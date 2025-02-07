const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization']

  const token = authHeader && authHeader.split(" ")[1]
  // console.log(token);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.'
    })
  }

  //decode this token
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
    // console.log(decodedToken);

    req.userInfo = decodedToken;
    next();

  } catch (e) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.'
    })
  }

}

module.exports = authMiddleware;