
const moment = require("moment");
const { INVOICE_DB, TRANSACTION_DB, USERS_DB, PATIENT_DB, APPOINTMENT_DB, MEDICAL_RECORD_DB } = require("../models/modules");
const AppError = require("../middlewares/AppError");
const { MESSAGES } = require("../utils/constants");


async function analyticsService(year, month, day, range) {
    let startDate = new Date(0);
    let endDate = new Date();

    if(year && !/^\d{4}$/.test(year) || month && !/^\d{2}$/.test(month) || day && !/^\d{2}$/.test(day)){
         throw new AppError("The time format is incorrect", 400);
    } 


    if(range === "today") {
        startDate = moment().startOf("day").toDate();
        endDate = moment().endOf("day").toDate();
    }else if(range === "yesterday") {
        startDate = moment().subtract(1, "day").startOf("day").toDate();
        endDate = moment().subtract(1, "day").endOf("day").toDate();
    }else if(range === "week") {
          startDate = moment().startOf("week").toDate(); 
          endDate = moment().endOf("day").toDate();
    }else if (year) {

        const y = parseInt(year);
        const m = month ? parseInt(month) - 1 : 0; 
        const d = day ? parseInt(day) : 1;

        if (day) {

            startDate = moment([y, m, d]).startOf('day').toDate();
            endDate = moment([y, m, d]).endOf('day').toDate();
        } else if (month) {

            startDate = moment([y, m]).startOf('month').toDate();
            endDate = moment([y, m]).endOf('month').toDate();
        } else {

            startDate = moment([y]).startOf('year').toDate();
            endDate = moment([y]).endOf('year').toDate();  
        }
    }
    // else {
    //     throw new AppError("The time format is incorrect", 400);
    // }
    let dateFilter = {createdAt: {$gte: startDate, $lte: endDate}};
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const [invoiceStats, transactionStats, countDoctor, countReceptionist, countPatients, newPatientsInPeriod, appointmentToday, appointments

    ] = await Promise.all([
        
        INVOICE_DB.aggregate([
            {$match: {...dateFilter}},
            {$group: {
                _id: null,
                totalRevenue: {$sum: "$totalAmount"},
                totalOutstanding: {$sum: "$balance"},
                totalInvoicesCount: { $sum: 1 }
            }}
        ]),
    
        TRANSACTION_DB.aggregate([
            {$match: {...dateFilter}},
            {$group: { _id: null,
               totalCollected: {$sum: "$amountPaid"},
               totalTransactionsCount: { $sum: 1 }
            }}
        ]),
    
        USERS_DB.countDocuments({
            role: {$in:['admin', "doctor"]}
        }),
        USERS_DB.countDocuments({
            role: "receptionist"
        }),
        PATIENT_DB.countDocuments(),
        PATIENT_DB.countDocuments(dateFilter),

        APPOINTMENT_DB.find({
            appointmentDate: {
                $gte: startOfToday,
                $lte: endOfToday
            }
        }),
        APPOINTMENT_DB.countDocuments(),
    ])

    const stats = invoiceStats[0] || { totalRevenue: 0, totalOutstanding: 0, totalInvoicesCount: 0 };
    const cash = transactionStats[0] || { totalCollected: 0, totalTransactionsCount: 0 };

    return {
        totalRevenue: stats.totalRevenue || 0,
        totalCollected: cash.totalCollected || 0,
        totalOutstanding: stats.totalOutstanding || 0,
        period: { startDate, endDate },
        doctors: countDoctor, 
        receptionists: countReceptionist, 
        patients: countPatients, 
        appointmentToday: appointmentToday, 
        appointments: appointments, 
        newPatientsInPeriod: newPatientsInPeriod, 
        totalInvoicesCount: stats.totalInvoicesCount,
        totalTransactionsCount: cash.totalTransactionsCount,
    };
};

async function analyticsHistoryService(year, month, day, range) {
    let startDate = new Date(0);
    let endDate = new Date();

    if(year && !/^\d{4}$/.test(year) || month && !/^\d{2}$/.test(month) || day && !/^\d{2}$/.test(day)){
         throw new AppError(MESSAGES.ERROR_TIME_FORMAT, 400);
    } 

    if(range === "today") {
        startDate = moment().startOf("day").toDate();
        endDate = moment().endOf("day").toDate();
    }else if(range === "yesterday") {
        startDate = moment().subtract(1, "day").startOf("day").toDate();
        endDate = moment().subtract(1, "day").endOf("day").toDate();
    }else if(range === "week") {
        startDate = moment().startOf("week").toDate();
        endDate = moment().endOf("day").toDate();
    }else if(year) {
        const y = parseInt(year);
        const m = month ? parseInt(month) - 1 : 0;
        const d = day ? parseInt(day) : 1;

        if(day) {
            startDate = moment([y, m, d]).startOf("day").toDate();
            endDate = moment([y, m, d]).endOf("day").toDate();
        }else if(month) {
            startDate = moment([y, m]).startOf("month").toDate();
            endDate = moment([y, m]).endOf("month").toDate();
        }else if(year) {
            startDate = moment([y]).startOf("year").toDate();
            endDate = moment([y]).endOf("year").toDate();
        }
    }

    const filterHistory = {createdAt: {$gte: startDate, $lte: endDate}};

    const [invoices, transactions, medicalRecords, appointments, patients] = await Promise.all([
        INVOICE_DB.aggregate([
            {$match: {...filterHistory}},
            {$group: {
                _id: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
            },
                totalRevenue: {$sum: "$totalAmount"},
                totalBalance: {$sum: "$balance"},
                totalInvoicesCount: { $sum: 1 }
            }},

        ]),
        TRANSACTION_DB.aggregate([
            {$match: {...filterHistory}},
            {$group: {
                _id: {
                    year: {$year: "$createdAt"},
                    month: {$month: "$createdAt"},
                },
                 totalTransactions: { $sum: 1 }
            }}
        ]),
        MEDICAL_RECORD_DB.aggregate([
            {$match: {...filterHistory}},
            {$group: {
                _id: {
                    year: {$year: "$createdAt"},
                    month: {$month: "$createdAt"},
                },
                totalMedicalRecords: { $sum: 1 }
            }}
        ]),

        APPOINTMENT_DB.aggregate([
            {$match: {...filterHistory}},
            {$group: {
                _id: {
                    year: {$year: "$createdAt"},
                    month: {$month: "$createdAt"}
                },
                totalAppointments: { $sum: 1 }
            }}
        ]),

        PATIENT_DB.aggregate([
            {$match: {...filterHistory}},
            {$group: {
                _id: {
                    year: {$year: "$createdAt"},
                    month: {$month: "$createdAt"},
                },
                totalPatients: {$sum: 1}
            }}
        ]),
    ]);



    return {
        invoices,
        transactions,
        medicalRecords,
        appointments,
        patients
    };
};

module.exports = {
    analyticsService,
    analyticsHistoryService
};
