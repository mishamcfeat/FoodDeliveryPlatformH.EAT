import React, { useState } from 'react';
import './App.css';
import './index.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginSignup from './screens/LoginSignup/LoginSignup.jsx';
import HomePage from './screens/HomePage/HomePage.jsx';
import RestaurantPage from './screens/RestaurantPage/RestaurantPage.jsx';
import AddItem from './screens/AddItem/AddItem.jsx';
import { AuthContextProvider } from './context/AuthContext.jsx';
import { BasketContextProvider } from './context/BasketContext.jsx'; 

function App() {

  const [user, setUser] = useState(null);

  const value = {
    user,
    setUser
  };

  return (
    <AuthContextProvider value={value}>
      <BasketContextProvider> 
        <Router>
          <div>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login-signup" element={<LoginSignup />} />
              <Route path="/restaurant/:id" element={<RestaurantPage />} />
              <Route path="/restaurant/:id/menu/:itemid" element={<AddItem />} />
            </Routes>
          </div>
        </Router>
      </BasketContextProvider>
    </AuthContextProvider>
  );
}

export default App;