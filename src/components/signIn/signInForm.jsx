import React from 'react';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';

export default function SignInForm({
  formData,
  errors,
  handleChange,
  showPassword,
  setShowPassword,
  handleSubmit,
  isSubmitting,
}) {
  return (
    <div className="signin-form-card">
      <div className="card-accent"></div>
      <div className="signin-form-content">
        <div className="signin-header">
          <h2 className="signin-title">Welcome Back!</h2>
          <p className="signin-subtitle">Sign in to access your account</p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="signin-form-fields"
        >
          {/* Email Field */}
          <div className="input-group">
            <label className="input-label">Email Address *</label>
            <div className="input-wrapper">
              <Mail className="input-icon" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your email"
              />
            </div>
            {errors.email && (
              <p className="error-message">
                <span className="error-dot"></span>
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="input-group">
            <label className="input-label">Password *</label>
            <div className="input-wrapper">
              <Lock className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="toggle-password"
              >
                {showPassword ? <EyeOff className="toggle-icon" /> : <Eye className="toggle-icon" />}
              </button>
            </div>
            {errors.password && (
              <p className="error-message">
                <span className="error-dot"></span>
                {errors.password}
              </p>
            )}
          </div>

          {/* General Error */}
          {errors.general && (
            <p className="error-message">
              <span className="error-dot"></span>
              {errors.general}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`signin-submit-button ${isSubmitting ? 'submitting' : ''}`}
          >
            {!isSubmitting && <div className="button-shine"></div>}
            {isSubmitting ? (
              <>
                <div className="spinner"></div>
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <LogIn className="button-icon" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}