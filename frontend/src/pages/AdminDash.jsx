import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminStats,
  fetchAdminUsers,
  fetchAdminTrainers,
  fetchAdminPlans,
  fetchAdminClasses,
  fetchAdminPayments,
  selectAdminStats,
  selectAdminUsers,
  selectAdminTrainers,
  selectAdminPlans,
  selectAdminClasses,
  selectAdminPayments,
  selectAdminLoading,
  selectAdminError,
  setAdminModal,
  selectAdminUsersPagination,
} from "../store/dashboardSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// Import components
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import DashboardOverview from "../components/admin/DashboardOverview";
import UsersTable from "../components/admin/UsersTable";
import TrainersTable from "../components/admin/TrainersTable";
import PlansTable from "../components/admin/PlansTable";
import ClassesTable from "../components/admin/ClassesTable";
import PaymentsTable from "../components/admin/PaymentsTable";

const AdminDash = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const accessToken = localStorage.getItem('accessToken');
  const stats = useSelector(selectAdminStats);
  const users = useSelector(selectAdminUsers);
  const trainers = useSelector(selectAdminTrainers);
  const plans = useSelector(selectAdminPlans);
  const classes = useSelector(selectAdminClasses);
  const payments = useSelector(selectAdminPayments);
  const loading = useSelector(selectAdminLoading);
  const error = useSelector(selectAdminError);
  const usersPagination = useSelector(selectAdminUsersPagination);
  const [currentView, setCurrentView] = React.useState("dashboard");
  const [showSidebar, setShowSidebar] = React.useState(true);
  const [usersPage, setUsersPage] = React.useState(1);

  // Fetch all dashboard data on mount and when currentView changes
  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
      toast.error("Please login to access admin dashboard");
      return;
    }
    dispatch(fetchAdminStats(accessToken));
    dispatch(fetchAdminUsers({ accessToken, page: usersPage, limit: usersPagination.limit }));
    dispatch(fetchAdminTrainers(accessToken));
    dispatch(fetchAdminPlans(accessToken));
    dispatch(fetchAdminClasses(accessToken));
    dispatch(fetchAdminPayments(accessToken));
  }, [accessToken, dispatch, navigate, currentView, usersPage, usersPagination.limit]);

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return <DashboardOverview stats={stats} loading={loading} error={error} />;
      case "users":
        return <UsersTable users={users} loading={loading} error={error} onAddUser={() => dispatch(setAdminModal({ user: { show: true, mode: "add", user: {} } }))} pagination={usersPagination} onPageChange={setUsersPage} />;
      case "trainers":
        return <TrainersTable trainers={trainers} loading={loading} error={error} />;
      case "plans":
        return <PlansTable plans={plans} loading={loading} error={error} />;
      case "classes":
        return <ClassesTable classes={classes} loading={loading} error={error} />;
      case "payments":
        return <PaymentsTable payments={payments} loading={loading} error={error} />;
      default:
        return <DashboardOverview stats={stats} loading={loading} error={error} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black">
      {/* Header */}
      <AdminHeader onLogout={() => { localStorage.clear(); navigate("/login"); }} />
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="hidden md:block">
          <AdminSidebar currentView={currentView} setCurrentView={setCurrentView} />
        </div>
        {/* Mobile Sidebar Toggle */}
        <div className="md:hidden flex items-center justify-between bg-black/60 px-4 py-3 border-b border-red-500/20">
          <button
            onClick={() => setShowSidebar((prev) => !prev)}
            className="text-white text-2xl focus:outline-none focus:ring-2 focus:ring-red-400"
            aria-label="Toggle sidebar"
          >
            &#9776;
          </button>
          <span className="text-lg font-bold text-white">Admin Panel</span>
        </div>
        {/* Mobile Sidebar Drawer */}
        {showSidebar && (
          <div className="fixed inset-0 z-50 flex">
            <div className="w-64 bg-black/90 backdrop-blur-lg border-r border-red-500/20 min-h-screen">
              <AdminSidebar currentView={currentView} setCurrentView={setCurrentView} />
            </div>
            <div
              className="flex-1 bg-black/40"
              onClick={() => setShowSidebar(false)}
              aria-label="Close sidebar"
            />
          </div>
        )}
        {/* Main Content */}
        <div className="flex-1 p-3 sm:p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDash;