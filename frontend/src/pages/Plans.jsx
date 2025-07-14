import React, { useState } from "react";
import { FaCheck,   FaCrown,  FaDumbbell, FaShower, FaMobile, FaParking, FaWifi, FaLock, FaClipboardCheck, FaUsers } from "react-icons/fa";
import Button from "../components/common/Button"; 

const Plans = () => {
  const [billingCycle, setBillingCycle] = useState("monthly");

  const plans = [
    {
      id: 1,
      name: "Basic",
      price: billingCycle === "monthly" ? 29 : 290,
      originalPrice: billingCycle === "monthly" ? 39 : 390,
      description: "Perfect for beginners starting their fitness journey",
      features: [
        "Access to gym facilities",
        "Basic equipment usage",
        "Locker room access",
        "Free parking",
        "WiFi access"
      ],
      popular: false,
      savings: billingCycle === "monthly" ? 10 : 100
    },
    {
      id: 2,
      name: "Premium",
      price: billingCycle === "monthly" ? 59 : 590,
      originalPrice: billingCycle === "monthly" ? 79 : 790,
      description: "Most popular choice for serious fitness enthusiasts",
      features: [
        "Everything in Basic",
        "Group fitness classes",
        "Personal training sessions (2/month)",
        "Towel service",
        "Guest passes (2/month)",
        "Nutrition consultation",
        "Fitness assessment",
        "Priority booking"
      ],
      popular: true,
      savings: billingCycle === "monthly" ? 20 : 200
    },
    {
      id: 3,
      name: "Elite",
      price: billingCycle === "monthly" ? 99 : 990,
      originalPrice: billingCycle === "monthly" ? 129 : 1290,
      description: "Ultimate fitness experience with premium amenities",
      features: [
        "Everything in Premium",
        "Unlimited personal training",
        "Spa & sauna access",
        "Guest passes (5/month)",
        "Nutrition meal plans",
        "Recovery sessions",
        "Exclusive classes",
        "24/7 access",
        "Priority support"
      ],
      popular: false,
      savings: billingCycle === "monthly" ? 30 : 300
    }
  ];

  const benefits = [
    { icon: FaDumbbell, text: "State-of-the-art equipment" },
    { icon: FaShower, text: "Clean locker rooms & showers" },
    { icon: FaMobile, text: "Mobile app access" },
    { icon: FaParking, text: "Free parking available" },
    { icon: FaWifi, text: "High-speed WiFi" },
    { icon: FaLock, text: "Secure 24/7 access" },
    { icon: FaClipboardCheck, text: "Fitness assessments" },
    { icon: FaUsers, text: "Expert trainers" }
  ];

  return (
    <div className="min-h-screen bg-red-gradient py-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
      <div className="absolute inset-0 bg-gradient-to-r from-red-900/10 via-transparent to-red-900/10" />
      
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
            Membership Plans
          </div>
          <h1 className="text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">
            CHOOSE YOUR <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">BATTLE PLAN</span>
          </h1>
          <p className="text-xl text-red-200 max-w-3xl mx-auto font-medium">
            Select the perfect warrior membership that fits your battle goals. 
            All plans include access to our battle-tested facilities and elite support.
          </p>
        </div>

        {/* Billing Toggle */}
        <div 
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="bg-black/20 backdrop-blur-xl rounded-2xl p-2 border border-white/10">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  billingCycle === "monthly"
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 relative ${
                  billingCycle === "yearly"
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Yearly
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className={`relative bg-black/20 backdrop-blur-xl rounded-2xl p-8 border transition-all duration-300 hover:scale-105 ${
                plan.popular
                  ? "border-red-400/30 bg-red-500/5"
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                    <FaCrown className="text-yellow-400" />
                    Most Popular
                  </div>
                </div>
              )}

              {plan.savings > 0 && (
                <div className="absolute -top-2 -right-2">
                  <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Save ${plan.savings}
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 mb-6">{plan.description}</p>
                
                <div className="mb-4">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-4xl font-bold text-white">${plan.price}</span>
                    {plan.originalPrice > plan.price && (
                      <span className="text-gray-400 line-through">${plan.originalPrice}</span>
                    )}
                  </div>
                  <span className="text-gray-400">
                    per {billingCycle === "monthly" ? "month" : "year"}
                  </span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-full flex items-center justify-center flex-shrink-0">
                      <FaCheck className="text-green-400 text-xs" />
                    </div>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                title={plan.popular ? "Get Started" : "Choose Plan"}
                link="/signup"
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                  plan.popular
                    ? "bg-red-500/20 backdrop-blur-xl border border-red-400/30 text-white hover:bg-red-500/30 shadow-lg"
                    : "bg-black/30 backdrop-blur-xl border border-white/20 text-white hover:bg-white/10"
                }`}
              />
            </div>
          ))}
        </div>

        {/* All Plans Include Section */}
        <div 
          className="bg-black/20 backdrop-blur-xl rounded-2xl p-12 border border-white/10 mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              All Plans Include
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Every membership comes with these essential features to support your fitness journey
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="text-center group"
              >
                <div className="w-16 h-16 bg-black/30 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <benefit.icon className="text-2xl text-red-400" />
                </div>
                <p className="text-gray-300 font-medium">{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>

       
      </div>
    </div>
  );
};

export default Plans;