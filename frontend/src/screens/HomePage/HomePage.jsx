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
                <Link to={`/restaurant/${restaurant.id}`} key={restaurant.id}>
                    <div className="app-card" key={restaurant.id}>
                        <span>
                            <img className="app-card-image" src={imagePath} alt={restaurant.name} />
                        </span>
                        <div className='text-container'>
                            <div className="app-card__subtext">{restaurant.name}</div>
                            <div className="app-card__microtext">{restaurant.address}</div>
                        </div>
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

    return (
        <div className='home-page'>


            <div className="app">
                <div className="header">
                    <img className="header-logo" src={logo} alt="" />
                    <div className="header-menu" ref={menuLinks}>
                    </div>
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
                                    <svg viewBox="0 0 488.455 488.455" fill="currentColor">
                                    </svg>
                                    £
                                </a>
                                <a href="#">
                                    <svg viewBox="0 0 512 512" fill="currentColor">
                                    </svg>
                                    ££
                                </a>
                                <a href="#">
                                    <svg viewBox="0 0 58 58" fill="currentColor">
                                    </svg>
                                    £££
                                </a>
                                <a href="#">
                                    <svg viewBox="0 0 512 512" fill="currentColor">
                                    </svg>
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
                                    Vegetarian, Vegan, Gluten-free, Halal
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="main-container">
                        <div className="main-header">

                            <div className="header-menu" ref={mainHeaderLinks}>
                                <a className="main-header-link is-active" href="#">
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
                                    Wings
                                </a>
                                <a className="main-header-link" href="#">
                                    Desserts
                                </a>
                                <a className="main-header-link" href="#">
                                    Alcohol
                                </a>
                            </div>
                        </div>
                        <div className="content-wrapper">
                            <div className="content-section">
                                <div className="content-section-title">Fastest Delivery</div>
                                <div className="apps-card">
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
