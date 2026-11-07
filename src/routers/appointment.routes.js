const express = require("express");
const { createAppointment, appointmentsToday, toggleAppointmentStatus, getAllAppointment } = require("../controllers/appointment.controller");
const { authMiddleware } = require("../middlewares/authMiddleware");
const checkRole  = require("../middlewares/role.middleware");
const route = express.Router();

route.get("/appointments",authMiddleware, checkRole("admin", "receptionist"), getAllAppointment);
route.post("/create/appointments",authMiddleware, checkRole("admin", "receptionist"), createAppointment);
route.get("/appointments/today", authMiddleware, checkRole("admin", "doctor", "receptionist"), appointmentsToday);
route.patch("/appointments/:id/status", authMiddleware, checkRole("admin", "receptionist"), toggleAppointmentStatus);



module.exports = route;