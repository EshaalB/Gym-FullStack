import React, { useState } from "react";
import { FaUsers, FaSearch, FaFilter } from "react-icons/fa";

const MyMembers = ({ membersInClasses = [], loading, error }) => {
  // Get unique members by memberId/classId
  const uniqueMembers = (membersInClasses || []).filter(
    (member, index, self) =>
      index === self.findIndex((m) => m.memberId === member.memberId && m.classId === member.classId)
  );

  // Extract unique class names for filter
  const classOptions = Array.from(new Set(uniqueMembers.map(m => m.className || m.classId)));

  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");

  // Filtered members
  const filteredMembers = uniqueMembers.filter(member => {
    const matchesClass = classFilter ? (member.className === classFilter || member.classId === classFilter) : true;
    const matchesSearch = search ? (
      member.fName?.toLowerCase().includes(search.toLowerCase()) ||
      member.lName?.toLowerCase().includes(search.toLowerCase()) ||
      member.email?.toLowerCase().includes(search.toLowerCase())
    ) : true;
    return matchesClass && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold text-white">My Members</h1>
          <FaUsers className="text-red-400 text-2xl ml-2" />
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg bg-black/50 border border-red-500/30 text-white placeholder-gray-400 focus:border-red-500 focus:outline-none"
            />
          </div>
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={classFilter}
              onChange={e => setClassFilter(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg bg-black/50 border border-red-500/30 text-white focus:border-red-500 focus:outline-none"
            >
              <option value="">All Classes</option>
              {classOptions.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
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
      ) : filteredMembers.length === 0 ? (
        <div className="text-center py-12">
          <FaUsers className="text-6xl text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Members Found</h3>
          <p className="text-gray-400">No members match your filters.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-red-500/20 bg-black/50 backdrop-blur-lg">
          <table className="min-w-full divide-y divide-red-500/20">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Class</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-red-500/10">
              {filteredMembers.map(member => (
                <tr key={member.memberId + "-" + member.classId}>
                  <td className="px-6 py-4 whitespace-nowrap text-white font-semibold">{member.fName} {member.lName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-200">{member.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-200">{member.className || member.classId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyMembers; 