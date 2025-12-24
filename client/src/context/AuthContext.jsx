import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services';

const AuthContext = createContext();

/**
 * Custom hook to use auth context
 * @returns {object} Auth context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Auth Provider component
 * Manages authentication state and provides auth methods
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(authService.getToken());

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          console.log('Checking authentication with token...');
          const data = await authService.getMe();
          console.log('Authentication successful, user:', data.user.email);
          setUser(data.user);
        } catch (error) {
          console.error('Auth check error:', error);
          console.log('Removing invalid token');
          authService.removeToken();
          setToken(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  // Handle Google OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');

    if (tokenFromUrl) {
      console.log('Token received from OAuth callback');
      authService.setToken(tokenFromUrl);
      setToken(tokenFromUrl);
      // Remove token from URL
      const url = new URL(window.location);
      url.searchParams.delete('token');
      window.history.replaceState({}, document.title, url.pathname);
    }
  }, []);

  /**
   * Login with email and password
   */
  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      authService.setToken(data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  /**
   * Sign up new user
   */
  const signup = async (name, email, password) => {
    try {
      const data = await authService.signup(name, email, password);
      authService.setToken(data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  /**
   * Logout user
   */
  const logout = () => {
    authService.removeToken();
    setToken(null);
    setUser(null);
  };

  /**
   * Login with Google OAuth
   * @param {string} redirectPath - Path to redirect after successful login
   */
  const loginWithGoogle = (redirectPath = '/') => {
    // Clear any existing invalid token before Google OAuth
    authService.removeToken();
    setToken(null);
    setUser(null);
    // Store the redirect path for after OAuth callback
    localStorage.setItem('authRedirect', redirectPath);
    authService.loginWithGoogle();
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    loginWithGoogle,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
