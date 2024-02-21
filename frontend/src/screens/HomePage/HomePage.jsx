import React, { useEffect, useRef, useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './HomePage.scss';
import logo from '../../assets/images/HEAT-logo.jpeg';
import { useAuth } from '../../AuthContext';
import { BasketContext } from './BasketContext'


axios.defaults.withCredentials = true;


const HomePage = () => {

    const BASE_URL = 'http://localhost:8000';
    const [restaurants, setRestaurants] = useState([]);


    useEffect(() => {

        // Fetch the restaurants data from your FastAPI backend
        axios.get(`${BASE_URL}/restaurants/list_restaurants/`)
            .then(response => {
                setRestaurants(response.data.restaurants);
                console.log(response.data.restaurants);
            })
            .catch(error => {
                console.error("Error fetching restaurants:", error);
            });
    }, []);

    // Render the restaurants:
    const renderRestaurants = () => {
        return restaurants.map(restaurant => {
            const sanitizedRestaurantName = restaurant.name.replace(/ /g, ''); // Replace spaces with an empty string
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
    };

    const mainHeaderLinks = useRef(null);
    const searchBarInput = useRef(null);

    useEffect(() => {

        const mainHeaderLinkNodes = mainHeaderLinks.current.querySelectorAll('.main-header-link');
        const handlers = [];

        mainHeaderLinkNodes.forEach((link) => {
            const handler = function () {
                mainHeaderLinkNodes.forEach(lnk => lnk.classList.remove('is-active'));
                this.classList.add('is-active');
            };
            link.addEventListener('click', handler);
            handlers.push({ element: link, type: 'click', handler });
        });

        searchBarInput.current.addEventListener('focus', () => {
            document.querySelector('.header').classList.add('wide');
        });

        searchBarInput.current.addEventListener('blur', () => {
            document.querySelector('.header').classList.remove('wide');
        });

        // Clean up event listeners on component unmount
        return () => {
            handlers.forEach(({ element, type, handler }) => {
                element.removeEventListener(type, handler);
            });
        };
    }, []);

    const navigate = useNavigate();
    const { basket } = useContext(BasketContext);

    const getTotalItems = () => basket.reduce((total, item) => total + item.quantity, 0);
    const getTotalCost = () => basket.reduce((total, item) => total + item.price * item.quantity, 0);

    const appsCardRef = useRef(null);

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

    const scroll = (direction) => {
        if (appsCardRef.current && appsCardRef.current.children[0]) {
            const cardWidth = appsCardRef.current.children[0].offsetWidth; // uses the width of the card
            const cardMargin = 20; // + margin-right of 20px for .app-card
            const numberOfItemsToScroll = 1;  // scrolls one item at a time
            const distance = (cardWidth + cardMargin) * numberOfItemsToScroll; // calculates the scrolling distance

            // Call the smoothScroll function
            smoothScroll(appsCardRef.current, appsCardRef.current.scrollLeft + distance * direction, 300); // 300ms duration of scrolling
        }
    };

    const { user } = useAuth();

    return (
        <div className='home-page'>

            <div className="app">
                <div className="header">
                    <img className="header-logo" src={logo} />
                    <div className="search-bar">
                        <input ref={searchBarInput} type="text" placeholder="Search" />
                    </div>
                    <button onClick={() => navigate('/basket')}>
                        Basket ({getTotalItems()} items) - £{getTotalCost().toFixed(2)}
                    </button>
                    <div className="buttons__both">
                        {
                            user ?
                                <button className="user-name-button">{user.username}</button> :
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
                                    £
                                </a>
                                <a href="#">
                                    ££
                                </a>
                                <a href="#">
                                    £££
                                </a>
                                <a href="#">
                                    ££££
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
                                    {renderRestaurants()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default HomePage;
