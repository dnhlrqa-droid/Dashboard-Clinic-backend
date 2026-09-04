const express = require("express");
const { registareController, loginController, checkIsTokenInCookies, updateAdminUser, toggleDoctorStatus, getUsersAndSearch } = require("../controllers/auth.controller");
const {authMiddleware, limitLogin} = require("../middlewares/authMiddleware");
const checkRole = require("../middlewares/role.middleware");

const route = express.Router();


route.post("/auth/login",limitLogin, loginController);
route.post("/auth/register",authMiddleware, checkRole('admin'), registareController);
route.get("/auth/verify/session", authMiddleware, checkIsTokenInCookies);
route.patch("/auth/update/admin/:id", authMiddleware, checkRole('admin'), updateAdminUser);
route.patch("/auth/toggle-status/:id", authMiddleware, checkRole('admin'), toggleDoctorStatus);
route.get("/auth/users", authMiddleware, checkRole('admin', 'receptionist'), getUsersAndSearch);


module.exports = route;
