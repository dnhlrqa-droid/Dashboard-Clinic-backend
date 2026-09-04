const {z} = require("zod");

const patientValideted = z.object({
    name: z.string(),
    doctor: z.string(),
    phone: z.string().min(10, "Sorry, the phone number is too short."),
    patientCode: z.string().min(1, "Sorry, the patient code is too short."),
    gender: z.enum(['Male', 'Female'], {
        errorMap: () => ({message: "Sorry, the items is not avaliable."})
    }),
    hasDiabetes: z.boolean(),
    hasBloodPressure: z.boolean(),
    hasSensitive: z.boolean(),
    otherNotes: z.string(),
});

const updatedPatientValideted = z.object({
    name: z.string(),
    doctor: z.string(),
    phone: z.string().min(10, "Sorry, the phone number is too short."),
    gender: z.enum(['Male', 'Female'], {
        errorMap: () => ({message: "Sorry, the items is not avaliable."})
    }),
    hasDiabetes: z.boolean(),
    hasBloodPressure: z.boolean(),
    hasSensitive: z.boolean(),
    otherNotes: z.string(),
});
const medicalHistoryValideted = z.object({
    hasDiabetes: z.boolean(),
    hasBloodPressure: z.boolean(),
    hasSensitive: z.boolean(),
    otherNotes: z.string(),
});



module.exports = {
    patientValideted,
    updatedPatientValideted,
    medicalHistoryValideted,
};