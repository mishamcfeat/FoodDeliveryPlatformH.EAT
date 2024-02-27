import React, { useContext, useEffect, useRef, useState } from 'react';
import './CartSidebar.scss';
import { BasketContext } from '../../context/BasketContext';

const CartSidebar = ({ isCartVisible, toggleCart }) => {
    const { basket, updateItemQuantity, removeItemFromBasket, getTotalCost, refetchBasketItems } = useContext(BasketContext);
    const [totalCost, setTotalCost] = useState(0);
    const sidebarRef = useRef();

    useEffect(() => {
        let isMounted = true;

        const fetchTotalCost = async () => {
            try {
                const cost = await getTotalCost();
                if (isMounted) {
                    setTotalCost(cost);
                }
            } catch (error) {
                console.error('Error fetching total cost:', error);
            }
        };

        fetchTotalCost();
        refetchBasketItems();

        return () => {
            isMounted = false;
        };
    }, [getTotalCost, basket, refetchBasketItems]);

    const handleQuantityChange = async (item, newQuantity) => {
        if (newQuantity === 0) {
            await removeItemFromBasket(item.order_id, item.id);
        } else if (newQuantity !== item.quantity) {
            await updateItemQuantity(item.order_id, item.id, newQuantity);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isCartVisible && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                toggleCart(); // Use toggleCart to close the sidebar
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [toggleCart, isCartVisible]);

    const renderedCartItems = basket.map((item) => {
        if (item.price && item.quantity && !isNaN(item.price) && !isNaN(item.quantity)) {
            return (
                <div key={item.id} className="cart-item">
                    <h3>{item.name}</h3>
                    <p>Price per item: £{item.price.toFixed(2)}</p>
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
                    <p>Total: £{(item.price * item.quantity).toFixed(2)}</p>
                </div>
            );
        }
    }).filter(Boolean); // filter out any undefined elements

    return (
        <aside ref={sidebarRef} className={`cart-sidebar ${isCartVisible ? 'visible' : ''}`}>
            <button className="close-btn" onClick={toggleCart}>X</button>
            <h2>Your Cart</h2>
            <div className="cart-items">
                {renderedCartItems.length > 0 ? renderedCartItems : <p>Your cart is empty.</p>}
            </div>
            <div className="cart-total">
                Total: £{totalCost.toFixed(2)}
            </div>
            <button className="checkout-button" onClick={toggleCart}>Go to checkout</button>
        </aside>
    );
};

export default CartSidebar;