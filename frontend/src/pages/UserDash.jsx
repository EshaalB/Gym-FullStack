import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  FaCalendarAlt, 
  FaClock, 
  FaDumbbell, 
  FaCreditCard, 
  FaChartLine,
  FaSignOutAlt,
  FaUser,
  FaBell,
  FaCog
} from "react-icons/fa";
import AnimatedCounter from "../components/AnimatedCounter";
import ProgressTracker from "../components/ProgressTracker";
import SkeletonLoader from "../components/SkeletonLoader";
import Button from "../components/Button";
import toast from "react-hot-toast";

const UserDash = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    classes: [],
    membershipStatus: "",
    classDays: [],
    workoutPlan: null,
    attendance: [],
    nextPayment: null,
    nextClass: null,
    currentPlan: null,
    paymentHistory: [],
    stats: {
      totalClasses: 0,
      classesAttended: 0,
      attendanceRate: 0,
      activePlans: 0,
      daysUntilPayment: 0,
      daysUntilClass: 0
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }

    // Get user info from token or localStorage
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (userData.userId) {
      setUser(userData);
    } else {
      // Fetch user data from backend
      fetchUserData();
    }
  }, [navigate]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('http://localhost:3500/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const userData = response.data;
      setUser(userData);
      localStorage.setItem('userData', JSON.stringify(userData));
    } catch (error) {
      console.error('Error fetching user data:', error);
      navigate('/login');
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const headers = { Authorization: `Bearer ${token}` };

      const [
        classesRes,
        membershipRes,
        classDaysRes,
        workoutPlanRes,
        attendanceRes,
        paymentsRes,
        nextClassRes,
        statsRes
      ] = await Promise.all([
        axios.get("http://localhost:3500/api/user-classes", {
          params: { userId: user.userId },
          headers
        }),
        axios.get("http://localhost:3500/api/membership-status", {
          params: { userId: user.userId },
          headers
        }),
        axios.get("http://localhost:3500/api/class-days", {
          params: { userId: user.userId },
          headers
        }),
        axios.get("http://localhost:3500/api/workout-plan", {
          params: { userId: user.userId },
          headers
        }),
        axios.get("http://localhost:3500/api/attendance", {
          params: { userId: user.userId },
          headers
        }),
        axios.get("http://localhost:3500/api/user-payments", {
          params: { userId: user.userId },
          headers
        }),
        axios.get("http://localhost:3500/api/next-class", {
          params: { userId: user.userId },
          headers
        }),
        axios.get("http://localhost:3500/api/user-stats", {
          params: { userId: user.userId },
          headers
        })
      ]);

      const nextPayment = paymentsRes.data?.find(p => p.status === 'Pending') || null;
      const nextClass = nextClassRes.data || null;

      setDashboardData({
        classes: classesRes.data || [],
        membershipStatus: membershipRes.data?.[0]?.status || "Unknown",
        classDays: classDaysRes.data || [],
        workoutPlan: workoutPlanRes.data || null,
        attendance: attendanceRes.data || [],
        nextPayment,
        nextClass,
        currentPlan: membershipRes.data?.[0] || null,
        paymentHistory: paymentsRes.data || [],
        stats: statsRes.data || {
          totalClasses: classesRes.data?.length || 0,
          classesAttended: attendanceRes.data?.reduce((sum, att) => sum + att.presentCount, 0) || 0,
          attendanceRate: 0,
          activePlans: workoutPlanRes.data ? 1 : 0,
          daysUntilPayment: nextPayment ? Math.ceil((new Date(nextPayment.paymentDate) - new Date()) / (1000 * 60 * 60 * 24)) : 0,
          daysUntilClass: nextClass ? Math.ceil((new Date(nextClass.classDate) - new Date()) / (1000 * 60 * 60 * 24)) : 0
        }
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Use mock data for demonstration
      setDashboardData({
        classes: [
          { className: "Strength Training", classTime: "09:00 AM", trainerName: "John Smith", classDate: "2025-01-15" },
          { className: "Cardio Blast", classTime: "06:00 PM", trainerName: "Sarah Johnson", classDate: "2025-01-16" }
        ],
        membershipStatus: "Active",
        classDays: ["Monday", "Wednesday", "Friday"],
        workoutPlan: { planName: "Beginner Strength", durationWeeks: 4, trainerName: "Mike Chen" },
        attendance: [
          { className: "Strength Training", presentCount: 8, absentCount: 2, totalClasses: 10, percent: 80 },
          { className: "Cardio Blast", presentCount: 6, absentCount: 1, totalClasses: 7, percent: 85.7 }
        ],
        nextPayment: { amount: 2000, paymentDate: "2025-01-20", status: "Pending" },
        nextClass: { className: "Strength Training", classTime: "09:00 AM", classDate: "2025-01-15" },
        currentPlan: { membershipType: "Premium", membershipStatus: "Active" },
        paymentHistory: [
          { amount: 2000, paymentDate: "2024-12-20", status: "Completed" },
          { amount: 2000, paymentDate: "2024-11-20", status: "Completed" }
        ],
        stats: {
          totalClasses: 2,
          classesAttended: 14,
          attendanceRate: 82,
          activePlans: 1,
          daysUntilPayment: 5,
          daysUntilClass: 2
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userData');
    toast.success("Logged out successfully!");
    navigate('/login');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <SkeletonLoader variant="card" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SkeletonLoader variant="card" />
            <SkeletonLoader variant="card" />
          </div>
          <SkeletonLoader variant="table" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white">User Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-400">Welcome back</p>
                <p className="text-white font-semibold">{user?.fName} {user?.lName}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                  <FaBell className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                  <FaCog className="w-5 h-5" />
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all duration-300"
                >
                  <FaSignOutAlt className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Welcome Section */}
        <div 
          className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                Welcome back, {user?.fName}! 👋
              </h2>
              <p className="text-gray-400 text-lg">
                Track your progress and manage your fitness journey
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-400">Membership Status</p>
                <p className={`text-lg font-semibold ${
                  dashboardData.membershipStatus === "Active" 
                    ? "text-green-400" 
                    : "text-red-400"
                }`}>
                  {dashboardData.membershipStatus}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Plan Type</p>
                <p className="text-lg font-semibold text-red-400">
                  {dashboardData.currentPlan?.membershipType || "Basic"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaDumbbell className="text-white text-xl" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Enrolled Classes</h3>
            <p className="text-2xl font-bold text-red-400">
              <AnimatedCounter value={dashboardData.stats.totalClasses} />
            </p>
          </div>

          <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaChartLine className="text-white text-xl" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Classes Attended</h3>
            <p className="text-2xl font-bold text-green-400">
              <AnimatedCounter value={dashboardData.stats.classesAttended} />
            </p>
          </div>

          <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUser className="text-white text-xl" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Attendance Rate</h3>
            <p className="text-2xl font-bold text-purple-400">
              <AnimatedCounter value={dashboardData.stats.attendanceRate} suffix="%" />
            </p>
          </div>

          <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaDumbbell className="text-white text-xl" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Active Plans</h3>
            <p className="text-2xl font-bold text-indigo-400">
              <AnimatedCounter value={dashboardData.stats.activePlans} />
            </p>
          </div>
        </div>

        {/* Next Class and Payment */}
        <div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Next Class */}
          <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FaCalendarAlt className="text-red-400" />
              Next Class
            </h3>
            {dashboardData.nextClass ? (
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/30">
                <h4 className="text-lg font-semibold text-white mb-2">
                  {dashboardData.nextClass.className}
                </h4>
                <div className="space-y-2 text-gray-300">
                  <p className="flex items-center gap-2">
                    <FaClock className="text-red-400" />
                    {formatTime(dashboardData.nextClass.classTime)}
                  </p>
                  <p className="flex items-center gap-2">
                    <FaCalendarAlt className="text-red-400" />
                    {formatDate(dashboardData.nextClass.classDate)}
                  </p>
                  <p className="text-sm text-gray-400">
                    {dashboardData.stats.daysUntilClass} days from now
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/30 text-center">
                <p className="text-gray-400">No upcoming classes</p>
                <button className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all duration-300">
                  Book a Class
                </button>
              </div>
            )}
          </div>

          {/* Next Payment */}
          <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FaCreditCard className="text-green-400" />
              Next Payment
            </h3>
            {dashboardData.nextPayment ? (
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/30">
                <h4 className="text-lg font-semibold text-white mb-2">
                  Payment Due
                </h4>
                <div className="space-y-2 text-gray-300">
                  <p className="flex items-center gap-2">
                    <FaCreditCard className="text-green-400" />
                    ${dashboardData.nextPayment.amount}
                  </p>
                  <p className="flex items-center gap-2">
                    <FaCalendarAlt className="text-green-400" />
                    {formatDate(dashboardData.nextPayment.paymentDate)}
                  </p>
                  <p className="text-sm text-gray-400">
                    {dashboardData.stats.daysUntilPayment} days remaining
                  </p>
                </div>
                <button className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all duration-300">
                  Pay Now
                </button>
              </div>
            ) : (
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/30 text-center">
                <p className="text-gray-400">No pending payments</p>
                <p className="text-sm text-green-400 mt-1">All payments up to date!</p>
              </div>
            )}
          </div>
        </div>

        {/* Classes and Workout Plan */}
        <div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Enrolled Classes */}
          <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FaDumbbell className="text-red-400" />
              Your Classes
            </h3>
            <div className="space-y-4">
              {dashboardData.classes.map((classItem, index) => (
                <div key={index} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-white">{classItem.className}</h4>
                      <p className="text-gray-400">Trainer: {classItem.trainerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-red-400 font-semibold">{classItem.classTime}</p>
                      <p className="text-gray-400 text-sm">Daily</p>
                    </div>
                  </div>
                </div>
              ))}
              {dashboardData.classes.length === 0 && (
                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/30 text-center">
                  <p className="text-gray-400">No enrolled classes</p>
                  <button className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all duration-300">
                    Enroll in a Class
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Workout Plan */}
          <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FaDumbbell className="text-purple-400" />
              Current Workout Plan
            </h3>
            {dashboardData.workoutPlan ? (
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/30">
                <h4 className="text-lg font-semibold text-white mb-2">{dashboardData.workoutPlan.planName}</h4>
                <div className="space-y-2 text-gray-300">
                  <p>Duration: {dashboardData.workoutPlan.durationWeeks} weeks</p>
                  <p>Trainer: {dashboardData.workoutPlan.trainerName}</p>
                  <p>Status: <span className="text-green-400">Active</span></p>
                </div>
                <button className="mt-3 w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-300">
                  View Details
                </button>
              </div>
            ) : (
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/30 text-center">
                <p className="text-gray-400">No active workout plan</p>
                <button className="mt-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-300">
                  Get a Plan
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Attendance Table */}
        <div 
          className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
        >
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <FaChartLine className="text-green-400" />
            Attendance Overview
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-700/50">
                  <th className="p-3 text-gray-400 font-medium">Class Name</th>
                  <th className="p-3 text-gray-400 font-medium">Present</th>
                  <th className="p-3 text-gray-400 font-medium">Absent</th>
                  <th className="p-3 text-gray-400 font-medium">Total Classes</th>
                  <th className="p-3 text-gray-400 font-medium">Attendance %</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.attendance.map((att, index) => (
                  <tr key={index} className="border-b border-gray-700/30 hover:bg-gray-800/30 transition-colors duration-200">
                    <td className="p-3 text-white font-medium">{att.className}</td>
                    <td className="p-3">
                      <AnimatedCounter value={att.presentCount} delay={index * 0.1} />
                    </td>
                    <td className="p-3">
                      <AnimatedCounter value={att.absentCount} delay={index * 0.1 + 0.1} />
                    </td>
                    <td className="p-3">
                      <AnimatedCounter value={att.totalClasses} delay={index * 0.1 + 0.2} />
                    </td>
                    <td className="p-3">
                      <AnimatedCounter value={Math.round(att.percent)} suffix="%" delay={index * 0.1 + 0.3} formatNumber={false} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDash;