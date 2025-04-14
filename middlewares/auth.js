// Middleware to check if the user is authenticated
export const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next(); // If authenticated, proceed to the next middleware (updateUserProfile)
    } else {
      return res.status(401).json({ error: "You must be logged in to update your profile." });
    }
  };
  