import { createContext, useContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode'; // Corrected import statement

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const setToken = token => {
    localStorage.setItem('token', token);
    const decodedUser = jwtDecode(token); // Ensure this line correctly decodes the token
    setUser(decodedUser);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// Define and export useAuth hook for easy consumption of context
export const useAuth = () => useContext(AuthContext);