let router = require("express").Router();
const authController = require('../controllers/authController');
const { rateLimit } = require("../middleware/rateLimit");

router.post("/sign-up", rateLimit, authController.signUp);
router.post("/login", rateLimit,  authController.login);
router.post("/verify-email",authController.verifyEmail);

module.exports = router; 
