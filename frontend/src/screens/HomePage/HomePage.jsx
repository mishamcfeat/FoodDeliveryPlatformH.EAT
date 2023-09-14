import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.scss';
import logo_icon from '../../assets/images/HEAT-logo.jpeg';

const HomePage = () => {

    const menuLinks = useRef(null);
    const mainHeaderLinks = useRef(null);
    const searchBarInput = useRef(null);
    const closeButton = useRef(null);
    const toggleButton = useRef(null);

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
                    //where to put sidebar toggle
                    <div className="header-menu" ref={menuLinks}>
                        <a className="menu-link" href="#">
                            Logo
                        </a>
                        <a className="menu-link is-active" href="#">
                            Delivery
                        </a>
                        <a className="menu-link" href="#">
                            Collect
                        </a>
                        <a className="menu-link" href="#">
                            Address
                        </a>
                    </div>
                    <div className="search-bar">
                        <input ref={searchBarInput} type="text" placeholder="Search" />
                    </div>

                </div>
                <div className="wrapper">
                    <div className="left-side">
                        <div className="side-wrapper">
                            <div className="side-title">Apps</div>
                            <div className="side-menu">
                                <a href="#">
                                    <svg viewBox="0 0 512 512">
//Path variables for icons
                                    </svg>
                                    All Apps
                                </a>

                            </div>
                        </div>
                        <div className="side-wrapper">
                            <div className="side-title">Categories</div>
                            <div className="side-menu">
                                <a href="#">
                                    <svg viewBox="0 0 488.455 488.455" fill="currentColor">
                                    </svg>
                                    Photography
                                </a>
                                <a href="#">
                                    <svg viewBox="0 0 512 512" fill="currentColor">
                                    </svg>
                                    Graphic Design
                                </a>
                                <a href="#">
                                    <svg viewBox="0 0 58 58" fill="currentColor">
                                    </svg>
                                    Video
                                </a>
                                <a href="#">
                                    <svg viewBox="0 0 512 512" fill="currentColor">
                                    </svg>
                                    Illustrations
                                </a>
                                <a href="#">
                                    <svg viewBox="0 0 512 512" fill="currentColor">
                                    </svg>
                                    UI/UX
                                </a>
                                <a href="#">
                                    <svg viewBox="0 0 512 512" fill="currentColor">
                                    </svg>
                                    3D/AR
                                </a>
                            </div>
                        </div>
                        <div className="side-wrapper">
                            <div className="side-title">Fonts</div>
                            <div className="side-menu">
                                <a href="#">
                                    <svg viewBox="0 0 332 332" fill="currentColor">
                                    </svg>
                                    Manage Fonts
                                </a>
                            </div>
                        </div>
                        <div className="side-wrapper">
                            <div className="side-title">Resource Links</div>
                            <div className="side-menu">
                                <a href="#">
                                    <svg viewBox="0 0 512 512" fill="currentColor">
                                    </svg>
                                    Stock
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
                                    Pizza
                                </a>
                                <a className="main-header-link" href="#">
                                    Pizza
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
                                    Halal
                                </a>
                                <a className="main-header-link" href="#">
                                    Alcohol
                                </a>
                            </div>
                        </div>
                        <div className="content-wrapper">
                            <div className="content-wrapper-header">
                                <div className="content-wrapper-context">
                                    <h3 className="img-content">
                                        <svg viewBox="0 0 512 512">
                                        </svg>
                                        Adobe Stock
                                    </h3>
                                </div>
                                <img
                                    className="content-wrapper-img"
                                    src="https://assets.codepen.io/3364143/glass.png"
                                    alt=""
                                />
                            </div>
                            <div className="content-section">
                                <div className="content-section-title">Apps in your plan</div>
                                <div className="apps-card">
                                    <div className="app-card">
                                        <span>

                                            Premiere Pro
                                        </span>
                                        <div className="app-card__subtext">
                                            Edit, master and create fully proffesional videos
                                        </div>

                                    </div>
                                    <div className="app-card">

                                        <div className="app-card__subtext">
                                            Design and publish great projects &amp; mockups
                                        </div>

                                    </div>
                                    <div className="app-card">

                                        <div className="app-card__subtext">
                                            Industry Standart motion graphics &amp; visual effects
                                        </div>
                                    </div>
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
