import React from "react";
import {
  FaUsers,
  FaGraduationCap,
  FaDollarSign,
  FaUserCheck,
  FaChartLine,
  FaChartBar,
  FaChartPie,
  FaUserTie,
  FaUserFriends,
} from "react-icons/fa";

const DashboardOverview = ({ analytics, loading, error, onRetry }) => {
  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          <span className="ml-3 text-white">Loading analytics...</span>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="space-y-6 p-6">
        <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">!</span>
            </div>
            <div>
              <h3 className="text-red-400 font-semibold">Error Loading Analytics</h3>
              <p className="text-red-300 text-sm mt-1">{error}</p>
            </div>
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Try Again
            </button>
          )}
        </div>
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
  const roleDistribution = analytics.roleDistribution || []; // NEW
  const ageGroups = analytics.ageGroups || []; // NEW
  const attendance = analytics.attendance || {};

  // Prepare chart data
  const userGrowthLabels = userGrowth.map((d) => d.month || d.monthName);
  const userGrowthData = userGrowth.map((d) => d.count);
  const revenueLabels = revenueTrend.map((d) => d.month || d.monthName);
  const revenueData = revenueTrend.map((d) => d.totalRevenue);
  const planLabels = planDistribution.map((d) => d.membershipType);
  const planData = planDistribution.map((d) => d.count);
  const genderLabels = genderDistribution.map((d) => d.gender);
  const genderData = genderDistribution.map((d) => d.count);
  const roleLabels = roleDistribution.map((d) => d.userRole);
  const roleData = roleDistribution.map((d) => d.count);
  const ageGroupLabels = ageGroups.map((d) => d.ageGroup);
  const ageGroupData = ageGroups.map((d) => d.count);

  // Simple bar chart component
  const SimpleBarChart = ({ data, labels, title, color = "red" }) => {
    if (!data || data.length === 0) {
      return (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">{title}</h4>
          <div className="text-gray-400 text-sm">No data available</div>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-white">{title}</h4>
        <div className="space-y-2">
          {data.map((value, index) => (
            <div key={index} className="flex items-center space-x-3">
              <span className="text-white text-sm w-20 truncate">{labels[index]}</span>
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
  };

  // Simple pie chart component
  const SimplePieChart = ({ data, labels, title }) => {
    if (!data || data.length === 0) {
      return (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">{title}</h4>
          <div className="text-gray-400 text-sm">No data available</div>
        </div>
      );
    }

    return (
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
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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
              <p className="text-red-200">Members</p>
              <p className="text-3xl font-bold">{userStats.totalMembers || 0}</p>
            </div>
            <FaUserFriends className="text-4xl text-red-300" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-red-800 to-red-950 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-200">Trainers</p>
              <p className="text-3xl font-bold">{userStats.totalTrainers || 0}</p>
            </div>
            <FaUserTie className="text-4xl text-red-300" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-red-900 to-black rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-200">Active Memberships</p>
              <p className="text-3xl font-bold">{userStats.activeMemberships || 0}</p>
            </div>
            <FaUserCheck className="text-4xl text-red-300" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-gray-700 to-gray-900 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-200">Attendance Rate</p>
              <p className="text-3xl font-bold">{attendance?.overall?.attendanceRate || 0}%</p>
            </div>
            <FaChartLine className="text-4xl text-gray-300" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <SimpleBarChart 
            data={userGrowthData} 
            labels={userGrowthLabels} 
            title="User Growth Trend" 
            color="blue"
          />
        </div>

        {/* Revenue Trend Chart */}
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <SimpleBarChart 
            data={revenueData} 
            labels={revenueLabels} 
            title="Revenue Trend" 
            color="green"
          />
        </div>

        {/* Gender Distribution */}
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <SimplePieChart 
            data={genderData} 
            labels={genderLabels} 
            title="Gender Distribution"
          />
        </div>

        {/* Role Distribution */}
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <SimplePieChart 
            data={roleData} 
            labels={roleLabels} 
            title="User Role Distribution"
          />
        </div>

        {/* Plan Distribution */}
        {planData.length > 0 && (
          <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <SimplePieChart 
              data={planData} 
              labels={planLabels} 
              title="Membership Plan Distribution"
            />
          </div>
        )}

        {/* Age Groups */}
        {ageGroupData.length > 0 && (
          <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <SimpleBarChart 
              data={ageGroupData} 
              labels={ageGroupLabels} 
              title="Age Group Distribution" 
              color="purple"
            />
          </div>
        )}
      </div>

      {/* Attendance Overview */}
      {attendance?.byClass?.length > 0 && (
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">Class Attendance Overview</h3>
          <div className="space-y-3">
            {attendance.byClass.map((classData, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                <span className="text-white font-medium">{classData.className}</span>
                <div className="flex items-center space-x-4">
                  <span className="text-green-400">Present: {classData.presentCount}</span>
                  <span className="text-red-400">Absent: {classData.absentCount}</span>
                  <span className="text-blue-400">Rate: {classData.attendanceRate}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Show a note if this is simplified data */}
      {analytics.error && (
        <div className="bg-yellow-900/50 border border-yellow-600/50 rounded-lg p-4">
          <p className="text-yellow-300 text-sm">
            <strong>Note:</strong> Some analytics data is using sample values. {analytics.error}
          </p>
        </div>
      )}
    </div>
  );
};

export default DashboardOverview; 