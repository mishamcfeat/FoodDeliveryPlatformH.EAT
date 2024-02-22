// src/context/BasketContext.js
import React, { createContext, useState, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const BasketContext = createContext();

export const BasketContextProvider = ({ children }) => {
  const [basket, setBasket] = useState([]);
  const { user } = useContext(AuthContext); // Access user from AuthContext

  const addItemToBasket = (item) => {
    setBasket(prevBasket => [...prevBasket, item]);
  };

  const removeItemFromBasket = (itemId) => {
    setBasket(prevBasket => prevBasket.filter(item => item.id !== itemId));
  };

  const getTotalCost = () => {
    return basket.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <BasketContext.Provider value={{ basket, addItemToBasket, removeItemFromBasket, getTotalCost }}>
      {children}
    </BasketContext.Provider>
  );
};