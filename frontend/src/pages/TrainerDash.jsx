import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTrainerStats, selectTrainerStats, selectTrainerLoading, selectTrainerError, fetchTrainerClasses, selectTrainerClasses, fetchTrainerAttendance, fetchTrainerWorkoutPlans, selectTrainerWorkoutPlans, fetchTrainerMembers, selectTrainerMembers } from "../store/dashboardSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
  
// Import components
import TrainerSidebar from "../components/trainer/TrainerSidebar";
import TrainerHeader from "../components/trainer/TrainerHeader";
import TrainerDashboardOverview from "../components/trainer/TrainerDashboardOverview";
import TrainerClassesTable from "../components/trainer/TrainerClassesTable";
import AttendanceManagement from "../components/trainer/AttendanceManagement";
import WorkoutPlanAssignment from "../components/trainer/WorkoutPlanAssignment";
import TrainerStatistics from "../components/trainer/TrainerStatistics";

const TrainerDash = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const accessToken = localStorage.getItem('accessToken');
  const stats = useSelector(selectTrainerStats);
  const loading = useSelector(selectTrainerLoading);
  const error = useSelector(selectTrainerError);
  const classes = useSelector(selectTrainerClasses);
  const workoutPlans = useSelector(selectTrainerWorkoutPlans);
  const members = useSelector(selectTrainerMembers);
  const user = useSelector(state => state.auth.user);
  const [currentView, setCurrentView] = React.useState("dashboard");
  const [showSidebar, setShowSidebar] = React.useState(true);
  const [analytics, setAnalytics] = React.useState(null);
  const [analyticsLoading, setAnalyticsLoading] = React.useState(false);
  const [analyticsError, setAnalyticsError] = React.useState("");

  // Fetch analytics for dashboard
  const fetchDashboardAnalytics = React.useCallback(async () => {
    setAnalyticsLoading(true);
    setAnalyticsError("");
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch("http://localhost:3500/api/trainers/dashboard-analytics", {
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

  // Fetch all trainer data on mount
  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
      toast.error("Please login to access trainer dashboard");
      return;
    }
    dispatch(fetchTrainerStats(accessToken));
    dispatch(fetchTrainerClasses(accessToken));
    dispatch(fetchTrainerWorkoutPlans(accessToken));
    dispatch(fetchTrainerMembers(accessToken));
  }, [accessToken, dispatch, navigate]);

  // Fetch attendance when attendance tab is selected
  useEffect(() => {
    if (currentView === "attendance" && classes && classes.length > 0) {
      dispatch(fetchTrainerAttendance({ accessToken, classId: classes[0].classId }));
    }
    if (currentView === "workoutPlans" || currentView === "assign-plans" || currentView === "plans") {
      dispatch(fetchTrainerWorkoutPlans(accessToken));
    }
  }, [currentView, accessToken, dispatch, classes]);

  // Fetch analytics on mount and when dashboard is viewed
  React.useEffect(() => {
    if (currentView === "dashboard") {
      fetchDashboardAnalytics();
    }
  }, [currentView, fetchDashboardAnalytics]);

  // Handler to refresh all data after actions
  const refreshAll = () => {
    dispatch(fetchTrainerStats(accessToken));
    dispatch(fetchTrainerClasses(accessToken));
    dispatch(fetchTrainerAttendance({ accessToken, classId: classes[0]?.classId || 0 }));
    dispatch(fetchTrainerWorkoutPlans(accessToken));
    dispatch(fetchTrainerMembers(accessToken));
  };

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return <TrainerDashboardOverview analytics={analytics} loading={analyticsLoading} error={analyticsError} />;
      case "classes":
        return <TrainerClassesTable classes={classes} membersInClasses={members} loading={loading} />;
      case "attendance":
        return <AttendanceManagement classes={classes} membersInClasses={members} loading={loading} onAction={refreshAll} />;
      case "workoutPlans":
      case "plans":
        return <WorkoutPlanAssignment membersInClasses={members} loading={loading} onAction={refreshAll} />;
      case "assign-plans":
        return <WorkoutPlanAssignment membersInClasses={members} loading={loading} onAction={refreshAll} />;
      case "statistics":
      case "stats":
        return <TrainerStatistics stats={stats} classes={classes} membersInClasses={members} plans={workoutPlans} />;
      default:
        return <TrainerDashboardOverview stats={stats} loading={loading} error={error} />;
    }
  };

  return (
    <div className="min-h-screen h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black flex flex-col m-0 p-0">
      {/* Header */}
      <TrainerHeader userName={user ? `${user.fName} ${user.lName}` : ""} onLogout={() => { localStorage.clear(); navigate("/login"); }} />
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <div className="hidden md:block h-full">
          <TrainerSidebar currentView={currentView} setCurrentView={setCurrentView} />
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
          <span className="text-lg font-bold text-white">Trainer Panel</span>
        </div>
        {/* Mobile Sidebar Drawer */}
        {showSidebar && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div className="w-64 bg-black/90 backdrop-blur-lg border-r border-red-500/20 min-h-screen">
              <TrainerSidebar currentView={currentView} setCurrentView={setCurrentView} />
            </div>
            <div
              className="flex-1 bg-black/40"
              onClick={() => setShowSidebar(false)}
              aria-label="Close sidebar"
            />
          </div>
        )}
        {/* Main Content */}
        <div className="flex-1 h-full min-h-0 flex flex-col overflow-hidden">
          <div className="flex-1 min-h-0 overflow-y-auto p-0 m-0">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerDash;