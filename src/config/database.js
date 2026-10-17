
const mongoose = require("mongoose");
const {logger} = require("../utils/logger");


const connectDatabase = async () => {
   try {
    const mongoURI = process.env.MONGO_URL;

    if(mongoose.connection.readyState === 1) {
       return logger.info("MongoDB is already connected.");
    }

    const conn = await mongoose.connect(mongoURI,{ 
        retryWrites: true,
        w: "majority",
        serverSelectionTimeoutMS: 8000,
    });

    logger.info(`✅ MongoDB successfully connected. ${conn.connection.host}`);
    logger.info(`📊 Data Base : ${conn.connection.name}`);

   }catch(error) {
        logger.error(`❌ Connection failed to MongoDB:`, error);
        throw new Error("Connection failed to MongoDB");
   }
};


const disconnectDatabase = async () => {
    try {
       await mongoose.disconnect();
       logger.info(('✅ Connection was lost with to mongoDB'))
    }  catch(error) {
       logger.error('❌ Error disconnecting', error);
       throw new Error("Error disconnecting from MongoDB");
    }
};

module.exports = {
    connectDatabase,
    disconnectDatabase,
};