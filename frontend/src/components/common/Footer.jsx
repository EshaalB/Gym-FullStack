import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaMapMarkerAlt, FaPhone, FaEnvelope, FaArrowUp } from "react-icons/fa";
import Button from "./Button";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-black/60 backdrop-blur-2xl border-t border-white/20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-900/10 via-transparent to-red-900/10" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-5 lg:px-32 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold text-white mb-4">Levels Gym</h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Forge your body into a weapon. Join the ranks of warriors who refuse to accept weakness. 
              Transform your limits into strength with our battle-tested facilities.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com/levelsgym" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-black/40 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-all duration-300 transform hover:scale-110"
              >
                <FaFacebook className="text-lg" />
              </a>
              <a 
                href="https://twitter.com/levelsgym" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-black/40 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-all duration-300 transform hover:scale-110"
              >
                <FaTwitter className="text-lg" />
              </a>
              <a 
                href="https://instagram.com/levelsgym" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-black/40 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-all duration-300 transform hover:scale-110"
              >
                <FaInstagram className="text-lg" />
              </a>
              <a 
                href="https://youtube.com/levelsgym" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-black/40 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-all duration-300 transform hover:scale-110"
              >
                <FaYoutube className="text-lg" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Button 
                  title="Home" 
                  link="/"
                  className="text-gray-400 hover:text-red-400 transition-colors duration-300"
                />
              </li>
              <li>
                <Button 
                  title="About Us" 
                  link="/about"
                  className="text-gray-400 hover:text-red-400 transition-colors duration-300"
                />
              </li>
              <li>
                <Button 
                  title="Membership Plans" 
                  link="/plans"
                  className="text-gray-400 hover:text-red-400 transition-colors duration-300"
                />
              </li>
              <li>
                <Button 
                  title="Contact Us" 
                  link="/contact"
                  className="text-gray-400 hover:text-red-400 transition-colors duration-300"
                />
              </li>
              <li>
                <Button 
                  title="Login" 
                  link="/login"
                  className="text-gray-400 hover:text-red-400 transition-colors duration-300"
                />
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Our Services</h4>
            <ul className="space-y-3">
              <li>
                <a href="/services/personal-training" className="text-gray-400 hover:text-red-400 transition-colors duration-300">
                  Personal Training
                </a>
              </li>
              <li>
                <a href="/services/group-classes" className="text-gray-400 hover:text-red-400 transition-colors duration-300">
                  Group Classes
                </a>
              </li>
              <li>
                <a href="/services/cardio-training" className="text-gray-400 hover:text-red-400 transition-colors duration-300">
                  Cardio Training
                </a>
              </li>
              <li>
                <a href="/services/strength-training" className="text-gray-400 hover:text-red-400 transition-colors duration-300">
                  Strength Training
                </a>
              </li>
              <li>
                <a href="/services/yoga-pilates" className="text-gray-400 hover:text-red-400 transition-colors duration-300">
                  Yoga & Pilates
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Contact Info</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-red-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-400 text-sm">
                    123 Fitness Street, Gulberg III<br />
                    Lahore, Pakistan
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaPhone className="text-red-400 flex-shrink-0" />
                <a href="tel:+923001234567" className="text-gray-400 hover:text-red-400 transition-colors duration-300 text-sm">
                  +92 300 123 4567
                </a>
              </div>
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-red-400 flex-shrink-0" />
                <a href="mailto:info@levelsgym.com" className="text-gray-400 hover:text-red-400 transition-colors duration-300 text-sm">
                  info@levelsgym.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-black/40 backdrop-blur-2xl rounded-2xl p-8 border border-white/20 mb-12">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Stay Battle Ready</h3>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Get the latest warrior training tips, battle strategies, and exclusive access to our elite programs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-red-400 transition-colors"
              />
              <Button 
                title="Subscribe" 
                link="#"
                className="bg-red-500/20 backdrop-blur-xl border border-red-400/30 text-white hover:bg-red-500/30 px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/20">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2024 Levels Gym. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="/privacy-policy" className="text-gray-400 hover:text-red-400 transition-colors duration-300 text-sm">
              Privacy Policy
            </a>
            <a href="/terms-of-service" className="text-gray-400 hover:text-red-400 transition-colors duration-300 text-sm">
              Terms of Service
            </a>
            <button
              onClick={scrollToTop}
              className="w-10 h-10 bg-black/40 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-all duration-300 transform hover:scale-110"
            >
              <FaArrowUp className="text-sm" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;