import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const BasketContext = createContext();

export const BasketContextProvider = ({ children }) => {
  const [basket, setBasket] = useState([]);
  const { user } = useContext(AuthContext);
  const [triggerFetch, setTriggerFetch] = useState(0); // Initialize as 0
  const baseURL = 'http://localhost:8000'; 

  // Function to trigger a re-fetch of basket items
  const refetchBasketItems = (newItem, quantityChanged) => {
    if (!newItem && !quantityChanged) {
      return;
    }

    setTriggerFetch(prev => prev + 1); // Increment by 1
  };

  // Fetch basket items when the user changes or triggerFetch changes
  useEffect(() => {
    const fetchBasketItems = async () => {
      if (user) {
        try {
          const response = await axios.get(`${baseURL}/orders/items`, {
            headers: { "Authorization": `Bearer ${user.token}` }
          });
          setBasket(response.data);
        } catch (error) {
          console.error('Error fetching basket items:', error);
        }
      }
    };

    fetchBasketItems();
  }, [user, triggerFetch]);

  const addItemToBasket = async (item, quantity = 1) => {
    if (user) {
      const existingItem = basket.find(basketItem => basketItem.restaurant_item_id === item.id);
      if (!existingItem) {
        // Item does not exist, add it
        try {
          await axios.post(`${baseURL}/orders/add_item_to_order/${item.order_id}/`, {
            restaurant_item_id: item.id,
            quantity,
            price_at_time_of_order: item.price
          }, { headers: { "Authorization": `Bearer ${user.token}` } });
          setBasket(prevBasket => [...prevBasket, { ...item, quantity }]);
          refetchBasketItems();
        } catch (error) {
          console.error('Error adding item to order:', error);
        }
      } else if (existingItem && existingItem.quantity !== quantity) {
        // Item exists and quantity has changed, update it
        updateItemQuantity(item.order_id, item.id, quantity);
      }
    }
  };

  const updateItemQuantity = async (orderId, itemId, newQuantity) => {
    if (user) {
      if (newQuantity > 0) {
        // Update the quantity if it's greater than zero
        try {
          await axios.put(`${baseURL}/orders/update_item_quantity/${orderId}/${itemId}/`, {
            new_quantity: newQuantity
          }, { headers: { "Authorization": `Bearer ${user.token}` } });
          setBasket(prevBasket => prevBasket.map(item => 
            item.id === itemId ? { ...item, quantity: newQuantity } : item
          ));
          refetchBasketItems();
        } catch (error) {
          console.error('Error updating item quantity:', error);
        }
      } else {
        // Quantity is zero or less, remove the item
        removeItemFromBasket(orderId, itemId);
      }
    }
  };

  const removeItemFromBasket = async (orderId, itemId) => {
    if (user && basket.some(item => item.id === itemId)) {
      try {
        await axios.delete(`${baseURL}/orders/remove_item_from_order/${orderId}/${itemId}/`, {
          headers: { "Authorization": `Bearer ${user.token}` }
        });
        setBasket(prevBasket => prevBasket.filter(item => item.id !== itemId));
        refetchBasketItems();
      } catch (error) {
        console.error('Error removing item from order:', error);
      }
    }
  };

  const getTotalCost = async () => {
    if (user) {
        try {
            // Adjusted URL to match your new routes
            const response = await axios.get(`${baseURL}/orders/total`, { 
              headers: { "Authorization": `Bearer ${user.token}` }
            });
            return parseFloat(response.data.total_cost);
        } catch (error) {
            console.error('Error fetching total cost:', error);
            return 0;
        }
    }
    return 0;
  };

  return (
    <BasketContext.Provider value={{
      basket,
      addItemToBasket,
      updateItemQuantity,
      removeItemFromBasket,
      getTotalCost,
      refetchBasketItems // Make sure to include this
    }}>
      {children}
    </BasketContext.Provider>
  );
};