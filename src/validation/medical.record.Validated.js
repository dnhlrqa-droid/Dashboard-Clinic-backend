const {z} = require("zod");


const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const toothTreatedSchema = z.object({
  toothNumber: z.number({ required_error: "Age is required." })
    .int("The tooth number must be an integer.")
    .min(1, "The tooth number must be between 1 and 32.")
    .max(32, "The tooth number must be between 1 and 32."),
  procedure: z.enum(
    ['Consultation', 'Cleaning', 'Filling', 'Root-Canal-Session', 'Extraction'],
    { required_error: "The procedure type is required." }
  ),
  newToothCondition: z.enum(
    ['Healthy', 'Caries', 'Filled', 'Missing', 'Crown', 'Root-Canal'],
    { required_error: "The new tooth condition is required." }
  ),
  cost: z.number({ required_error: "The cost is requires." })
    .positive("The cost must be a positive number."),
});

const medicalRecordSchema = z.object({
  patientId: z.string({ required_error: "The patient ID is required." })
    .regex(objectIdRegex, "The patient ID format is invalid."),

  appointmentId: z.string({ required_error: "The appointment ID is required." })
    .regex(objectIdRegex, "The appointment ID format is invalid."),

  treatmentStatus: z.enum(
    ['No-Action', 'In-Progress', 'Completed'],
    { required_error: "The treatment status is required." }
  ).optional(),

  nextSessionTimeframe: z.enum(
    ['ASAP', 'Within-1-Week', 'Within-2-Weeks', 'Within-1-Month', 'Not-Required'],
    { required_error: "The scheduled session time is required." }
  ),

  teethTreated: z.array(toothTreatedSchema)
    .min(1, "The tooth treated array must contain at least one entry."),

  notes: z.string().optional(),

});

module.exports = {
    medicalRecordSchema
};