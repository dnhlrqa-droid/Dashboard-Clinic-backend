

const {createAppointmenService, appointmentsTodayService, toggleAppointmentStatusService, getAllAppointmentService} = require("../services/appointment.service");
const { logger } = require("../utils/logger");
const { MESSAGES } = require("../utils/constants");


const getAllAppointment = async (req, res) => {
      const {status, page, limit} = req.query;
    try {
        let querySearch = {};
        if(querySearch && typeof status === "string"){
            querySearch = {
                $or: [
                    {status: {$regex: status, $options: "i"}},
                ],
                
            }
        };

        const appointment = await getAllAppointmentService(querySearch, page, limit);
    
     res.status(200).json({
        status: true,
        message: MESSAGES.SUCCESS_GET_APPOINTMENT,
        data: appointment,
        count: appointment.length
     });

    }catch(error) {
        res.status(500).json({
        status: false,
        message: error.message
      });
       return logger.error(error);
    }
}

const createAppointment = async (req, res) => {
    const employeeId = req.user.id
    const {doctorId, patientCode,durationMinutes, appointmentDate, plannedProcedure, notes} = req.body;
   
    try {

        const newData = {
            employeeId: employeeId,
            patientCode: patientCode,
            doctorId: doctorId,
            appointmentDate: appointmentDate,
            plannedProcedure: plannedProcedure,
            durationMinutes: durationMinutes,
            notes: notes,
        };
        const appointment = await createAppointmenService(newData);

     res.status(200).json({
        status: true,
        message: MESSAGES.SUCCESS_CREATE_APPOINTMENT,
        data: appointment
     });

    }catch(error) {
       res.status(500).json({
        status: false,
        message: error.message
      });
       return logger.error(error);
    }
};

const appointmentsToday = async (req, res) => {
   try {
    let Filter = {};
    if(req.user.role === "doctor") {
        Filter = {doctorId: req.user.id};
    }

    const getAppointmentsToday = await appointmentsTodayService(Filter);

    res.status(200).json({
        status: true,
        message: MESSAGES.SUCCESS_GET_APPOINTMENT,
        data: getAppointmentsToday
    });
   }catch(error) {
    res.status(500).json({
        status: false,
        message: error.message
      });
       return logger.error(error);
   }
};

const toggleAppointmentStatus = async (req, res) => {
       const id = req.params.id;
       const {status} = req.body;
    try {

    const appointmentStatus = await toggleAppointmentStatusService({id, status});

    res.status(200).json({
        status: true,
        message: MESSAGES.SUCCESS_UPDATE_APPOINTMENT_STATUS,
        data: appointmentStatus
    });
   }catch(error) {
    res.status(500).json({
        status: false,
        message: error.message
      });
       return logger.error(error);
    };
};


module.exports = {
 createAppointment,
 appointmentsToday,
 toggleAppointmentStatus,
 getAllAppointment,
};
