const express = require('express');
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect } = require('../middleware/auth'); // middleware to ensure user is authenticated
const router = express.Router();
const multer = require('multer');


// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage });

// Route to create a new product (only accessible to admins)
router.post('/', protect,upload.single('image'), createProduct);

// Route to get all products
router.get('/', getProducts);

// Route to get a single product by ID
router.get('/:id', getProductById);

// Route to update a product (only accessible to admins)
router.put('/:id', protect, updateProduct);

// Route to delete a product (only accessible to admins)
router.delete('/:id', protect, deleteProduct);

module.exports = router;
