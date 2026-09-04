const express = require("express");
const { createMedicalRecord, getMedicalRecord, getMedicalRecordPatient } = require("../controllers/medical.records.controller");
const { authMiddleware } = require("../middlewares/authMiddleware");
const checkRole = require("../middlewares/role.middleware");
const route = express.Router();


route.post("/create/medical-record", authMiddleware, checkRole('admin', 'doctor'), createMedicalRecord);
route.get("/medical-records",authMiddleware, checkRole('admin', 'doctor'), getMedicalRecord);



module.exports = route;