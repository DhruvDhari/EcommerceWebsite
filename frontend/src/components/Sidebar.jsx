import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const user = useSelector((state) => state.user.user);  // Access user from Redux
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // Get the current path

  useEffect(() => {
    if (user && user.email === 'admin@admin.com') {
      console.log("Admin user detected");
    }
  }, [user, dispatch]);

  // Only render sidebar if the user is an admin
  if (!user || user.email !== 'admin@admin.com') {
    return null;
  }

  return (
    <nav className="sidebar">
      <ul>
        <li
          className={location.pathname === "/home/products" ? "active" : ""}
          onClick={() => navigate("/home/products")}
        >
          Products
        </li>
        <li
          className={location.pathname === "/home/employee" ? "active" : ""}
          onClick={() => navigate("/home/employee")}
        >
          User Management
        </li>
        <li
          className={location.pathname === "/home/orderhistory" ? "active" : ""}
          onClick={() => navigate("/home/orderhistory")}
        >
          Order History
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
