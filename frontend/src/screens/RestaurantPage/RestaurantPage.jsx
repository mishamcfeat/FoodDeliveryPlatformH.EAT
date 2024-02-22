import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './RestaurantPage.scss';
import logo from '../../assets/images/HEAT-logo.jpeg';  // adjust as necessary
import { useAuth } from '../../context/AuthContext';


const RestaurantPage = () => {

    const searchBarInput = useRef(null);

    useEffect(() => {

        const handlers = [];


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



    const { id: restaurantId } = useParams();
    const [restaurant, setRestaurant] = useState({});
    const [menu, setMenuItems] = useState([]);

    useEffect(() => {
        // Fetch the restaurant details first
        axios.get(`http://localhost:8000/restaurants/${restaurantId}/`)
            .then(response => {
                setRestaurant(response.data.restaurant);
                // Then, fetch the menu items
                return axios.get(`http://localhost:8000/restaurants/${restaurantId}/menu/`);
            })
            .then(response => {
                setMenuItems(response.data.menu);
            })
            .catch(error => {
                console.error("Error fetching restaurant details or items:", error);
            });
    }, [restaurantId]);

    const sanitizedRestaurantName = restaurant && restaurant.name ? restaurant.name.replace(/ /g, '') : '';
    const imagePath = sanitizedRestaurantName ? require(`../../assets/images/${sanitizedRestaurantName}/${restaurant.name}.jpg`) : null;

    const renderMenuItems = () => {

        return menu.map(item => {
            const itemPath = require(`../../assets/images/${sanitizedRestaurantName}/menu-items/${item.name}.jpg`)

            return (
                <Link to={`/restaurant/${restaurant.id}/menu/${item.id}`} className="menu-card" key={item.id}>
                    <span>
                        <img className="app-card-image" src={itemPath} alt={restaurant.name} />
                    </span>
                    <div className="text-container">
                        <div className="subtext">{item.name}</div>
                        <div className="microtext">Price: ${item.price.toFixed(2)}</div>
                    </div>
                </Link>
            );

        });
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
            const cardMargin = 20; // Your margin-right of 20px for .app-card
            const numberOfItemsToScroll = 1;  // Adjust this number as needed
            const distance = (cardWidth + cardMargin) * numberOfItemsToScroll;

            // Call the smoothScroll function
            smoothScroll(appsCardRef.current, appsCardRef.current.scrollLeft + distance * direction, 300); // 300ms duration
        }
    };

    const { user } = useAuth();

    return (
        <div className='restaurant-page'>

            <div className="app">
                <div className="header">
                    <Link to="/">
                        <img className="header-logo" src={logo} alt="" />
                    </Link>
                    <div className="search-bar">
                        <input ref={searchBarInput} type="text" placeholder="Search" />
                    </div>
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
                            <div className="header-menu">
                                {imagePath && <img className="restaurant-image" src={imagePath} alt="Restaurant Main Image" />}
                            </div>
                        </div>
                        <div className="content-wrapper">
                            <div className="content-section">
                                <div className="title-and-controls">
                                    <div className="content-section-title">{restaurant.name}</div>
                                    <div className="control-buttons">
                                        <button id="scrollLeft" className="scroll-button" onClick={() => scroll(-1)}>←</button>
                                        <button id="scrollRight" className="scroll-button" onClick={() => scroll(1)}>→</button>
                                    </div>
                                </div>
                                <div className="apps-card" ref={appsCardRef}>
                                    {renderMenuItems()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div >
    );
}


export default RestaurantPage;