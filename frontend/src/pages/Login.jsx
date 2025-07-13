import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import { showSuccessAlert, showErrorAlert, showConfirmAlert } from "../utils/sweetAlert";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        // Redirect based on user role
        switch (user.userRole) {
          case "Admin":
            navigate("/admindash");
            break;
          case "Trainer":
            navigate("/trainerdash");
            break;
          case "Member":
            navigate("/userdash");
            break;
          default:
            navigate("/userdash");
        }
      } catch (error) {
        // Clear invalid data
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userData');
      }
    }
  }, [navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);
    
    try {
      console.log("Attempting login...");
      // Authenticate with backend
      const response = await fetch("http://localhost:3500/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Login response:", data);

      if (response.ok) {
        // Store the access token and user data
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('userData', JSON.stringify(data.user));
        
        // Show success message
        toast.success("Login successful! Welcome back!");
        
        console.log("User role:", data.user.userRole);
        
        // Redirect based on user role (immediate navigation)
        switch (data.user.userRole) {
          case "Admin":
            console.log("Redirecting to admin dashboard...");
            navigate("/admindash");
            break;
          case "Trainer":
            console.log("Redirecting to trainer dashboard...");
            navigate("/trainerdash");
            break;
          case "Member":
            console.log("Redirecting to user dashboard...");
            navigate("/userdash");
            break;
          default:
            console.log("Default redirect to user dashboard...");
            navigate("/userdash");
        }
        
      } else {
        // Handle login error
        console.error("Login failed:", data.message);
        toast.error(data.message || "Login failed. Please try again.");
        await showErrorAlert("Login Failed", data.message || "Invalid email or password. Please try again.");
      }
      
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please check your connection and try again.");
      await showErrorAlert("Login Failed", "Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const result = await showConfirmAlert(
      "Reset Password",
      "We'll send you a password reset link. Continue?",
      "Send Link",
      "Cancel"
    );
    
    if (result.isConfirmed) {
      toast.success("Password reset link sent to your email!");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12">
      <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
              Levels Gym
            </h1>
          </Link>
          <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-400">Sign in to your account to continue</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 bg-black/50 backdrop-blur-sm border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-300 ${
                errors.email ? 'border-red-500' : 'border-white/20'
              }`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-black/50 backdrop-blur-sm border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-300 pr-12 ${
                  errors.password ? 'border-red-500' : 'border-white/20'
                }`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">
                {errors.password}
              </p>
            )}
          </div>

          {/* Forgot Password */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-red-400 hover:text-red-300 transition-colors duration-200"
            >
              Forgot your password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 shadow-lg"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="text-center mt-8">
          <p className="text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-red-400 hover:text-red-300 font-semibold transition-colors duration-200"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
