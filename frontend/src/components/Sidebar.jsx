import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const user = useSelector((state) => state.user.user);  // Access user from Redux
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.email === 'admin@admin.com') {
      console.log("Admin user detected");
    }
  }, [user, dispatch]);  // Trigger this effect whenever 'user' updates

  // Only render sidebar if the user is an admin
  if (!user || user.email !== 'admin@admin.com') {
    return null;  // Don't render the sidebar if the user is not an admin
  }

  return (
    <nav className="sidebar">
      <ul>
        <li onClick={() => navigate("/home/products")}>Products</li>
        <li onClick={() => navigate("/home/employee")}>User Management</li>
     
      </ul>
    </nav>
  );
};

export default Sidebar;
