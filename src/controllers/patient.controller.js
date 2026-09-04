
const { createPatientService, updatePatientsService, deletePatientsService, togglePatientStatusService, getPatientsService, toggleMedicalHistoryPatientService } = require("../services/patient.service");
const { logger } = require("../utils/logger");
const { MESSAGES } = require("../utils/constants");



const createPatient = async (req, res) => {
   const {name, phone, gender, patientCode, doctor, hasDiabetes, hasBloodPressure, hasSensitive, otherNotes} = req.body;
     const newPatient = {
        name, phone, gender, patientCode, doctor,
        hasDiabetes, hasBloodPressure, hasSensitive, otherNotes
     };
   try {
    
       const createPatient = await createPatientService(newPatient);
    
       res.status(201).json({status: true,
        message: MESSAGES.SUCCESS_CREATE_PATIENT,
        data: createPatient
       });
   } catch(error) {
    res.status(500).json({
        status: false,
        message: error.message
      });
       return logger.error(error);
   }

};

const getPatients = async (req, res) => {
    const {search, page, limit} = req.query;
    try {
        let queryObject = {};
        if(queryObject && typeof search === "string") {

            queryObject = {
                $or: [
                    {name: {$regex: search, $options: "i"}},
                    {phone: {$regex: search, $options: "i"}},
                ]
            }
        }
        const patients = await getPatientsService(queryObject, page, limit);

        res.status(200).json({
            status: true,
            message: MESSAGES.SUCCESS_GET_PATIENT,
            data: patients,
            count: patients.length
        });

    } catch(error) {
        res.status(500).json({
        status: false,
        message: error.message
      });
       return logger.error(error);
    }
};

const updatePatients = async (req, res) => {
    const {id} = req.params;
    const {name, phone, gender, doctor, hasDiabetes, hasBloodPressure, hasSensitive, otherNotes} = req.body;
      const newPatient = {
        name, phone, gender, id, doctor,
        hasDiabetes, hasBloodPressure, hasSensitive, otherNotes
      };
    try {
        const updatePatient = await updatePatientsService(newPatient);
        res.status(201).json({
            status: true,
            message: MESSAGES.SUCCESS_UPDATE_PATIENT,
            data: updatePatient
        })
    }catch(error) {
        res.status(500).json({
        status: false,
        message: error.message
      });
       return logger.error(error);
    }
};


const togglePatientStatus = async (req, res) => {
    const {id} = req.params;
   try {
    const togglePatient = await togglePatientStatusService({id});
    res.status(201).json({
        status: true,
        message: MESSAGES.SUCCESS_UPDATE_PATIENT,
        data: togglePatient
    });

   }catch(error){
    res.status(500).json({
        status: false,
        message: error.message
      });
       return logger.error(error);
   }
};

const toggleMedicalHistoryPatient = async (req, res) => {
    const {id} = req.params;
    const {hasDiabetes, hasBloodPressure, otherNotes} = req.body;

    const newMedicalHistory = {
        hasDiabetes, hasBloodPressure, hasSensitive, otherNotes
    };

    try {
        const medicalHistory = await toggleMedicalHistoryPatientService(id, newMedicalHistory);
         res.status(201).json({
            status: true,
            message: MESSAGES.SUCCESS_UPDATE_PATIENT,
            data: medicalHistory
         });
    }catch(error) {
        res.status(500).json({
        status: false,
        message: error.message
      });
       return logger.error(error);
    }
};

module.exports = {
    createPatient,
    getPatients,
    updatePatients,
    togglePatientStatus,
    toggleMedicalHistoryPatient,
};
