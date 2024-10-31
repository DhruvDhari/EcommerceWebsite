import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import HomeContainer from './components/HomeContainer';
import EmployeeList from './components/EmployeeList';
import { useDispatch, useSelector} from 'react-redux';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import './App.css';
import AddProduct from './components/AddProduct';

import { login } from './redux/slices/userSlice';
import axios from 'axios';

function App() {


  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:5000/api/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
         
          dispatch(login(response.data)); // Dispatch the full user object received from the server
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, [dispatch]);

  useEffect(() => {
   
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Public routes for customers
  const PublicRoutes = () => (
    <Routes>
      <Route path="/home" element={<HomeContainer  />}>
        <Route path="products" element={<ProductList />} />
        <Route path="cart" element={<Cart />} />
        <Route path="*" element={<ProductList />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Navigate to="/home/products" />} />
    </Routes>
  );

  // Protected routes for admin users
  const AdminProtectedRoutes = () => (
    <Routes>
      <Route path="/home" element={<HomeContainer  />}>
        <Route path="employee" element={<EmployeeList />} />
        {/* <Route path="post" element={<Post />} /> */}
        <Route path="products" element={<ProductList />} />
        <Route path="cart" element={<Cart />} /> 
        <Route path="add-product" element={<AddProduct />} />
      </Route>
      <Route path="*" element={<Navigate to="/home/products" />} />
    </Routes>
  );


  const UserProtectedRoutes = () => (
    <Routes>
      <Route path="/home" element={<HomeContainer />}>
        <Route path="products" element={<ProductList  />} />
        <Route path="cart" element={<Cart />} />

      </Route>
      <Route path="*" element={<Navigate to="/home/products" />} />
    </Routes>
  );

  return (
    <div className="App">
      {user ? 
        (user.email === 'admin@admin.com' ? <AdminProtectedRoutes /> : <UserProtectedRoutes />) 
        : <PublicRoutes />
      }
    </div>
  );
}

export default App;
