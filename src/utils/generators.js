const { APPOINTMENT_DB } = require("../models/modules");






const generatorsCode = (prefix, length = 8) => {
     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
     let code = "";
     for(let i = 0; i < length; i++) {
         code += characters.charAt(Math.floor(Math.random() * characters.length));
     }
     return prefix ? `${prefix}-${code}` : code;
};


const checkAppointmentConflict = async (doctorId, appointmentDate, durationMinutes, excludeAppointmentId = null) => {
     const startTime = new Date(appointmentDate);
     const endTime = new Date(startTime.getTime() + durationMinutes * 60000);

     const conflictFilter  = {
        doctorId,
        status: {$ne: "Cancelled"},
        $expr: {
           $and: [
              {$lt: ["$appointmentDate", endTime]},
              {
               $gt: [
                  {$add: ["$appointmentDate", {$multiply: ["$durationMinutes", 60000]}]},
                  startTime
               ],
              }
           ],
        }
     };

     if(excludeAppointmentId){
        conflictFilter ._id = {$ne: excludeAppointmentId}
     }
     const conflictingAppointment  = await APPOINTMENT_DB.findOne(conflictFilter);

     return conflictingAppointment;
};


module.exports = {
    generatorsCode,
    checkAppointmentConflict,
};


