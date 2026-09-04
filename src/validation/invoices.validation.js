const {z, email} = require("zod");



const transactionValidated = z.object({
   cashierId: z.string().regex(/^[0-9a-fA-F]{24}$/, {
      message: "cashier ID format is invalid.",
    }),
   invoiceId: z.string().regex(/^[0-9a-fA-F]{24}$/, {
      message: "Invoice ID format is invalid.",
    }),
   patientId: z.string().regex(/^[0-9a-fA-F]{24}$/, {
      message: "Patient ID format is invalid.",
    }),
    amountPaid: z.number().min(0, {
        message: "Amount paid cannot be negative.",
    }),
    paymentMethod: z.enum(['Cash', 'Card', 'Unknown'], {
        message: "The payment method is not available.",
    }),
    notes: z.string(),
});


module.exports = {
   transactionValidated,
};