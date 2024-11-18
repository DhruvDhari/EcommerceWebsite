const { verifyToken } = require('../utils/jwt');

const protect = (req, res, next) => {

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }
  

  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
  //   if (req.user && req.user.role !== 'admin') {
  //     return res.status(403).json({ message: "Admin access required" });
  // }
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is invalid' });
  }
};

module.exports = { protect };

