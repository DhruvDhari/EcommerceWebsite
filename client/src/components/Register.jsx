import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

function Register({setUser}) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); 
  const [ProfileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();

  const handleProfileImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const registerHandler = async (e) => {
    
    e.preventDefault();
    if (password !== confirmPassword) {
      return alert('Passwords do not match');
    }
    
      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      formData.append('password', password);
      if (ProfileImage) {
         formData.append('profileImage', ProfileImage);
      }


      try {
      const { data } = await axios.post('/api/auth/register', formData, {
         headers: {
            'Content-Type': 'multipart/form-data',
         },
      });
   
      localStorage.setItem('token', data.token);
      localStorage.setItem('profileImage', data.profileImage);
      setUser(data);
      navigate('/home/employee');
    } catch (error) {
    
      if (error.response && error.response.data) { 
        alert(`${error.response.data.message}`);
      } else {
     
        alert('Error registering user');
      }
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={registerHandler} encType="multipart/form-data">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
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
                {showPassword ?  <FaEye /> : <FaEyeSlash /> }
          </span>
        </div>
        <div className="password-container">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <span
            className="eye-button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
                {showConfirmPassword ?  <FaEye /> : <FaEyeSlash /> }
          </span>
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleProfileImageChange}
        />
        <button type="submit">Register</button>
      </form>
      <button onClick={() => navigate('/login')}>Back to Login</button>
    </div>
  );
}

export default Register;
