const Cart = require('../models/Cart');

// Add product to cart
const addToCart = async (req, res) => {
    const { userId, productId, name, price, image } = req.body;

    try {
        let cart = await Cart.findOne({ userId });

        // If cart exists, update it
        if (cart) {
            const itemIndex = cart.items.findIndex(item => item.productId == productId);

            if (itemIndex > -1) {
                // Update quantity if item is already in the cart
                let productItem = cart.items[itemIndex];
                productItem.quantity += 1;
                cart.items[itemIndex] = productItem;
            } else {
                // Add new product to the cart
                cart.items.push({ productId, name, price, image, quantity: 1 });
            }
            cart.totalPrice += price;
            cart = await cart.save();
            res.status(200).json(cart);
        } else {
            // Create a new cart if none exists
            const newCart = await Cart.create({
                userId,
                items: [{ productId, name, price, image, quantity: 1 }],
                totalPrice: price,
            });
            res.status(201).json(newCart);
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get cart items for a user
const getCart = async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }
    try {
        const cart = await Cart.findOne({ userId }).populate('items.productId');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};



const updateQuantity = async (req, res) => {
    const { productId, action } = req.body;
    const { userId } = req.params;

    try {
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(item => item.productId == productId);

        if (itemIndex > -1) {
            let productItem = cart.items[itemIndex];

            // Update quantity based on the action
            if (action === 'increment') {
                productItem.quantity += 1;
                cart.totalPrice += productItem.price;
            } else if (action === 'decrement') {
                if (productItem.quantity > 1) {
                    productItem.quantity -= 1;
                    cart.totalPrice -= productItem.price;
                } else {
                    // When quantity is 1 and decrement is requested, remove the product from cart
                    cart.totalPrice -= productItem.price; // Subtract the price before removing
                    cart.items.splice(itemIndex, 1); // Remove the product from the cart
            
                }
            }

         
            cart = await cart.save();

            res.status(200).json(cart);
        } else {
            res.status(404).json({ message: 'Product not found in cart' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

  


module.exports = {
    addToCart,
    getCart,
    // removeFromCart,
    updateQuantity
};
