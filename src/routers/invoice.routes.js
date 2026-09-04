const express = require("express");
const { getTransactionsPatient, getInvoicePatient, createTransacations, getAllInvoices } = require("../controllers/invoices.controller");
const { authMiddleware } = require("../middlewares/authMiddleware");
const checkRole = require("../middlewares/role.middleware");
const route = express.Router();


route.get("/transactions/patient/:id", authMiddleware,checkRole("admin", "receptionist"), getTransactionsPatient);
route.post("/create/transactions",authMiddleware,checkRole("admin", "receptionist"), createTransacations);
route.get("/invoices/patient/:id", authMiddleware,checkRole("admin", "receptionist"), getInvoicePatient);
route.get("/invoices",authMiddleware,checkRole("admin", "receptionist"), getAllInvoices);


module.exports = route;