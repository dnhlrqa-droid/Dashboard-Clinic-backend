const {z} = require("zod");


const appointmentValidated = z.object({
    patientCode: z.string(),
    doctorId: z.string(),
    durationMinutes: z.string(),
    appointmentDate: z.coerce.date({
    required_error: "The appointment date is required."}),
    plannedProcedure: z.enum(['Consultation', 'Cleaning', 'Filling', 'Root-Canal-Session', 'Extraction', 'Other'], {
        errorMap: () => ({message: "The planned procedure is required."})
    }),
    notes: z.string().optional(),
});


const updateAppointmentStatusValidated = z.object({
    status: z.enum(['Pending', 'Completed', 'Cancelled', 'no-show'], {
      required_error: "The appointment status is required.",
    }),
});

const paramsIdValidated = z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/),
});

module.exports = {
  appointmentValidated,
  updateAppointmentStatusValidated,
  paramsIdValidated
};