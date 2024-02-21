import React, { useState } from 'react';
import './App.css';
import './index.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginSignup from './screens/LoginSignup/LoginSignup.jsx';
import HomePage from './screens/HomePage/HomePage.jsx';
import RestaurantPage from './screens/RestaurantPage/RestaurantPage.jsx';
import AddItem from './screens/AddItem/AddItem.jsx';
import { AuthContext } from './AuthContext';
import { BasketProvider } from './screens/HomePage/BasketContext'; // Import BasketProvider

function App() {

  const [user, setUser] = useState(null);

  const value = {
    user,
    setUser
  };

  return (
    <AuthContext.Provider value={value}>
      <BasketProvider> {/* Wrap your components with BasketProvider */}
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
      </BasketProvider>
    </AuthContext.Provider>
  );
}

export default App;