const { MEDICAL_RECORD_DB, APPOINTMENT_DB, PATIENT_DB, INVOICE_DB } = require("../models/modules");
const AppError = require("../middlewares/AppError");
const { medicalRecordSchema } = require("../validation/medical.record.Validated");
const { paramsIdValidated } = require("../validation/appointmentValidation");
const { MESSAGES } = require("../utils/constants");





async function medicalRecordService(newMedicalRecord, createdBy) {
  
    const medicalValidated = medicalRecordSchema.safeParse(newMedicalRecord);
    if(!medicalValidated.success) {
       const errorMessage = medicalValidated.error.issues.map(i => i.message).join(", ");
      throw new AppError(errorMessage, 400);
    }
    const result = medicalValidated.data;
    
    let TotalCost = 0;
    if(result.teethTreated.length !== 0) {
        const totalCost = result.teethTreated.reduce((acc, tooth) => acc + tooth.cost, 0);
        TotalCost = totalCost;
    }

    const newDataMedical = {
        patientId: result.patientId,
        doctorId: createdBy,
        appointmentId: result.appointmentId,
        treatmentStatus: result.treatmentStatus,
        teethTreated: result.teethTreated,
        nextSessionTimeframe: result.nextSessionTimeframe,
        totalCost: TotalCost,
        notes: result.notes,
    };

    const medicalRecord = await MEDICAL_RECORD_DB.create(newDataMedical);
    await APPOINTMENT_DB.findByIdAndUpdate(result.appointmentId, {status: "Completed"}, {new: true});

    for(const tooth of result.teethTreated) {
        await PATIENT_DB.updateOne(
            { 
                _id: result.patientId, 
                "dentalChart.toothNumber": tooth.toothNumber
            },
            { $set: { "dentalChart.$.condition": tooth.newToothCondition } }
            , {new: true}
        )
    };

    const newInvoiceMedical = {
            patientId: result.patientId,
            medicalRecordId: medicalRecord._id,
            appointmentId: result.appointmentId,
            doctorId: createdBy,
            totalAmount: TotalCost,        
            balance: TotalCost,       
        };
    await INVOICE_DB.create(newInvoiceMedical);
    

    return medicalRecord;
};


async function getMedicalRecordService(search, user, page, limit) {
    let Filter = {};
    if(user === "doctor") {
               Filter = {role: user};
            }
            if(search && typeof search === "string") {
                const medicalRecord = await PATIENT_DB.find({
                   $or: [
                        { name: {$regex: search, $options: "i"}},
                        { patientCode: {$regex: search, $options: "i"}},
                    ]
                }).select("_id");
                Filter = {...Filter, patientId: {$in: medicalRecord.map(p => p._id)}};                
            }
    
    const Page = Math.max(page || process.env.DEFAULT_PAGE, process.env.DEFAULT_PAGE);
    const Limit = Math.min(limit || process.env.DEFAULT_LIMIT, process.env.MAX_LIMIT);
    const skip = (Page - 1) * Limit;
      
    const medicalRecord = await MEDICAL_RECORD_DB.find(Filter)
    .populate("patientId", "name patientCode gender")
    .populate("doctorId", "name")
    .skip(skip).limit(Limit).sort({createdAt: -1});
    if(!medicalRecord) throw new AppError(MESSAGES.ERROR_PATIENT_NOT_FOUND, 400);

    return medicalRecord;

};



module.exports = {
    medicalRecordService,
    getMedicalRecordService,
};