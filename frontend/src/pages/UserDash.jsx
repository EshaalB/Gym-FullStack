import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
// import { fetchUserStats, setUserModal } from "../store/dashboardSlice"; // To be implemented
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
 
const UserDash = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const accessToken = localStorage.getItem('accessToken');
  // const { stats, loading } = useSelector(state => state.dashboard.user); // To be implemented

  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
      toast.error('Please login to access user dashboard');
      return;
    }
    // dispatch(fetchUserStats(accessToken)); // To be implemented
  }, [accessToken, dispatch, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black">
      {/* User dashboard content goes here */}
      <h1 className="text-3xl font-bold text-white">User Dashboard</h1>
      {/* Add dashboard widgets, stats, and components here, using Redux state in the future */}
    </div>
  );
};

export default UserDash;