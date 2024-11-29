const express = require("express");
const { processCheckout } = require("../../controllers/checkoutController");
const { authenticate } = require("../../middlewares/authMiddleware");

const router = express.Router();

// POST route for checkout
router.post("/checkout", authenticate, processCheckout);

module.exports = router;
