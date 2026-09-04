



// ==================== Messages System ====================
const MESSAGES = {
  // success
  SUCCESS_LOGIN: 'Logged in successfully.',
  SUCCESS_GET_PATIENT: 'Get patients successfully.',
  SUCCESS_CREATE_PATIENT: 'Created patient successfully.',
  SUCCESS_UPDATE_PATIENT: 'Patient data has been successfully updated.',
  SUCCESS_CREATE_APPOINTMENT: 'Appointment successfully created.',
  SUCCESS_GET_APPOINTMENT: 'Get appointments successfully.',
  SUCCESS_UPDATE_APPOINTMENT: 'Appointment data has been successfully updated.',
  SUCCESS_UPDATE_APPOINTMENT_STATUS: 'Appointment status has been successfully updated.',
  SUCCESS_DELETE_PATIENT: 'The patient has been successfully deleted.',
  SUCCESS_CREATE_EMPLOYEE: 'The employee has been successfully created.',
  SUCCESS_UPDATE_EMPLOYEE: 'Employee data has been updated successfully.',
  SUCCESS_GET_MEDICAL_RECORD: 'Get medical record successfully',
  SUCCESS_CREATE_MEDICAL_RECORD: 'created medical record successfully.',
  SUCCESS_CREATE_TRANSACTION: 'created transaction successfully.',
  SUCCESS_GET_TRANSACTION: 'Get transaction successfully.',
  SUCCESS_GET_ID_TRANSACTION: 'Get transaction by id successfully.',

  // errors
  ERROR_AUTH_TOKEN: 'Authorization token missing',
  ERROR_AUTH_ROLE: 'Unauthorized access',
  ERROR_AUTH_ACCESS: 'Access denied',
  ERROR_USER_NOT_EXISTS: 'User not exists',
  ERROR_ACCOUNT: 'The account is disabled',
  ERROR_LOGIN_LIMIT: 'Too many requests from this IP, please try again after 15 minutes',
  ERROR_LOGIN_LIMIT_ENDPOINT: 'Too many requests from this IP, please try again after 1 minutes',
  ERROR_PATH: 'No path exists',

  ERROR_PATIENT_NOT_FOUND: 'Patient not found',
  ERROR_PATIENT_EXISTS: 'Patient already exists',
  ERROR_PATIENT_INVALID: 'Invalid ID format',

  ERROR_EMPLOYEE_NOT_FOUND: 'Employee not found',
  ERROR_EMPLOYEE_EXISTS: 'Employee already exists',
  ERROR_EMPLOYEE_INVALID: 'Invalid ID format',
  ERROR_EMPLOYEE_EMAIL: 'The account is incorrect',
  ERROR_EMPLOYEE_PASSWORD: 'The password is incorrect',

  ERROR_APPOINTMENT_NOT_FOUND: 'Appointment not found',
  ERROR_APPOINTMENT_CONFLICT: 'There is a conflict with another appointment for this doctor at the same time',
  ERROR_APPOINTMENT_INVALID: 'This patient is unavailable',
  
  ERROR_DOCTOR_NOT_FOUND: 'Doctor not found',

  ERROR_TRANSACTION_NOT_FOUND: 'Transaction not found',

  ERROR_TIME_FORMAT: 'The time format is incorrect',

  
};


module.exports = {
    MESSAGES,
};