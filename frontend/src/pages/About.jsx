import React, { useState, useEffect } from "react";
import { FaDumbbell, FaHeart, FaUsers, FaTrophy, FaClock, FaStar, FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebook, FaInstagram, FaTwitter, FaQuoteLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa";
  import AnimatedCounter from "../components/common/AnimatedCounter";
import Button from "../components/common/Button";
import aboutImg from "../assets/img/about.png";
import img1 from "../assets/img/img1.jpg";
import img2 from "../assets/img/img2.jpg";
import img3 from "../assets/img/img3.jpg";

const About = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: "Ahmed Khan",
      role: "Weight Loss Success",
      rating: 5,
      text: "Lost 45 pounds in 8 months! The trainers here are incredible. They pushed me beyond my limits and helped me discover strength I never knew I had. This isn't just a gym - it's a transformation center."
    },
    {
      id: 2,
      name: "Fatima Ali",
      role: "Fitness Enthusiast",
      rating: 5,
      text: "The community here is amazing! Everyone is so supportive and motivating. I've made incredible friends and achieved fitness goals I never thought possible. This gym changed my life completely."
    },
    {
      id: 3,
      name: "Usman Malik",
      role: "Bodybuilding Champion",
      rating: 5,
      text: "Won my first bodybuilding competition thanks to the expert guidance here. The equipment is top-notch and the trainers know exactly how to push you to your maximum potential. Pure excellence!"
    },
    {
      id: 4,
      name: "Ayesha Hassan",
      role: "Yoga Instructor",
      rating: 5,
      text: "As a yoga instructor, I appreciate the variety of classes and the peaceful environment. The management truly cares about member experience. This is more than just a gym - it's a wellness sanctuary."
    },
    {
      id: 5,
      name: "Bilal Ahmed",
      role: "CrossFit Athlete",
      rating: 5,
      text: "The CrossFit program here is intense and challenging. I've improved my strength, endurance, and overall fitness dramatically. The trainers are world-class and the facilities are unmatched."
    }
  ];

  // Auto-switch testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000); // Switch every 5 seconds

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToTestimonial = (index) => {
    setCurrentTestimonial(index);
  };

  // Gym facility images
  const facilityImages = [
    {
      id: 1,
      image: aboutImg,
      title: "Weight Training Area",
      description: "State-of-the-art equipment for strength training"
    },
    {
      id: 2,
      image: img1,
      title: "Cardio Zone",
      description: "Latest cardio machines for endurance training"
    },
    {
      id: 3,
      image: img2,
      title: "Group Fitness Studio",
      description: "Spacious studio for classes and group sessions"
    },
    {
      id: 4,
      image: img3,
      title: "Yoga & Pilates Room",
      description: "Peaceful environment for mind-body workouts"
    }
  ];

  return (
    <div className="relative w-screen min-h-screen bg-red-gradient py-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-black via-gray-900 to-black z-0" />
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-red-900/10 via-transparent to-red-900/10 z-0" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(10)].map((_, i) => (
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
            About Our Gym
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
            About <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">Our Gym</span>
          </h1>
          <p className="text-xl text-red-200 max-w-3xl mx-auto">
            We're more than just a gym - we're a community dedicated to transforming lives through fitness, 
            wellness, and unwavering support.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Text Content */}
          <div className="slide-up">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                Your Journey to Fitness Excellence
              </h2>
              
              <div className="space-y-4 text-lg text-red-200 leading-relaxed">
                <p>
                  Your well-being is your greatest wealth. Whether it's achieving optimal health 
                  or enhancing your fitness journey, we're here to support you every step of the way.
                </p>
                
                <p>
                  At our fitness center, our team of certified personal trainers, attentive staff, 
                  and experienced management are dedicated to fostering a nurturing environment where 
                  every member feels valued and motivated.
                </p>
                
                <p>
                  We believe that fitness is not just about physical transformation, but also about 
                  mental strength, emotional well-being, and building lasting relationships within 
                  our community.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-400 mb-2">
                    <AnimatedCounter value={10} suffix="+" delay={0.3} />
                  </div>
                  <div className="text-red-200">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-400 mb-2">
                    <AnimatedCounter value={1000} suffix="+" delay={0.5} />
                  </div>
                  <div className="text-red-200">Happy Members</div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button 
                  title="Join Our Community" 
                  link="/signup"
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg border-2 border-red-400/50 hover:border-red-300"
                />
                <Button 
                  title="View Our Plans" 
                  link="/plans"
                  className="bg-black/30 backdrop-blur-xl border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/30 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300"
                />
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="scale-in">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-800 rounded-2xl transform rotate-3"></div>
              <img 
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop" 
                alt="Gym interior" 
                className="relative rounded-2xl shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500"
              />
            </div>
          </div>
        </div>

        {/* Facility Showcase */}
        <div className="mb-20">
          <div className="text-center mb-16 slide-up">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Our <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">Facilities</span>
            </h2>
            <p className="text-xl text-red-200 max-w-3xl mx-auto">
              Explore our world-class facilities designed to support every aspect of your fitness journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {facilityImages.map((facility, index) => (
              <div
                key={facility.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="relative overflow-hidden rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10">
                  <img 
                    src={facility.image} 
                    alt={facility.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{facility.title}</h3>
                    <p className="text-gray-200">{facility.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <div className="text-center mb-16 slide-up">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Our Core <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">Values</span>
            </h2>
            <p className="text-xl text-red-200 max-w-3xl mx-auto">
              The principles that guide everything we do and every decision we make
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-red-card rounded-xl p-8 text-center hover-lift">
              <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaHeart className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Passion</h3>
              <p className="text-red-200">
                We're passionate about fitness and committed to helping you achieve your goals
              </p>
            </div>

            <div className="bg-red-card rounded-xl p-8 text-center hover-lift">
              <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaUsers className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Community</h3>
              <p className="text-red-200">
                Building a supportive community where everyone feels welcome and motivated
              </p>
            </div>

            <div className="bg-red-card rounded-xl p-8 text-center hover-lift">
              <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaStar className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Excellence</h3>
              <p className="text-red-200">
                Striving for excellence in everything we do, from equipment to service
              </p>
            </div>

            <div className="bg-red-card rounded-xl p-8 text-center hover-lift">
              <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaDumbbell className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Innovation</h3>
              <p className="text-red-200">
                Embracing the latest fitness trends and technology to enhance your experience
              </p>
            </div>

            <div className="bg-red-card rounded-xl p-8 text-center hover-lift">
              <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaClock className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Dedication</h3>
              <p className="text-red-200">
                Dedicated to your success with personalized attention and support
              </p>
            </div>

            <div className="bg-red-card rounded-xl p-8 text-center hover-lift">
              <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaTrophy className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Results</h3>
              <p className="text-red-200">
                Focused on delivering measurable results and celebrating your achievements
              </p>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mb-20">
          <div className="text-center mb-16 slide-up">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Warrior <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">Testimonials</span>
            </h2>
            <p className="text-xl text-red-200 max-w-3xl mx-auto">
              Real warriors who transformed their bodies and conquered their limits
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Testimonial Card */}
            <div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-black/20 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-white/10"
            >
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(testimonials[currentTestimonial].name)}&background=EF4444&color=fff&size=128&bold=true&rounded=true`} 
                    alt={testimonials[currentTestimonial].name}
                    className="w-24 h-24 lg:w-32 lg:h-32 rounded-full object-cover border-4 border-red-500/30 shadow-lg"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 text-center lg:text-left">
                  {/* Quote Icon */}
                  <div className="mb-4">
                    <FaQuoteLeft className="text-red-400/50 text-3xl mx-auto lg:mx-0" />
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-lg lg:text-xl text-gray-300 leading-relaxed mb-6 italic">
                    "{testimonials[currentTestimonial].text}"
                  </p>

                  {/* Rating */}
                  <div className="flex items-center justify-center lg:justify-start gap-1 mb-4">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400 text-lg" />
                    ))}
                  </div>

                  {/* Author Info */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      {testimonials[currentTestimonial].name}
                    </h3>
                    <p className="text-red-300 font-medium">
                      {testimonials[currentTestimonial].role}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevTestimonial}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/40 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-all duration-300 hover:scale-110"
            >
              <FaChevronLeft className="text-lg" />
            </button>

            <button
              onClick={nextTestimonial}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/40 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-all duration-300 hover:scale-110"
            >
              <FaChevronRight className="text-lg" />
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center mt-8 gap-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial 
                      ? 'bg-red-500 scale-125' 
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="bg-red-card rounded-2xl p-12 text-center scale-in">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Our Mission
          </h2>
          <p className="text-xl text-red-200 max-w-4xl mx-auto leading-relaxed">
            To inspire and empower individuals to reach their full potential through fitness, 
            creating a healthier, stronger, and more confident community. We believe that 
            everyone deserves access to world-class fitness facilities and expert guidance 
            to achieve their health and wellness goals.
          </p>
        </div>

       
      </div>
    </div>
  );
};

export default About;