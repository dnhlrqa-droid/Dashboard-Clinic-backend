const express = require("express");
const route = express.Router();

const { createPatient, getPatients, updatePatients, togglePatientStatus } = require("../controllers/patient.controller");
const { authMiddleware } = require("../middlewares/authMiddleware");
const checkRole = require("../middlewares/role.middleware");
const {toggleMedicalHistoryPatient} = require("../controllers/patient.controller");

route.post("/create/patients",authMiddleware, createPatient, checkRole('admin', 'receptionist'));
route.get("/patients",authMiddleware, getPatients);
route.patch("/update/patients/:id",authMiddleware,checkRole('admin', 'receptionist'), updatePatients);
route.patch("/patient/:id/status", authMiddleware,checkRole('admin', "receptionist"), togglePatientStatus);
route.patch("/patients/:id/medical-history", authMiddleware, checkRole('admin', "receptionist"), toggleMedicalHistoryPatient);

module.exports = route;