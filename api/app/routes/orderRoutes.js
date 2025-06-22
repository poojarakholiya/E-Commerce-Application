const express = require("express");
const router = express.Router();
const {
  placeOrder,
  cancelOrder,
  getMyOrders,
  getTotalExpenses,
} = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");


router.use(protect);

router.post("/", placeOrder);               
router.put("/:id/cancel", cancelOrder);     
router.get("/", getMyOrders);              
router.get("/total/expenses", getTotalExpenses);

module.exports = router;
