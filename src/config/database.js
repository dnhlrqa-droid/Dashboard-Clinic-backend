
const mongoose = require("mongoose");
const {logger} = require("../utils/logger");


const connectDatabase = async () => {
   try {
    const mongoURI = process.env.MONGO_URL;

    const conn = await mongoose.connect(mongoURI,{ 
        retryWrites: true,
        w: "majority"
    });

    logger.info(`✅ MongoDB successfully connected. ${conn.connection.host}`);
    logger.info(`📊 Data Base : ${conn.connection.name}`);

   }catch(error) {
        logger.error(`❌ Connection failed to MongoDB:`, error);
        process.exit(1);
   }
};


const disconnectDatabase = async () => {
    try {
       await mongoose.disconnect();
       logger.info(('✅ Connection was lost with to mongoDB'))
    }  catch(error) {
       logger.error('❌ Error disconnecting', error);
       process.exit(1);
    }
};

module.exports = {
    connectDatabase,
    disconnectDatabase,
};