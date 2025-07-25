import React from "react";
import {
  FaUsers,
  FaDumbbell,
  FaClipboardList,
  FaCalendarCheck,
  FaChartLine,
  FaChartBar,
  FaChartPie,
  FaUser,
} from "react-icons/fa";
import SkeletonLoader from "../common/SkeletonLoader";

const TrainerDashboardOverview = ({ analytics, loading, error }) => {
  if (loading) return <div className="text-white">Loading analytics...</div>;
  if (error) return <div className="text-red-400">{error}</div>;
  if (!analytics) return null;

  // Extract analytics data - Updated for new structure
  const trainerInfo = analytics.trainerInfo || {};
  const classStats = analytics.classStats || [];
  const genderDistribution = analytics.genderDistribution || [];
  const attendance = analytics.attendance || {};
  const planAssignmentRate = analytics.planAssignmentRate ?? 0;
  const totalMembers = analytics.totalMembers || 0;
  const activeClasses = analytics.activeClasses || 0;

  // Prepare chart data
  const classLabels = classStats.map((c) => c.className);
  const classMemberCounts = classStats.map((c) => c.memberCount);
  const genderLabels = genderDistribution.map((d) => d.gender);
  const genderData = genderDistribution.map((d) => d.count);

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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Trainer Dashboard</h1>
        {trainerInfo.name && (
          <div className="flex items-center space-x-2 bg-black/40 rounded-lg px-4 py-2">
            <FaUser className="text-red-400" />
            <span className="text-white font-medium">{trainerInfo.name}</span>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-200">My Classes</p>
              <p className="text-3xl font-bold">{activeClasses}</p>
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
        
        <div className="bg-gradient-to-r from-red-800 to-red-950 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-200">Attendance Rate</p>
              <p className="text-3xl font-bold">{attendance?.overall?.attendanceRate || 0}%</p>
            </div>
            <FaCalendarCheck className="text-4xl text-red-300" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-red-900 to-black rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-200">Plan Assignment Rate</p>
              <p className="text-3xl font-bold">{planAssignmentRate}%</p>
            </div>
            <FaClipboardList className="text-4xl text-red-300" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Class Member Distribution */}
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <SimpleBarChart 
            data={classMemberCounts} 
            labels={classLabels} 
            title="Members per Class" 
            color="blue"
          />
        </div>

        {/* Gender Distribution */}
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <SimplePieChart 
            data={genderData} 
            labels={genderLabels} 
            title="Member Gender Distribution"
          />
        </div>
      </div>

      {/* Class Details */}
      {classStats.length > 0 && (
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">My Classes Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classStats.map((classData, index) => (
              <div key={index} className="bg-black/30 rounded-lg p-4 border border-white/10">
                <h4 className="text-white font-semibold mb-2">{classData.className}</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Members:</span>
                    <span className="text-white">{classData.memberCount}/{classData.seats}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Gender:</span>
                    <span className="text-white">{classData.genderSpecific}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(classData.memberCount / classData.seats) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Attendance Details */}
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

      {/* Overall Attendance Summary */}
      {attendance?.overall && (
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">Overall Attendance Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">
                {attendance.overall.presentCount || 0}
              </div>
              <p className="text-gray-400 text-sm">Present</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400 mb-1">
                {attendance.overall.absentCount || 0}
              </div>
              <p className="text-gray-400 text-sm">Absent</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-1">
                {attendance.overall.lateCount || 0}
              </div>
              <p className="text-gray-400 text-sm">Late</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {attendance.overall.totalAttendance || 0}
              </div>
              <p className="text-gray-400 text-sm">Total Records</p>
            </div>
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

export default TrainerDashboardOverview; 