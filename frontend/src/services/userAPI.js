import axios from 'axios';

const BASE_URL = 'http://localhost:8000/users';

async function listUsers() {
    try {
        const response = await axios.get(`${BASE_URL}/list_users/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

async function registerUser(userData) {
    try {
        const response = await axios.post(`${BASE_URL}/register/`, userData);
        return response.data;
    } catch (error) {
        console.error('Error registering user:', error);
    }
}

async function loginUser(credentials) {
    try {
        const response = await axios.post(`${BASE_URL}/login/`, credentials);
        const token = response.data.token;
        // Save the token to local storage or any other state management solution
        localStorage.setItem('authToken', token);
        return token;
    } catch (error) {
        console.error('Error logging in:', error);
    }
}

async function updateProfile(userId, updatedData) {
    try {
        const token = localStorage.getItem('authToken');
        const response = await axios.put(`${BASE_URL}/profile/${userId}/`, updatedData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating profile:', error);
    }
}

async function logoutUser() {
    try {
        const token = localStorage.getItem('authToken');
        const response = await axios.post(`${BASE_URL}/logout/`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        localStorage.removeItem('authToken');
        return response.data;
    } catch (error) {
        console.error('Error logging out:', error);
    }
}
