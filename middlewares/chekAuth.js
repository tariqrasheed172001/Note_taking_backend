import jwt from 'jsonwebtoken';

const jwtAuth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized - Token missing' });
  }

  try {
    // Verify the JWT token
    const TokenArray = token.split(" ");
    const decoded = jwt.verify(TokenArray[1], process.env.JWT_SECRET);

    // Attach the decoded user information to the request object
    req.user = decoded;
    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Unauthorized - Invalid token',token });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Unauthorized - Token expired' });
    } else {
      // Handle other errors (e.g., malformed tokens) appropriately
      console.error('JWT verification error:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};

export default jwtAuth;
