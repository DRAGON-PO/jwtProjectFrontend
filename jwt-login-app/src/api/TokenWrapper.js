// src/TokenWrapper.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { refreshToken } from './authService'; // Assuming refreshToken function exists in authService.js

const TokenWrapper = ({ children }) => {
  const navigate = useNavigate();


  useEffect(() => {
    const checkTokens = async () => {
      const accessToken = sessionStorage.getItem('accessToken');
      const refreshTokenStored = sessionStorage.getItem('refreshToken');

      // Helper function to check if a token is valid
      const isTokenValid = (token) => {
        if (!token) return false;
        try {
          const { exp } = jwtDecode(token); // Extract expiration time
          return exp * 1000 > Date.now(); // Check if current time is before expiration
        } catch (error) {
          return false; // Return false if decoding fails
        }
      };

      // Check access token validity
      if (!isTokenValid(accessToken)) {
        if (refreshTokenStored) {
          // Try to refresh the tokens
          try {
            const response = await refreshToken(refreshTokenStored);
            if (response.accessToken && response.refreshToken) {
              sessionStorage.setItem('accessToken', response.accessToken);
              sessionStorage.setItem('refreshToken', response.refreshToken);
            } else {
              throw new Error("Token refresh failed.");
            }
          } catch (error) {
            // Clear tokens and redirect to login if refreshing fails
            sessionStorage.clear();
            navigate('/login');
          }
        } else {
          // If no refresh token, redirect to login
          sessionStorage.clear();
          navigate('/login');
        }
      }
    };

    // Run checkTokens on component mount
    checkTokens();
  }, [navigate]);

  // Render children components if tokens are valid
  return <>{children}</>;
};

export default TokenWrapper;