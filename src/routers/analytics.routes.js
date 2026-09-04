const express = require("express");
const { analytics, analyticsHistory } = require("../controllers/analytics.controller");
const { authMiddleware } = require("../middlewares/authMiddleware");
const checkRole = require("../middlewares/role.middleware");
const route = express.Router();

route.get("/analytics/summary", authMiddleware, checkRole("admin"), analytics);
route.get("/analytics/summary/history", authMiddleware, checkRole("admin"), analyticsHistory);


module.exports = route;