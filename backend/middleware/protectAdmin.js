import jwt from "jsonwebtoken";

export const protectAdmin = (req, res, next) => {
  const token = req.cookies.admin_token;
  console.log("Protect Admin Middleware Invoked. Token:", token);
  // console.log("Protect Admin Middleware Invoked. Token:", token);
  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
    req.user = decoded;
    // console.log("Decoded Admin Info:", decoded);
    // console.log("Admin authenticated successfully.");
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};
