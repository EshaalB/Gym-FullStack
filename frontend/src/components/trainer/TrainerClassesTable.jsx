import React from "react";
import { FaUsers, FaCalendar, FaVenusMars, FaChair, FaDumbbell } from "react-icons/fa";

const TrainerClassesTable = ({ classes = [], membersInClasses = [], loading }) => {
  const getGenderBadge = (gender) => {
    const colors = {
      'Male': 'bg-blue-500 text-white',
      'Female': 'bg-pink-500 text-white',
      'Other': 'bg-purple-500 text-white'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[gender] || 'bg-gray-600 text-white'}`}>
        {gender}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">My Classes</h1>
        <div className="flex items-center space-x-4">
          <div className="bg-red-600/20 border border-red-500/30 rounded-lg px-4 py-2">
            <div className="flex items-center space-x-2">
              <FaUsers className="text-red-400" />
              <span className="text-red-400 font-semibold">
                {classes.length} Classes
              </span>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading classes...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {classes.length === 0 ? (
            <div className="bg-black/50 backdrop-blur-lg rounded-xl p-12 text-center border border-red-500/20">
              <FaDumbbell className="text-6xl text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Classes Assigned</h3>
              <p className="text-gray-400">You haven't been assigned any classes yet.</p>
            </div>
          ) : (
            classes.map((cls) => {
              const classMembers = membersInClasses.filter(member => member.classId === cls.classId);
              return (
                <div key={cls.classId} className="bg-black/50 backdrop-blur-lg rounded-xl overflow-hidden border border-red-500/20 shadow-xl">
                  {/* Class Header */}
                  <div className="bg-gradient-to-r from-red-600/80 to-red-800/80 px-6 py-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-xl font-bold text-white">{cls.className}</h3>
                        <p className="text-red-200">Class ID: {cls.classId}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 text-white">
                          <FaVenusMars />
                          <span>{cls.genderSpecific}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-white">
                          <FaChair />
                          <span>{cls.seats} seats</span>
                        </div>
                        <div className="flex items-center space-x-2 text-white">
                          <FaUsers />
                          <span>{classMembers.length} members</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Class Members */}
                  <div className="p-6">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                      <FaUsers className="text-red-400" />
                      <span>Enrolled Members</span>
                    </h4>
                    
                    {classMembers.length === 0 ? (
                      <div className="text-center py-8">
                        <FaUsers className="text-4xl text-gray-600 mx-auto mb-2" />
                        <p className="text-gray-400">No members enrolled in this class</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {classMembers.map((member) => (
                          <div key={member.enrollmentId} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                                  {member.fName?.charAt(0)}{member.lName?.charAt(0)}
                                </div>
                              </div>
                              <div className="flex-1">
                                <div className="text-sm font-medium text-white">
                                  {member.fName} {member.lName}
                                </div>
                                <div className="text-sm text-gray-400">{member.email}</div>
                                <div className="mt-1">
                                  {getGenderBadge(member.gender)}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default TrainerClassesTable; 