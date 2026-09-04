
const { medicalRecordService, getMedicalRecordService } = require("../services/medical.records.service");
const { logger } = require("../utils/logger");
const { MESSAGES } = require("../utils/constants");




const createMedicalRecord = async (req, res) => {
       const createdBy = req.user.id;
       const {patientId, appointmentId, teethTreated, nextSessionTimeframe, treatmentStatus, notes} = req.body;
    try {
          const newMedicalRecord = {
            patientId, appointmentId, teethTreated, nextSessionTimeframe, treatmentStatus, notes
          };
        const medicalRecord = await medicalRecordService(newMedicalRecord, createdBy);

        res.status(201).json({
            status: true,
            message: MESSAGES.SUCCESS_CREATE_MEDICAL_RECORD,
            data: medicalRecord
        });

    }catch(error){
        res.status(500).json({
        status: false,
        message: error.message
      });
       return logger.error(error);
    }
};


const getMedicalRecord = async (req, res) => {
    const {page, limit, search} = req.query;
    const user = req.user.role;
    try {
       
        const medicalRecord = await getMedicalRecordService(search, user, page, limit);

        res.status(200).json({
            status: true,
            count: medicalRecord.length,
            message: MESSAGES.SUCCESS_GET_MEDICAL_RECORD,
            data: medicalRecord
        });

    }catch(error){
        res.status(500).json({
        status: false,
        message: error.message
      });
       return logger.error(error);
    }
};



module.exports = {
    createMedicalRecord,
    getMedicalRecord,
};
