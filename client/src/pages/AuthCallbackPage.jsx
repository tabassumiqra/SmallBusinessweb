import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthCallbackPage.css';

/**
 * AuthCallbackPage Component
 * Handles OAuth callback and redirects to intended destination
 */
const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  const [hasToken, setHasToken] = useState(false);
  const [redirectPath, setRedirectPath] = useState('/');

  // Check if token is in URL on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    
    if (tokenFromUrl) {
      setHasToken(true);
      // Get the redirect path from localStorage (set before OAuth)
      const storedPath = localStorage.getItem('authRedirect') || '/';
      setRedirectPath(storedPath);
    } else {
      // No token in URL, redirect to home immediately
      navigate('/', { replace: true });
    }
  }, [navigate]);

  // Wait for authentication to complete, then redirect
  useEffect(() => {
    if (hasToken && !loading) {
      // Clear the stored redirect path
      localStorage.removeItem('authRedirect');

      if (isAuthenticated) {
        // Successfully authenticated, redirect to intended page
        console.log('Google OAuth success, redirecting to:', redirectPath);
        navigate(redirectPath, { replace: true });
      } else {
        // Authentication failed, go to home
        console.error('Google OAuth failed, redirecting to home');
        navigate('/', { replace: true });
      }
    }
  }, [hasToken, loading, isAuthenticated, navigate, redirectPath]);

  return (
    <div className="auth-callback-page">
      <div className="callback-container">
        <div className="loading-spinner"></div>
        <p>Completing sign in...</p>
      </div>
    </div>
  );
};

export default AuthCallbackPage;

