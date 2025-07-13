import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Button from "../components/Button";
import { FaDumbbell, FaHeart, FaUsers, FaTrophy, FaPlay, FaFire, FaBolt, FaShieldAlt } from "react-icons/fa";
import heroImage from "../assets/img/hero.jpg";
import AnimatedCounter from "../components/AnimatedCounter";
import ClassBookingModal from "../components/ClassBookingModal";

const Home = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const iconVariants = {
    hover: {
      scale: 1.2,
      rotate: 360,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Hero Background Image with Enhanced Parallax */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${heroImage})`,
          transform: `translateY(${scrollY * 0.6}px) scale(${1 + scrollY * 0.0001})`
        }}
      />
      
      {/* Multiple Overlay Layers for Enhanced Depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 via-transparent to-red-900/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      
      {/* Enhanced Animated Particles Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-red-500/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Floating Energy Orbs */}
      <motion.div
        className="absolute top-20 left-10 w-20 h-20 bg-red-500/20 rounded-full blur-xl"
        animate={{
          y: [-20, 20, -20],
          x: [-10, 10, -10],
          scale: [0.8, 1.2, 0.8],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute top-40 right-20 w-16 h-16 bg-orange-500/20 rounded-full blur-xl"
        animate={{
          y: [20, -20, 20],
          x: [10, -10, 10],
          scale: [1.2, 0.8, 1.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />

      {/* Hero Section */}
      <div className="relative min-h-screen flex flex-col lg:flex-row items-center justify-between px-5 lg:px-32 py-20">
        {/* Left Content */}
        <motion.div 
          className="relative z-10 flex flex-col justify-center lg:w-1/2 text-center lg:text-left mb-10 lg:mb-0"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-block bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <motion.span
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="inline-block mr-2"
              >
                🏆
              </motion.span>
              #1 Gym in Lahore
            </span>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-6xl lg:text-8xl font-black text-white mb-6 leading-tight tracking-tight"
          >
            BUILD YOUR
            <span className="block bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent">
              LEGACY
            </span>
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-xl lg:text-2xl text-gray-300 mb-8 leading-relaxed font-medium"
          >
            Forge your body into a weapon. Transform weakness into strength with our 
            battle-tested facilities and warrior trainers. Your transformation starts NOW.
          </motion.p>
          
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                title="Start Your Journey" 
                link="/signup"
                className="group bg-red-500/20 backdrop-blur-xl border border-red-400/30 text-white hover:bg-red-500/30 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              />
            </motion.div>
            <motion.button 
              onClick={() => setIsBookingModalOpen(true)}
              className="group bg-black/40 backdrop-blur-xl border border-white/20 text-white hover:bg-white/10 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                variants={iconVariants}
                whileHover="hover"
              >
                <FaPlay className="text-sm" />
              </motion.div>
              Book a Class
            </motion.button>
          </motion.div>

          {/* Trust Indicators with Enhanced Animations */}
          <motion.div 
            variants={itemVariants}
            className="flex items-center justify-center lg:justify-start gap-6 mt-8 text-gray-400"
          >
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div 
                className="w-8 h-8 bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-full flex items-center justify-center"
                variants={pulseVariants}
                animate="animate"
              >
                <FaHeart className="text-green-400 text-sm" />
              </motion.div>
              <span className="text-sm">
                <AnimatedCounter value={1000} suffix="+" delay={0.5} /> Happy Members
              </span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div 
                className="w-8 h-8 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-full flex items-center justify-center"
                variants={pulseVariants}
                animate="animate"
                transition={{ delay: 0.5 }}
              >
                <FaTrophy className="text-blue-400 text-sm" />
              </motion.div>
              <span className="text-sm">
                <AnimatedCounter value={10} suffix="+" delay={0.7} /> Years Experience
              </span>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right Content - Enhanced Floating Stats Cards */}
        <motion.div 
          className="relative z-10 lg:w-1/2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid grid-cols-2 gap-6 max-w-md mx-auto lg:max-w-none">
            <motion.div 
              variants={floatingVariants}
              animate="animate"
              className="bg-black/20 backdrop-blur-xl rounded-2xl p-6 text-center border border-white/10 hover:scale-105 transition-transform duration-300 group"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(220, 38, 38, 0.2)"
              }}
            >
              <motion.div 
                className="w-16 h-16 bg-black/30 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
                variants={iconVariants}
                whileHover="hover"
              >
                <FaDumbbell className="text-2xl text-white" />
              </motion.div>
              <h3 className="text-3xl font-bold text-white mb-2">
                <AnimatedCounter value={500} suffix="+" delay={0.2} />
              </h3>
              <p className="text-gray-300">Equipment Pieces</p>
            </motion.div>
            
            <motion.div 
              variants={floatingVariants}
              animate="animate"
              transition={{ delay: 0.5 }}
              className="bg-black/20 backdrop-blur-xl rounded-2xl p-6 text-center border border-white/10 hover:scale-105 transition-transform duration-300 group"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(220, 38, 38, 0.2)"
              }}
            >
              <motion.div 
                className="w-16 h-16 bg-black/30 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
                variants={iconVariants}
                whileHover="hover"
              >
                <FaFire className="text-2xl text-white" />
              </motion.div>
              <h3 className="text-3xl font-bold text-white mb-2">
                <AnimatedCounter value={1000} suffix="+" delay={0.7} />
              </h3>
              <p className="text-gray-300">Happy Members</p>
            </motion.div>
            
            <motion.div 
              variants={floatingVariants}
              animate="animate"
              transition={{ delay: 1 }}
              className="bg-black/20 backdrop-blur-xl rounded-2xl p-6 text-center border border-white/10 hover:scale-105 transition-transform duration-300 group"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(220, 38, 38, 0.2)"
              }}
            >
              <motion.div 
                className="w-16 h-16 bg-black/30 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
                variants={iconVariants}
                whileHover="hover"
              >
                <FaBolt className="text-2xl text-white" />
              </motion.div>
              <h3 className="text-3xl font-bold text-white mb-2">
                <AnimatedCounter value={50} suffix="+" delay={1.2} />
              </h3>
              <p className="text-gray-300">Expert Trainers</p>
            </motion.div>
            
            <motion.div 
              variants={floatingVariants}
              animate="animate"
              transition={{ delay: 1.5 }}
              className="bg-black/20 backdrop-blur-xl rounded-2xl p-6 text-center border border-white/10 hover:scale-105 transition-transform duration-300 group"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(220, 38, 38, 0.2)"
              }}
            >
              <motion.div 
                className="w-16 h-16 bg-black/30 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
                variants={iconVariants}
                whileHover="hover"
              >
                <FaShieldAlt className="text-2xl text-white" />
              </motion.div>
              <h3 className="text-3xl font-bold text-white mb-2">
                <AnimatedCounter value={10} suffix="+" delay={1.7} />
              </h3>
              <p className="text-gray-300">Years Experience</p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Class Booking Modal */}
      <ClassBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        classData={{
          name: "Strength Training",
          trainer: "John Smith",
          duration: "60 min",
          capacity: "20"
        }}
      />
    </div>
  );
};

export default Home;