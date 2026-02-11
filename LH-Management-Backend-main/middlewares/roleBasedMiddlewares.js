
const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
      const userRole = req.user.role;
      
      if (allowedRoles.includes(userRole)) {
        next(); // User has the required role, proceed to the next middleware or route handler
      } else {
        res.status(403).json({ message: 'Permission denied' });
      }
    };
  };
  
  module.exports = roleMiddleware;