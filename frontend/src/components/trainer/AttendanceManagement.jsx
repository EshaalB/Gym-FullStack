import React, { useState } from "react";
import { FaCheck, FaTimes, FaCalendar, FaUsers, FaDumbbell } from "react-icons/fa";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { selectTrainerAttendanceError, selectTrainerAttendanceLoading, markTrainerAttendance } from "../../store/dashboardSlice";

const AttendanceManagement = ({ classes = [], membersInClasses = [] }) => {
  const dispatch = useDispatch();
  const loading = useSelector(selectTrainerAttendanceLoading);
  const error = useSelector(selectTrainerAttendanceError);
  const [selectedClass, setSelectedClass] = useState(null);
  const [attendanceData, setAttendanceData] = useState({});

  const handleClassSelect = (classId) => {
    setSelectedClass(classId);
    setAttendanceData({});
  };

  const handleAttendanceChange = (memberId, status) => {
    setAttendanceData(prev => ({
      ...prev,
      [memberId]: status
    }));
  };

  const handleSubmitAttendance = async () => {
    if (!selectedClass) {
      toast.error("Please select a class first");
      return;
    }

    const attendanceEntries = Object.entries(attendanceData);
    if (attendanceEntries.length === 0) {
      toast.error("Please mark attendance for at least one member");
      return;
    }

    try {
      for (const [memberId, status] of attendanceEntries) {
        await dispatch(markTrainerAttendance({ classId: selectedClass, memberId, status })).unwrap();
      }
      toast.success("Attendance marked successfully!");
      setAttendanceData({});
    } catch (error) {
      toast.error(error || "Failed to mark attendance");
    }
  };

  const getSelectedClassMembers = () => {
    if (!selectedClass) return [];
    return (membersInClasses || []).filter(member => member.classId === selectedClass);
  };

  const getAttendanceStatus = (memberId) => {
    return attendanceData[memberId] || null;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Attendance Management</h1>
        <div className="flex items-center space-x-4">
          <div className="bg-red-600/20 border border-red-500/30 rounded-lg px-4 py-2">
            <div className="flex items-center space-x-2">
              <FaCalendar className="text-red-400" />
              <span className="text-red-400 font-semibold">
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
      {error && (
        <div className="text-center text-red-400 font-semibold py-2">{error}</div>
      )}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Class Selection */}
          <div className="lg:col-span-1">
            <div className="bg-black/50 backdrop-blur-lg rounded-xl p-6 border border-red-500/20">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <FaDumbbell className="text-red-400" />
                <span>Select Class</span>
              </h3>
              
              {classes.length === 0 ? (
                <div className="text-center py-8">
                  <FaDumbbell className="text-4xl text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-400">No classes assigned</p>
                </div>
              ) : membersInClasses.length === 0 ? (
                <div className="text-center py-8">
                  <FaUsers className="text-4xl text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-400">No members found for your classes</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {classes.map((cls) => {
                    const classMembers = membersInClasses.filter(member => member.classId === cls.classId);
                    return (
                      <button
                        key={cls.classId}
                        onClick={() => handleClassSelect(cls.classId)}
                        className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${
                          selectedClass === cls.classId
                            ? "bg-red-600 text-white"
                            : "bg-gray-800/50 text-white hover:bg-gray-700/50"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-semibold">{cls.className}</h4>
                            <p className="text-sm opacity-75">{cls.genderSpecific}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FaUsers />
                            <span className="text-sm">{classMembers.length}</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Attendance Marking */}
          <div className="lg:col-span-2">
            {selectedClass ? (
              <div className="bg-black/50 backdrop-blur-lg rounded-xl p-6 border border-red-500/20">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-white">Mark Attendance</h3>
                  <button
                    onClick={handleSubmitAttendance}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-all duration-200"
                  >
                    Submit Attendance
                  </button>
                </div>

                <div className="space-y-4">
                  {getSelectedClassMembers().map((member) => (
                    <div key={member.enrollmentId} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                              {member.fName?.charAt(0)}{member.lName?.charAt(0)}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">
                              {member.fName} {member.lName}
                            </div>
                            <div className="text-sm text-gray-400">{member.email}</div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleAttendanceChange(member.memberId, 'P')}
                            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                              getAttendanceStatus(member.memberId) === 'P'
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-600 text-white hover:bg-green-600'
                            }`}
                          >
                            <FaCheck className="mr-1" />
                            Present
                          </button>
                          <button
                            onClick={() => handleAttendanceChange(member.memberId, 'A')}
                            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                              getAttendanceStatus(member.memberId) === 'A'
                                ? 'bg-red-600 text-white'
                                : 'bg-gray-600 text-white hover:bg-red-600'
                            }`}
                          >
                            <FaTimes className="mr-1" />
                            Absent
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-black/50 backdrop-blur-lg rounded-xl p-12 text-center border border-red-500/20">
                <FaCalendar className="text-6xl text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Select a Class</h3>
                <p className="text-gray-400">Choose a class from the left to mark attendance</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceManagement; 