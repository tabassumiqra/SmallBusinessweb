import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services';
import './AuthCallbackPage.css';

/**
 * AuthCallbackPage Component
 * Handles OAuth callback and redirects to intended destination
 */
const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  const [processingAuth, setProcessingAuth] = useState(true);
  const [redirectPath, setRedirectPath] = useState('/add-business');

  // Check if token is in URL on mount and wait for auth to complete
  useEffect(() => {
    const processOAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const tokenFromUrl = urlParams.get('token');
      
      // Also check if we have authRedirect in localStorage (indicates OAuth flow)
      const hasAuthRedirect = localStorage.getItem('authRedirect');
      
      console.log('AuthCallbackPage: Token from URL:', tokenFromUrl ? 'exists' : 'not found');
      console.log('AuthCallbackPage: Has authRedirect:', hasAuthRedirect ? 'yes' : 'no');
      
      // If no token in URL but we have authRedirect, we're in OAuth callback flow
      // AuthContext might have already grabbed the token from URL
      if (!tokenFromUrl && !hasAuthRedirect) {
        // Not an OAuth callback, redirect to home
        console.log('AuthCallbackPage: Not OAuth callback, redirecting to home');
        navigate('/', { replace: true });
        return;
      }

      // Get the redirect path from localStorage (set before OAuth)
      const storedPath = localStorage.getItem('authRedirect') || '/add-business';
      setRedirectPath(storedPath);
      console.log('AuthCallbackPage: Redirect path:', storedPath);

      // We're in OAuth flow, wait for AuthContext to finish processing
      // Give it a moment to save token and fetch user
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProcessingAuth(false);
    };

    processOAuthCallback();
  }, [navigate]);

  // Wait for authentication to complete, then redirect
  useEffect(() => {
    // Don't do anything while still processing or while auth is loading
    if (processingAuth || loading) {
      console.log('AuthCallbackPage: Waiting... processingAuth:', processingAuth, 'loading:', loading);
      return;
    }

    // Check if we have a token in localStorage (means auth succeeded)
    const token = authService.getToken();
    
    console.log('AuthCallbackPage: Auth complete. Token:', token ? 'exists' : 'not found', 'isAuthenticated:', isAuthenticated);

    if (token) {
      // Clear the stored redirect path
      localStorage.removeItem('authRedirect');
      
      // Token exists - either user is authenticated or will be soon
      if (isAuthenticated) {
        // Successfully authenticated, redirect to intended page
        console.log('✅ Google OAuth success! Redirecting to:', redirectPath);
        navigate(redirectPath, { replace: true });
      } else {
        // Token exists but user not loaded yet, wait a bit more
        console.log('AuthCallbackPage: Token exists but user not loaded, waiting one more second...');
        setTimeout(() => {
          if (authService.getToken()) {
            console.log('✅ Redirecting after delay to:', redirectPath);
            navigate(redirectPath, { replace: true });
          } else {
            console.error('❌ Token disappeared, redirecting to home');
            navigate('/', { replace: true });
          }
        }, 1500);
      }
    } else {
      // No token, authentication failed
      localStorage.removeItem('authRedirect');
      console.error('❌ Google OAuth failed (no token), redirecting to home');
      navigate('/', { replace: true });
    }
  }, [processingAuth, loading, isAuthenticated, navigate, redirectPath]);

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

