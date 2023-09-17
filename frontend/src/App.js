import React from 'react';
import './App.css';
import './index.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginSignup from './screens/LoginSignup/LoginSignup.jsx';
import HomePage from './screens/HomePage/HomePage.jsx';
import RestaurantPage from './screens/RestaurantPage/RestaurantPage.jsx';


function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login-signup" element={<LoginSignup />} />
          <Route path="/restaurant/:id" element={<RestaurantPage/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;