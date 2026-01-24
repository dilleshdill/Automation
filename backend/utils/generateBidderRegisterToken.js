import jwt from "jsonwebtoken";

const generateBidderRegisterToken = (bidderId,email ) => {
  return jwt.sign(
    { bidder_id: bidderId ,
      email
    },
    process.env.JWT_BIDDER_SECRET,
    {
      expiresIn: "7d", // token validity
    }
  );
  
};

export default generateBidderRegisterToken;
