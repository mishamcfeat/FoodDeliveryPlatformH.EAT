import React, { useContext, useEffect, useRef } from 'react';
import './CartSidebar.scss';
import { BasketContext } from '../../context/BasketContext'; // Adjust the import path as necessary

const CartSidebar = ({ isCartVisible, setCartVisible, totalCost }) => {
  const { basket, addItemToBasket, removeItemFromBasket } = useContext(BasketContext);
  const sidebarRef = useRef();

  const handleQuantityChange = (item, newQuantity) => {
    const quantityDifference = newQuantity - (item.quantity ?? 1);
    if (quantityDifference > 0) {
      addItemToBasket(item, quantityDifference);
    } else if (quantityDifference < 0) {
      removeItemFromBasket(item.id, -quantityDifference);
    }
  };

  const handleRemoveItem = (itemId) => {
    removeItemFromBasket(itemId);
  };

  // Click outside to close sidebar
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

  return (
    <aside ref={sidebarRef} className={`cart-sidebar ${isCartVisible ? 'visible' : ''}`}>
      <button className="checkout-button" onClick={() => setCartVisible(false)}>Go to checkout</button>
      <button className="close-btn" onClick={() => setCartVisible(false)}>X</button>
      <h2>Your Cart</h2>
      <div className="cart-items">
        {basket.map((item) => {
          const itemPrice = item.price ?? 0;
          const itemQuantity = item.quantity ?? 1;
          const itemTotal = itemPrice * itemQuantity;
          return (
            <div key={item.id} className="cart-item">
              <h3>{item.name}</h3>
              <p>Price per item: £{itemPrice.toFixed(2)}</p>
              <div className="quantity-select-container">
                <select
                  value={itemQuantity}
                  onChange={(e) => handleQuantityChange(item, Number(e.target.value))}
                >
                  {[...Array(20)].map((_, index) => (
                    <option value={index + 1} key={index}>
                      {index + 1}
                    </option>
                  ))}
                </select>
              </div>
              <p>Total: £{itemTotal.toFixed(2)}</p>
              <button onClick={() => handleRemoveItem(item.id)}>Remove Item</button>
            </div>
          );
        })}
      </div>
      <div className="cart-total">
        Total: £{(totalCost ?? 0).toFixed(2)}
      </div>
      <button className="checkout-button" onClick={() => setCartVisible(false)}>Go to checkout</button>
    </aside>
  );
};

export default CartSidebar;