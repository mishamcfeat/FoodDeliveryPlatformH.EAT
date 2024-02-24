import React, { useEffect, useRef, useState, useContext, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './HomePage.scss';
import logo from '../../assets/images/HEAT-logo.jpeg';
import { useAuth } from '../../context/AuthContext';
import { BasketContext } from '../../context/BasketContext'
import shoppingCartIcon from '../../assets/images/basket.png';
import CartSidebar from '../CartSidebar/CartSidebar'; // Adjust the path as necessary


axios.defaults.withCredentials = true;

const baseURL = 'http://localhost:8000';

const HomePage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { basket, getTotalCost } = useContext(BasketContext);

    const [restaurants, setRestaurants] = useState([]);
    const [username, setUsername] = useState('');
    const [isCartVisible, setCartVisible] = useState(false); // State to control CartSidebar visibility
    const [totalCost, setTotalCost] = useState(0);

    const mainHeaderLinks = useRef(null);
    const searchBarInput = useRef(null);
    const appsCardRef = useRef(null);

    const fetchData = useCallback(async () => {
        if (user) {
            const userId = user.sub;
            try {
                const res = await axios.get(`${baseURL}/users/profile/id/${userId}`);
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
            }
        } catch (error) {
            console.error('An error occurred while logging out:', error);
        }
    }, []);

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

    
    useEffect(() => {
        const sidebar = document.querySelector('.cart-sidebar');
        if (isCartVisible) {
            sidebar.classList.add('visible');
        } else {
            sidebar.classList.remove('visible');
        }
        }, [isCartVisible]);



    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        const updateTotalCost = async () => {
          const cost = await getTotalCost(); // This now correctly waits for the async function
          setTotalCost(cost);
        };
    
        updateTotalCost();
      }, [getTotalCost]); // Re-run when getTotalCost changes

      useEffect(() => {
        let isMounted = true; // flag to check if the component is mounted
        const fetchTotalCost = async () => {
            try {
                const cost = await getTotalCost(); // wait for the promise to resolve
                if (isMounted) {
                    setTotalCost(cost); // then set the total cost
                }
            } catch (error) {
                console.error('Error fetching total cost:', error);
            }
        };

        fetchTotalCost();

        // Cleanup function to set isMounted to false when the component unmounts
        return () => {
            isMounted = false;
        };
    }, [getTotalCost]);

    // Handlers for CartSidebar

      // Use setCartVisible to handle the closing of the cart sidebar
    const toggleCart = () => {
        setCartVisible(!isCartVisible);
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
                    <CartSidebar
                        isCartVisible={isCartVisible}
                        setCartVisible={setCartVisible} // Pass setCartVisible to handle closing the sidebar
                        totalCost={totalCost} // Make sure totalCost state is defined and passed here
                    />
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
            </div>
        </div>
    );
}

export default HomePage;