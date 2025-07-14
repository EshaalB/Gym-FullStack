import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from "react-icons/fa";

const Toast = ({ message, type = "info", isVisible, onClose }) => {
  const toastVariants = {
    hidden: { opacity: 0, x: 300, scale: 0.8 },
    visible: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: 300, scale: 0.8 }
  };

  const getToastStyles = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-500/20",
          border: "border-green-400/30",
          icon: FaCheckCircle,
          iconColor: "text-green-400",
          textColor: "text-green-300"
        };
      case "error":
        return {
          bg: "bg-red-500/20",
          border: "border-red-400/30",
          icon: FaExclamationTriangle,
          iconColor: "text-red-400",
          textColor: "text-red-300"
        };
      case "warning":
        return {
          bg: "bg-yellow-500/20",
          border: "border-yellow-400/30",
          icon: FaExclamationTriangle,
          iconColor: "text-yellow-400",
          textColor: "text-yellow-300"
        };
      default:
        return {
          bg: "bg-blue-500/20",
          border: "border-blue-400/30",
          icon: FaInfoCircle,
          iconColor: "text-blue-400",
          textColor: "text-blue-300"
        };
    }
  };

  const styles = getToastStyles();
  const IconComponent = styles.icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-20 right-5 z-50"
          variants={toastVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className={`${styles.bg} ${styles.border} backdrop-blur-xl rounded-xl p-4 shadow-2xl border min-w-80`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <IconComponent className={`text-xl ${styles.iconColor}`} />
                <span className={`${styles.textColor} font-medium`}>{message}</span>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <FaTimes className="text-sm" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast; 