



function checkRole(...allwoedroles) {
   return (req, res, next) => {
      const userRole = req.user?.role;

    if(!req?.user || !userRole) return res.status(401).json({message: "Unauthorized"});
    if(!allwoedroles.includes(userRole)) return res.status(403).json({message: "Access denied"});
    

    next()
   }
};

module.exports = checkRole;
