# Dashboard-Clinic BackEnd


## Technologies used
**Backend:** Node.js, Express, MongoDB, Mongoose


##  Features

-Complete athentcation system (JWT + refresh tokens, HttpOnly cookis)
-**Roles-based promissions**(Admin / Doctor / Receptionist)
-**API RESTful Complete**
**Comprehensive Error handling** - Clear messages
-**Pagination** - Page support and data
-**analytices** Statistics and time filtering (day/week/month/year)
-Patient management, appointments, medical records, invoicing, and financial transactions
- Automatic appointment conflict detection

## Librarys used  
**compression** To avoid a surge in requists
**cors** To protect the site from exploitation, it is configured to run on a single port.`http://localhost:5173`
**express-rate-limit** Specifying the number of requests
**helmet** To prevent XSS attacks carried out via requests
**moment** For handling dates and calculations
**zod** To validate inputs received via APIs.


### Requirements

- Node.js v16+
- MongoDB (local or cloud)
- npm or yarn

## Installation 

npm install 

## Operation 
 
npm run dev


The server will work on `http://localhost:3000`


## 📁 بنية المشروع

```
src/
├── config/             
│   └── database.js     # Sitting MongoDB
├── models/             # Templates Mongoose
│   ├── User.js
│   ├── patient.js
│   ├── medical.js
│   ├── invoices.js
│   └── appointment.js
│   └── analytice.js
├── middleware/         # Middlewares
│   ├── auth.js        # المصادقة والصلاحيات
│   ├── errorHandler.js # معالجة الأخطاء
│   ├── AppError.js   # التحقق من الاخطاء
│   ├── role.js   # التحقق من الدور
├── controllers/        # Controllers
│   ├── analytice.controller.js
│   ├── auth.controller.js
│   ├── appointment.controller.js
│   ├── invoices.controller.js
│   ├── medical.controller.js
│   ├── patient.controller.js
├── services/          # Business Logic
│   ├── analytice.service.js
│   ├── appointment.service.js
│   ├── auth.service.js
│   ├── invoices.service.js
│   ├── medical.service.js
│   └── patient.service.js
├── routes/            # API Routes
│   ├── analytice.routes.js
│   ├── appointment.routes.js
│   ├── auth.routes.js
│   ├── invoices.routes.js
│   ├── medical.routes.js
│   ├── patient.routes.js
├── utils/             # Utility Functions
│   ├── logger.js
│   ├── constants.js
│   └── generators.js
├── Validation/             # Validation Library 
│   ├── patient.js
│   ├── appointment.js
│   └── invoices.js
│   └── auth.js
│   └── medical.js
└── app.js          # Main File 
```

## API Endpoints

### (Auth)

POST   /api/auth/login                        # تسجيل دخول
POST   /api/auth/register                     # انشاء موضف جديد 
GET    /api/auth/verify/session               # التحقق من الجلسة
PATCH  /api/update/admin/:id                  # تعديل بيانات الموضف
PATCH  /api/auth/toggle-status/:id            # تبديل الحالة 
GET    /api/auth/users                        #   جلب كافة الموضفين

### (Patients)

POST     /api/create/patients                       #  Created patient
GET     /api/patients                               # Get all patients
PATCH      /api/update/patients/:id                 # Updated patient
PATCH    /api/patient/:id/status                    # Updated status patient
PATCH    /api/patients/:id/medical-history          # Updated medical history patient

### (Appointments)

POST     /api/create/appointments                   #  Created appointments
GET     /api/appointments                           # Get all appointments
GET      /api/appointments/today                    # Get all appointments today
PATCH    /api/appointments/:id/status               # Updated status appointments


### (medicalRecords)

POST     /api/create/medical-record                   #  Created medical-records
GET     /api/medical-records                          # Get all medical-records

### (invoices)

POST     /api/create/transactions                   # Created transactions
GET     /api/transactions/patient/:id               # Get all transactions patient
GET     /api/invoices/patient/:id                   # Get all invoices patient
GET     /api/invoices                               # Get all invoices


### (analytices)

GET     /api/analytics/summary/history                       # Get all analytics history
GET     /api/analytics/summary                               # Get all analytics


### Login

```bash
curl -X POST http://localhost:5173/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"employeeCode":"EMP001"}'
```

**response:**
```json
{
  "success": true,
  "message": "Logged in successfully",
  "data": {
    "user": {
      "_id": "...",
      "name": "أحمد محمد",
      "email": "ahmed@example.com",
      "role": "admin"
    },
  }
}
```

### Usage Token

في جميع الطلبات المحمية:

```bash
curl -H "credentials: include" \
  http://localhost:5000/api/products
```

##  Treat Errors

All errors are returned in a standardized format.

```json
{
  "success": false,
  "message": "Message Error",
  "status": 500,
}
```

## Security 
- **Tokens** - JWT storage in cookis
- **CORS** - limited only to Frontend 
- **HttpOnly cookies** To prevent access to sesstion tokent via JavaScript
- **Rate limiting** To prevent attacks Brute Force on login attempts
- **Helmet** To protect aganits common XSS attacks
-**ZOD**  Chick inputs via Zod schemas before reaching the layer business logic




## ⚙️ Environment Variaples

*env*
# Environment
NODE_ENV=development

# Servar
PORT=5000
HOST=localhost

# Data base
MONGODB_URI=mongodb://localhost:27017/supermarket-dashboard

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:5173

# Pagination
DEFAULT_PAGE=1
DEFAULT_LIMIT=20
MAX_LIMIT=40
