const { PATIENT_DB, USERS_DB, APPOINTMENT_DB } = require("../models/modules");
const AppError = require("../middlewares/AppError");
const { appointmentValidated, updateAppointmentStatusValidated, paramsIdValidated } = require("../validation/appointmentValidation");
const { logger } = require("../utils/logger");
const { checkAppointmentConflict } = require("../utils/generators");
const { MESSAGES } = require("../utils/constants");


async function getAllAppointmentService(querySearch, page, limit) {
    const Page = Math.max(page || process.env.DEFAULT_PAGE, process.env.DEFAULT_PAGE);
    const Limit = Math.min(limit || process.env.DEFAULT_LIMIT, process.env.MAX_LIMIT);
    const skip = (Page - 1) * Limit;
    
      const appointment = await APPOINTMENT_DB.aggregate([
           {$match: {...querySearch}},
           {
            $lookup: {
                from: "patients",
                localField: "patientId",
                foreignField: "_id",
                as: "patientId"
            }
           },
           {$unwind: "$patientId"},
           {$match: {"patientId.isActive": true}}
      ])

    return appointment;
};

async function createAppointmenService(newData) {
 
 const validatedInputs = appointmentValidated.safeParse(newData);
    if(!validatedInputs.success){
        const errorMessage = validatedInputs.error.issues.map(i => i.message).join(", ");
        throw new AppError(errorMessage, 400);
    }
    const {doctorId, appointmentDate, plannedProcedure, notes, patientCode, durationMinutes} = validatedInputs.data;

    const checkPatient = await PATIENT_DB.findOne({patientCode});
    if(!checkPatient) throw new AppError(MESSAGES.ERROR_APPOINTMENT_NOT_FOUND,  401);
    if(!checkPatient.isActive) throw new AppError(MESSAGES.ERROR_APPOINTMENT_INVALID, 401);


    const checkUser = await USERS_DB.findOne({
        _id: doctorId,
        role: "doctor"
    });
    if(!checkUser) throw new AppError(MESSAGES.ERROR_DOCTOR_NOT_FOUND, 404);
    
    const conflict = await checkAppointmentConflict(doctorId, appointmentDate, Number(durationMinutes));
    if(conflict) throw new AppError(MESSAGES.ERROR_APPOINTMENT_CONFLICT, 409);


    const createAppointment  = await APPOINTMENT_DB.create({
        doctorId: checkUser._id, 
        patientId: checkPatient._id, 
        appointmentDate: appointmentDate, 
        plannedProcedure: plannedProcedure,
        durationMinutes: Number(durationMinutes),
        notes: notes, 
        createdBy: newData.employeeId
    });

    return createAppointment;
};

async function appointmentsTodayService(Filter) {
   const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const todayAppointments = await APPOINTMENT_DB.find({
        appointmentDate: {
            $gte: startOfToday,
            $lte: endOfToday    
        },
        status: {$in: ['Pending', 'no-show']},
        ...Filter
    })
    .populate('patientId', 'name patientCode gender')
    .populate('doctorId', 'name')
    .sort({ appointmentDate: 1 });

    return todayAppointments
};

async function toggleAppointmentStatusService({id, status}) {

    const appointmentStatusValidatedInputs = updateAppointmentStatusValidated.safeParse({status});
    const paramsId = paramsIdValidated.safeParse({id});

    if(!appointmentStatusValidatedInputs.success){
        const errorMessage = appointmentStatusValidatedInputs.error.issues.map(i => i.message).join(", ");
        throw new AppError(errorMessage, 400);
    }

    if(!paramsId.success){
        throw new AppError("ID is not found", 400);
    }
    const result = appointmentStatusValidatedInputs.data;
    const resultId = paramsId.data;

    const appointmentUpdated = await APPOINTMENT_DB.findByIdAndUpdate(
         resultId.id,
         {status: result.status},
          {new: true}
    );
    if(!appointmentUpdated) throw new AppError(MESSAGES.ERROR_APPOINTMENT_NOT_FOUND, 404);

    return appointmentUpdated;
};

module.exports = {
   createAppointmenService,
   appointmentsTodayService,
   toggleAppointmentStatusService,
   getAllAppointmentService,
};