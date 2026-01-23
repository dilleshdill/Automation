import jwt from "jsonwebtoken";

const generateUserToken = (userId,email ) => {
  
  return jwt.sign(
    { id: userId ,
        email
    },
    process.env.JWT_USER_SECRET,
    {
      expiresIn: "7d", // token validity
    }
  );
  
};

export default generateUserToken;
