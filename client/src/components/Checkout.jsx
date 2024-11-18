import axios from "axios";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {setCartCount } from '../redux/slices/cartSlice';

const Checkout = () => {
  const user = useSelector((state) => state.user.user);
  const userId = user?.userId; // Use the correct field for userId
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    address: "",
    mobile: "",
    pincode: "",
    email: user?.email || "",
    userId: userId || ""  // Include userId in formData
  });
  

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData((prevData) => ({
        ...prevData,
        name: user.username || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.mobile) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\d+$/.test(formData.mobile)) {
      newErrors.mobile = "Mobile number must contain only digits";
    }
    if (!formData.pincode) newErrors.pincode = "Pincode is required";
    if (!formData.email) newErrors.email = "Email is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    try {
      // Include userId in the data sent to the backend
      await axios.post("/api/orders", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
   
      dispatch(setCartCount(0));
      navigate("/home/order-success");
    } catch (error) {
    
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <form>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        {errors.name && <p className="error">{errors.name}</p>}

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        {errors.email && <p className="error">{errors.email}</p>}

        <label>Mobile:</label>
        <input
          type="tel"
          name="mobile"
          value={formData.mobile}
          onChange={handleInputChange}
          required
        />
        {errors.mobile && <p className="error">{errors.mobile}</p>}

        <label>Address:</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          required
        />
        {errors.address && <p className="error">{errors.address}</p>}

        <label>Pincode:</label>
        <input
          type="text"
          name="pincode"
          value={formData.pincode}
          onChange={handleInputChange}
          required
        />
        {errors.pincode && <p className="error">{errors.pincode}</p>}
      </form>

      <h3>Payment</h3>
      <div >
        <input type="radio" name="payment" value="cod" checked readOnly /> Cash
        on Delivery
      </div>
      <button onClick={handlePlaceOrder} className="btn center" >
        Place Order
      </button>
      
    </div>
  );
};

export default Checkout;
