const jwt = require("jsonwebtoken");
const User = require('../models/User');

const optionalAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return next();
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
  } catch (error) {
    return next();
  }
  next();
};


const protect = async (req, res, next) => {
    let token;
  try {
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer")) {
        return res.status(401).json({message: "No estas autorizado"})
    } else {
        token = req.headers.authorization.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return res.status(401).json({message: 'No autorizado, usuario no encontrado'});
        }
        next();
    }

  } catch (error) {
    return res.status(401).json({message:'No autorizado, token fallido'});
  }
  
} 


module.exports = { protect, optionalAuth };
