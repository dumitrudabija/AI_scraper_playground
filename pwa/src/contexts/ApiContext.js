import React, { createContext, useContext, useState, useCallback } from 'react';

const ApiContext = createContext();

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};

export const ApiProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // API base URL - will be localhost during development
  const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? '/api' 
    : 'http://localhost:3002/api';

  const apiCall = useCallback(async (endpoint, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  // Get latest report
  const getLatestReport = useCallback(async () => {
    return apiCall('/reports/latest');
  }, [apiCall]);

  // Trigger scraping
  const triggerScrape = useCallback(async () => {
    return apiCall('/scrape/trigger', {
      method: 'POST',
    });
  }, [apiCall]);

  // Get scrape status
  const getScrapeStatus = useCallback(async () => {
    return apiCall('/scrape/status');
  }, [apiCall]);

  // Get source status
  const getSourceStatus = useCallback(async () => {
    return apiCall('/sources/status');
  }, [apiCall]);

  // Subscribe to notifications
  const subscribeToNotifications = useCallback(async (subscription) => {
    return apiCall('/notifications/subscribe', {
      method: 'POST',
      body: JSON.stringify(subscription),
    });
  }, [apiCall]);

  const value = {
    loading,
    error,
    getLatestReport,
    triggerScrape,
    getScrapeStatus,
    getSourceStatus,
    subscribeToNotifications,
    clearError: () => setError(null),
  };

  return (
    <ApiContext.Provider value={value}>
      {children}
    </ApiContext.Provider>
  );
};
