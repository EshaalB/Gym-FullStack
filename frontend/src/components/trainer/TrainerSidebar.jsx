import React from "react";
import {
  FaUsers,
  FaDumbbell,
  FaClipboardList,
  FaChartLine,
  FaHome,
  FaCalendarCheck,
  FaUserPlus,
} from "react-icons/fa";

const TrainerSidebar = ({ currentView, setCurrentView }) => {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: FaHome },
    { id: "classes", label: "My Classes", icon: FaDumbbell },
    { id: "attendance", label: "Attendance", icon: FaCalendarCheck },
    { id: "members", label: "My Members", icon: FaUsers },
    { id: "plans", label: "Workout Plans", icon: FaClipboardList },
    { id: "stats", label: "Statistics", icon: FaChartLine },
  ];

  return (
    <div className="w-64 bg-black/50 backdrop-blur-lg border-r border-red-500/20 min-h-screen">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-white mb-8">Trainer Panel</h2>
        <nav className="space-y-2" role="navigation" aria-label="Trainer dashboard navigation">
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
                aria-current={currentView === item.id ? 'page' : undefined}
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

export default TrainerSidebar; 