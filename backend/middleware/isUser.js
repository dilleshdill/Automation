export const isUser = (req, res, next) => {
  if (req.user.role !== "User") {
    return res.status(403).json({ message: "User access only" });
  }
  next();
};
