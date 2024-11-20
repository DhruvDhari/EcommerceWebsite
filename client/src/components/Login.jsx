import React, { useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from 'react-redux';
import { login } from '../redux/slices/userSlice';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, { email, password });
      localStorage.setItem('profileImage', data.profileImage);
      localStorage.setItem('token', data.token);
      
      dispatch(login(data));  // Dispatch login action to Redux

      if (data.email === 'admin@admin.com') {
        navigate('/home/employee');
      } else {
        navigate('/home/products');
      }
    } catch (error) {
      alert('Wrong credentials');
    }
  };

  // // Log the user state whenever it updates
  // useEffect(() => {
  //   console.log("User state updated:", user);
  // }, [user]);

  return (
    <div className="login-container">
      <h2>Login</h2>
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
        <button type="submit" >Login</button>
      </form>
      <button onClick={() => navigate('/register')}>Don't have an account? Register</button>
    </div>
  );
}

export default Login;
