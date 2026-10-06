import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getCustomerProfile,
  customerLogin as apiCustomerLogin,
  customerSignup as apiCustomerSignup,
  customerLogout as apiCustomerLogout,
} from '../services/api';

const CustomerAuthContext = createContext(null);

export function CustomerAuthProvider({ children }) {
  const [customer, setCustomer] = useState(() => {
    try {
      const saved = localStorage.getItem('penguin_customer_info');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await getCustomerProfile();
      if (res?.success && res.user) {
        setCustomer(res.user);
        localStorage.setItem('penguin_customer_info', JSON.stringify(res.user));
      } else {
        setCustomer(null);
        localStorage.removeItem('penguin_customer_info');
      }
    } catch {
      // Not logged in
      setCustomer(null);
      localStorage.removeItem('penguin_customer_info');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const login = async (credentials) => {
    const res = await apiCustomerLogin(credentials);
    if (res?.success && res.user) {
      setCustomer(res.user);
      localStorage.setItem('penguin_customer_info', JSON.stringify(res.user));
    }
    return res;
  };

  const signup = async (data) => {
    const res = await apiCustomerSignup(data);
    if (res?.success && res.user && res.user.emailVerified) {
      setCustomer(res.user);
      localStorage.setItem('penguin_customer_info', JSON.stringify(res.user));
    }
    return res;
  };

  const logout = async () => {
    try {
      await apiCustomerLogout();
    } finally {
      setCustomer(null);
      localStorage.removeItem('penguin_customer_info');
    }
  };

  return (
    <CustomerAuthContext.Provider
      value={{
        customer,
        isLoggedIn: !!customer,
        loading,
        login,
        signup,
        logout,
        fetchProfile,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
  }
  return context;
}
