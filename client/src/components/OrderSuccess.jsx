import React from "react";
import { useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="order-success">
      <h2>Order Placed Successfully!</h2>
      <button className="btn" onClick={() => navigate("/home/products")}>Continue Shopping</button>
    </div>
  );
};

export default OrderSuccess;
