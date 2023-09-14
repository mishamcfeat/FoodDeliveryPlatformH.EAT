import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LoginSignup from '../screens/LoginSignup/LoginSignup';
import Homepage from '../screens/HomePage/HomePage';

function App() {
    return (
        <Router>
            <nav>
                <Link to="/">
                    <img src={logo_icon} alt="Logo" />
                </Link>
                <Link to="/login-signup">Login / Signup</Link>
            </nav>
            <Routes>
                <Route path="/login-signup" element={<LoginSignup />} />
                <Route path="/" element={<Homepage />} />
            </Routes>
        </Router>
    );
}

export default App;
