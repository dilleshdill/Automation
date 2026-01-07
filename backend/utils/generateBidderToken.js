import jwt from "jsonwebtoken";

const generateBidderToken = (bidderId,auctionId,email ) => {
  return jwt.sign(
    { bidder_id: bidderId ,
      auction_id : auctionId,
      email
    },
    process.env.JWT_BIDDER_SECRET,
    {
      expiresIn: "7d", // token validity
    }
  );
  
};

export default generateBidderToken;
