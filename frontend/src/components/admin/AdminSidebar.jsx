import React from "react";
import {
  FaUsers,
  FaDumbbell,
  FaClipboardList,
  FaGraduationCap,
  FaChartLine,
  FaHome,
  FaCreditCard,
} from "react-icons/fa";

const AdminSidebar = ({ currentView, setCurrentView }) => {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: FaHome },
    { id: "users", label: "Users", icon: FaUsers },
    { id: "trainers", label: "Trainers", icon: FaGraduationCap },
    { id: "plans", label: "Plans", icon: FaClipboardList },
    { id: "classes", label: "Classes", icon: FaDumbbell },
    { id: "payments", label: "Payments", icon: FaCreditCard },
  ];

  return (
    <div className="w-64 bg-black/50 backdrop-blur-lg border-r border-red-500/20 min-h-screen">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-white mb-8">Admin Panel</h2>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  currentView === item.id
                    ? "bg-red-600 text-white shadow-lg"
                    : "text-gray-300 hover:bg-red-500/20 hover:text-white"
                }`}
              >
                <Icon className="text-xl" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default AdminSidebar; 