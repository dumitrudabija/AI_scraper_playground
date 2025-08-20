import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

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
  
  // Smart caching state
  const [cachedData, setCachedData] = useState(null);
  const [lastFetchTime, setLastFetchTime] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Cache configuration
  const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes
  const AUTO_REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes

  // API base URL - use full Vercel URL in production
  const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? 'https://ai-scraper-playground.vercel.app/api' 
    : 'http://localhost:3000/api';

  // Utility functions for caching
  const isCacheValid = useCallback(() => {
    if (!lastFetchTime || !cachedData) return false;
    return Date.now() - lastFetchTime < CACHE_DURATION;
  }, [lastFetchTime, cachedData, CACHE_DURATION]);

  const getDataAge = useCallback(() => {
    if (!lastFetchTime) return null;
    const ageMs = Date.now() - lastFetchTime;
    const ageMinutes = Math.floor(ageMs / (1000 * 60));
    if (ageMinutes < 1) return 'Just now';
    if (ageMinutes < 60) return `${ageMinutes}m ago`;
    const ageHours = Math.floor(ageMinutes / 60);
    return `${ageHours}h ago`;
  }, [lastFetchTime]);

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

  // Smart data fetching with caching
  const getLatestReport = useCallback(async (forceRefresh = false) => {
    // Return cached data if valid and not forcing refresh
    if (!forceRefresh && isCacheValid() && cachedData) {
      return cachedData;
    }

    try {
      const data = await apiCall('/reports/latest');
      
      // Update cache
      setCachedData(data);
      setLastFetchTime(Date.now());
      setIsInitialLoad(false);
      
      return data;
    } catch (err) {
      // If we have cached data, return it even if refresh fails
      if (cachedData) {
        console.warn('API call failed, returning cached data:', err.message);
        return cachedData;
      }
      throw err;
    }
  }, [apiCall, isCacheValid, cachedData]);

  // Incremental refresh - fetch new data and merge with existing
  const refreshLatestNews = useCallback(async () => {
    if (refreshing) return cachedData;
    
    setRefreshing(true);
    try {
      const newData = await apiCall('/reports/latest');
      
      if (cachedData && newData.data && cachedData.data) {
        // Merge new articles with existing ones, avoiding duplicates
        const existingArticles = cachedData.data.articles || [];
        const newArticles = newData.data.articles || [];
        
        // Create a map of existing articles by title for deduplication
        const existingTitles = new Set(existingArticles.map(a => a.title));
        const uniqueNewArticles = newArticles.filter(a => !existingTitles.has(a.title));
        
        // Combine articles (new first, then existing)
        const combinedArticles = [...uniqueNewArticles, ...existingArticles];
        
        // Limit to reasonable number (e.g., 50 articles max)
        const limitedArticles = combinedArticles.slice(0, 50);
        
        const mergedData = {
          ...newData,
          data: {
            ...newData.data,
            articles: limitedArticles,
            total_articles: limitedArticles.length,
            new_articles_count: uniqueNewArticles.length
          }
        };
        
        setCachedData(mergedData);
        setLastFetchTime(Date.now());
        return mergedData;
      } else {
        // No existing data to merge, use new data
        setCachedData(newData);
        setLastFetchTime(Date.now());
        return newData;
      }
    } catch (err) {
      // Return cached data if refresh fails
      if (cachedData) {
        console.warn('Refresh failed, keeping cached data:', err.message);
        return cachedData;
      }
      throw err;
    } finally {
      setRefreshing(false);
    }
  }, [apiCall, cachedData, refreshing]);

  // Force full refresh
  const forceFullRefresh = useCallback(async () => {
    setCachedData(null);
    setLastFetchTime(null);
    return getLatestReport(true);
  }, [getLatestReport]);

  // Trigger scraping (using optimized endpoint)
  const triggerScrape = useCallback(async () => {
    return apiCall('/scrape/optimized', {
      method: 'POST',
      body: JSON.stringify({ mode: 'quick' }),
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

  // Auto-refresh effect
  useEffect(() => {
    let intervalId;
    
    // Set up auto-refresh if we have cached data
    if (cachedData && !isInitialLoad) {
      intervalId = setInterval(() => {
        // Only auto-refresh if cache is getting stale
        if (!isCacheValid()) {
          console.log('Auto-refreshing stale data...');
          refreshLatestNews().catch(err => {
            console.warn('Auto-refresh failed:', err.message);
          });
        }
      }, AUTO_REFRESH_INTERVAL);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [cachedData, isInitialLoad, isCacheValid, refreshLatestNews, AUTO_REFRESH_INTERVAL]);

  // Initial data load on app start
  useEffect(() => {
    if (isInitialLoad) {
      // Try to load initial data immediately
      getLatestReport().catch(err => {
        console.warn('Initial data load failed:', err.message);
      });
    }
  }, [isInitialLoad, getLatestReport]);

  const value = {
    // Loading states
    loading,
    error,
    refreshing,
    isInitialLoad,
    
    // Data and metadata
    cachedData,
    lastFetchTime,
    getDataAge,
    isCacheValid: isCacheValid(),
    
    // API functions
    getLatestReport,
    refreshLatestNews,
    forceFullRefresh,
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
