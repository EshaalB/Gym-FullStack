import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaTrophy, FaFire, FaHeart, FaDumbbell, FaCalendar, FaBullseye } from "react-icons/fa";

const ProgressTracker = ({ userData }) => {
  const [activeTab, setActiveTab] = useState("goals");

  const goals = [
    {
      id: 1,
      title: "Weight Loss",
      target: 80,
      current: 75,
      unit: "kg",
      icon: FaFire,
      color: "from-red-500 to-red-600"
    },
    {
      id: 2,
      title: "Muscle Gain",
      target: 70,
      current: 68,
      unit: "kg",
      icon: FaDumbbell,
      color: "from-blue-500 to-blue-600"
    },
    {
      id: 3,
      title: "Cardio Endurance",
      target: 30,
      current: 25,
      unit: "min",
      icon: FaHeart,
      color: "from-green-500 to-green-600"
    }
  ];

  const achievements = [
    {
      id: 1,
      title: "First Week Complete",
      description: "Completed 7 days of workouts",
      icon: FaTrophy,
      achieved: true,
      date: "2024-01-15"
    },
    {
      id: 2,
      title: "Weight Goal Reached",
      description: "Lost 5kg in 2 months",
      icon: FaBullseye,
      achieved: true,
      date: "2024-02-01"
    },
    {
      id: 3,
      title: "100 Workouts",
      description: "Completed 100 workout sessions",
      icon: FaDumbbell,
      achieved: false,
      progress: 75
    }
  ];

  const weeklyStats = [
    { day: "Mon", workouts: 2, calories: 450 },
    { day: "Tue", workouts: 1, calories: 320 },
    { day: "Wed", workouts: 3, calories: 680 },
    { day: "Thu", workouts: 2, calories: 420 },
    { day: "Fri", workouts: 1, calories: 280 },
    { day: "Sat", workouts: 2, calories: 520 },
    { day: "Sun", workouts: 0, calories: 0 }
  ];

  const calculateProgress = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return "from-green-500 to-green-600";
    if (progress >= 60) return "from-yellow-500 to-yellow-600";
    if (progress >= 40) return "from-orange-500 to-orange-600";
    return "from-red-500 to-red-600";
  };

  return (
    <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Progress Tracker</h2>
        <div className="flex items-center gap-2 bg-gray-800/50 rounded-lg p-1">
          {["goals", "achievements", "stats"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                activeTab === tab
                  ? "bg-red-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === "goals" && (
          <div className="space-y-4">
            {goals.map((goal) => {
              const progress = calculateProgress(goal.current, goal.target);
              const IconComponent = goal.icon;
              
              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/30"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 bg-gradient-to-r ${goal.color} rounded-full flex items-center justify-center`}>
                        <IconComponent className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{goal.title}</h3>
                        <p className="text-gray-400 text-sm">
                          {goal.current} / {goal.target} {goal.unit}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-white">{Math.round(progress)}%</span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${getProgressColor(progress)} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {activeTab === "achievements" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => {
              const IconComponent = achievement.icon;
              
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-4 rounded-xl border transition-all duration-300 ${
                    achievement.achieved
                      ? "bg-green-500/10 border-green-500/30"
                      : "bg-gray-800/50 border-gray-700/30"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      achievement.achieved
                        ? "bg-green-500"
                        : "bg-gray-600"
                    }`}>
                      <IconComponent className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{achievement.title}</h3>
                      <p className="text-gray-400 text-sm">{achievement.description}</p>
                    </div>
                  </div>
                  
                  {achievement.achieved ? (
                    <div className="text-green-400 text-sm">
                      Achieved on {new Date(achievement.date).toLocaleDateString()}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>Progress</span>
                        <span>{achievement.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-700/50 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full"
                          style={{ width: `${achievement.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {activeTab === "stats" && (
          <div className="space-y-6">
            {/* Weekly Overview */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FaCalendar className="text-red-400" />
                This Week's Activity
              </h3>
              <div className="grid grid-cols-7 gap-2">
                {weeklyStats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-sm text-gray-400 mb-1">{stat.day}</div>
                    <div className="bg-gray-800/50 rounded-lg p-2">
                      <div className="text-white font-semibold">{stat.workouts}</div>
                      <div className="text-xs text-gray-400">{stat.calories} cal</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/30">
                <div className="flex items-center gap-3 mb-2">
                  <FaFire className="text-red-400 text-xl" />
                  <span className="text-white font-semibold">Total Calories</span>
                </div>
                <div className="text-2xl font-bold text-white">2,670</div>
                <div className="text-green-400 text-sm">+15% from last week</div>
              </div>
              
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/30">
                <div className="flex items-center gap-3 mb-2">
                  <FaDumbbell className="text-blue-400 text-xl" />
                  <span className="text-white font-semibold">Workouts</span>
                </div>
                <div className="text-2xl font-bold text-white">11</div>
                <div className="text-green-400 text-sm">+2 from last week</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressTracker; 