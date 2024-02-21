import React, { createContext, useState } from 'react';

export const BasketContext = createContext();

export const BasketProvider = ({ children }) => {
  const [basket, setBasket] = useState([]);

  return (
    <BasketContext.Provider value={{ basket, setBasket }}>
      {children}
    </BasketContext.Provider>
  );
};