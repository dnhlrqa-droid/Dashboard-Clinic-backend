const { PATIENT_DB } = require("../models/modules");
const AppError = require("../middlewares/AppError");
const { idValideted } = require("../validation/auth.validation");
const { generatorsCode } = require("../utils/generators");
const { updatedPatientValideted, medicalHistoryValideted, patientValideted } = require("../validation/patient.validation");
const { MESSAGES } = require("../utils/constants");




async function createPatientService(newPatient) {
    
    const validetedInputs = await patientValideted.safeParseAsync(newPatient);
    if (!validetedInputs.success) {
      const errorMessage = validetedInputs.error.issues.map(i => i.message).join(", ");
      throw new AppError(errorMessage, 400);
    }
    const result = validetedInputs.data;
    
    const dentalChart = [];
    
    for(let i = 1; i <= 32; i++) {
        dentalChart.push({
            toothNumber: i,
            condition: "Healthy",
            notes: ""
        });
    };
    const patientCode = generatorsCode(result.patientCode);
    const newMedicalHistory = {
     hasDiabetes: result.hasDiabetes,
     hasBloodPressure: result.hasBloodPressure,
     hasSensitive: result.hasSensitive,
     otherNotes: result.otherNotes,
    };
    const dataPatient = {
     name: result.name,
     doctor: result.doctor,
     phone: result.phone,
     gender: result.gender,
     patientCode: patientCode,
     medicalHistory: newMedicalHistory,
     dentalChart: dentalChart
    };

    const patient = await PATIENT_DB.findOne({phone: dataPatient.phone});
    if(patient)  throw new AppError(MESSAGES.ERROR_PATIENT_EXISTS, 400);

    const newUser = await PATIENT_DB.create(dataPatient);

    return newUser.toObject();
};

async function getPatientsService(queryObject, page, limit) {

    const Page = Math.max(page || process.env.DEFAULT_PAGE, process.env.DEFAULT_PAGE);
    const Limit = Math.min(limit || process.env.DEFAULT_LIMIT, process.env.MAX_LIMIT);
    const skip = (Page - 1) * Limit;
    
    const patients = await PATIENT_DB.find(queryObject).sort({createdAt: -1})
    .skip(skip).limit(Limit);
    const count = await PATIENT_DB.countDocuments();

    return {patients, count, Page};
};

async function updatePatientsService(newPatient) {
    const validetedInputs = updatedPatientValideted.safeParse(newPatient);
        const checkIdValideted = idValideted.safeParse({id: newPatient.id});

        if(!checkIdValideted.success){
           throw new AppError(MESSAGES.ERROR_PATIENT_INVALID, 400);
        }
        if(!validetedInputs.success) {
             const errorMessage = validetedInputs.error.issues.map(i => i.message).join(", ");
             throw new AppError(errorMessage, 400);
        }
        const resultId = checkIdValideted.data;
        const resultValideted = validetedInputs.data;

        const newMedicalHistory = {
            hasDiabetes: resultValideted.hasDiabetes,
            hasBloodPressure: resultValideted.hasBloodPressure,
            hasSensitive: resultValideted.hasSensitive,
            otherNotes: resultValideted.otherNotes,
        };
        const newData = {
          name: resultValideted.name,
          phone: resultValideted.phone,
          gender: resultValideted.gender,
          doctor: resultValideted.doctor,
           medicalHistory: newMedicalHistory,
        };

    const patient = await PATIENT_DB.findByIdAndUpdate(resultId.id, newData, {new: true, runValidators: true});
    if(!patient) throw new AppError(MESSAGES.ERROR_PATIENT_INVALID, 404);

    return patient;
};


async function togglePatientStatusService({id}) {
    const checkIdValideted = idValideted.safeParse({id});
    if(!checkIdValideted.success){
        throw new AppError("Invalid ID found", 400);
     }
     const newData = checkIdValideted.data;

    const togglePatient = await PATIENT_DB.findById(newData.id);
    if(!togglePatient) throw new AppError(MESSAGES.ERROR_USER_NOT_EXISTS, 404);
    togglePatient.isActive = !togglePatient.isActive;
    await togglePatient.save();
    return togglePatient;
};


async function toggleMedicalHistoryPatientService(id, newMedicalHistory) {
     const medicalValidated = medicalHistoryValideted.safeParse(newMedicalHistory);
     if(!medicalValidated.success) {
        const errorMessage = medicalValidated.error.issues.map(i => i.message).join(", ");
      throw new AppError(errorMessage, 400);
     }
     const {hasDiabetes, hasBloodPressure, otherNotes, hasSensitive} = medicalValidated.data;
     const newData = {
        hasDiabetes:hasDiabetes,
        hasBloodPressure: hasBloodPressure, 
        hasSensitive: hasSensitive, 
        otherNotes: otherNotes
     };

    const checkIdValideted = idValideted.safeParse({id});
     if(!checkIdValideted.success) {
        throw new AppError(MESSAGES.ERROR_PATIENT_INVALID, 400);
     }
     const patientId = checkIdValideted.data;

     const patient = await PATIENT_DB.findByIdAndUpdate(patientId.id, {medicalHistory: newData}, {new: true, runValidators: true});
     if(!patient) throw new AppError(MESSAGES.ERROR_PATIENT_NOT_FOUND, 404);

     return patient;
};

module.exports = {
    createPatientService,
    updatePatientsService,
    togglePatientStatusService,
    getPatientsService,
    toggleMedicalHistoryPatientService,
};

