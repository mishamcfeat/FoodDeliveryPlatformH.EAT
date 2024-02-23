import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './LoginSignup.scss';
import { Helmet } from 'react-helmet';
import { AuthContext } from '../../context/AuthContext';
import { jwtDecode } from 'jwt-decode';

import facebook from '../../assets/images/facebook.jpeg';
import linkedin from '../../assets/images/linkedin.jpeg';
import twitter from '../../assets/images/twitter.jpeg';
import logo from '../../assets/images/HEAT-logo.jpeg';

const LoginSignup = () => {

    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const BASE_URL_USERS = 'http://localhost:8000/users';

    const { setUser, setToken } = useContext(AuthContext);


    const handleSubmit = (event) => {
        event.preventDefault();
    
        if (isLogin && (!email || !password)) {
            console.error("Email and password fields are required for login!");
            return;
        } else if (!isLogin && (!username || !email || !password)) {
            console.error("All fields are required for sign up!");
            return;
        }
    
        const endpoint = isLogin ? 'login/' : 'register/';
        const data = isLogin ? { email, password } : { username, email, password };
    
        axios.post(`${BASE_URL_USERS}/${endpoint}`, data)
            .then(res => {
                console.log(res);
    
                // Store the token in the context
                setToken(res.data.token);
    
                // Decode the token to get the user's details
                const user = jwtDecode(res.data.token);
                setUser(user);
    
                // Clear the input fields
                setUsername('');
                setEmail('');
                setPassword('');
    
                // Navigate back to the homepage
                navigate('/');
            })
            .catch(err => {
                console.error("An error occurred:", err);
            });
    };

    const switchCtn = useRef(null);
    const switchC1 = useRef(null);
    const switchC2 = useRef(null);
    const aContainer = useRef(null);
    const bContainer = useRef(null);
    const allButtons = useRef([]);
    const switchBtn = useRef([]);

    const changeForm = (e) => {
        if (!switchCtn.current || !aContainer.current || !bContainer.current || !switchC1.current || !switchC2.current) {
            console.error("One or more refs are not initialized.");
            return;
        }

        switchCtn.current.classList.add("is-gx");
        setTimeout(() => {
            switchCtn.current.classList.remove("is-gx");
        }, 1500);

        switchCtn.current.classList.toggle("is-txr");
        switchCtn.current.firstChild.classList.toggle("is-txr");
        switchCtn.current.lastChild.classList.toggle("is-txr");

        switchC1.current.classList.toggle("is-hidden");
        switchC2.current.classList.toggle("is-hidden");
        aContainer.current.classList.toggle("is-txl");
        bContainer.current.classList.toggle("is-txl");
        bContainer.current.classList.toggle("is-z200");

        setIsLogin(prevIsLogin => !prevIsLogin);
    };

    useEffect(() => {
        const allButtonsCurrent = allButtons.current;
        const switchBtnCurrent = switchBtn.current;

        const getButtons = (e) => e.preventDefault();


        if (allButtonsCurrent) {
            allButtonsCurrent.forEach(button => {
                button.addEventListener("click", getButtons);
            });
        }

        if (switchBtnCurrent) {
            switchBtnCurrent.forEach(button => {
                button.addEventListener("click", changeForm);
            });
        }

        return () => {
            if (allButtonsCurrent) {
                allButtonsCurrent.forEach(button => {
                    button.removeEventListener("click", getButtons);
                });
            }

            if (switchBtnCurrent) {
                switchBtnCurrent.forEach(button => {
                    button.removeEventListener("click", changeForm);
                });
            }
        };
    }, []);


    return (
        <div className='login-signup'>
            <Helmet>
                <html lang="es" dir="ltr" />
                <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0" />
                <meta charSet="utf-8" />
                <link rel="stylesheet" type="text/css" href="main.css" />
                <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;800&display=swap" rel="stylesheet" />
            </Helmet>

            <div className="main">
                <div className="container a-container" id="a-container" ref={aContainer}>
                    <form className="form" id="a-form">
                        <h2 className="form_title title">Create Account</h2>
                        <div className="form__icons">
                            <img className="form__icon" src={facebook} alt="" />
                            <img className="form__icon" src={linkedin} alt="" />
                            <img className="form__icon" src={twitter} alt="" />
                        </div>
                        <span className="form__span">or use email for registration</span>
                        <input className="form__input" type="text" placeholder="Name" value={username} onChange={e => setUsername(e.target.value)} />
                        <input className="form__input" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                        <input className="form__input" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                        <button className="form__button button submit" onClick={handleSubmit} >SIGN UP</button>
                    </form>
                </div>

                <div className="container b-container" id="b-container" ref={bContainer}>
                    <form className="form" id="b-form">
                        <h2 className="form_title title">Sign in to Website</h2>
                        <div className="form__icons">
                            <img className="form__icon" src={facebook} alt="" />
                            <img className="form__icon" src={linkedin} alt="" />
                            <img className="form__icon" src={twitter} alt="" />
                        </div>
                        <span className="form__span">or use your email account</span>
                        <input className="form__input" type="text" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                        <input className="form__input" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                        <a className="form__link">Forgot your password?</a>
                        <button className="form__button button submit" onClick={handleSubmit} >LOG IN</button>
                    </form>
                </div>

                <div className="switch" id="switch-cnt" ref={switchCtn}>
                    <div className="switch__circle"></div>
                    <div className="switch__circle switch__circle--t"></div>
                    <div className="switch__container" id="switch-c1" ref={switchC1}>
                        <Link to="/">
                            <img className="switch__logo" src={logo} alt="" />
                        </Link>
                        <h2 className="switch__title title">Sign up Now!</h2>
                        <p className="switch__description description">Please enter your personal details to order your food at the touch of a button</p>
                        <button className="switch__button button switch-btn" onClick={changeForm}>LOG IN</button>
                    </div>
                    <div className="switch__container is-hidden" id="switch-c2" ref={switchC2}>
                        <Link to="/">
                            <img className="switch__logo" src={logo} alt="" />
                        </Link>
                        <h2 className="switch__title title"> Welcome back</h2>
                        <p className="switch__description description">Craving Food? Enter your personal details and find the best restaurants that deliver</p>
                        <button className="switch__button button switch-btn" onClick={changeForm}>SIGN UP</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginSignup;

