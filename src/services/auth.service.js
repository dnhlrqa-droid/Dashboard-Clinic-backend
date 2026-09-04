
const jwt = require("jsonwebtoken");

const AppError = require("../middlewares/AppError");
const { USERS_DB } = require("../models/modules");
const { registareValideted, loginValideted, idValideted } = require("../validation/auth.validation");


async function registarService(newUser) {
  const validetedInputs = await registareValideted.safeParseAsync(newUser);
      if(!validetedInputs.success) {
        const errorMessage = validetedInputs.errors.error.format();
        throw new AppError(errorMessage, 404);
      }
      const { name, email, password, role, phone } = validetedInputs.data;
      const addedUser = {
        name, email, password, role, phone
      };

  const checkUser = await USERS_DB.findOne({email});
  const checkUserPassword = await USERS_DB.findOne({password});
  if(checkUser) throw new AppError(MESSAGES.ERROR_EMPLOYEE_EMAIL, 400);
  if(checkUserPassword) throw new AppError(MESSAGES.ERROR_EMPLOYEE_PASSWORD, 400);
  const createUser = await USERS_DB.create(addedUser);

  return createUser.toObject();
};

async function loginService(user) {
     const validetedInputs = loginValideted.safeParse(user);
        if(!validetedInputs.success) {
         const errorMessage = validetedInputs.error.issues.map(i => i.message).join(", ");
              throw new AppError(errorMessage, 400);
        }
        const {password} = validetedInputs.data;

   
   const User = await USERS_DB.findOne({password});

   if(!User) throw new AppError(MESSAGES.ERROR_EMPLOYEE_PASSWORD, 404);
   if(!User.isActive) throw new AppError(MESSAGES.ERROR_ACCOUNT, 403);


    const accessToken = jwt.sign(
    {
        id: User._id,
        role: User.role,
    },
    process.env.JWT_SECRET
);

    return {accessToken};
};

async function updateAdminUserService({id, name, email, password, role, phone}) {
     const checkIdValideted =  idValideted.safeParse({id});
        const validetedInputs =  registareValideted.safeParse({name, email, password, role, phone});

        if(!checkIdValideted.success) {
              const errorMessage = checkIdValideted.error.issues.map(i => i.message).join(", ");
              throw new AppError(errorMessage, 400);
            }
        if(!validetedInputs.success) {
              const errorMessage = validetedInputs.error.issues.map(i => i.message).join(", ");
             throw new AppError(errorMessage, 400);
            }

        const resultId = checkIdValideted.data;
        const resultValideted = validetedInputs.data;

        const newUpdatedUser = {
            name: resultValideted.name,
            email: resultValideted.email,
            password: resultValideted.password,
            phone: resultValideted.phone,
            role: resultValideted.role,
        };

    const updated = await USERS_DB.findByIdAndUpdate(resultId.id, newUpdatedUser, {new: true, runValidators: true});
    if(!updated) throw new AppError(MESSAGES.ERROR_EMPLOYEE_NOT_FOUND, 404);

    return updated;
};


async function toggleDoctorStatusService({id}) {
     if(!id) AppError(MESSAGES.ERROR_EMPLOYEE_INVALID, 400);

     const toogleDoctor = await USERS_DB.findById(id);
     if(!toogleDoctor) throw new AppError(MESSAGES.ERROR_EMPLOYEE_NOT_FOUND, 404);
     toogleDoctor.isActive = !toogleDoctor.isActive;
     await toogleDoctor.save();
     return toogleDoctor;
};

module.exports = {
    registarService,
    loginService,
    updateAdminUserService,
    toggleDoctorStatusService,
};