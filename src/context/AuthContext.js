// src/context/AuthContext.js - Authentication & User Management
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simulated user data structure
  // In production, this would come from Firebase/backend
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('research_copilot_users');
    return saved ? JSON.parse(saved) : {};
  });

  // Get current user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('research_copilot_current_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setCurrentUser(userData);
      
      // Reset daily query count if it's a new day
      const today = new Date().toDateString();
      if (userData.lastQueryDate !== today) {
        const updatedUser = {
          ...userData,
          queriesUsedToday: 0,
          lastQueryDate: today
        };
        setCurrentUser(updatedUser);
        localStorage.setItem('research_copilot_current_user', JSON.stringify(updatedUser));
      }
    }
    setLoading(false);
  }, []);

  // Save users to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('research_copilot_users', JSON.stringify(users));
  }, [users]);

  // Sign up function
  const signup = async (email, password, displayName) => {
    if (users[email]) {
      throw new Error('User already exists');
    }

    const isStudent = email.endsWith('.edu.in') || email.endsWith('.ac.in');
    
    const newUser = {
      uid: Date.now().toString(),
      email,
      displayName: displayName || email.split('@')[0],
      createdAt: new Date().toISOString(),
      
      // Subscription Info
      subscriptionTier: 'free',
      subscriptionStatus: 'active',
      subscriptionStart: new Date().toISOString(),
      subscriptionEnd: null,
      
      // Usage Tracking
      queriesUsedToday: 0,
      lastQueryDate: new Date().toDateString(),
      totalQueriesAllTime: 0,
      
      // Limits
      dailyQueryLimit: 5, // 5 for free, -1 for unlimited
      
      // Student Discount
      isStudent,
      studentEmail: isStudent ? email : null,
      studentDiscount: isStudent ? 0.40 : 0
    };

    setUsers(prev => ({
      ...prev,
      [email]: newUser
    }));

    setCurrentUser(newUser);
    localStorage.setItem('research_copilot_current_user', JSON.stringify(newUser));
    
    return newUser;
  };

  // Login function
  const login = async (email, password) => {
    const user = users[email];
    if (!user) {
      throw new Error('User not found');
    }

    // Reset daily query count if it's a new day
    const today = new Date().toDateString();
    if (user.lastQueryDate !== today) {
      user.queriesUsedToday = 0;
      user.lastQueryDate = today;
      
      setUsers(prev => ({
        ...prev,
        [email]: user
      }));
    }

    setCurrentUser(user);
    localStorage.setItem('research_copilot_current_user', JSON.stringify(user));
    
    return user;
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('research_copilot_current_user');
  };

  // Check if user can make a query
  const canMakeQuery = () => {
    if (!currentUser) return false;
    
    // Pro and Enterprise users have unlimited queries
    if (currentUser.subscriptionTier === 'pro' || currentUser.subscriptionTier === 'enterprise') {
      return true;
    }
    
    // Free users are limited
    return currentUser.queriesUsedToday < currentUser.dailyQueryLimit;
  };

  // Increment query count
  const incrementQueryCount = () => {
    if (!currentUser) return;

    const today = new Date().toDateString();
    const updatedUser = {
      ...currentUser,
      queriesUsedToday: today === currentUser.lastQueryDate ? currentUser.queriesUsedToday + 1 : 1,
      lastQueryDate: today,
      totalQueriesAllTime: currentUser.totalQueriesAllTime + 1
    };

    setCurrentUser(updatedUser);
    localStorage.setItem('research_copilot_current_user', JSON.stringify(updatedUser));
    
    // Update in users object
    setUsers(prev => ({
      ...prev,
      [currentUser.email]: updatedUser
    }));
  };

  // Upgrade to Pro
  const upgradeToPro = (plan) => {
    if (!currentUser) return;

    const isAnnual = plan === 'pro-annual';
    const basePrice = isAnnual ? 5999 : 599;
    const discountedPrice = currentUser.isStudent ? basePrice * (1 - currentUser.studentDiscount) : basePrice;

    const subscriptionEnd = new Date();
    if (isAnnual) {
      subscriptionEnd.setFullYear(subscriptionEnd.getFullYear() + 1);
    } else {
      subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1);
    }

    const updatedUser = {
      ...currentUser,
      subscriptionTier: 'pro',
      subscriptionStatus: 'active',
      subscriptionPlan: plan,
      subscriptionStart: new Date().toISOString(),
      subscriptionEnd: subscriptionEnd.toISOString(),
      dailyQueryLimit: -1, // Unlimited
      paidAmount: discountedPrice,
      billingCycle: isAnnual ? 'annual' : 'monthly'
    };

    setCurrentUser(updatedUser);
    localStorage.setItem('research_copilot_current_user', JSON.stringify(updatedUser));
    
    setUsers(prev => ({
      ...prev,
      [currentUser.email]: updatedUser
    }));

    return updatedUser;
  };

  // Get queries remaining today
  const getQueriesRemaining = () => {
    if (!currentUser) return 0;
    
    if (currentUser.subscriptionTier === 'pro' || currentUser.subscriptionTier === 'enterprise') {
      return -1; // Unlimited
    }
    
    return Math.max(0, currentUser.dailyQueryLimit - currentUser.queriesUsedToday);
  };

  // Get time until queries reset
  const getTimeUntilReset = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const diff = tomorrow - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return { hours, minutes };
  };

  // Calculate pricing with student discount
  const getPricing = (plan) => {
    const prices = {
      'pro-monthly': 599,
      'pro-annual': 5999,
      'enterprise': 29999
    };

    const basePrice = prices[plan] || 0;
    
    if (currentUser?.isStudent && (plan === 'pro-monthly' || plan === 'pro-annual')) {
      const discountedPrice = basePrice * (1 - currentUser.studentDiscount);
      return {
        original: basePrice,
        discounted: Math.round(discountedPrice),
        discount: currentUser.studentDiscount,
        savings: Math.round(basePrice - discountedPrice)
      };
    }

    return {
      original: basePrice,
      discounted: basePrice,
      discount: 0,
      savings: 0
    };
  };

  const value = {
    currentUser,
    signup,
    login,
    logout,
    canMakeQuery,
    incrementQueryCount,
    upgradeToPro,
    getQueriesRemaining,
    getTimeUntilReset,
    getPricing,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}