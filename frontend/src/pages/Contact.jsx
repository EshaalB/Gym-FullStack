import React, { useState } from "react";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaYoutube, FaWhatsapp, FaCheck, FaTimes } from "react-icons/fa";
import Button from "../components/common/Button";
import BarLoader from "../components/common/BarLoader";
import toast from "react-hot-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Name is required";
        if (value.trim().length < 2) return "Name must be at least 2 characters";
        return "";
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/\S+@\S+\.\S+/.test(value)) return "Email is invalid";
        return "";
      case "subject":
        if (!value.trim()) return "Subject is required";
        if (value.trim().length < 5) return "Subject must be at least 5 characters";
        return "";
      case "message":
        if (!value.trim()) return "Message is required";
        if (value.trim().length < 10) return "Message must be at least 10 characters";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Real-time validation
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast.success("Message sent successfully! We'll get back to you soon.");
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      setErrors({});
      
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  const getFieldStatus = (fieldName) => {
    if (errors[fieldName]) return "error";
    if (formData[fieldName] && !errors[fieldName]) return "success";
    return "neutral";
  };

  return (
    <div className="relative w-screen min-h-screen overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-black via-gray-900 to-black z-0" />
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-red-900/10 via-transparent to-red-900/10 z-0" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-red-500/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 lg:px-32">
        {/* Header Section */}
        <div className="text-center mb-20 fade-in">
          <div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-block bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-300 px-6 py-3 rounded-full text-sm font-medium mb-6"
          >
            Get In Touch
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
            Contact <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">Us</span>
          </h1>
          <p className="text-xl text-red-200 max-w-3xl mx-auto">
            Ready to start your fitness journey? We're here to help you every step of the way. 
            Get in touch with us today!
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          {/* Contact Form */}
          <div 
            className="slide-up"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
              <h2 className="text-3xl font-bold text-white mb-6">Send Us a Message</h2>
              
              {loading && (
                <div className="mb-6">
                  <BarLoader />
                  <p className="text-center text-gray-300 mt-2">Sending your message...</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-red-200 font-medium mb-2">Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 bg-black/30 backdrop-blur-sm border rounded-xl text-white placeholder-gray-400 focus:outline-none transition-colors ${
                          getFieldStatus("name") === "error" 
                            ? "border-red-400 focus:border-red-400" 
                            : getFieldStatus("name") === "success"
                            ? "border-green-400 focus:border-green-400"
                            : "border-white/20 focus:border-red-400"
                        }`}
                        placeholder="Your full name"
                        disabled={isSubmitting}
                      />
                      {getFieldStatus("name") === "success" && (
                        <FaCheck className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400" />
                      )}
                      {getFieldStatus("name") === "error" && (
                        <FaTimes className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-400" />
                      )}
                    </div>
                    {errors.name && (
                      <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-red-200 font-medium mb-2">Email</label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 bg-black/30 backdrop-blur-sm border rounded-xl text-white placeholder-gray-400 focus:outline-none transition-colors ${
                          getFieldStatus("email") === "error" 
                            ? "border-red-400 focus:border-red-400" 
                            : getFieldStatus("email") === "success"
                            ? "border-green-400 focus:border-green-400"
                            : "border-white/20 focus:border-red-400"
                        }`}
                        placeholder="your.email@example.com"
                        disabled={isSubmitting}
                      />
                      {getFieldStatus("email") === "success" && (
                        <FaCheck className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400" />
                      )}
                      {getFieldStatus("email") === "error" && (
                        <FaTimes className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-400" />
                      )}
                    </div>
                    {errors.email && (
                      <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-red-200 font-medium mb-2">Subject</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-black/30 backdrop-blur-sm border rounded-xl text-white placeholder-gray-400 focus:outline-none transition-colors ${
                        getFieldStatus("subject") === "error" 
                          ? "border-red-400 focus:border-red-400" 
                          : getFieldStatus("subject") === "success"
                          ? "border-green-400 focus:border-green-400"
                          : "border-white/20 focus:border-red-400"
                      }`}
                      placeholder="What can we help you with?"
                      disabled={isSubmitting}
                    />
                    {getFieldStatus("subject") === "success" && (
                      <FaCheck className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400" />
                    )}
                    {getFieldStatus("subject") === "error" && (
                      <FaTimes className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-400" />
                    )}
                  </div>
                  {errors.subject && (
                    <p className="text-red-400 text-sm mt-1">{errors.subject}</p>
                  )}
                </div>
                <div>
                  <label className="block text-red-200 font-medium mb-2">Message</label>
                  <div className="relative">
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="6"
                      className={`w-full px-4 py-3 bg-black/30 backdrop-blur-sm border rounded-xl text-white placeholder-gray-400 focus:outline-none resize-none transition-colors ${
                        getFieldStatus("message") === "error" 
                          ? "border-red-400 focus:border-red-400" 
                          : getFieldStatus("message") === "success"
                          ? "border-green-400 focus:border-green-400"
                          : "border-white/20 focus:border-red-400"
                      }`}
                      placeholder="Tell us more about your fitness goals..."
                      disabled={isSubmitting}
                    ></textarea>
                    {getFieldStatus("message") === "success" && (
                      <FaCheck className="absolute right-3 top-3 text-green-400" />
                    )}
                    {getFieldStatus("message") === "error" && (
                      <FaTimes className="absolute right-3 top-3 text-red-400" />
                    )}
                  </div>
                  {errors.message && (
                    <p className="text-red-400 text-sm mt-1">{errors.message}</p>
                  )}
                </div>
                <Button 
                  title={isSubmitting ? "Sending..." : "Send Message"} 
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                />
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div 
            className="scale-in"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-8">
              {/* Contact Details */}
              <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
                <h2 className="text-3xl font-bold text-white mb-8">Get In Touch</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500/20 to-red-600/20 backdrop-blur-sm border border-red-400/30 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FaMapMarkerAlt className="text-xl text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">Visit Our Gym</h3>
                      <p className="text-gray-300">123 Fitness Ave, Metropolis, USA</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500/20 to-red-600/20 backdrop-blur-sm border border-red-400/30 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FaPhone className="text-xl text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">Call Us</h3>
                      <p className="text-gray-300">(555) 123-4567</p>
                      <p className="text-gray-300">(555) 765-4321</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500/20 to-red-600/20 backdrop-blur-sm border border-red-400/30 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FaEnvelope className="text-xl text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">Email Us</h3>
                      <p className="text-gray-300">info@levelsgym.com</p>
                      <p className="text-gray-300">support@levelsgym.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500/20 to-red-600/20 backdrop-blur-sm border border-red-400/30 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FaClock className="text-xl text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">Opening Hours</h3>
                      <p className="text-gray-300">Monday - Friday: 6:00 AM - 11:00 PM</p>
                      <p className="text-gray-300">Saturday - Sunday: 7:00 AM - 10:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-6">Quick Actions</h3>
                <div className="space-y-4">
                  <Button 
                    title="Book a Free Trial" 
                    link="/signup"
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                  />
                  <Button 
                    title="View Membership Plans" 
                    link="/plans"
                    className="w-full bg-black/30 backdrop-blur-sm border border-white/20 text-white hover:bg-white/10 py-3 rounded-xl font-semibold transition-all duration-300"
                  />
                  <Button 
                    title="Schedule a Tour" 
                    link="#"
                    className="w-full bg-black/30 backdrop-blur-sm border border-white/20 text-white hover:bg-white/10 py-3 rounded-xl font-semibold transition-all duration-300"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media & Additional Contact */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Social Media */}
          <div 
            className="slide-up"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
              <h2 className="text-3xl font-bold text-white mb-6">Follow Us</h2>
              <p className="text-gray-300 mb-8">
                Stay connected with us on social media for the latest updates, fitness tips, and community events.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <a href="#" className="flex items-center gap-3 p-4 bg-black/30 backdrop-blur-sm border border-white/20 rounded-xl text-white hover:bg-white/10 transition-all duration-300 group">
                  <FaFacebook className="text-2xl text-blue-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <h4 className="font-semibold">Facebook</h4>
                    <p className="text-gray-400 text-sm">@LevelsGym</p>
                  </div>
                </a>
                
                <a href="#" className="flex items-center gap-3 p-4 bg-black/30 backdrop-blur-sm border border-white/20 rounded-xl text-white hover:bg-white/10 transition-all duration-300 group">
                  <FaInstagram className="text-2xl text-pink-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <h4 className="font-semibold">Instagram</h4>
                    <p className="text-gray-400 text-sm">@LevelsGym</p>
                  </div>
                </a>
                
                <a href="#" className="flex items-center gap-3 p-4 bg-black/30 backdrop-blur-sm border border-white/20 rounded-xl text-white hover:bg-white/10 transition-all duration-300 group">
                  <FaTwitter className="text-2xl text-blue-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <h4 className="font-semibold">Twitter</h4>
                    <p className="text-gray-400 text-sm">@LevelsGym</p>
                  </div>
                </a>
                
                <a href="#" className="flex items-center gap-3 p-4 bg-black/30 backdrop-blur-sm border border-white/20 rounded-xl text-white hover:bg-white/10 transition-all duration-300 group">
                  <FaYoutube className="text-2xl text-red-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <h4 className="font-semibold">YouTube</h4>
                    <p className="text-gray-400 text-sm">Levels Gym</p>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* WhatsApp Contact */}
          <div 
            className="scale-in"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
              <h2 className="text-3xl font-bold text-white mb-6">Quick Contact</h2>
              <p className="text-gray-300 mb-8">
                Need immediate assistance? Reach out to us on WhatsApp for instant support.
              </p>
              
              <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-6 bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-xl text-white hover:bg-green-500/30 transition-all duration-300 group">
                <FaWhatsapp className="text-4xl text-green-400 group-hover:scale-110 transition-transform" />
                <div>
                  <h3 className="text-xl font-semibold">WhatsApp Support</h3>
                  <p className="text-gray-300">Get instant help from our team</p>
                  <p className="text-green-400 font-medium">+92 300 123 4567</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-20 flex justify-center">
          <div className="w-full max-w-2xl bg-black/80 bg-gradient-to-br from-black via-gray-900 to-red-900/10 rounded-2xl shadow-2xl border border-red-500/10 p-8">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Find Us</h2>
            <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg">
              <iframe
                title="Gym Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019019145409!2d-122.4194154846816!3d37.7749297797597!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085808c7e6b1b1b%3A0x4a0b8b8b8b8b8b8b!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1680000000000!5m2!1sen!2sus"
                className="w-full h-64 md:h-56 lg:h-80"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;