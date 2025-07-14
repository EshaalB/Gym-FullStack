import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaUser, FaDumbbell } from "react-icons/fa";
import toast from "react-hot-toast";
import { showSuccessAlert, showErrorAlert } from "../utils/sweetAlert";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Member", // Capitalized
    gender: "",
    dateOfBirth: "",
    age: "",
    phone: "",
    experience: "",
    specialization: "",
    salary: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName) {
      newErrors.firstName = "First name is required";
    }
    
    if (!formData.lastName) {
      newErrors.lastName = "Last name is required";
    }
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and number";
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }
    
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    }
    
    if (!formData.age) {
      newErrors.age = "Age is required";
    } else if (parseInt(formData.age) < 16 || parseInt(formData.age) > 100) {
      newErrors.age = "Age must be between 16 and 100";
    }
    
    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    }
    
    if (formData.role === "Trainer" && !formData.experience) {
      newErrors.experience = "Experience is required for trainers";
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
    setGeneralError("");
    
    if (!validateForm()) {
      setGeneralError("Please fix the errors in the form");
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);
    
    try {
      const signupData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        dob: formData.dateOfBirth,
        gender: formData.gender,
        userRole: formData.role,
      };
      if (formData.role === "Trainer") {
        signupData.specialization = formData.specialization;
        signupData.experience = parseInt(formData.experience);
        signupData.salary = parseFloat(formData.salary) || undefined;
      } else if (formData.role === "Member") {
        signupData.membershipType = "Basic";
      }

      // Call backend API
      const response = await fetch("http://localhost:3500/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(signupData),
      });

      const data = await response.json();

      if (response.ok) {
        // Show success message
        toast.success("Account created successfully! Welcome to Levels Gym!");
        
        // Show success alert
        await showSuccessAlert("Registration Successful!", `Welcome to Levels Gym, ${formData.firstName}! Your account has been created successfully.`);
        
        // Navigate to appropriate dashboard based on role
        switch (data.user.userRole) {
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
        
      } else {
        setGeneralError(data.error || data.message || "Registration failed. Please try again.");
        toast.error(data.error || data.message || "Registration failed. Please try again.");
        await showErrorAlert("Registration Failed", data.error || data.message || "There was an error creating your account. Please try again.");
      }
      
    } catch (error) {
      setGeneralError(error.message || "Registration failed. Please check your connection and try again.");
      toast.error(error.message || "Registration failed. Please check your connection and try again.");
      await showErrorAlert("Registration Failed", "Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    if (!formData.password) return { strength: 0, color: "gray", text: "" };
    
    let strength = 0;
    if (formData.password.length >= 8) strength++;
    if (/(?=.*[a-z])/.test(formData.password)) strength++;
    if (/(?=.*[A-Z])/.test(formData.password)) strength++;
    if (/(?=.*\d)/.test(formData.password)) strength++;
    if (/(?=.*[!@#$%^&*])/.test(formData.password)) strength++;
    
    const strengthMap = {
      1: { color: "red", text: "Very Weak" },
      2: { color: "orange", text: "Weak" },
      3: { color: "yellow", text: "Fair" },
      4: { color: "lightgreen", text: "Good" },
      5: { color: "green", text: "Strong" }
    };
    
    return { strength, ...strengthMap[strength] };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12">
      <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/10 w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
              Levels Gym
            </h1>
          </Link>
          <h2 className="text-2xl font-bold text-white mb-2">Create Your Account</h2>
          <p className="text-gray-400">Join our fitness community today</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6" aria-live="polite">
          {generalError && (
            <div className="bg-red-500/20 border border-red-400/30 text-red-300 rounded-lg px-4 py-2 mb-4 text-center font-semibold" aria-live="polite">{generalError}</div>
          )}
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-black/50 backdrop-blur-sm border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-300 ${
                  errors.firstName ? 'border-red-500' : 'border-white/20'
                }`}
                placeholder="Enter your first name"
              />
              {errors.firstName && (
                <p
                  className="text-red-400 text-sm mt-1"
                >
                  {errors.firstName}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-black/50 backdrop-blur-sm border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-300 ${
                  errors.lastName ? 'border-red-500' : 'border-white/20'
                }`}
                placeholder="Enter your last name"
              />
              {errors.lastName && (
                <p
                  className="text-red-400 text-sm mt-1"
                >
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>

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
              <p
                className="text-red-400 text-sm mt-1"
              >
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              {formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded ${
                          level <= passwordStrength.strength
                            ? `bg-${passwordStrength.color}-500`
                            : "bg-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs mt-1 text-${passwordStrength.color}-400`}>
                    {passwordStrength.text}
                  </p>
                </div>
              )}
              {errors.password && (
                <p
                  className="text-red-400 text-sm mt-1"
                >
                  {errors.password}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-black/50 backdrop-blur-sm border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-300 pr-12 ${
                    errors.confirmPassword ? 'border-red-500' : 'border-white/20'
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p
                  className="text-red-400 text-sm mt-1"
                >
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              I want to join as
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, role: "Member" }))}
                className={`p-4 rounded-xl border transition-all duration-300 ${
                  formData.role === "Member"
                    ? "bg-red-500/20 border-red-400/50 text-white"
                    : "bg-black/50 border-white/20 text-gray-400 hover:bg-white/10"
                }`}
              >
                <FaUser className="text-2xl mx-auto mb-2" />
                <span className="font-medium">Member</span>
              </button>
              
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, role: "Trainer" }))}
                className={`p-4 rounded-xl border transition-all duration-300 ${
                  formData.role === "Trainer"
                    ? "bg-red-500/20 border-red-400/50 text-white"
                    : "bg-black/50 border-white/20 text-gray-400 hover:bg-white/10"
                }`}
              >
                <FaDumbbell className="text-2xl mx-auto mb-2" />
                <span className="font-medium">Trainer</span>
              </button>
            </div>
          </div>

          {/* Additional Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-300 mb-2">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-black/50 backdrop-blur-sm border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-300 ${errors.gender ? 'border-red-500' : 'border-white/20'}`}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && (
                <p className="text-red-400 text-sm mt-1">{errors.gender}</p>
              )}
            </div>
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-300 mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-black/50 backdrop-blur-sm border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-300 ${errors.dateOfBirth ? 'border-red-500' : 'border-white/20'}`}
              />
              {errors.dateOfBirth && (
                <p className="text-red-400 text-sm mt-1">{errors.dateOfBirth}</p>
              )}
            </div>
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-300 mb-2">
                Age
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-black/50 backdrop-blur-sm border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-300 ${
                  errors.age ? 'border-red-500' : 'border-white/20'
                }`}
                placeholder="Enter your age"
                min="16"
                max="100"
              />
              {errors.age && (
                <p
                  className="text-red-400 text-sm mt-1"
                >
                  {errors.age}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-black/50 backdrop-blur-sm border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-300 ${
                  errors.phone ? 'border-red-500' : 'border-white/20'
                }`}
                placeholder="Enter your phone number"
              />
              {errors.phone && (
                <p
                  className="text-red-400 text-sm mt-1"
                >
                  {errors.phone}
                </p>
              )}
            </div>
          </div>

          {/* Trainer Experience Field */}
          {formData.role === "Trainer" && (
            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-gray-300 mb-2">
                Years of Experience
              </label>
              <input
                type="number"
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-black/50 backdrop-blur-sm border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-300 ${
                  errors.experience ? 'border-red-500' : 'border-white/20'
                }`}
                placeholder="Enter years of experience"
                min="0"
                max="50"
              />
              {errors.experience && (
                <p
                  className="text-red-400 text-sm mt-1"
                >
                  {errors.experience}
                </p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 shadow-lg"
            aria-busy={loading}
            aria-disabled={loading}
          >
            {loading ? <span className="flex items-center justify-center"><span className="loader mr-2"></span> Creating Account...</span> : "Create Account"}
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center mt-8">
          <p className="text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-red-400 hover:text-red-300 font-semibold transition-colors duration-200"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
