import React from 'react';
import './App.css';
import './index.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginSignup from './screens/LoginSignup/LoginSignup.jsx';
import HomePage from './screens/HomePage/HomePage';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login-signup" element={<LoginSignup />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;