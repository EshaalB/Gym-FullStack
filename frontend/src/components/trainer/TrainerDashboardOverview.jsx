import React from "react";
import {
  FaUsers,
  FaDumbbell,
  FaClipboardList,
  FaCalendarCheck,
  FaChartLine,
  FaChartBar,
  FaChartPie,
} from "react-icons/fa";
import SkeletonLoader from "../SkeletonLoader";

const TrainerDashboardOverview = ({ stats, loading, error }) => {
  if (loading) return <SkeletonLoader variant="dashboard" />;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  // Use default values to avoid undefined errors
  const {
    totalClasses = 0,
    totalMembers = 0,
    totalPlans = 0,
    todayAttendance = 0
  } = stats || {};

  // Simple bar chart component
  const SimpleBarChart = ({ data, labels, title, color = "red" }) => (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-white">{title}</h4>
      <div className="space-y-2">
        {data.map((value, index) => (
          <div key={index} className="flex items-center space-x-3">
            <span className="text-white text-sm w-16">{labels[index]}</span>
            <div className="flex-1 bg-gray-700 rounded-full h-4">
              <div 
                className={`bg-${color}-500 h-4 rounded-full transition-all duration-500`}
                style={{ width: `${(value / Math.max(...data)) * 100}%` }}
              />
            </div>
            <span className="text-white text-sm w-12">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // Simple pie chart component
  const SimplePieChart = ({ data, labels, title }) => (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-white">{title}</h4>
      <div className="grid grid-cols-2 gap-4">
        {data.map((value, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className="w-4 h-4 rounded-full"
              style={{ 
                backgroundColor: [
                  'rgb(239, 68, 68)',
                  'rgb(220, 38, 38)', 
                  'rgb(185, 28, 28)',
                  'rgb(153, 27, 27)'
                ][index] 
              }}
            />
            <span className="text-white text-sm">{labels[index]}</span>
            <span className="text-white text-sm font-semibold">{value}%</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-200">My Classes</p>
              <p className="text-3xl font-bold">{totalClasses}</p>
            </div>
            <FaDumbbell className="text-4xl text-red-300" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-red-700 to-red-900 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-200">Total Members</p>
              <p className="text-3xl font-bold">{totalMembers}</p>
            </div>
            <FaUsers className="text-4xl text-red-300" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-red-800 to-black rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-200">Workout Plans</p>
              <p className="text-3xl font-bold">{totalPlans}</p>
            </div>
            <FaClipboardList className="text-4xl text-red-300" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-black to-red-900 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-200">Today's Attendance</p>
              <p className="text-3xl font-bold">{todayAttendance}</p>
            </div>
            <FaCalendarCheck className="text-4xl text-red-300" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-black/50 backdrop-blur-lg rounded-xl p-6 border border-red-500/20">
          <h3 className="text-xl font-semibold text-white mb-4">Weekly Attendance</h3>
          <SimpleBarChart 
            data={[15, 12, 18, 14, 16, 10, 8]}
            labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
            title="This Week's Attendance"
          />
        </div>
        
        <div className="bg-black/50 backdrop-blur-lg rounded-xl p-6 border border-red-500/20">
          <h3 className="text-xl font-semibold text-white mb-4">Class Distribution</h3>
          <SimplePieChart 
            data={[40, 30, 20, 10]}
            labels={['Yoga', 'Strength', 'Cardio', 'Flexibility']}
            title="Class Types"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-black/50 backdrop-blur-lg rounded-xl p-6 border border-red-500/20">
        <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-red-500/10 rounded-lg">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-white">New member enrolled in Yoga class</span>
            <span className="text-gray-400 text-sm ml-auto">2 hours ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-red-500/10 rounded-lg">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span className="text-white">Workout plan assigned to John Doe</span>
            <span className="text-gray-400 text-sm ml-auto">4 hours ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-red-500/10 rounded-lg">
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <span className="text-white">Attendance marked for Strength class</span>
            <span className="text-gray-400 text-sm ml-auto">6 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboardOverview; 