const {z, email} = require("zod");


const loginValideted = z.object({
    password: z.string().min(5, {message: "The password is too short."}).max(40, 
    {message: "The password is too long."})
});

const registareValideted = z.object({
    name: z.string(),
    email: z.string().email({message: "The email format is invalid."}),
    password: z.string().min(5, {message: "The password is too short."}).max(40, 
    {message: "The password is too long."}),
    role: z.enum(['admin', 'doctor', 'receptionist'], {
        errorMap: () => ({message: "Please enter a valid role."})
    }),
    phone: z.string().min(10, {message: "The phone number is too short."}).max(20, 
    {message: "The phone number is too long."}),
});

const idValideted = z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/)
});


module.exports = {
    loginValideted,
    registareValideted,
    idValideted,
}