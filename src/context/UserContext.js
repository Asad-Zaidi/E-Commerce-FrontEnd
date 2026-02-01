import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/api';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('userToken'));
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  // Fetch user data when token exists on app load
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsAuthenticated(true);
      
      // Fetch user data from backend
      const fetchUserData = async () => {
        try {
          const res = await api.get('/auth/profile');
          setUser(res.data.user || res.data);
        } catch (err) {
          console.error('Error fetching user data:', err);
          // Token might be invalid, clear it
          localStorage.removeItem('userToken');
          setToken(null);
          setIsAuthenticated(false);
          delete api.defaults.headers.common['Authorization'];
        } finally {
          setLoading(false);
        }
      };
      
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [token]);

  const signup = async (name, email, password, confirmPassword) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/signup', { name, email, password, confirmPassword });
      const { token: newToken, user: userData } = res.data;
      
      localStorage.setItem('userToken', newToken);
      setToken(newToken);
      setUser(userData);
      setIsAuthenticated(true);
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      return { success: true, message: 'Account created successfully!' };
    } catch (err) {
      const message = err.response?.data?.message || 'Signup failed';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token: newToken, user: userData } = res.data;
      
      localStorage.setItem('userToken', newToken);
      // Also store as adminToken if user is admin for backward compatibility
      if (userData.role === 'admin') {
        localStorage.setItem('adminToken', newToken);
      }
      setToken(newToken);
      setUser(userData);
      setIsAuthenticated(true);
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      // Load cart from backend and merge with local cart
      try {
        const cartRes = await api.get('/auth/cart');
        const backendCart = cartRes.data.cart || [];
        const localCart = JSON.parse(localStorage.getItem("checkoutItems") || "[]");
        
        // Merge carts (local cart takes priority for new items)
        const mergedCart = [...backendCart];
        localCart.forEach(localItem => {
          const existingIndex = mergedCart.findIndex(item => item.productId === localItem.productId);
          if (existingIndex >= 0) {
            mergedCart[existingIndex].quantity = localItem.quantity;
          } else {
            mergedCart.push(localItem);
          }
        });
        
        // Update localStorage and backend with merged cart
        localStorage.setItem("checkoutItems", JSON.stringify(mergedCart));
        window.dispatchEvent(new Event('cartUpdated'));
        
        if (mergedCart.length > 0 && JSON.stringify(backendCart) !== JSON.stringify(mergedCart)) {
          await api.put('/auth/cart', { cart: mergedCart });
        }
      } catch (cartErr) {
        console.error('Error loading cart:', cartErr);
      }
      
      return { success: true, message: 'Logged in successfully!', user: userData };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Clear cart from backend before logout
    if (isAuthenticated) {
      try {
        api.delete('/auth/cart').catch(err => console.error('Error clearing cart on logout:', err));
      } catch (err) {
        console.error('Error clearing cart:', err);
      }
    }
    
    localStorage.removeItem('userToken');
    localStorage.removeItem('adminToken'); // Also clear admin token
    localStorage.removeItem('checkoutItems'); // Clear local cart on logout
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    delete api.defaults.headers.common['Authorization'];
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const updateProfile = async (name, email) => {
    setLoading(true);
    try {
      const res = await api.put('/auth/profile', { userId: user.id, name, email });
      setUser(res.data.user);
      return { success: true, message: 'Profile updated successfully!' };
    } catch (err) {
      const message = err.response?.data?.message || 'Update failed';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{ user, token, loading, isAuthenticated, signup, login, logout, updateProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};
