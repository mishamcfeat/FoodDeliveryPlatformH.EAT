import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import './RestaurantPage.scss';
import { Helmet } from 'react-helmet';

const RestaurantPage = (props) => {
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        // Fetch the menu items for this restaurant
        const restaurantId = props.match.params.id;
        axios.get(`/api/restaurant/${restaurantId}/items`)
            .then(response => {
                setMenuItems(response.data);
            })
            .catch(error => {
                console.error("Error fetching restaurant items:", error);
            });
    }, [props.match.params.id]);

    return (
        <div>
            <h1>Restaurant Menu</h1>
            {menuItems.map(item => (
                <div key={item.id}>
                    <h2>{item.name}</h2>
                    <p>{item.description}</p>
                    <p>Price: ${item.price.toFixed(2)}</p>
                </div>
            ))}
        </div>
    );
}

export default RestaurantPage;