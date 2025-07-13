import React from "react";
import { FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import Button from "../Button";

const UsersTable = ({ 
  users, 
  loading, 
  onAddUser, 
  onEditUser, 
  onDeleteUser 
}) => {
  const getRoleBadge = (role) => {
    const colors = {
      'Admin': 'bg-red-600 text-white',
      'Trainer': 'bg-blue-600 text-white',
      'Member': 'bg-green-600 text-white'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[role] || 'bg-gray-600 text-white'}`}>
        {role}
      </span>
    );
  };

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
        <h1 className="text-3xl font-bold text-white">Users Management</h1>
        <Button
          onClick={onAddUser}
          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <FaPlus className="mr-2" />
          Add User
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading users...</p>
        </div>
      ) : (
        <div className="bg-black/50 backdrop-blur-lg rounded-xl overflow-hidden border border-red-500/20 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-red-600/80 to-red-800/80">
                <tr>
                  <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wider">Age</th>
                  <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wider">Gender</th>
                  <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-red-500/20">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                      <div className="flex flex-col items-center space-y-2">
                        <FaEye className="text-4xl text-gray-600" />
                        <p className="text-lg">No users found</p>
                        <p className="text-sm">Add your first user to get started</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.userId} className="hover:bg-red-500/10 transition-all duration-200 group">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center text-white font-semibold">
                              {user.fName?.charAt(0)}{user.lName?.charAt(0)}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">
                              {user.fName} {user.lName}
                            </div>
                            <div className="text-sm text-gray-400">ID: {user.userId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white">{user.email}</td>
                      <td className="px-6 py-4">{getRoleBadge(user.userRole)}</td>
                      <td className="px-6 py-4 text-white">{user.age || 'N/A'}</td>
                      <td className="px-6 py-4">{getGenderBadge(user.gender)}</td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => onEditUser(user)}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
                            title="Edit User"
                          >
                            <FaEdit className="mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => onDeleteUser(user.userId)}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 transform hover:scale-105"
                            title="Delete User"
                          >
                            <FaTrash className="mr-1" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTable; 