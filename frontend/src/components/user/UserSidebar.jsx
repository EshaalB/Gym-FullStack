import React from "react";
import { FaHome, FaCalendarAlt, FaDumbbell, FaMoneyBill, FaUser, FaHeadset, FaClipboardList, FaWeight } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/userdash", label: "Dashboard", icon: <FaHome /> },
  { to: "/userdash/book", label: "Book Class", icon: <FaCalendarAlt /> },
  { to: "/userdash/classes", label: "My Classes", icon: <FaClipboardList /> },
  { to: "/userdash/plans", label: "Workout Plans", icon: <FaDumbbell /> },
  { to: "/userdash/payments", label: "Payments", icon: <FaMoneyBill /> },
  { to: "/userdash/profile", label: "Profile", icon: <FaUser /> },
  { to: "/userdash/bmi", label: "BMI Calculator", icon: <FaWeight /> },
  { to: "/userdash/support", label: "Support", icon: <FaHeadset /> },
];

const UserSidebar = ({ currentView, setCurrentView }) => {
  return (
    <aside className="bg-black/90 border-r border-red-500/20 min-h-screen w-56 flex flex-col py-8 px-4">
      <nav className="flex flex-col gap-2" role="navigation" aria-label="User dashboard navigation">
        {links.map(link => (
          <button
            key={link.to}
            onClick={() => setCurrentView(link.to)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all font-semibold text-white hover:bg-red-500/20 ${currentView === link.to ? 'bg-red-600/80 text-white' : ''}`}
            aria-current={currentView === link.to ? 'page' : undefined}
          >
            <span className="text-lg">{link.icon}</span>
            <span>{link.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default UserSidebar; 