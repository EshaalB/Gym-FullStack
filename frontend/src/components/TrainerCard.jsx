import React from "react";
import { FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";
import { motion } from "framer-motion";
import Button from "./Button";

const TrainerCard = ({ name, specialization, experience, socialLinks }) => {
  return (
    <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 text-center border border-white/10 hover:border-red-400/30 transition-all duration-300 hover:scale-105">
      <div className="w-24 h-24 bg-gradient-to-r from-red-500/80 to-red-600/80 backdrop-blur-sm border border-red-400/30 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-3xl font-bold text-white">{name.charAt(0)}</span>
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-2">{name}</h3>
      <p className="text-gray-300 mb-2">{specialization}</p>
      <p className="text-sm text-gray-400 mb-4">{experience} years experience</p>
      
      <div className="flex justify-center space-x-3">
        {socialLinks?.instagram && (
          <a href={socialLinks.instagram} className="text-gray-400 hover:text-red-400 transition-colors duration-300">
            <FaInstagram className="text-xl" />
          </a>
        )}
        {socialLinks?.twitter && (
          <a href={socialLinks.twitter} className="text-gray-400 hover:text-red-400 transition-colors duration-300">
            <FaTwitter className="text-xl" />
          </a>
        )}
        {socialLinks?.facebook && (
          <a href={socialLinks.facebook} className="text-gray-400 hover:text-red-400 transition-colors duration-300">
            <FaFacebook className="text-xl" />
          </a>
        )}
      </div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-auto"
      >
        <Button 
          title="Book Session" 
          link="/contact"
          className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl"
        />
      </motion.div>
    </div>
  );
};

export default TrainerCard;