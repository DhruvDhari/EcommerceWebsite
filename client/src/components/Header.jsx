import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Logo from "../assets/icon.png";
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart } from "react-icons/fa";
import axios from 'axios';
import { logout } from '../redux/slices/userSlice';
import { setCartCount } from '../redux/slices/cartSlice';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { login } from '../redux/slices/userSlice';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartCount = useSelector((state) => state.cart.cartCount);
  const user = useSelector((state) => state.user.user);
  const profileImage = localStorage.getItem('profileImage') || 'https://walnuteducation.com/static/core/images/icon-profile.png';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, { email, password });
      localStorage.setItem('profileImage', data.profileImage);
      localStorage.setItem('token', data.token);
   
      dispatch(login(data));  // Dispatch login action to Redux

      window.$('#myModal').modal('hide');

      if (data.email === 'admin@admin.com') {
        navigate('/home/employee');
      } else {
        navigate('/home/products');
      }
    } catch (error) {
      alert('Wrong credentials');
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("profileImage");
      dispatch(logout());
      dispatch(setCartCount(0));
      navigate("/");
    }
  };

  const fetchCartItems = async (userId) => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/cart/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const totalItems = Array.isArray(data.items) 
        ? data.items.reduce((total, item) => total + item.quantity, 0) 
        : 0;

      dispatch(setCartCount(totalItems));
     

    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('Cart not found, setting cart count to 0.');
        dispatch(setCartCount(0)); // Handle case where cart does not exist
      } else {
        console.error('Error fetching cart items:', error);
      }
    }
  };

  useEffect(() => {
    if (user) {
      fetchCartItems(user.userId);
    } else {
      setCartCount(0); // If no user is logged in, cart count should be 0
    }
    // eslint-disable-next-line
  }, [user]);

  // Handle guest login
  const handleGuestLogin = () => {
    setEmail('dhruv@gmail.com');
    setPassword('dhruv');
    
   
  };

  // Handle admin login
  const handleAdminLogin = () => {
    setEmail('admin@admin.com');
    setPassword('admin123');
   
  };

  return (
    <>
      <div id="myModal" className="modal" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <div className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </div>
              <center>
                <h2>Login</h2>
              </center>
            </div>
            <div className="modal-body">
              <div className="login-container">
                <form onSubmit={loginHandler}>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <div className="password-container">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <span
                      className="eye-button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </span>
                  </div>
                  <button type="submit">Login</button>
                </form>
                <button data-dismiss="modal" onClick={() => navigate('/register')}>
                  Don't have an account? Register
                </button>
                {/* Login as Guest Button */}
                <div className="flex">

                <button onClick={handleGuestLogin} style={{backgroundColor:'DodgerBlue'}} className="guest-login-button">
                  Guest Credentials
                </button>
                {/* Admin Login Button */}
                <button onClick={handleAdminLogin} style={{backgroundColor:'DodgerBlue'}} className="admin-login-button">
                  Admin Credentials
                </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <header className="header">
        <img
          src={Logo}
          onClick={() => navigate("/home/products")}
          className="website-logo"
          alt="logo"
        />
        {user ? (
          <>
            <div className="cart-icon" onClick={() => navigate("/home/cart")}>
              <FaShoppingCart style={{ fontSize: "30px" }} />
              <div className="cart-number">{cartCount}</div>
            </div>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
            <img
  src={profileImage && profileImage.startsWith('http') 
    ? profileImage 
    : `${process.env.REACT_APP_BACKEND_URL}${profileImage || '/path/to/default-icon.png'}`}
  alt="icon"
  className="logo"
/>

          </>
        ) : (
          <>
            <div className="cart-icon" onClick={() => navigate("/home/cart")}>
              <FaShoppingCart style={{ fontSize: "30px" }} />
              <div className="cart-number">{cartCount}</div>
            </div>
            <button
              data-toggle="modal"
              data-target="#myModal"
              className="logout-button"
              style={{ backgroundColor: '#4CAF50' }}
            >
              Login
            </button>
          </>
        )}
      </header>
    </>
  );
};

export default Header;
