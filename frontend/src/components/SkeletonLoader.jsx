import React from "react";
import { motion } from "framer-motion";

const SkeletonLoader = ({ 
  variant = "card", 
  className = "", 
  lines = 3, 
  height = "h-4",
  width = "w-full" 
}) => {
  const shimmerVariants = {
    shimmer: {
      x: ["-100%", "100%"],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const renderSkeleton = () => {
    switch (variant) {
      case "card":
        return (
          <div className={`bg-gray-800/50 rounded-xl p-6 border border-gray-700/30 ${className}`}>
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gray-700/50 rounded-full animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-700/50 rounded animate-pulse w-3/4"></div>
                <div className="h-3 bg-gray-700/50 rounded animate-pulse w-1/2"></div>
              </div>
            </div>
            <div className="space-y-2">
              {[...Array(lines)].map((_, i) => (
                <div 
                  key={i} 
                  className={`${height} bg-gray-700/50 rounded animate-pulse ${width}`}
                ></div>
              ))}
            </div>
          </div>
        );

      case "text":
        return (
          <div className={`space-y-2 ${className}`}>
            {[...Array(lines)].map((_, i) => (
              <div 
                key={i} 
                className={`${height} bg-gray-700/50 rounded animate-pulse ${
                  i === lines - 1 ? "w-3/4" : "w-full"
                }`}
              ></div>
            ))}
          </div>
        );

      case "image":
        return (
          <div className={`bg-gray-700/50 rounded-xl animate-pulse ${className}`}>
            <div className="w-full h-48 bg-gray-700/50 rounded-xl"></div>
          </div>
        );

      case "avatar":
        return (
          <div className={`w-12 h-12 bg-gray-700/50 rounded-full animate-pulse ${className}`}></div>
        );

      case "button":
        return (
          <div className={`h-12 bg-gray-700/50 rounded-xl animate-pulse ${className}`}></div>
        );

      case "table":
        return (
          <div className={`bg-gray-800/50 rounded-xl p-4 border border-gray-700/30 ${className}`}>
            <div className="space-y-3">
              {[...Array(lines)].map((_, i) => (
                <div key={i} className="flex space-x-4">
                  <div className="h-4 bg-gray-700/50 rounded animate-pulse w-1/4"></div>
                  <div className="h-4 bg-gray-700/50 rounded animate-pulse w-1/4"></div>
                  <div className="h-4 bg-gray-700/50 rounded animate-pulse w-1/4"></div>
                  <div className="h-4 bg-gray-700/50 rounded animate-pulse w-1/4"></div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className={`${height} bg-gray-700/50 rounded animate-pulse ${width} ${className}`}></div>
        );
    }
  };

  return (
    <div className="relative overflow-hidden">
      {renderSkeleton()}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        variants={shimmerVariants}
        animate="shimmer"
      />
    </div>
  );
};

export default SkeletonLoader; 