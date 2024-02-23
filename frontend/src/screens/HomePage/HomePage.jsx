import React, { useEffect, useRef, useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './HomePage.scss';
import logo from '../../assets/images/HEAT-logo.jpeg';
import { useAuth } from '../../context/AuthContext';
import { BasketContext } from '../../context/BasketContext'
import shoppingCartIcon from '../../assets/images/basket.png';


axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:8000';

const HomePage = () => {

    const { user, loading } = useAuth();
    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {
        axios.get(`/restaurants/list_restaurants/`)
            .then(response => {
                setRestaurants(response.data.restaurants);
                console.log(response.data.restaurants);
            })
            .catch(error => {
                console.error("Error fetching restaurants:", error);
            });
    }, []);

    const renderRestaurants = () => {
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

        return () => {
            handlers.forEach(({ element, type, handler }) => {
                element.removeEventListener(type, handler);
            });
        };
    }, []);

    const navigate = useNavigate();
    const [basketChange, setBasketChange] = useState(Date.now());
    const [totalCost, setTotalCost] = useState(0);
    const { getTotalCost } = useContext(BasketContext);

    useEffect(() => {
        const updateTotalCost = async () => {
          const cost = await getTotalCost(); // This now correctly waits for the async function
          setTotalCost(cost);
        };
    
        updateTotalCost();
      }, [getTotalCost, basketChange]); // Re-run when getTotalCost changes

      const modifyBasket = async (item) => {
        // Your add/remove item logic here
        await addItem(item);
        setBasketChange(Date.now()); // Trigger useEffect to re-run
    };
    
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
            const cardWidth = appsCardRef.current.children[0].offsetWidth;
            const cardMargin = 20;
            const numberOfItemsToScroll = 1;
            const distance = (cardWidth + cardMargin) * numberOfItemsToScroll;

            smoothScroll(appsCardRef.current, appsCardRef.current.scrollLeft + distance * direction, 300);
        }
    };

    return (
        <div className='home-page'>
            <div className="app">
                <div className="header">
                    <img className="header-logo" src={logo} />
                    <div className="search-bar">
                        <input ref={searchBarInput} type="text" placeholder="Search" />
                    </div>
                    <div className="buttons__both">
                    {
                        user ?
                            <>
                                <button className="cart-button" onClick={() => navigate('/basket')}>
                                    <img src={shoppingCartIcon} alt='Basket' className='shopping-cart-icon'/>
                                    £{totalCost.toFixed(2)}
                                </button>
                                <button className="user-name-button">{user.username}</button>
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