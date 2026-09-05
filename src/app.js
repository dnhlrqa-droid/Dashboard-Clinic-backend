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
const AppError = require("./middlewares/AppError");
const { connectDatabase } = require("./config/database");
const { logger } = require("./utils/logger");
const { limitEnpoint } = require("./middlewares/authMiddleware");


const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';
const NODE_ENV = process.env.NODE_ENV || 'development';
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'https://dashboard-clinic-a.netlify.app';

const app = express();

// ==================== Middleware ==================== //
app.use(helmet());

app.use(cors({
  origin: ['http://localhost:5173', 'https://dashboard-clinic-a.netlify.app'], 
  credentials: true
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


app.use("/api", route);
app.use("/api", router_patient);
app.use("/api", router_appointment);
app.use("/api", router_medical);
app.use("/api", router_invoice);
app.use("/api", router_analytics);




app.use(notFoundHandler);

process.on("uncaughtException", (error) => {
    logger.error("❌ Uncaught Exception", error);
    process.exit(1);
});
process.on("unhandledRejection", (error) => {
  logger.error("❌ Unhandled Rejection", error);
  process.exit(1);
});

async function startServer() {
  try {
      await connectDatabase();

      app.listen(PORT, () => {
        logger.succss(`✅ The server runs on: http://${HOST}:${PORT}`);
        logger.info(`📊 Environment: ${NODE_ENV}`);
        logger.info(`🔗 Data Base: ${process.env.MONGO_URL}`);
      });
  }catch(error) {
    logger.error('❌ Server startup failed: ', error);
    process.exit(1);
  }
};

startServer();