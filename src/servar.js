const express = require("express");


async function startServer() {
    
    const app = express();

    const PORT = process.env.PORT || 3000;
     const HOST = process.env.HOST || 'localhost';
   app.listen(PORT, () => {
          logger.succss(`✅ The server runs on: http://${HOST}:${PORT}`);
          logger.info(`📊 Environment: ${NODE_ENV}`);
    });
};

module.exports = startServer;