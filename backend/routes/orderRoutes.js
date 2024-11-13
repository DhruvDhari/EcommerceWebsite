const express = require("express");
const { createOrder, getOrders } = require("../controllers/orderController");
const { protect } = require("../middleware/auth"); 

const router = express.Router();

router.post("/", protect, createOrder); // POST /api/orders
router.get("/", protect, getOrders);  

module.exports = router;
