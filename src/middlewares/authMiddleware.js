const jwt = require("jsonwebtoken");
const { USERS_DB } = require("../models/modules");
const rateLimit = require("express-rate-limit");
const {MESSAGES} = require("../utils/constants");

async function authMiddleware(req, res, next) {
   const cookeisToken = req.cookies && req.cookies.token;
   const headersToken = req.headers && req.headers.authorization;
   
   try {
        
        let token = null;
        if(cookeisToken) {
            token = typeof cookeisToken === "string" && cookeisToken.startsWith("Bearer ") ? cookeisToken.split(" ")[1] : cookeisToken;
        } else if(headersToken) {
            token = typeof headersToken === "string" && headersToken.startsWith("Bearer ") ? headersToken.split(" ")[1] : headersToken;
        }

        if(!token) return res.status(401).json({message: MESSAGES.ERROR_AUTH_TOKEN});

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const USER = await USERS_DB.findById(decoded.id);
           if (!USER) return res.status(401).json({message: MESSAGES.ERROR_USER_NOT_EXISTS});
           if(!USER.isActive) return res.status(403).json({message: MESSAGES.ERROR_ACCOUNT});
           
          const dataUser = {
           id: USER.id,
           name: USER.name,
           email: USER.email,
           phone: USER.phone,
           role: USER.role,
           isActive: USER.isActive,
          };
        req.user = dataUser;
        next();
   }catch(error) {
     return res.status(401).json({message: error})
   }
};

const limitLogin = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    message: {
        message: MESSAGES.ERROR_LOGIN_LIMIT,
        statusCode: 429,
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const limitEnpoint = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 5,
    message: {
        message: MESSAGES.ERROR_LOGIN_LIMIT_ENDPOINT,
        statusCode: 429,
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    authMiddleware,
    limitLogin,
    limitEnpoint,
};
