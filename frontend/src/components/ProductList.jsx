import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { incrementCartCount } from '../redux/slices/cartSlice';
import { useNavigate } from 'react-router-dom';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [category, setCategory] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const productsPerPage = 10;
    const user = useSelector((state) => state.user.user);
    const userId = user?.userId;
    const dispatch = useDispatch();
    const [containerClass, setContainerClass] = useState('full-width');
    const navigate=useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get('/api/products');
                setProducts(data);
                setFilteredProducts(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching products:', error);
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const formatPrice = (price) => price.toLocaleString('en-IN');

    useEffect(() => {
        if (user && user.email === 'admin@admin.com') {
            setContainerClass('product-list');
        } else {
            setContainerClass('full-width');
        }
    }, [user]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading) {
                return;
            }
            setCurrentPage((prevPage) => prevPage + 1);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading]);

    useEffect(() => {
        const loadMoreProducts = () => {
            if (currentPage > 1) {
                const start = currentPage * productsPerPage - productsPerPage;
                const moreProducts = products.slice(start, start + productsPerPage);
                setFilteredProducts((prevProducts) => [...prevProducts, ...moreProducts]);
            }
        };
        loadMoreProducts();
    }, [currentPage, products]);

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
        setCurrentPage(1);
        if (e.target.value === '') {
            setFilteredProducts(products.slice(0, productsPerPage));
        } else {
            const filtered = products.filter(product => product.category === e.target.value);
            setFilteredProducts(filtered.slice(0, productsPerPage));
        }
    };

    const addToCart = async (product) => {
        if (!userId) {
            alert("Please login to add items to the cart.");
            return;
        }
        try {
            await axios.post('/api/cart/add', {
                userId,
                productId: product._id,
                name: product.name,
                price: product.price,
                image: product.image[0],
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            alert(`${product.name} added to cart!`);
            dispatch(incrementCartCount());
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const removeProduct = async (productId) => {
        if (!window.confirm('Do you want to delete this product?')) {
            return;
        }
        try {
            await axios.delete(`/api/products/${productId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            alert("Product deleted successfully.");
            // Remove the product from the product list after deletion
            setProducts((prevProducts) => prevProducts.filter(product => product._id !== productId));
            setFilteredProducts((prevFilteredProducts) => prevFilteredProducts.filter(product => product._id !== productId));
        } catch (error) {
            console.error('Error deleting product:', error);
            alert("Error deleting product.");
        }
    };

    return (
        <div className={containerClass}>


<div className="product-header">


            <select class="btn btn-secondary dropdown " value={category} onChange={handleCategoryChange}>
                <option value="">All Categories</option>
                <option class="dropdown-item" value="electronics">Electronics</option>
                <option class="dropdown-item" value="footwear">Footwear</option>
                <option class="dropdown-item" value="fashion">Fashion</option>
                <option class="dropdown-item" value="home">Home</option>
                <option class="dropdown-item" value="toys">Toys</option>
            </select>
            {user?.email === 'admin@admin.com' && (
                            <button
                            style={{  width: '200px',height:'40px' }}
                            onClick={() => navigate("/home/add-product")}
                            >
                               + Add Product
                            </button>
                        )}
                        </div>
            <div className="product-grid">
                {filteredProducts.map((product) => (
                    <div key={product._id} className="product-card">
                        <img src={product.image[0]} alt={product.name} />
                        <h3>{product.name}</h3>
                        <p>Price: ₹ {formatPrice(product.price)}</p>
                        <div className="flex">

                        <button onClick={() => addToCart(product)}>Add to Cart</button>
                        
                        {user?.email === 'admin@admin.com' && (
                            <button
                            style={{  backgroundColor: '#ff3434' }}
                            onClick={() => removeProduct(product._id)}
                            >
                                Remove 
                            </button>
                        )}
                        </div>
                    </div>
                ))}
            </div>
            {loading && <p>Loading more products...</p>}
            
        </div>
    );
};

export default ProductList;
