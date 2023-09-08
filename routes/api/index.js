const router = require("express").Router();
const userRoutes = require("./userRoutes"); // Import user routes
const thoughtRoutes = require("./thoughtRoutes"); // Import thought routes

// Use the user and thought routes
router.use("/users", userRoutes); // Use user routes under /users
router.use("/thoughts", thoughtRoutes); // Use thought routes under /thoughts

// Export the router
module.exports = router;
