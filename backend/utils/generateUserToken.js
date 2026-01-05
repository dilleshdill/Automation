import jwt from "jsonwebtoken";

const generateUserToken = (userId,email , role) => {
  return jwt.sign(
    { id: userId ,
        role,
        email
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d", // token validity
    }
  );
  
};

export default generateUserToken;
