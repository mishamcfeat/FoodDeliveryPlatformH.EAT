import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './AddItem.scss';
import logo from '../../assets/images/HEAT-logo.jpeg';  // adjust as necessary
import { useAuth } from '../../context/AuthContext';
import { BasketContext } from '../../context/BasketContext';


const AddItem = () => {

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

    const BASE_URL_RESTAURANTS = 'http://localhost:8000/restaurants';
    const { id: restaurantId } = useParams();
    const { itemid: itemId } = useParams();
    const [restaurant, setRestaurant] = useState({});
    const [menuItem, setMenuItem] = useState(null);

    useEffect(() => {
        // Fetch the restaurant details first
        axios.get(`${BASE_URL_RESTAURANTS}/${restaurantId}/`)
            .then(response => {
                setRestaurant(response.data.restaurant);
                // Then, fetch the menu items
                return axios.get(`${BASE_URL_RESTAURANTS}/${restaurantId}/menu/${itemId}/`);
            })
            .then(response => {
                setMenuItem(response.data.item);
            })
            .catch(error => {
                console.error("Error fetching restaurant details or items:", error);
            });
    }, [restaurantId]);

    const navigate = useNavigate();
    const handleBackClick = () => {
        navigate(-1);
    };

    const BASE_URL_ORDERS = 'http://localhost:8000/orders';
    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const token = localStorage.getItem("jwt_token");
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const initiateOrder = async (restaurantId, deliveryAddress) => {
        try {
            const response = await axios.post(`${BASE_URL_ORDERS}/initiate_order/`, {
                restaurant_id: restaurantId,
                delivery_address: deliveryAddress  // You can get this from the user's state or context
            });
            return response.data.order_id;
        } catch (error) {
            console.error("Error initiating order:", error);
            return null;
        }
    };

    const addItemToOrder = async (orderId, menuItem, price) => {
        try {
            await axios.post(`${BASE_URL_ORDERS}/add_item_to_order/${orderId}/`, {
                restaurant_item_id: menuItem.id,
                quantity: selectedQuantity,
                price_at_time_of_order: price
            });
            console.log("Item added successfully");
        } catch (error) {
            console.error("Error adding item to order:", error);
        }
    };

    const { addItemToBasket, removeItemFromBasket } = useContext(BasketContext);

    const handleAddToOrder = async () => {
        if (!restaurant.id) {
            console.error("Restaurant ID is undefined");
            return;
        }
        const orderId = await initiateOrder(restaurant.id);
        if (orderId) {
            await addItemToOrder(orderId, menuItem, menuItem.price);
            addItemToBasket(menuItem, selectedQuantity);  // add the item with quantity to the basket
        }
    };

    const renderMenuItem = () => {
        if (menuItem) {
            const sanitizedRestaurantName = restaurant.name ? restaurant.name.replace(/ /g, '') : '';
            const itemPath = require(`../../assets/images/${sanitizedRestaurantName}/menu-items/${menuItem.name}.jpg`);

            return (
                <div className="item-card" key={menuItem.id}>
                    <img className="item-card-image" src={itemPath} alt={restaurant.name} />
                    <div className="text-container">
                        <div className="subtext">{menuItem.name}</div>
                        <div className="microtext">Price: ${menuItem.price.toFixed(2)}</div>
                        <div className="description">{menuItem.description}</div>
                        <div className="quantity-select-container">
                            <label for="quantity"></label>
                            <select
                                id="quantity"
                                value={selectedQuantity}
                                onChange={(e) => setSelectedQuantity(Number(e.target.value))}
                            >
                                {[...Array(10)].map((_, index) => (
                                    <option value={index + 1} key={index + 1}>
                                        {index + 1}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button className="addbutton" onClick={handleAddToOrder}>
                            Add {selectedQuantity} to order - £{(selectedQuantity * menuItem.price).toFixed(2)}
                        </button>
                    </div>
                </div >
            );

        }
    };

    const { user } = useAuth();

    return (
        <div className='restaurant-page'>
            <div className='additem-page'>

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
                        <div className="add-item-container">
                            <div className="content-section-title">
                                <button className="back-button" onClick={handleBackClick}>
                                    &#8592; Back to {restaurant.name}
                                </button>
                            </div>
                            <div className="content-section">
                                <div className="items-card">
                                    {renderMenuItem()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div >
    );
}


export default AddItem;