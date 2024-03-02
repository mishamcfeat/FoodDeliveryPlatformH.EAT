import React, { useEffect, useRef, useState, useContext, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import logo from '../../assets/images/HEAT-logo.jpeg';
import shoppingCartIcon from '../../assets/images/basket.png';
import './HomePage.scss';

import { useAuth } from '../../context/AuthContext';
import CartSidebar from '../CartSidebar/CartSidebar';

axios.defaults.withCredentials = true;


const baseURL = 'http://localhost:8000';

const HomePage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isCartVisible, setCartVisible] = useState(false);
    const [restaurants, setRestaurants] = useState([]);
    const [username, setUsername] = useState('');

    const mainHeaderLinks = useRef(null);
    const searchBarInput = useRef(null);
    const appsCardRef = useRef(null);

    const fetchData = useCallback(async () => {
        if (user) {
            const userId = user.sub;
            try {
                const res = await axios.get(`${baseURL}/users/profile/id/${userId}/`);
                setUsername(res.data.user.username);
            } catch (err) {
                console.error("An error occurred:", err);
            }
        }

        try {
            const response = await axios.get(`${baseURL}/restaurants/list_restaurants/`);
            setRestaurants(response.data.restaurants);
        } catch (error) {
            console.error("Error fetching restaurants:", error);
        }
    }, [user]);

    const renderRestaurants = useMemo(() => {
        return restaurants.map(restaurant => {
            const sanitizedRestaurantName = restaurant.name.replace(/ /g, '');
            const imagePath = require(`../../assets/images/${sanitizedRestaurantName}/${restaurant.name}.jpg`);

            return (
                <Link to={`/restaurant/${restaurant.id}`} className="app-card" key={restaurant.id}>
                    <span>
                        <img className="app-card-image" src={imagePath} alt={restaurant.name} />
                    </span>
                    <div className='text-container'>
                        <div className="subtext">{restaurant.name}</div>
                        <div className="microtext">{restaurant.address}</div>
                    </div>      
                </Link>
            );
        });
    }, [restaurants]);

    const handleLogout = useCallback(async () => {
        try {
            const response = await axios.post(`${baseURL}/users/logout/`);
            if (response.data.message === 'Logged out') {
                localStorage.removeItem('token');
                navigate('/');
            }
        } catch (error) {
            console.error('An error occurred while logging out:', error);
        }
    }, [navigate]);

    // Scroll function for carousel
    const scroll = (direction) => {
        if (appsCardRef.current && appsCardRef.current.children[0]) {
            const cardWidth = appsCardRef.current.children[0].offsetWidth;
            const cardMargin = 20;
            const numberOfItemsToScroll = 1;
            const distance = (cardWidth + cardMargin) * numberOfItemsToScroll;

            const smoothScroll = (element, targetPosition, duration) => {
                let start = null;
                const startPosition = element.scrollLeft;

                const step = timestamp => {
                    if (!start) start = timestamp;
                    const progress = Math.min((timestamp - start) / duration, 1);
                    element.scrollLeft = startPosition + (targetPosition - startPosition) * progress;
                    if (progress < 1) {
                        window.requestAnimationFrame(step);
                    }
                };

                window.requestAnimationFrame(step);
            };

            smoothScroll(appsCardRef.current, appsCardRef.current.scrollLeft + distance * direction, 300);
        }
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const toggleCart = () => {
        setCartVisible(!isCartVisible);
    };

    return (
        <div className='home-page'>
            <div className="app">
                <div className="header">
                    <img className="header-logo" src={logo} alt="logo" />
                    <div className="search-bar">
                        <input ref={searchBarInput} type="text" placeholder="Search" />
                    </div>
                    <div className="buttons__both">
                        {
                            user ?
                                <>
                                    <button className="cart-button" onClick={toggleCart}>
                                        <img src={shoppingCartIcon} alt='Basket' className='shopping-cart-icon'/>
                                        <span>Cart</span>
                                    </button>
                                    <button className="user-name-button">{username}</button>
                                    <button className="logout-button" onClick={handleLogout}>Logout</button>
                                </> :
                                <Link to="/login-signup">
                                    <button className="buttons__login">LOG IN</button>
                                    <button className="buttons__signup">SIGN UP</button>
                                </Link>
                        }
                    </div>
                </div>
                <div className="wrapper">
                    <div className="left-side">
                        <div className="side-wrapper">
                            <div className="side-title">All Shops</div>
                            <div className="side-menu">
                                <a href="#">
                                    Sort
                                </a>
                            </div>
                        </div>
                        <div className="side-wrapper">
                            <div className="side-title">Price</div>
                            <div className="side-menu">
                                <a href="#">
                                    Budget-Friendly
                                </a>
                                <a href="#">
                                    Premium
                                </a>
                                <a href="#">
                                    Luxury
                                </a>
                                <a href="#">
                                    Gourmet
                                </a>
                            </div>
                        </div>
                        <div className="side-wrapper">
                            <div className="side-title">Max Delivery Fee</div>
                            <div className="side-menu">
                                <a href="#">
                                    Slider
                                </a>
                            </div>
                        </div>
                        <div className="side-wrapper">
                            <div className="side-title">Dietary</div>
                            <div className="side-menu">
                                <a href="#">
                                    Vegetarian, Vegan, Halal
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="main-container">
                        <div className="main-header">
                            <div className="header-menu" ref={mainHeaderLinks}>
                                <a className="main-header-link is-active" href="#">
                                    All
                                </a>
                                <a className="main-header-link" href="#">
                                    Chinese
                                </a>
                                <a className="main-header-link" href="#">
                                    Indian
                                </a>
                                <a className="main-header-link" href="#">
                                    East Asian
                                </a>
                                <a className="main-header-link" href="#">
                                    Wings
                                </a>
                                <a className="main-header-link" href="#">
                                    Pizza
                                </a>
                                <a className="main-header-link" href="#">
                                    Coffee & Tea
                                </a>
                                <a className="main-header-link" href="#">
                                    Desserts
                                </a>
                            </div>
                        </div>
                        <div className="content-wrapper">
                            <div className="content-section">
                                <div className="title-and-controls">
                                    <div className="content-section-title">Fastest Delivery</div>
                                    <div className="control-buttons">
                                        <button id="scrollLeft" className="scroll-button" onClick={() => scroll(-1)}>←</button>
                                        <button id="scrollRight" className="scroll-button" onClick={() => scroll(1)}>→</button>
                                    </div>
                                </div>
                                <div className="apps-card" ref={appsCardRef}>
                                    {renderRestaurants}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <CartSidebar
                    isCartVisible={isCartVisible}
                    toggleCart={toggleCart}
                />
            </div>
        </div>
    );
}

export default HomePage;