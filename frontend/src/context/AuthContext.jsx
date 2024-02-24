import { useEffect, createContext, useContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode'; // Corrected import statement
import axios from 'axios';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedUser = jwtDecode(token);
      setUser(decodedUser);
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    }
  }, []);

  const setToken = token => {
    localStorage.setItem('token', token);
    const decodedUser = jwtDecode(token);
    setUser(decodedUser);
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  };

  return (
    <AuthContext.Provider value={{ user, setUser, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// Define and export useAuth hook for easy consumption of context
export const useAuth = () => useContext(AuthContext);