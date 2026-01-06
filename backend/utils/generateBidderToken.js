import jwt from "jsonwebtoken";

const generateBidderToken = (bidderId,email ) => {
  return jwt.sign(
    { id: bidderId ,
        email
    },
    process.env.JWT_BIDDER_SECRET,
    {
      expiresIn: "7d", // token validity
    }
  );
  
};

export default generateBidderToken;
