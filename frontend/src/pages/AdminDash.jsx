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
  selectAdminClasses,
  selectAdminPayments,
  selectAdminLoading,
  selectAdminError,
  selectAdminUsersPagination,
  addAdminUser,
  editAdminUser,
  deleteAdminUser,
  addAdminTrainer,
  editAdminTrainer,
  deleteAdminTrainer,
  addAdminClass,
  editAdminClass,
  deleteAdminClass,
  approveAdminPayment,
  fetchPaymentMethods,
  selectPaymentMethods,
  editAdminPayment,
} from "../store/dashboardSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { showSuccessAlert, showErrorAlert } from "../utils/sweetAlert";

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
  const classes = useSelector(selectAdminClasses);
  const payments = useSelector(selectAdminPayments);
  const loading = useSelector(selectAdminLoading);
  const error = useSelector(selectAdminError);
  const usersPagination = useSelector(selectAdminUsersPagination);
  const paymentMethods = useSelector(selectPaymentMethods);
  const [currentView, setCurrentView] = React.useState("dashboard");
  const [showSidebar, setShowSidebar] = React.useState(true);
  const [usersPage, setUsersPage] = React.useState(1);
  const [analytics, setAnalytics] = React.useState(null);
  const [analyticsLoading, setAnalyticsLoading] = React.useState(false);
  const [analyticsError, setAnalyticsError] = React.useState("");

  // Fetch analytics for dashboard
  const fetchDashboardAnalytics = React.useCallback(async () => {
    setAnalyticsLoading(true);
    setAnalyticsError("");
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch("http://localhost:3500/api/users/dashboard-analytics", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch analytics");
      const data = await res.json();
      setAnalytics(data);
    } catch (err) {
      setAnalyticsError(err.message || "Failed to fetch analytics");
    } finally {
      setAnalyticsLoading(false);
    }
  }, []);

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

  // Fetch analytics on mount and when dashboard is viewed
  useEffect(() => {
    if (currentView === "dashboard") {
      fetchDashboardAnalytics();
    }
  }, [currentView, fetchDashboardAnalytics]);

  // Add/Edit/Delete handlers for users
  const handleAddUser = async (user, onDone) => {
    try {
      const resultAction = await dispatch(addAdminUser({ accessToken, user }));
      if (addAdminUser.fulfilled.match(resultAction)) {
        showSuccessAlert("User Added", "The user was added successfully.");
        dispatch(fetchAdminUsers({ accessToken, page: usersPage, limit: usersPagination.limit }));
        onDone && onDone();
      } else {
        showErrorAlert("Add Failed", resultAction.payload || resultAction.error.message);
      }
    } catch (err) {
      showErrorAlert("Add Failed", err.message);
    }
  };

  const handleEditUser = async (user, onDone) => {
    try {
      const resultAction = await dispatch(editAdminUser({ accessToken, userId: user.userId, user }));
      if (editAdminUser.fulfilled.match(resultAction)) {
        showSuccessAlert("User Updated", "The user was updated successfully.");
        dispatch(fetchAdminUsers({ accessToken, page: usersPage, limit: usersPagination.limit }));
        onDone && onDone();
      } else {
        showErrorAlert("Update Failed", resultAction.payload || resultAction.error.message);
      }
    } catch (err) {
      showErrorAlert("Update Failed", err.message);
    }
  };

  const handleDeleteUser = async (user) => {
    try {
      const resultAction = await dispatch(deleteAdminUser({ accessToken, userId: user.userId }));
      if (deleteAdminUser.fulfilled.match(resultAction)) {
        showSuccessAlert("User Deleted", "The user was deleted successfully.");
        dispatch(fetchAdminUsers({ accessToken, page: usersPage, limit: usersPagination.limit }));
      } else {
        showErrorAlert("Delete Failed", resultAction.payload || resultAction.error.message);
      }
    } catch (err) {
      showErrorAlert("Delete Failed", err.message);
    }
  };

  // Add/Edit/Delete handlers for trainers
  const handleAddTrainer = async (trainer, onDone) => {
    try {
      const resultAction = await dispatch(addAdminTrainer({ accessToken, trainer }));
      if (addAdminTrainer.fulfilled.match(resultAction)) {
        showSuccessAlert("Trainer Added", "The trainer was added successfully.");
        dispatch(fetchAdminTrainers(accessToken));
        onDone && onDone();
      } else {
        showErrorAlert("Add Failed", resultAction.payload || resultAction.error.message);
      }
    } catch (err) {
      showErrorAlert("Add Failed", err.message);
    }
  };
  const handleEditTrainer = async (trainer, onDone) => {
    try {
      const resultAction = await dispatch(editAdminTrainer({ accessToken, trainerId: trainer.userId, trainer }));
      if (editAdminTrainer.fulfilled.match(resultAction)) {
        showSuccessAlert("Trainer Updated", "The trainer was updated successfully.");
        dispatch(fetchAdminTrainers(accessToken));
        onDone && onDone();
      } else {
        showErrorAlert("Update Failed", resultAction.payload || resultAction.error.message);
      }
    } catch (err) {
      showErrorAlert("Update Failed", err.message);
    }
  };
  const handleDeleteTrainer = async (trainer) => {
    try {
      const resultAction = await dispatch(deleteAdminTrainer({ accessToken, trainerId: trainer.userId }));
      if (deleteAdminTrainer.fulfilled.match(resultAction)) {
        showSuccessAlert("Trainer Deleted", "The trainer was deleted successfully.");
        dispatch(fetchAdminTrainers(accessToken));
      } else {
        showErrorAlert("Delete Failed", resultAction.payload || resultAction.error.message);
      }
    } catch (err) {
      showErrorAlert("Delete Failed", err.message);
    }
  };
  // Add/Edit/Delete handlers for classes
  const handleAddClass = async (classObj, onDone) => {
    try {
      const resultAction = await dispatch(addAdminClass({ accessToken, classObj }));
      if (addAdminClass.fulfilled.match(resultAction)) {
        showSuccessAlert("Class Added", "The class was added successfully.");
        await dispatch(fetchAdminClasses(accessToken));
        onDone && onDone();
      } else {
        showErrorAlert("Add Failed", resultAction.payload || resultAction.error.message);
      }
    } catch (err) {
      showErrorAlert("Add Failed", err.message);
    }
  };
  const handleEditClass = async (classObj, onDone) => {
    try {
      const resultAction = await dispatch(editAdminClass({ accessToken, classId: classObj.classId, classObj }));
      if (editAdminClass.fulfilled.match(resultAction)) {
        showSuccessAlert("Class Updated", "The class was updated successfully.");
        await dispatch(fetchAdminClasses(accessToken));
        onDone && onDone();
      } else {
        showErrorAlert("Update Failed", resultAction.payload || resultAction.error.message);
      }
    } catch (err) {
      showErrorAlert("Update Failed", err.message);
    }
  };
  const handleDeleteClass = async (classObj) => {
    try {
      const resultAction = await dispatch(deleteAdminClass({ accessToken, classId: classObj.classId }));
      if (deleteAdminClass.fulfilled.match(resultAction)) {
        showSuccessAlert("Class Deleted", "The class was deleted successfully.");
        await dispatch(fetchAdminClasses(accessToken));
      } else {
        showErrorAlert("Delete Failed", resultAction.payload || resultAction.error.message);
      }
    } catch (err) {
      showErrorAlert("Delete Failed", err.message);
    }
  };
  // Add/Edit/Delete handlers for payments
  const handleApprovePayment = async (payment) => {
    try {
      await dispatch(approveAdminPayment({ accessToken, paymentId: payment.paymentId })).unwrap();
      showSuccessAlert("Payment Approved", "The payment was approved successfully.");
      await dispatch(fetchAdminPayments(accessToken));
    } catch (err) {
      showErrorAlert("Approve Failed", err.message);
    }
  };
  const handleEditPayment = async (payment, onDone) => {
    try {
      await dispatch(editAdminPayment({ accessToken, paymentId: payment.paymentId, payment })).unwrap();
      showSuccessAlert("Payment Updated", "The payment was updated successfully.");
      await dispatch(fetchAdminPayments(accessToken));
      onDone && onDone();
    } catch (err) {
      showErrorAlert("Update Failed", err.message);
    }
  };
  const handleFetchPaymentMethods = () => {
    dispatch(fetchPaymentMethods(accessToken));
  };

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return <DashboardOverview analytics={analytics} loading={analyticsLoading} error={analyticsError} />;
      case "users":
        return <UsersTable users={users} loading={loading} error={error} pagination={usersPagination} onPageChange={setUsersPage} onAddUser={handleAddUser} onEditUser={handleEditUser} onDeleteUser={handleDeleteUser} />;
      case "trainers":
        return <TrainersTable trainers={trainers} loading={loading} error={error} onAddTrainer={handleAddTrainer} onEditTrainer={handleEditTrainer} onDeleteTrainer={handleDeleteTrainer} />;
      case "classes":
        return <ClassesTable
          classes={classes}
          trainers={trainers}
          loading={loading}
          error={error}
          onAddClass={handleAddClass}
          onEditClass={handleEditClass}
          onDeleteClass={handleDeleteClass}
        />;
      case "payments":
        return <PaymentsTable
          payments={payments}
          loading={loading}
          error={error}
          onApprovePayment={handleApprovePayment}
          onEditPayment={handleEditPayment}
          paymentMethods={paymentMethods}
          fetchPaymentMethods={handleFetchPaymentMethods}
        />;
      default:
        return <DashboardOverview stats={stats} loading={loading} error={error} />;
    }
  };

  return (
    <div className="min-h-screen h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black flex flex-col">
      {/* Header */}
      <AdminHeader onLogout={() => { localStorage.clear(); navigate("/login"); }} />
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <div className="hidden md:block h-full">
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
        <div className="flex-1 h-full min-h-0 flex flex-col">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDash;