import jwt from "jsonwebtoken";

const generateAdminToken = (adminId,email) => {
  return jwt.sign(
    { id: adminId ,
        email
    },
    process.env.JWT_ADMIN_SECRET,
    {
      expiresIn: "7d", // token validity
    }
  );
  
};

export default generateAdminToken;
