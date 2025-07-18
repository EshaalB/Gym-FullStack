import React from "react";
import {
  FaUsers,
  FaGraduationCap,
  FaDollarSign,
  FaUserCheck,
  FaChartLine,
  FaChartBar,
  FaChartPie,
} from "react-icons/fa";

const DashboardOverview = ({ analytics, loading, error }) => {
  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
        <div className="text-white">Loading analytics...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
        <div className="text-red-400">{error}</div>
      </div>
    );
  }
  if (!analytics) {
    return null;
  }

  // Extract analytics data
  const userStats = analytics.userStats || {};
  const userGrowth = analytics.userGrowth || [];
  const revenueTrend = analytics.revenueTrend || [];
  const planDistribution = analytics.planDistribution || [];
  const genderDistribution = analytics.genderDistribution || [];
  const attendance = analytics.attendance || {};

  // Prepare chart data
  const userGrowthLabels = userGrowth.map((d) => d.monthName);
  const userGrowthData = userGrowth.map((d) => d.count);
  const revenueLabels = revenueTrend.map((d) => d.monthName);
  const revenueData = revenueTrend.map((d) => d.totalRevenue);
  const planLabels = planDistribution.map((d) => d.membershipType);
  const planData = planDistribution.map((d) => d.count);
  const genderLabels = genderDistribution.map((d) => d.gender);
  const genderData = genderDistribution.map((d) => d.count);

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
                style={{ width: `${(value / Math.max(...data, 1)) * 100}%` }}
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
                ][index % 4] 
              }}
            />
            <span className="text-white text-sm">{labels[index]}</span>
            <span className="text-white text-sm font-semibold">{value}</span>
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
              <p className="text-3xl font-bold">{userStats.totalUsers || 0}</p>
            </div>
            <FaUsers className="text-4xl text-red-300" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-red-700 to-red-900 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-200">Total Trainers</p>
              <p className="text-3xl font-bold">{userStats.totalTrainers || 0}</p>
            </div>
            <FaGraduationCap className="text-4xl text-red-300" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-red-800 to-black rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-200">Total Members</p>
              <p className="text-3xl font-bold">{userStats.totalMembers || 0}</p>
            </div>
            <FaUsers className="text-4xl text-red-300" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-black to-red-900 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-200">Active Memberships</p>
              <p className="text-3xl font-bold">{userStats.activeMemberships || 0}</p>
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
            data={userGrowthData}
            labels={userGrowthLabels}
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
            data={revenueData}
            labels={revenueLabels}
            title="Monthly Revenue"
            color="red"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-black/50 backdrop-blur-lg rounded-xl p-6 border border-red-500/20">
          <div className="flex items-center space-x-2 mb-4">
            <FaChartPie className="text-red-400 text-xl" />
            <h3 className="text-xl font-semibold text-white">Plan Distribution</h3>
          </div>
          <SimplePieChart 
            data={planData}
            labels={planLabels}
            title="Membership Plan Distribution"
          />
        </div>
        <div className="bg-black/50 backdrop-blur-lg rounded-xl p-6 border border-red-500/20">
          <div className="flex items-center space-x-2 mb-4">
            <FaChartPie className="text-red-400 text-xl" />
            <h3 className="text-xl font-semibold text-white">Gender Distribution</h3>
          </div>
          <SimplePieChart 
            data={genderData}
            labels={genderLabels}
            title="Gender Distribution"
          />
        </div>
      </div>
      {/* Attendance Overview */}
      <div className="bg-black/50 backdrop-blur-lg rounded-xl p-6 border border-red-500/20">
        <h3 className="text-xl font-semibold text-white mb-4">Attendance Overview (Last Month)</h3>
        <div className="flex flex-wrap gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {attendance.overall?.presentCount || 0}
            </div>
            <p className="text-gray-400">Present</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-400 mb-2">
              {attendance.overall?.absentCount || 0}
            </div>
            <p className="text-gray-400">Absent</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">
              {attendance.overall?.lateCount || 0}
            </div>
            <p className="text-gray-400">Late</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {attendance.overall?.attendanceRate || 0}%
            </div>
            <p className="text-gray-400">Attendance Rate</p>
          </div>
        </div>
      </div>
      {/* Attendance by Class */}
      <div className="bg-black/50 backdrop-blur-lg rounded-xl p-6 border border-red-500/20">
        <h3 className="text-xl font-semibold text-white mb-4">Attendance Rate by Class (Last Month)</h3>
        <SimpleBarChart
          data={(attendance.byClass || []).map((c) => Math.round(c.attendanceRate))}
          labels={(attendance.byClass || []).map((c) => c.className)}
          title="Attendance Rate (%)"
        />
      </div>
    </div>
  );
};

export default DashboardOverview; 