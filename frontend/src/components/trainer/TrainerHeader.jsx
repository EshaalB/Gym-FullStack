import React from "react";
import { FaSignOutAlt, FaUserCircle } from "react-icons/fa";

const TrainerHeader = ({ userName, onLogout }) => {
  return (
    <header className="bg-black/50 backdrop-blur-lg border-b border-red-500/20 px-8 py-4 m-0">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-center">
            <FaUserCircle className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Welcome back, {userName || 'Trainer'}!</h1>
            <p className="text-sm text-gray-400">Trainer Dashboard</p>
          </div>
        </div>
        
        <button
          onClick={onLogout}
          className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default TrainerHeader; 