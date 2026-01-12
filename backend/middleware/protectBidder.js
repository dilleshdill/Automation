import jwt from "jsonwebtoken";

export const protectBidder = (req, res, next) => {
  const token = req.cookies.bidder_token;
  console.log("token" ,token)
  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_BIDDER_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};
