// src/components/signin/ForgotPassword.jsx
import React from 'react';

export default function ForgotPassword() {
  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
    // Add your forgot password logic here
  };

  return (
    <div className="forgot-password-container">
      <button onClick={handleForgotPassword} className="forgot-password-link">
        Forgot your password?
      </button>
    </div>
  );
}