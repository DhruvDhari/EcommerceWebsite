import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  incrementCartCount,
  decrementCartCount,
} from "../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [itemsToShow, setItemsToShow] = useState(10); // Initially show 10 items
  const [totalPrice, setTotalPrice] = useState(0); // Total Price of items in the cart

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);
  const userId = user?.userId;
  // Fetch cart items when the component mounts
  useEffect(() => {
    const fetchCart = async () => {
      if (!userId) return;
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/cart/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCartItems(data.items);
        setTotalPrice(data.totalPrice); // Fetch the total price from the backend
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchCart();
  }, [userId]);

  // Handle scroll to load more items
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight
      ) {
        setItemsToShow((prev) => prev + 10); // Load 10 more items on scroll
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Handle quantity change
  const updateQuantity = async (productId, action) => {
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/cart/update/${userId}`,
        {
          productId,
          action, // action could be 'increment' or 'decrement'
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setCartItems(data.items);
      setTotalPrice(data.totalPrice);
      if (action === "increment") {
        dispatch(incrementCartCount());
      } else if (action === "decrement") {
        dispatch(decrementCartCount());
      }
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const handleIncrement = (productId) => {
    updateQuantity(productId, "increment");
  };

  const handleDecrement = (productId) => {
    updateQuantity(productId, "decrement");
  };

  const formatPrice = (price) => {
    return price.toLocaleString("en-IN");
  };

  return (
    <div className="cart">
      <h3 style={{fontWeight:'bold'}}>Shopping Cart</h3>
      {cartItems.length === 0 ? (
        <h3>Your cart is empty</h3>
      ) : (
        <>
        <ul>
          {cartItems.slice(0, itemsToShow).map(
            (item) =>
              item.productId && (
                <li
                  key={item.productId._id || item.productId}
                  className="cart-item"
                >
                  <img
                    src={`${process.env.REACT_APP_BACKEND_URL}${item.image}`}
                    alt={item.name}
                    className="cart-item-img"
                    />
                  <div className="cart-item-details">
                    <div className="cartleft">
                      <div className="cart-item-name">{item.name}</div>
                      <div className="flex-q">
                        <button
                          onClick={() =>
                            handleDecrement(
                              item.productId._id || item.productId
                            )
                          }
                        >
                          -
                        </button>
                        <button className="quantity">{item.quantity}</button>
                        <button
                          onClick={() =>
                            handleIncrement(
                              item.productId._id || item.productId
                            )
                          }
                          >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="cart-item-price">
                      ₹{formatPrice(item.price)}
                    </div>
                  </div>
                </li>
              )
            )}
        </ul>
        <div className="cart-total">
        <div>Total</div>
        <div> ₹{formatPrice(totalPrice)}</div>
      </div>
      <button onClick={() => navigate("/home/checkout")} className="btn">
        Proceed to Checkout
      </button>
            </>
      )}
 
    </div>
  );
};

export default Cart;
