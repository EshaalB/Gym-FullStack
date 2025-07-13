import React, { useEffect, useState } from "react";
import {
  FaUsers,
  FaGraduationCap,
  FaDollarSign,
  FaUserCheck,
  FaChartLine,
  FaChartBar,
  FaChartPie,
} from "react-icons/fa";

const DashboardOverview = ({ stats }) => {
  const [isLoading, setIsLoading] = useState(true);

  // Force remount when stats change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [stats]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-200">Total Users</p>
                <p className="text-3xl font-bold">{stats.totalUsers || 0}</p>
              </div>
              <FaUsers className="text-4xl text-red-300" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-red-700 to-red-900 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-200">Total Trainers</p>
                <p className="text-3xl font-bold">{stats.totalTrainers || 0}</p>
              </div>
              <FaGraduationCap className="text-4xl text-red-300" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-red-800 to-black rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-200">Total Revenue</p>
                <p className="text-3xl font-bold">${(stats.totalRevenue || 0).toLocaleString()}</p>
              </div>
              <FaDollarSign className="text-4xl text-red-300" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-black to-red-900 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-200">Active Memberships</p>
                <p className="text-3xl font-bold">{stats.activeMemberships || 0}</p>
              </div>
              <FaUserCheck className="text-4xl text-red-300" />
            </div>
          </div>
        </div>

        {/* Loading Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-black/50 backdrop-blur-lg rounded-xl p-6 border border-red-500/20">
            <h3 className="text-xl font-semibold text-white mb-4">User Growth</h3>
            <div className="h-64 flex items-center justify-center text-white">Loading chart...</div>
          </div>
          
          <div className="bg-black/50 backdrop-blur-lg rounded-xl p-6 border border-red-500/20">
            <h3 className="text-xl font-semibold text-white mb-4">Revenue Trend</h3>
            <div className="h-64 flex items-center justify-center text-white">Loading chart...</div>
          </div>
        </div>

        <div className="bg-black/50 backdrop-blur-lg rounded-xl p-6 border border-red-500/20">
          <h3 className="text-xl font-semibold text-white mb-4">Plan Distribution</h3>
          <div className="w-full max-w-md mx-auto h-64 flex items-center justify-center text-white">Loading chart...</div>
        </div>
      </div>
    );
  }

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
              <p className="text-red-200">Total Users</p>
              <p className="text-3xl font-bold">{stats.totalUsers || 0}</p>
            </div>
            <FaUsers className="text-4xl text-red-300" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-red-700 to-red-900 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-200">Total Trainers</p>
              <p className="text-3xl font-bold">{stats.totalTrainers || 0}</p>
            </div>
            <FaGraduationCap className="text-4xl text-red-300" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-red-800 to-black rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-200">Total Revenue</p>
              <p className="text-3xl font-bold">${(stats.totalRevenue || 0).toLocaleString()}</p>
            </div>
            <FaDollarSign className="text-4xl text-red-300" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-black to-red-900 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-200">Active Memberships</p>
              <p className="text-3xl font-bold">{stats.activeMemberships || 0}</p>
            </div>
            <FaUserCheck className="text-4xl text-red-300" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-black/50 backdrop-blur-lg rounded-xl p-6 border border-red-500/20">
          <div className="flex items-center space-x-2 mb-4">
            <FaChartLine className="text-red-400 text-xl" />
            <h3 className="text-xl font-semibold text-white">User Growth</h3>
          </div>
          <SimpleBarChart 
            data={[12, 19, 25, 32, 38, 45]}
            labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]}
            title="Monthly User Growth"
            color="red"
          />
        </div>
        
        <div className="bg-black/50 backdrop-blur-lg rounded-xl p-6 border border-red-500/20">
          <div className="flex items-center space-x-2 mb-4">
            <FaChartBar className="text-red-400 text-xl" />
            <h3 className="text-xl font-semibold text-white">Revenue Trend</h3>
          </div>
          <SimpleBarChart 
            data={[15, 22, 28, 35, 42, 48]}
            labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]}
            title="Monthly Revenue (K)"
            color="red"
          />
        </div>
      </div>

      <div className="bg-black/50 backdrop-blur-lg rounded-xl p-6 border border-red-500/20">
        <div className="flex items-center space-x-2 mb-4">
          <FaChartPie className="text-red-400 text-xl" />
          <h3 className="text-xl font-semibold text-white">Plan Distribution</h3>
        </div>
        <div className="w-full max-w-md mx-auto">
          <SimplePieChart 
            data={[30, 25, 20, 25]}
            labels={["Basic", "Premium", "VIP", "Temporary"]}
            title="Membership Plan Distribution"
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview; 