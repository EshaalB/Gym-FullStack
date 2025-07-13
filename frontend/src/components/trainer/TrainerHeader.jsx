import React from "react";
import { FaSignOutAlt, FaUserCircle } from "react-icons/fa";

const TrainerHeader = ({ userName, onLogout }) => {
  return (
    <header className="bg-black/50 backdrop-blur-lg border-b border-red-500/20 px-8 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-center">
            <FaUserCircle className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Trainer Dashboard</h1>
            <p className="text-gray-300 text-sm">Welcome back, {userName}</p>
          </div>
        </div>
        
        <button
          onClick={onLogout}
          className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default TrainerHeader; 