import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTrainerStats, selectTrainerStats, selectTrainerLoading, selectTrainerError, fetchTrainerClasses, selectTrainerClasses, fetchTrainerAttendance, selectTrainerAttendance, fetchTrainerWorkoutPlans, selectTrainerWorkoutPlans } from "../store/dashboardSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

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
  const attendance = useSelector(selectTrainerAttendance);
  const workoutPlans = useSelector(selectTrainerWorkoutPlans);
  // const { stats, loading } = useSelector(state => state.dashboard.trainer); // To be implemented
  const [currentView, setCurrentView] = React.useState("dashboard");
  const [showSidebar, setShowSidebar] = React.useState(true);

  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
      toast.error("Please login to access trainer dashboard");
      return;
    }
    dispatch(fetchTrainerStats(accessToken));
    dispatch(fetchTrainerClasses(accessToken));
  }, [accessToken, dispatch, navigate]);

  // Fetch attendance when attendance tab is selected
  useEffect(() => {
    if (currentView === "attendance" && classes && classes.length > 0) {
      dispatch(fetchTrainerAttendance({ accessToken, classId: classes[0].classId }));
    }
    if (currentView === "workoutPlans") {
      dispatch(fetchTrainerWorkoutPlans(accessToken));
    }
  }, [currentView, accessToken, dispatch, classes]);

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return <TrainerDashboardOverview stats={stats} loading={loading} error={error} />;
      case "classes":
        return <TrainerClassesTable classes={classes} loading={loading} />;
      case "attendance":
        return <AttendanceManagement classes={classes} membersInClasses={attendance} loading={loading} />;
      case "workoutPlans":
        return <WorkoutPlanAssignment membersInClasses={workoutPlans} loading={loading} />;
      case "statistics":
        return <TrainerStatistics />;
      default:
        return <TrainerDashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black">
      {/* Header */}
      <TrainerHeader onLogout={() => { localStorage.clear(); navigate("/login"); }} />
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="hidden md:block">
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
          <div className="fixed inset-0 z-50 flex">
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
        <div className="flex-1 p-3 sm:p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default TrainerDash;