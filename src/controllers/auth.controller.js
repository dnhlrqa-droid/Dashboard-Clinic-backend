

const { USERS_DB } = require("../models/modules");
const { registarService, loginService, updateAdminUserService, toggleDoctorStatusService } = require("../services/auth.service");
const { logger } = require("../utils/logger");
const { MESSAGES } = require("../utils/constants");


const registareController = async (req, res) => {
    const { name, email, password, role, phone } = req.body;
       const newUser = {
         name, email, password, role, phone
       };
    try {
      const Registar = await registarService(newUser);
      res.status(201).json({
        status: true,
        message: MESSAGES.SUCCESS_CREATE_EMPLOYEE,
        user: Registar,
      });
    }catch(error) {
       res.status(500).json({
        status: false,
        message: error.message
      });
      return logger.error(error);
    }
};

// ===================== //
const loginController = async (req, res) => {
      const {password} = req.body;
      const user = {
         password
      };
    try {
        const {accessToken} = await loginService(user);

        res.cookie("token", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
        });
        res.status(200).json({
          status: true,
           message: MESSAGES.SUCCESS_LOGIN,
          });
    }catch(error) {
       res.status(500).json({
        status: false,
        message: error.message
      });
       return logger.error(error);
    }
};

// ===================== //

const checkIsTokenInCookies = (req, res) => {
   res.status(200).json({
    status: true,
    user: req.user,
   });
};


// ===================== //

const updateAdminUser = async (req, res) => {
   const {id} = req.params;
   const {name, email, password, role, phone} = req.body;
       const updateUser = {
        name, email, password, role, phone, id
       };
   try {
          const newUpdateUserAdmin = await updateAdminUserService(updateUser);
          res.status(201).json({
            status: true,
            message: MESSAGES.SUCCESS_UPDATE_EMPLOYEE,
            data: newUpdateUserAdmin
          });
   }catch(error) {
     res.status(500).json({
      status: false,
      message: error.message
    });
    return logger.error(error);
   }
};

// ===================== //

const toggleDoctorStatus = async (req, res) => {
   const {id} = req.params;

   try {
    const toggleDoctor = await toggleDoctorStatusService({id});
    console.log(toggleDoctor)
    res.status(201).json({
      status: true,
      message: MESSAGES.SUCCESS_UPDATE_EMPLOYEE,
      data: toggleDoctor
    });

   }catch(error) {
     res.status(500).json({
      status: false,
      message: error.message
    });
    return logger.error(error);
   }
};


// ===================== //
const getUsersAndSearch = async (req, res) => {
    const {search} = req.query;
    try {
      let querySearch = {};
      if(querySearch && typeof search === "string"){
        querySearch = {
          $or: [
            {name: {$regex: search, $options: "i"}},
            {phone: {$regex: search, $options: "i"} }
          ]
        }
      }

      const user = await USERS_DB.find(querySearch).sort({createAt: -1});
      const count = await USERS_DB.countDocuments().sort({createAt: -1});

      res.status(200).json({
        status: true,
        count: count,
        data: user
      });

    }catch(error) {
       res.status(500).json({
        status: false,
        message: error.message
      });
      return logger.error(error);
    }
};

module.exports = {
    registareController,
    loginController,
    checkIsTokenInCookies,
    updateAdminUser,
    toggleDoctorStatus,
    getUsersAndSearch,
};