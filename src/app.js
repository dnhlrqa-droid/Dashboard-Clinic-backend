require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
// ========== //
const route = require("./routers/auth.routes");
const router_patient = require("./routers/patient.routes");
const router_appointment = require("./routers/appointment.routes");
const router_medical = require("./routers/medical.routes");
const router_invoice = require("./routers/invoice.routes");
const router_analytics = require("./routers/analytics.routes");
// ============ //
const {notFoundHandler} = require("./middlewares/errorHndler");

const cookies = require("cookie-parser");
const { connectDatabase } = require("./config/database");
const { logger } = require("./utils/logger");
const { limitEnpoint } = require("./middlewares/authMiddleware");


const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';
const NODE_ENV = process.env.NODE_ENV || 'development';
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'https://dashboard-clinic-a.netlify.app';

const app = express();
app.set("trust proxy", 1);
// ==================== Middleware ==================== //
app.use(helmet());

app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true,
}));
app.use(compression());

app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({limit: "10mb", extended: true}));
app.use(cookies());


if(NODE_ENV === "development") {
  app.use(morgan("dev"));
}else {
  app.use(morgan("combined"));
}



app.get("/api/health", limitEnpoint, (req, res) => {
   res.status(200).json({
    status: true,
    message: 'API It works correctly',
    version: "1.0.0",
    timestamp: new Date().toISOString(),
   });
});

app.use( async (req, res, next) => {
   try {
    await connectDatabase();
    next();
   }catch(error) {
     logger.error("Server startup failed: ", error)
     next(error);
   }
})

app.use("/api", route);
app.use("/api", router_patient);
app.use("/api", router_appointment);
app.use("/api", router_medical);
app.use("/api", router_invoice);
app.use("/api", router_analytics);




app.use(notFoundHandler);

app.use((err, req, res, next) => {
  logger.error("Request error: ", err);
  res.status(err.status || 500).json({ status: false, message: "Internal server error" });
});

async function startServer() {
  try {

    await connectDatabase();

   app.listen(PORT, () => {
          logger.success(`✅ The server runs on: http://${HOST}:${PORT}`);
          logger.info(`📊 Environment: ${NODE_ENV}`);
    });
  }catch(error) {
    logger.error("Server startup failed: ", error)
  }
};
if(process.env.NODE_ENV === "development") {
  startServer();
}
module.exports = app;
