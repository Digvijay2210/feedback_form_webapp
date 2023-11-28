export const authorizeAdmin = (req, res, next) => {
  const userRole = req.userRole; // Get the user's role from the request

  if (userRole === "admin") {
    next(); // User is authorized, continue to the next middleware/route
  } else {
    res.status(403).json({ msg: "Access denied" }); // User is not authorized
  }
};
