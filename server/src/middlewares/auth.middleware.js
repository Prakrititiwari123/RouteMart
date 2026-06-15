import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    const authHeader = req.headers.authorization;
    // console.log('AUTH HEADER:', authHeader);

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
    }

    // console.log('TOKEN:', token);

    // console.log('TOKEN LENGTH:', token.length);
    // console.log('TOKEN LAST CHAR:', token[token.length - 1]);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // console.log('DECODED:', decoded);

    req.user = await User.findById(decoded.id).select('-password');

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      message: 'Invalid Token',
    });
  }
};
