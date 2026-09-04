const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true 
  },
  password: { 
    type: String, 
    required: true,
    select: true 
  },
  role: { 
    type: String, 
    enum: ['admin', 'doctor', 'receptionist'], 
    required: true 
  },
  phone: { 
    type: String,
    trim: true
  },
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, { timestamps: true });


const toothSchema = new mongoose.Schema({
  toothNumber: { type: Number, required: true, min: 1, max: 32 },
  condition: { 
    type: String, 
    enum: ['Healthy', 'Caries', 'Filled', 'Missing', 'Crown', 'Root-Canal'], 
    default: 'Healthy' 
  },
  treatmentStatus: {
    type: String,
    enum: ['No-Action', 'In-Progress', 'Completed'], 
    default: 'No-Action'
  },
  notes: { type: String, trim: true }
}, { _id: false });

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  doctor: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  patientCode: { type: String, required: true, unique: true, trim: true},
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  isActive: { 
    type: Boolean, 
    default: true 
  },

  medicalHistory: {
    hasDiabetes: { type: Boolean, default: false },
    hasBloodPressure: { type: Boolean, default: false },
    hasSensitive: { type: Boolean, default: false },
    otherNotes: { type: String, trim: true, default: '' }, 
  },


  dentalChart: [toothSchema]

}, { timestamps: true });



const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'patient', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  appointmentDate: { type: Date, required: true },
  durationMinutes: { type: Number, required: true },
  plannedProcedure: { 
    type: String, 
    enum: ['Consultation', 'Cleaning', 'Filling', 'Root-Canal-Session', 'Extraction'],
    default: 'Consultation'
  },
  notes: { type: String },
  status: { type: String, enum: ['Pending', 'Completed', 'Cancelled', 'no-show'], default: 'Pending' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true }
}, { timestamps: true });





const medicalRecordSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'patient', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'appointment' },
  treatmentStatus: {
    type: String,
    enum: ['No-Action', 'In-Progress', 'Completed'],
    required: true,
    default: 'No-Action'
  },
  teethTreated: [{
    toothNumber: { type: Number, required: true },
    procedure: { 
      type: String, 
      required: true,
      enum: ['Consultation', 'Cleaning', 'Filling', 'Root-Canal-Session', 'Extraction',]
    },
    newToothCondition: {
      type:  String,
      enum: ['Healthy', 'Caries', 'Filled', 'Missing', 'Crown', 'Root-Canal'],
      required: true
    },
    cost: { type: Number, required: true }
  }],
  nextSessionTimeframe: { 
    type: String, 
   enum: ['ASAP', 'Within-1-Week', 'Within-2-Weeks', 'Within-1-Month', 'Not-Required'],
  },
  totalCost: {type: Number, required: true},
  notes: { type: String },
}, { timestamps: true });


const invoiceSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'patient', required: true },
  medicalRecordId: { type: mongoose.Schema.Types.ObjectId, ref: 'medicalRecord', required: true },
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'appointment', required: true },
  totalAmount: { type: Number, required: true },
  balance: { type: Number, default: 0 }, 
  paymentStatus: { type: String, enum: ['Paid', 'Partially Paid', 'Unpaid'], default: 'Unpaid' },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true }
}, { timestamps: true });


const transactionSchema = new mongoose.Schema({
  invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'invoice', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'patient', required: true },
  cashierId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  amountPaid: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['Cash', 'Card'], required: true },
  notes: { type: String }
}, { timestamps: true });

const USERS_DB = mongoose.model("users", userSchema);
const PATIENT_DB = mongoose.model("patient", patientSchema);
const APPOINTMENT_DB = mongoose.model("appointment", appointmentSchema);
const MEDICAL_RECORD_DB = mongoose.model("medicalRecord", medicalRecordSchema);
const INVOICE_DB = mongoose.model("invoice", invoiceSchema);
const TRANSACTION_DB = mongoose.model("transaction", transactionSchema);

module.exports = {
    USERS_DB,
    PATIENT_DB,
    APPOINTMENT_DB,
    MEDICAL_RECORD_DB,
    INVOICE_DB,
    TRANSACTION_DB,
}