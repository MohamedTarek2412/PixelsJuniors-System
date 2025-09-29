import React from 'react';
import { Eye, EyeOff, User, Mail, Phone, Calendar, Lock, Shield } from 'lucide-react'; // Kept imports for prop usage

// eslint-disable-next-line no-unused-vars
export default function InputField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  icon: Icon,
  error,
  showPasswordToggle,
  showPassword,
  setShowPassword,
}) {
  return (
    <div className="input-group">
      <label className="input-label">{label}</label>
      <div className="input-wrapper">
        {Icon && <Icon className="input-icon" />}
        <input
          type={showPassword ? 'text' : type}
          name={name}
          value={value}
          onChange={onChange}
          className="input-field"
          placeholder={placeholder}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="toggle-password"
          >
            {showPassword ? <EyeOff className="toggle-icon" /> : <Eye className="toggle-icon" />}
          </button>
        )}
      </div>
      {error && (
        <p className="error-message">
          <span className="error-dot"></span>
          {error}
        </p>
      )}
    </div>
  );
}