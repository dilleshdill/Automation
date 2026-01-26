import jwt from "jsonwebtoken";

export const protectUser = (req, res, next) => {
  const token = req.cookies.userToken;
  
  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_USER_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};
