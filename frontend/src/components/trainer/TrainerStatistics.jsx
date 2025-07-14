import React from "react";
import { FaChartLine, FaChartBar, FaChartPie, FaUsers, FaDumbbell, FaCalendar, FaClipboardList } from "react-icons/fa";

const TrainerStatistics = ({ stats = {}, classes = [], membersInClasses = [], plans = [] }) => {
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

  // Calculate class distribution
  const classDistribution = (classes || []).reduce((acc, cls) => {
    const members = (membersInClasses || []).filter(member => member.classId === cls.classId).length;
    acc.push({ name: cls.className, members });
    return acc;
  }, []);

  // Calculate gender distribution
  const genderDistribution = (membersInClasses || []).reduce((acc, member) => {
    acc[member.gender] = (acc[member.gender] || 0) + 1;
    return acc;
  }, {});

  const totalMembers = Object.values(genderDistribution).reduce((a, b) => a + b, 0);
  const genderPercentages = Object.entries(genderDistribution).map(([gender, count]) => ({
    gender,
    percentage: totalMembers > 0 ? Math.round((count / totalMembers) * 100) : 0
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Statistics & Analytics</h1>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-200">Total Classes</p>
              <p className="text-3xl font-bold">{stats.totalClasses || 0}</p>
            </div>
            <FaDumbbell className="text-4xl text-red-300" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-red-700 to-red-900 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-200">Total Members</p>
              <p className="text-3xl font-bold">{stats.totalMembers || 0}</p>
            </div>
            <FaUsers className="text-4xl text-red-300" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-red-800 to-black rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-200">Workout Plans</p>
              <p className="text-3xl font-bold">{stats.totalPlans || 0}</p>
            </div>
            <FaClipboardList className="text-4xl text-red-300" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-black to-red-900 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-200">Today's Attendance</p>
              <p className="text-3xl font-bold">{stats.todayAttendance || 0}</p>
            </div>
            <FaCalendar className="text-4xl text-red-300" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-black/50 backdrop-blur-lg rounded-xl p-6 border border-red-500/20">
          <h3 className="text-xl font-semibold text-white mb-4">Class Member Distribution</h3>
          <SimpleBarChart 
            data={classDistribution.map(cls => cls.members)}
            labels={classDistribution.map(cls => cls.name)}
            title="Members per Class"
          />
        </div>
        
        <div className="bg-black/50 backdrop-blur-lg rounded-xl p-6 border border-red-500/20">
          <h3 className="text-xl font-semibold text-white mb-4">Gender Distribution</h3>
          <SimplePieChart 
            data={genderPercentages.map(g => g.percentage)}
            labels={genderPercentages.map(g => g.gender)}
            title="Member Gender Distribution"
          />
        </div>
      </div>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-black/50 backdrop-blur-lg rounded-xl p-6 border border-red-500/20">
          <h3 className="text-xl font-semibold text-white mb-4">Class Details</h3>
          <div className="space-y-4">
            {classes.map((cls) => {
              const memberCount = (membersInClasses || []).filter(member => member.classId === cls.classId).length;
              const attendanceRate = memberCount > 0 ? Math.round((stats.todayAttendance / memberCount) * 100) : 0;
              
              return (
                <div key={cls.classId} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-white">{cls.className}</h4>
                    <span className="text-sm text-gray-400">{cls.genderSpecific}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Members</p>
                      <p className="text-white font-semibold">{memberCount}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Capacity</p>
                      <p className="text-white font-semibold">{cls.seats}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Attendance Rate</p>
                      <p className="text-white font-semibold">{attendanceRate}%</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-black/50 backdrop-blur-lg rounded-xl p-6 border border-red-500/20">
          <h3 className="text-xl font-semibold text-white mb-4">Recent Workout Plans</h3>
          <div className="space-y-4">
            {plans.slice(0, 5).map((plan) => (
              <div key={plan.planId} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-white">{plan.plan_name}</h4>
                  <span className="text-sm text-gray-400">{plan.duration_weeks} weeks</span>
                </div>
                <p className="text-sm text-gray-400 mb-2">Assigned to: {plan.fName} {plan.lName}</p>
                <p className="text-xs text-gray-500">
                  Assigned on: {new Date(plan.assigned_on).toLocaleDateString()}
                </p>
              </div>
            ))}
            {plans.length === 0 && (
              <div className="text-center py-8">
                <FaClipboardList className="text-4xl text-gray-600 mx-auto mb-2" />
                <p className="text-gray-400">No workout plans assigned yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-black/50 backdrop-blur-lg rounded-xl p-6 border border-red-500/20">
        <h3 className="text-xl font-semibold text-white mb-4">Performance Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-red-400 mb-2">
              {classes.length > 0 ? Math.round((stats.totalMembers / classes.length) * 10) / 10 : 0}
            </div>
            <p className="text-gray-400">Average Members per Class</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-400 mb-2">
              {stats.totalMembers > 0 ? Math.round((stats.totalPlans / stats.totalMembers) * 100) : 0}%
            </div>
            <p className="text-gray-400">Plan Assignment Rate</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-400 mb-2">
              {stats.totalMembers > 0 ? Math.round((stats.todayAttendance / stats.totalMembers) * 100) : 0}%
            </div>
            <p className="text-gray-400">Today's Attendance Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerStatistics; 