import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaMapMarkerAlt, FaPhone, FaEnvelope, FaArrowUp } from "react-icons/fa";
import Button from "./Button";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-black/90 bg-gradient-to-r from-black via-gray-900 to-red-900/10 backdrop-blur-2xl border-t border-red-900/20 relative overflow-hidden shadow-2xl z-10">
      {/* Glassmorphic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-black/40 to-white/10 opacity-80 pointer-events-none z-0" />
      <div className="relative z-10 max-w-7xl mx-auto px-5 lg:px-32 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold text-white mb-4">Levels Gym</h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Forge your body into a weapon. Join the ranks of warriors who refuse to accept weakness. 
              Transform your limits into strength with our battle-tested facilities.
            </p>
          </div>
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><Button title="Home" link="/" className="text-gray-400 hover:text-red-400 transition-colors duration-300" /></li>
              <li><Button title="About Us" link="/about" className="text-gray-400 hover:text-red-400 transition-colors duration-300" /></li>
              <li><Button title="Membership Plans" link="/plans" className="text-gray-400 hover:text-red-400 transition-colors duration-300" /></li>
              <li><Button title="Contact Us" link="/contact" className="text-gray-400 hover:text-red-400 transition-colors duration-300" /></li>
              <li><Button title="Login" link="/login" className="text-gray-400 hover:text-red-400 transition-colors duration-300" /></li>
            </ul>
          </div>
          {/* Contact Info (Dummy) */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Contact</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center gap-2"><FaMapMarkerAlt className="text-red-400" /> 123 Fitness Ave, Metropolis, USA</li>
              <li className="flex items-center gap-2"><FaPhone className="text-red-400" /> (555) 123-4567</li>
              <li className="flex items-center gap-2"><FaEnvelope className="text-red-400" /> info@levelsgym.com</li>
              <li className="flex items-center gap-2"><FaArrowUp className="text-red-400 cursor-pointer" onClick={scrollToTop} aria-label="Back to top" /> Back to Top</li>
            </ul>
          </div>
          {/* Interactive Map (Google Maps Dummy) */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Find Us</h4>
            <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg">
              <iframe
                title="Gym Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019019145409!2d-122.4194154846816!3d37.7749297797597!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085808c7e6b1b1b%3A0x4a0b8b8b8b8b8b8b!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1680000000000!5m2!1sen!2sus"
                className="w-full h-40 md:h-32 lg:h-40"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} Levels Gym. All rights reserved.</div>
          <div className="flex gap-4">
            <a href="#" className="text-gray-400 hover:text-red-400" aria-label="Facebook"><FaFacebook /></a>
            <a href="#" className="text-gray-400 hover:text-red-400" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" className="text-gray-400 hover:text-red-400" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" className="text-gray-400 hover:text-red-400" aria-label="YouTube"><FaYoutube /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;