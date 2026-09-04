
const { getTransactionsPatientService, getInvoicePatientService, createTransacationsService, getAllInvoicesService } = require("../services/invoices.service");
const {logger} = require("../utils/logger");
const {MESSAGES} = require("../utils/constants");


const createTransacations = async (req, res) => {
        const { invoiceId, patientId, amountPaid, paymentMethod, notes } = req.body;
        const cashierId = req.user?.id;
        const transactionData = {
            invoiceId,
            patientId,
            cashierId,
            amountPaid,
            paymentMethod,
            notes 
        };
    try {

         const invoicesTransaction = await createTransacationsService(transactionData);

         res.status(200).json({
            status: true,
            message:  MESSAGES.SUCCESS_CREATE_TRANSACTION,
            data: invoicesTransaction
         });

    }catch(error) {
        res.status(500).json({
        status: false,
        message: error.message
      });
       return logger.error(error);
    };
};

const getInvoicePatient = async (req, res) => {
       const {id} = req.params;
    try {
        const transactionsPatient = await getInvoicePatientService(id);

         res.status(200).json({
            status: true,
            message: MESSAGES.SUCCESS_GET_TRANSACTION,
            data: transactionsPatient
         });

    }catch(error) {
        res.status(500).json({
        status: false,
        message: error.message
      });
       return logger.error(error);
    };
};

const getTransactionsPatient = async (req, res) => {
       const {id} = req.params;
    try {
        const transactionsPatient = await getTransactionsPatientService(id);

         res.status(200).json({
            status: true,
            message: "get transactions patient successfully",
            count:transactionsPatient.length,
            data: transactionsPatient,
         });

    }catch(error) {
        res.status(500).json({
        status: false,
        message: error.message
      });
       return logger.error(error);
    };
};


const getAllInvoices = async (req, res) => {
         const {search, paymentStatus, page, limit} = req.query;

    try {
        const invoices = await getAllInvoicesService(search, paymentStatus, page, limit);

         res.status(200).json({
            status: true,
            message:  MESSAGES.SUCCESS_GET_ID_TRANSACTION,
            count: invoices.length,
            data: invoices
         });

    }catch(error) {
        res.status(500).json({
        status: false,
        message: error.message
      });
       return logger.error(error);
    };
};

module.exports = {
    createTransacations,
    getTransactionsPatient,
    getInvoicePatient,
    getAllInvoices,
};