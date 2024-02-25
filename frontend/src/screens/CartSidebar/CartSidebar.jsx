// CartSidebar.jsx
import React, { useContext, useEffect, useRef } from 'react';
import './CartSidebar.scss';
import { BasketContext } from '../../context/BasketContext'; // Adjust the import path as necessary

const CartSidebar = ({ isCartVisible, setCartVisible, totalCost }) => {
  const { basket, updateItemQuantity, removeItemFromBasket } = useContext(BasketContext);
  const sidebarRef = useRef();

  const handleQuantityChange = async (item, newQuantity) => {
    if (newQuantity === 0) {
      // If the new quantity is 0, remove the item from the cart
      await removeItemFromBasket(item.order_id, item.id);
    } else if (newQuantity !== item.quantity) {
      // If the new quantity is dAifferent from the current quantity, update it
      await updateItemQuantity(item.order_id, item.id, newQuantity);
    }
  };


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setCartVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setCartVisible]);

  const renderedCartItems = basket.map((item) => (
    <div key={item.id} className="cart-item">
      <h3>{item.name}</h3>
      <p>Price per item: £{item.price ? item.price.toFixed(2) : '0.00'}</p>
      <div className="quantity-select-container">
        <select
          value={item.quantity}
          onChange={(e) => handleQuantityChange(item, Number(e.target.value))}
        >
          <option value={0}>0 (Remove)</option>
          {[...Array(10)].map((_, index) => (
            <option value={index + 1} key={index}>
              {index + 1}
            </option>
          ))}
        </select>
      </div>
      <p>Total: £{(item.price && item.quantity) ? (item.price * item.quantity).toFixed(2) : '0.00'}</p>
    </div>
  ));

  return (
    <aside ref={sidebarRef} className={`cart-sidebar ${isCartVisible ? 'visible' : ''}`}>
      <button className="close-btn" onClick={() => setCartVisible(false)}>X</button>
      <h2>Your Cart</h2>
      <div className="cart-items">
        {renderedCartItems.length > 0 ? renderedCartItems : <p>Your cart is empty.</p>}
      </div>
      <div className="cart-total">
        Total: £{totalCost ? totalCost.toFixed(2) : '0.00'}
      </div>
      <button className="checkout-button" onClick={() => setCartVisible(false)}>Go to checkout</button>
    </aside>
  );
};

export default CartSidebar;