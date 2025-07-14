import React from "react";
import { FaSignOutAlt, FaUser, FaBell } from "react-icons/fa";
import Button from "../../common/Button";

const AdminHeader = ({ userName, onLogout }) => {
  return (
    <header className="bg-black/50 backdrop-blur-lg border-b border-red-500/20 px-8 py-4">
      <div className="flex justify-between items-center">
        {/* Left side - Welcome message */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center text-white font-semibold">
              <FaUser />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Welcome back, {userName}!</h1>
              <p className="text-sm text-gray-400">Admin Dashboard</p>
            </div>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-white transition-colors duration-200">
            <FaBell className="text-xl" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              3
            </span>
          </button>

          {/* User menu */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-white">{userName}</p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
            
            {/* Logout button */}
            <Button
              onClick={onLogout}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-2"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader; 