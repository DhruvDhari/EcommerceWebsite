const express = require('express');
const { addToCart, getCart, updateQuantity } = require('../controllers/cartController');
const { protect } = require('../middleware/auth'); // Protect routes with authentication

const router = express.Router();

// Add to cart (userId from auth middleware)
router.post('/add',protect,  addToCart);

// Get user cart
router.get('/:userId',protect , getCart);

// // Remove item from cart
// router.delete('/remove',protect ,removeFromCart);

// In routes/cart.js

router.put('/update/:userId', protect,updateQuantity);


module.exports = router;
