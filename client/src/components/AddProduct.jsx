import React, { useState } from 'react';
import axios from 'axios';

const AddProduct = () => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('electronics'); // Default category
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState(''); // New state for description
    const [image, setImage] = useState(null); // Change to null for single image

    const handleAddProduct = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('category', category);
        formData.append('price', price);
        formData.append('description', description); // Append description
        if (image) {
            formData.append('image', image);
        }

        const token = localStorage.getItem('token');

        try {
            await axios.post('https://ecommercewebsite-hv8m.onrender.com/api/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
            });

            setName('');
            setCategory('electronics'); // Reset to default
            setPrice('');
            setDescription(''); // Clear description field
            setImage(null);
            alert('Product added successfully');
      
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Error adding product');
        }
    };

    return (
        <div className="add-product">
            <form onSubmit={handleAddProduct} className="add-product-form">
                <h1>Add New Product</h1>
                <input
                    type="text"
                    placeholder="Product Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                
                <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                    <option value="electronics">Electronics</option>
                    <option value="footwear">Footwear</option>
                    <option value="fashion">Fashion</option>
                    <option value="home">Home</option>
                    <option value="toys">Toys</option>
                </select>

                <input
                    type="number"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />

                <textarea
                    placeholder="Product Description" // New input for description
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />

                <input
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
                    required
                />

                <button type="submit">Add Product</button>
            </form>
        </div>
    );
};

export default AddProduct;
