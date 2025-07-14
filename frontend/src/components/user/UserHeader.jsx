import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
  import { logout } from "../../store/authSlice";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";

const UserHeader = () => {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between bg-black/80 px-6 py-4 border-b border-red-500/20 shadow-lg">
      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">Levels Gym</span>
      </div>
      <div className="flex items-center gap-4">
        <FaUserCircle className="text-2xl text-red-400" />
        <span className="text-white font-semibold">{user?.fName} {user?.lName}</span>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </header>
  );
};

export default UserHeader; 