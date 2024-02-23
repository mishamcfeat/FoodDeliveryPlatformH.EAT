import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

axios.defaults.baseURL = 'http://localhost:8000';

export const BasketContext = createContext();

export const BasketContextProvider = ({ children }) => {
  const [basket, setBasket] = useState([]);
  const { user } = useContext(AuthContext); // Access user from AuthContext

  useEffect(() => {
    // Function to fetch the basket items from the backend
    const fetchBasketItems = async () => {
      if (user) {
        try {
          const response = await axios.get(`/orders/items`, { headers: { "Authorization": `Bearer ${user.token}` } });
          setBasket(response.data); // Assuming the response data is in the format that your context expects
        } catch (error) {
          console.error('Error fetching basket items:', error);
        }
      }
    };

    fetchBasketItems();
  }, [user]);

  const addItemToBasket = async (item, quantity = 1) => {
    // Call the backend to add the item to the order
    if (user) {
      try {
        await axios.post(`/add_item_to_order/${item.order_id}/`, {
          ...item,
          quantity
        }, { headers: { "Authorization": `Bearer ${user.token}` } });

        // After successful backend call, update the basket state
        setBasket(prevBasket => {
          const existingItemIndex = prevBasket.findIndex(basketItem => basketItem.id === item.id);
          if (existingItemIndex > -1) {
            const newBasket = [...prevBasket];
            newBasket[existingItemIndex] = {
              ...newBasket[existingItemIndex],
              quantity: newBasket[existingItemIndex].quantity + quantity
            };
            return newBasket;
          } else {
            return [...prevBasket, { ...item, quantity }];
          }
        });
      } catch (error) {
        console.error('Error adding item to order:', error);
      }
    }
  };

  const removeItemFromBasket = async (itemId) => {
    // Call the backend to remove the item from the order
    if (user) {
      try {
        await axios.delete(`/remove_item_from_order/${itemId}/`, { headers: { "Authorization": `Bearer ${user.token}` } });

        // After successful backend call, update the basket state
        setBasket(prevBasket => prevBasket.filter(item => item.id !== itemId));
      } catch (error) {
        console.error('Error removing item from order:', error);
      }
    }
  };

  const getTotalCost = async () => {
    if (user) {
        try {
            const response = await axios.get(`/orders/total`, { headers: { "Authorization": `Bearer ${user.token}` } });
            return parseFloat(response.data.total_cost); // Make sure this is a number
        } catch (error) {
            console.error('Error fetching total cost:', error);
        }
    }
    return 0; // Return 0 by default if user is not logged in or in case of error
};

  return (
    <BasketContext.Provider value={{ basket, addItemToBasket, removeItemFromBasket, getTotalCost }}>
      {children}
    </BasketContext.Provider>
  );
};