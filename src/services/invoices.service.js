const { INVOICE_DB, TRANSACTION_DB, PATIENT_DB } = require("../models/modules");
const AppError = require("../middlewares/AppError");
const { transactionValidated } = require("../validation/invoices.validation");
const { idValideted } = require("../validation/auth.validation");
const { limitLogin } = require("../middlewares/authMiddleware");
const { disconnect } = require("mongoose");
const { MESSAGES } = require("../utils/constants");




async function createTransacationsService(transactionData) {
    const transctionValidatedInputs = transactionValidated.safeParse(transactionData);
    if(!transctionValidatedInputs.success) {
       const errorMessage = transctionValidatedInputs.error.issues.map(i => i.message).join(", ");
      throw new AppError(errorMessage, 400);
    }
    const result = transctionValidatedInputs.data;

    const invoice = await INVOICE_DB.findById(result.invoiceId);

    if (!invoice) {
        throw new AppError("invoice not found", 404);
    }
    if(invoice.paymentStatus === "Paid" && invoice.balance === 0){
        throw new AppError("This invoice is fully paid and no new transactions can be added to it.", 400);
    }


    const netInvoiceAmount = invoice.balance - result.amountPaid;


    let newState = "Unpaid";
    if(netInvoiceAmount <= 0){
        newState = "Paid"
    }else if( netInvoiceAmount > 0) {
        newState = "Partially Paid"
    }
 
    invoice.balance = netInvoiceAmount < 0 ? 0 : netInvoiceAmount;
    invoice.paymentStatus = newState;
    await invoice.save(); 

    const newTransactions = await TRANSACTION_DB.create({
        invoiceId: result.invoiceId,
        patientId: result.patientId,
        cashierId: result.cashierId,
        amountPaid: result.amountPaid,
        paymentMethod: result.paymentMethod,
        notes: result.notes
    });


    return newTransactions;
};

async function getInvoicePatientService(id) {
  
    const resultIdValidated = idValideted.safeParse({id});
    if(!resultIdValidated.success) {
        const errorMessage = resultIdValidated.error.issues.map(i => i.message).join(", ");
        throw new AppError(errorMessage, 400);
    }
    const resultId = resultIdValidated.data;


    const invoice = await INVOICE_DB.findById( resultId.id)
    .populate('appointmentId', 'plannedProcedure createdAt')
    .populate("patientId", "name patientCode")
    .sort({createdAt: -1});
    if(!invoice) throw new AppError(MESSAGES.ERROR_INVOICE_NOT_FOUND, 404);


    return invoice;
};

async function getTransactionsPatientService(id) {
    const resultIdValidated = idValideted.safeParse({id});
    if(!resultIdValidated.success) {
      const errorMessage = resultIdValidated.error.issues.map(i => i.message).join(", ");
      throw new AppError(errorMessage, 400);
    }
    const resultId = resultIdValidated.data;

    const transactions = await TRANSACTION_DB.find({invoiceId: resultId.id})
    .sort({createdAt: -1})
    .populate("invoiceId", "name patientCode");
    if(transactions.length === 0) throw new AppError(MESSAGES.ERROR_TRANSACTION_NOT_FOUND, 404);

    return transactions;
};

async function getAllInvoicesService(search, paymentStatus, page, limit) {

    let queryObject = {};
         if(paymentStatus) {
            queryObject.paymentStatus = paymentStatus;
         }
         if(search || typeof search === "string") {
            const matchedPatients = await PATIENT_DB.find({
                $or:[
                    {name: {$regex: search, $options: "i"}},
                    {patientCode: {$regex: search, $options: "i"}}
                ]
            }).select("_id");

            const patientIds = matchedPatients.map(patientId => patientId._id);
            queryObject.patientId = {$in:patientIds};
        }

    const Page = Math.max(page || process.env.DEFAULT_PAGE, process.env.DEFAULT_PAGE);
    const Limit = Math.min(limit || process.env.DEFAULT_LIMIT, process.env.MAX_LIMIT);
    const skip = (Page - 1) * Limit;

    const getInvoices = await INVOICE_DB.find(queryObject)
     .populate("patientId", "name patientCode")
     .populate("appointmentId", "plannedProcedure")
     .sort({createdAt: -1})
     .skip(skip).limit(Limit);

     return getInvoices;
};


module.exports = {
    createTransacationsService,
    getTransactionsPatientService,
    getInvoicePatientService,
    getAllInvoicesService,
};