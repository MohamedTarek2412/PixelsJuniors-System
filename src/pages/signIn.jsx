import React, { useState } from 'react';
import axios from 'axios';
import SignInForm from '../components/signIn/signInForm';
import ForgotPassword from '../components/signIn/forgetPassword';
import Header from '../components/common/header';
import BackgroundElements from '../components/common/backgroundElement';
import { useNavigate } from 'react-router-dom';

export default function MyForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 3) {
      newErrors.password = 'Password must be at least 3 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const testBackendConnection = async (url) => {
    try {
      console.log(`Testing backend connection: ${url}/debug`);
      const response = await axios.get(`${url}/debug`, { timeout: 5000 });
      console.log('Backend test successful:', response.data);
      return true;
    } catch (error) {
      console.log(`Backend test failed for ${url}:`, error.message);
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    setErrors({});

    // Simple URLs without process.env
    const possibleUrls = [
      'http://localhost/pixels-website/backend',
      'http://127.0.0.1/pixels-website/backend',
      'http://localhost:80/pixels-website/backend'
    ];
    
    let workingApiUrl = null;
    
    // تست كل الـ URLs عشان نلاقي اللي شغال
    for (const url of possibleUrls) {
      const isWorking = await testBackendConnection(url);
      if (isWorking) {
        workingApiUrl = url;
        break;
      }
    }
    
    if (!workingApiUrl) {
      setErrors({
        general: 'Cannot connect to backend server. Please check if the server is running.'
      });
      setIsSubmitting(false);
      return;
    }
    
    console.log('Using API URL:', workingApiUrl);

    try {
      console.log('Sending login request with:', {
        email: formData.email,
        password: formData.password.length + ' characters',
        url: `${workingApiUrl}/api/login`
      });

      const response = await axios.post(
        `${workingApiUrl}/api/login`,
        {
          email: formData.email,
          password: formData.password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        }
      );

      console.log('Login successful! Response:', response.data);
      console.log('Full response object:', response);
      console.log('Response keys:', Object.keys(response.data));

      // شوف إيه الـ structure اللي راجع
      const responseData = response.data;
      console.log('Response data structure:', {
        hasToken: 'token' in responseData,
        hasEmployee: 'employee' in responseData,
        hasUser: 'user' in responseData,
        allKeys: Object.keys(responseData)
      });

      const { token, employee, user } = response.data;

      console.log("Token:", token);
      console.log("Employee debug:", employee);
      console.log("User debug:", user);

      // جرب كل الاحتمالات الممكنة للـ user data
      const userData = employee || user || responseData.data || responseData;
      console.log("Final user data:", userData);

      if (token && userData && userData.id) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));

        alert(`Welcome ${userData.full_name || userData.email}!`);

        // Debug: تأكد من قيمة الـ employee ID
        console.log("User ID for navigation:", userData.id);
        console.log("User object:", userData);

        setTimeout(() => {
          if (userData.role === "admin") {
            navigate("/pages/employee");
          } else {
            const userId = userData.id;
            console.log("Navigating to:", `/pages/EmployeeProfile/${userId}`);
            navigate(`/pages/EmployeeProfile/${userId}`);
          }
        }, 1500);
      } else {
        console.error("Missing data in response:", {
          hasToken: !!token,
          hasUserData: !!userData,
          hasUserId: !!(userData && userData.id),
          fullResponse: response.data
        });
        throw new Error("Invalid response format from server");
      }

    } catch (error) {
      console.error('Login failed:', error);
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        config: error.config
      });
      
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const serverError = error.response.data?.error;
        
        switch (status) {
          case 401:
            errorMessage = serverError || 'Invalid email or password. Please check your credentials.';
            break;
          case 404:
            errorMessage = 'Login service not found. Please contact support.';
            break;
          case 500:
            errorMessage = serverError || 'Server error. Please try again later.';
            break;
          default:
            errorMessage = serverError || `Server error: ${status}`;
        }
      } else if (error.request) {
        errorMessage = 'Cannot connect to server. Please check if server is running.';
      } else {
        errorMessage = error.message;
      }
      
      setErrors({
        general: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="signin-container">
      <BackgroundElements />
      <div className="signin-content">
        <div className="signin-wrapper">
          <Header />
          <SignInForm
            formData={formData}
            errors={errors}
            handleChange={handleChange}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
          <ForgotPassword />
        </div>
      </div>
    </div>
  );
}