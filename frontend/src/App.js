import React, { useState } from 'react';
import './App.css';
import './index.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginSignup from './screens/LoginSignup/LoginSignup.jsx';
import HomePage from './screens/HomePage/HomePage.jsx';
import RestaurantPage from './screens/RestaurantPage/RestaurantPage.jsx';
import AddItem from './screens/AddItem/AddItem.jsx';
import { AuthContext } from './AuthContext';



function App() {

  const [user, setUser] = useState(null);

  const value = {
    user,
    setUser
  };

  return (
    <AuthContext.Provider value={value}>
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
    </AuthContext.Provider>
  );
}

export default App;