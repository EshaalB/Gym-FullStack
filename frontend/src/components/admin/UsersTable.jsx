import React from "react";
import SkeletonLoader from "../common/SkeletonLoader";
import Button from "../common/Button";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const UsersTable = ({ users, loading, error, onAddUser, pagination, onPageChange }) => {
  if (loading) {
    return <SkeletonLoader variant="table" />;
  }
  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }
  return (
    <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Users</h2>
        <Button onClick={onAddUser} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <FaPlus /> Add User
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-300">
          <caption className="sr-only">List of all users</caption>
          <thead>
            <tr>
              <th className="px-4 py-2 text-left" scope="col">Name</th>
              <th className="px-4 py-2 text-left" scope="col">Email</th>
              <th className="px-4 py-2 text-left" scope="col">Role</th>
              <th className="px-4 py-2 text-left" scope="col">Gender</th>
              <th className="px-4 py-2 text-left" scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users && users.length > 0 ? (
              users.map((user) => (
                <tr key={user.userId} className="border-b border-gray-700/30">
                  <td className="px-4 py-2">{user.fName} {user.lName}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.userRole}</td>
                  <td className="px-4 py-2">{user.gender}</td>
                  <td className="px-4 py-2">
                    {/* Future: Edit/Delete buttons using Redux thunks */}
                    <Button aria-label="Edit" onClick={() => {/* TODO: add edit logic */}} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-xs mr-2 flex items-center gap-1"><FaEdit /></Button>
                    <Button aria-label="Delete" onClick={() => {/* TODO: add delete logic */}} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-xs flex items-center gap-1"><FaTrash /></Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center text-gray-400 py-6">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 space-x-2">
          <Button
            className="px-3 py-1 text-xs bg-gray-700 text-white rounded disabled:opacity-50"
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={!pagination.hasPrev}
          >
            Prev
          </Button>
          <span className="text-white text-sm">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <Button
            className="px-3 py-1 text-xs bg-gray-700 text-white rounded disabled:opacity-50"
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={!pagination.hasNext}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default UsersTable; 