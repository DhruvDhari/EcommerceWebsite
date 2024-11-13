const Order = require("../models/Order");
const Cart = require("../models/Cart");

const createOrder = async (req, res) => {
  const { userId, address, mobile, pincode, email, name } = req.body;


  try {
    // Check if the cart exists for the given user
    
    const cart = await Cart.findOne({ userId });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    
    // Validate the data
    
    if (!name || !userId || !address || !mobile || !pincode || !email || !cart.items || cart.totalPrice === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }


    // Create the order object
    const newOrder = new Order({
      userId,
      name,
      items: cart.items,  // Ensure this is an array of orderItem objects
      address,
      mobile,
      pincode,
      email,
      totalPrice: cart.totalPrice,
    });



    // Save the order to the database
    await newOrder.save();
  

    // Clear the user's cart after placing the order
    await Cart.findOneAndUpdate({ userId }, { items: [], totalPrice: 0 });

    res.status(201).json({ message: "Order placed successfully", order: newOrder });
    
  } catch (error) {
    console.error("Error during order save:", error); // Log the error details
    res.status(500).json({ message: "Error placing order", error: error.message });
  }
};


const getOrders = async (req, res) => {
  try {
    // Admins can access all orders, so we'll get all orders from the database
    const orders = await Order.find().populate('items.productId');

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found' });
    }

    res.status(200).json(orders); // Send orders back to the client
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};



module.exports = { createOrder,getOrders };
