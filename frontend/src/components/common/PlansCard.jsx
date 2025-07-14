import React from "react";
import { motion } from "framer-motion";
import { FaCheck, FaTimes } from "react-icons/fa";
import Button from "./Button";
import AnimatedCounter from "../components/AnimatedCounter";

const PlansCard = ({ 
  title, 
  price, 
  description, 
  features, 
  popular = false, 
  color = "from-red-400 to-red-600",
  icon: IconComponent,
  savings = null,
  billingCycle = "monthly"
}) => {
  return (
    <motion.div 
      className={`relative flex flex-col h-full p-8 text-white rounded-3xl border shadow-2xl backdrop-blur-xl transition-all duration-500 ${
        popular 
          ? 'bg-gradient-to-br from-red-500/10 to-red-600/10 border-red-500/30 shadow-red-500/20' 
          : 'bg-black/40 border-white/10 hover:border-white/20'
      }`}
      whileHover={{ y: -10, scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* Popular Badge */}
      {popular && (
        <motion.div 
          className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10"
          initial={{ scale: 0, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        >
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-full text-sm font-bold shadow-2xl border border-red-400/30 backdrop-blur-sm">
            MOST POPULAR
          </div>
        </motion.div>
      )}

      {/* Savings Badge */}
      {savings && (
        <motion.div 
          className="absolute -top-2 -right-2 z-10"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
        >
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg border border-green-400/30">
            {savings}
          </div>
        </motion.div>
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className={`w-16 h-16 bg-gradient-to-r ${color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg border border-white/20`}
        >
          <IconComponent className="text-2xl text-white" />
        </motion.div>
        
        <motion.h3 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`mb-4 text-3xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}
        >
          {title}
        </motion.h3>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-300 text-lg leading-relaxed"
        >
          {description}
        </motion.p>
      </div>

      {/* Price */}
      <motion.div 
        className="flex justify-center items-baseline my-8"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
      >
        <span className="mr-2 text-6xl font-extrabold text-white">
          $<AnimatedCounter value={price} delay={0.6} />
        </span>
        <span className="text-gray-400 text-xl">
          /{billingCycle === "monthly" ? "month" : "year"}
        </span>
      </motion.div>

      {/* Features */}
      <div className="flex-1 space-y-4 mb-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            className="flex items-center gap-3"
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
              feature.available 
                ? "bg-green-500/20 border border-green-400/30" 
                : "bg-gray-600/20 border border-gray-500/30"
            }`}>
              {feature.available ? (
                <FaCheck className="text-green-400 text-sm" />
              ) : (
                <FaTimes className="text-gray-500 text-sm" />
              )}
            </div>
            <span className={`text-sm ${
              feature.available ? "text-gray-300" : "text-gray-500 line-through"
            }`}>
              {feature.text}
            </span>
          </motion.div>
        ))}
      </div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-auto"
      >
        <Button 
          title={popular ? "Get Started" : "Choose Plan"}
          link="/signup"
          className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl ${
            popular
              ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border border-red-400/30"
              : "bg-black/30 backdrop-blur-sm border border-white/20 text-white hover:bg-white/10"
          }`}
        />
      </motion.div>

      {/* Hover Effects */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  );
};

export default PlansCard;