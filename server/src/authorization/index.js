import jwt from 'jsonwebtoken';
const jwtSecret = process.env.JWT_SECRET;

export const authorizeUser = (req, res, next) => {
  const token = req.headers['authorization'];
    jwt.verify(token, jwtSecret, (err, user) => {
      if(err)console.error(err.message);
      req.user = user;
      if(!user){
      console.log("User Not Authorized");
    }
      next();
    });
};