import React from "react";
import { FaUsers } from "react-icons/fa";

const MyMembers = ({ membersInClasses = [], loading, error }) => {
  // Get unique members by memberId
  const uniqueMembers = (membersInClasses || []).filter(
    (member, index, self) =>
      index === self.findIndex((m) => m.memberId === member.memberId)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">My Members</h1>
        <div className="flex items-center space-x-4">
          <div className="bg-red-600/20 border border-red-500/30 rounded-lg px-4 py-2">
            <div className="flex items-center space-x-2">
              <FaUsers className="text-red-400" />
              <span className="text-red-400 font-semibold">
                {uniqueMembers.length} Members
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
          <p className="text-white text-lg">Loading members...</p>
        </div>
      ) : uniqueMembers.length === 0 ? (
        <div className="text-center py-12">
          <FaUsers className="text-6xl text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Members Found</h3>
          <p className="text-gray-400">You have no members in your classes yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {uniqueMembers.map((member) => (
            <div key={member.memberId} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 flex items-center justify-between">
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
                  <div className="text-xs text-gray-400">Class: {member.className || member.classId}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyMembers; 