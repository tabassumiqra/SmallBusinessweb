import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../hooks';
import { useAuth } from '../context/AuthContext';
import { VALIDATION } from '../constants';
import './AuthModal.css';

/**
 * Initial form values
 */
const initialFormValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
};

/**
 * AuthModal Component
 * Handles user authentication (login/signup)
 * @param {boolean} isOpen - Whether modal is open
 * @param {function} onClose - Close handler
 * @param {function} onSuccess - Success handler (optional, redirects to add-business by default)
 * @param {string} redirectPath - Path to redirect after successful auth (default: /add-business)
 */
const AuthModal = ({ isOpen, onClose, onSuccess, redirectPath = '/add-business' }) => {
  const { login, signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleAuthSubmit = async (values, isLogin) => {
    if (isLogin) {
      const result = await login(values.email, values.password);
      if (result.success) {
        onClose();
        // If onSuccess is provided, call it, otherwise navigate to redirectPath
        if (onSuccess) {
          onSuccess();
        } else {
          navigate(redirectPath);
        }
      } else {
        throw new Error(result.error);
      }
    } else {
      // Signup validation
      if (values.password !== values.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      if (values.password.length < VALIDATION.password.minLength) {
        throw new Error(VALIDATION.password.message);
      }

      const result = await signup(values.name, values.email, values.password);
      if (result.success) {
        onClose();
        // If onSuccess is provided, call it, otherwise navigate to redirectPath
        if (onSuccess) {
          onSuccess();
        } else {
          navigate(redirectPath);
        }
      } else {
        throw new Error(result.error);
      }
    }
  };

  const handleGoogleLogin = () => {
    // Pass the redirect path to loginWithGoogle
    loginWithGoogle(redirectPath);
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose} />
        <AuthForm onSubmit={handleAuthSubmit} onGoogleLogin={handleGoogleLogin} />
      </div>
    </div>
  );
};

/**
 * Close Button Component
 */
const CloseButton = ({ onClick }) => (
  <button className="auth-modal-close" onClick={onClick}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  </button>
);

/**
 * Auth Form Component
 */
const AuthForm = ({ onSubmit, onGoogleLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const form = useForm(initialFormValues, async (values) => {
    await onSubmit(values, isLogin);
  });

  const { values, handleChange, reset } = form;

  const toggleMode = () => {
    setIsLogin(!isLogin);
    reset();
    setError('');
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onSubmit(values, isLogin);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="auth-modal-header">
        <h2>{isLogin ? 'Sign In' : 'Sign Up'}</h2>
        <p>{isLogin ? 'Welcome back!' : 'Create your account'}</p>
      </div>

      <form onSubmit={onFormSubmit} className="auth-form">
        {!isLogin && (
          <FormField
            label="Full Name"
            name="name"
            type="text"
            value={values.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required={!isLogin}
          />
        )}

        <FormField
          label="Email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
        />

        <FormField
          label="Password"
          name="password"
          type="password"
          value={values.password}
          onChange={handleChange}
          placeholder="Enter your password"
          required
        />

        {!isLogin && (
          <FormField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={values.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            required={!isLogin}
          />
        )}

        {error && <div className="auth-error">{error}</div>}

        <button type="submit" className="auth-submit-btn" disabled={loading}>
          {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
        </button>
      </form>

      <div className="auth-divider">
        <span>OR</span>
      </div>

      <GoogleButton onClick={onGoogleLogin} />

      <div className="auth-switch">
        <span>{isLogin ? "Don't have an account? " : 'Already have an account? '}</span>
        <button type="button" className="auth-switch-btn" onClick={toggleMode}>
          {isLogin ? 'Sign Up' : 'Sign In'}
        </button>
      </div>
    </>
  );
};

/**
 * Form Field Component
 */
const FormField = ({ label, name, type, value, onChange, placeholder, required }) => (
  <div className="form-group">
    <label htmlFor={name}>{label}</label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
    />
  </div>
);

/**
 * Google Button Component
 */
const GoogleButton = ({ onClick }) => (
  <button className="google-auth-btn" onClick={onClick}>
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
    <span>Continue with Google</span>
  </button>
);

export default AuthModal;
