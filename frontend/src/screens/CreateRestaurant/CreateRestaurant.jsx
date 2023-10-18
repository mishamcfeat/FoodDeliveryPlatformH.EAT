import React, { useRef } from 'react';
import axios from 'axios';

const CreateRestaurantPage = () => {
    const nameRef = useRef();
    const imageRef = useRef();

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('restaurant_name', nameRef.current.value);
        formData.append('image', imageRef.current.files[0]);
        
        try {
            const response = await axios.post('http://your_fastapi_url/upload_restaurant_image/', formData);
            console.log('Image uploaded:', response.data.filename);
        } catch (error) {
            console.error('Failed to upload image:', error);
        }
    };

    return (
        <div>
            <input ref={nameRef} placeholder="Restaurant Name" />
            <input ref={imageRef} type="file" accept="image/*" />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
}

export default CreateRestaurantPage;





