const Product = require('../models/Product');

// Create a new product
exports.createProduct = async (req, res) => {
    try {
        const { name, category, price, description } = req.body; // Include description in destructuring
        const image = `/uploads/${req.file.filename}`;
        
        // Ensure all required fields are provided
        if (!name || !category || !price || !description || !image) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        // Create the product
        const product = new Product({
            name,
            category,
            price,
            image,
            description // Include description in the product
        });

        const savedProduct = await product.save();
        return res.status(201).json(savedProduct);
    } catch (error) {
        return res.status(500).json({ message: "Error creating product", error: error.message });
    }
};


// Get all products
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching products", error: error.message });
    }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching product", error: error.message });
    }
};

// Update a product by ID
exports.updateProduct = async (req, res) => {
    try {
        const { name, category, price, image, description } = req.body; // Include description in destructuring

        // Find the product by ID and update it
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { name, category, price, image, description }, // Include description in the update
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json(updatedProduct);
    } catch (error) {
        return res.status(500).json({ message: "Error updating product", error: error.message });
    }
};

// Delete a product by ID
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error deleting product", error: error.message });
    }
};
