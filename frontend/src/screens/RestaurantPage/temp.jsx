import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './HomePage.scss';
import logo from '../../assets/images/HEAT-logo.jpeg';


const HomePage = () => {

    const [restaurants, setRestaurants] = useState([]);


    useEffect(() => {

        // Fetch the restaurants data from your FastAPI backend
        axios.get('http://localhost:8000/restaurants/list_restaurants/')
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
            const imagePath = require(`../../assets/images/${restaurant.name}.jpg`);

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

    const menuLinks = useRef(null);
    const mainHeaderLinks = useRef(null);
    const searchBarInput = useRef(null);

    useEffect(() => {

        const menuLinkNodes = menuLinks.current.querySelectorAll('.menu-link');
        const mainHeaderLinkNodes = mainHeaderLinks.current.querySelectorAll('.main-header-link');
        const handlers = [];

        menuLinkNodes.forEach((link) => {
            const handler = function () {
                menuLinkNodes.forEach(lnk => lnk.classList.remove('is-active'));
                this.classList.add('is-active');
            };
            link.addEventListener('click', handler);
            handlers.push({ element: link, type: 'click', handler });
        });

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

    return (
        <div className='restaurant-page'>

            <div className="app">
                <div className="header">
                    <img className="header-logo" src={logo} alt="" />
                    <div className="search-bar">
                        <input ref={searchBarInput} type="text" placeholder="Search" />
                    </div>
                    <div className='buttons__both'>
                        <Link to="/login-signup">
                            <button className="buttons__login" >LOG IN</button>
                            <button className="buttons__signup" >SIGN UP</button>
                        </Link>
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
                            <h1>{restaurant.name}</h1>
                            <div className="header-menu" ref={mainHeaderLinks}>
                                {imagePath && <img className="restaurant-image" src={imagePath} alt="Restaurant Main Image" />}
                            </div>
                        </div>
                        <div className="content-wrapper">
                            <div className="content-section">
                                <div className="title-and-controls">
                                    <div className="content-section-title">Menu Items</div>
                                    <div className="control-buttons">
                                        <button id="scrollLeft" className="scroll-button" onClick={() => scroll(-1)}>←</button>
                                        <button id="scrollRight" className="scroll-button" onClick={() => scroll(1)}>→</button>
                                    </div>
                                </div>
                                <div className="menu-items-container">
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

export default HomePage;

