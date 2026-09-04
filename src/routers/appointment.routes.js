const express = require("express");
const { createAppointment, appointmentsToday, toggleAppointmentStatus, getAllAppointment } = require("../controllers/appointment.controller");
const { authMiddleware } = require("../middlewares/authMiddleware");
const route = express.Router();

route.get("/appointments",authMiddleware, getAllAppointment);
route.post("/create/appointments",authMiddleware, createAppointment);
route.get("/appointments/today", authMiddleware, appointmentsToday);
route.patch("/appointments/:id/status", authMiddleware, toggleAppointmentStatus);



module.exports = route;