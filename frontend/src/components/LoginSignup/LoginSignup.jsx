import React, { useState } from 'react';
import axios from 'axios';
import './LoginSignup.css';

import user_icon from '../Assets/person.png';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';
import logo from '../Assets/logo.jpeg';

const LoginSignup = () => {
    const [isLogin, setIsLogin] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const BASE_URL = 'http://localhost:8000/users';

    const handleSubmit = (event) => {
        event.preventDefault();

        if (isLogin && (!email || !password)) {
            console.error("Email and password fields are required for login!");
            return;
        } else if (!isLogin && (!username || !email || !password)) {
            console.error("All fields are required for sign up!");
            return;
        }

        const endpoint = isLogin ? '/login/' : '/register/';
        const data = isLogin ? { email, password } : { username, email, password };

        axios.post(`${BASE_URL}${endpoint}`, data)
            .then(res => {
                console.log(res);
                setUsername('');  // Clear the input fields after successful action
                setEmail('');
                setPassword('');
            })
            .catch(err => {
                console.error("An error occurred:", err);
            });
    };

    return (

        <div className='container'>
            <div className="navbar">
                <div className='logo'>
                    <img src={logo} alt="User" />
                </div>
                <button className={isLogin ? "submit gray" : "submit"} onClick={() => setIsLogin(false)}>Sign Up</button>
                <button className={isLogin ? "submit" : "submit gray"} onClick={() => setIsLogin(true)}>Login</button>
            </div>
            <div className='header'>
                <div className="text">{isLogin ? "Login" : "Sign Up"}</div>
                <div className='underline'></div>
            </div>
            <form onSubmit={handleSubmit} className='inputs'>
                {!isLogin && (
                    <div className='input'>
                        <img src={user_icon} alt="User" />
                        <input type="text" placeholder='Name' value={username} onChange={e => setUsername(e.target.value)} />
                    </div>
                )}
                <div className='input'>
                    <img src={email_icon} alt="Email" />
                    <input type="email" placeholder='Email' value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className='input'>
                    <img src={password_icon} alt="Password" />
                    <input type="password" placeholder='Password' value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <div className='Continue'>
                    <button type="submit-continue" className="submit-continue">Continue</button>
                </div>
            </form>
        </div>
    );
}

export default LoginSignup;
