import React, { useState, useEffect } from "react";
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
  const [currentView, setCurrentView] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalMembers: 0,
    totalPlans: 0,
    todayAttendance: 0,
  });
  const [classes, setClasses] = useState([]);
  const [membersInClasses, setMembersInClasses] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));

  // Check authentication on mount
  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
      toast.error("Please login to access trainer dashboard");
      return;
    }
    checkAuth();
  }, [accessToken, navigate]);

  useEffect(() => {
    if (currentView === "dashboard") fetchStats();
    if (currentView === "classes") fetchClasses();
    if (currentView === "attendance") fetchClasses();
    if (currentView === "members") fetchMembers();
    if (currentView === "plans") fetchPlans();
    if (currentView === "assign-plans") fetchMembers();
    if (currentView === "stats") {
      fetchStats();
      fetchClasses();
      fetchMembers();
      fetchPlans();
    }
  }, [currentView]);

  const checkAuth = async () => {
    try {
      const res = await fetch("http://localhost:3500/api/auth/verify", {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        credentials: "include"
      });
      if (!res.ok) {
        localStorage.removeItem('accessToken');
        navigate("/login");
        toast.error("Please login to access trainer dashboard");
      } else {
        // Fetch user info after successful auth
        await fetchUserInfo();
      }
    } catch {
      localStorage.removeItem('accessToken');
      navigate("/login");
      toast.error("Please login to access trainer dashboard");
    }
  };

  const fetchUserInfo = async () => {
    try {
      const res = await fetch("http://localhost:3500/api/auth/me", {
        headers: getAuthHeaders(),
        credentials: "include"
      });
      if (res.ok) {
        const userData = await res.json();
        setUser(userData.user);
      }
    } catch {
      console.error("Fetch user info error");
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Logout',
      text: 'Are you sure you want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel',
      background: '#1f2937',
      color: '#ffffff',
      customClass: {
        popup: 'bg-gray-800 border border-gray-600',
        title: 'text-white',
        content: 'text-gray-300'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('accessToken');
        setAccessToken(null);
        setUser(null);
        navigate("/login");
        toast.success("Logged out successfully");
      }
    });
  };

  const getAuthHeaders = () => ({
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  });

  const fetchStats = async () => {
    try {
      const res = await fetch("http://localhost:3500/api/trainers/stats", { 
        headers: getAuthHeaders(),
        credentials: "include" 
      });
      const data = await res.json();
      setStats(data.stats || {
        totalClasses: 0,
        totalMembers: 0,
        totalPlans: 0,
        todayAttendance: 0,
      });
    } catch {
      console.error("Error fetching stats");
      toast.error("Failed to fetch dashboard stats");
    }
  };

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3500/api/trainers/my-classes", { 
        headers: getAuthHeaders(),
        credentials: "include" 
      });
      const data = await res.json();
      setClasses(data.classes || []);
    } catch {
      toast.error("Failed to fetch classes");
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3500/api/trainers/my-classes/members", { 
        headers: getAuthHeaders(),
        credentials: "include" 
      });
      const data = await res.json();
      setMembersInClasses(data.members || []);
    } catch {
      toast.error("Failed to fetch members");
    } finally {
      setLoading(false);
    }
  };

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3500/api/trainers/my-plans", { 
        headers: getAuthHeaders(),
        credentials: "include" 
      });
      const data = await res.json();
      setPlans(data.plans || []);
    } catch {
      toast.error("Failed to fetch plans");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = async (classId, memberId, attendanceStatus) => {
    try {
      const res = await fetch(`http://localhost:3500/api/trainers/class/${classId}/attendance`, {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify({ memberId, attendanceStatus })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to mark attendance");
      }
      
      return await res.json();
    } catch (error) {
      console.error("Mark attendance error:", error);
      throw error;
    }
  };

  const handleAssignPlan = async (memberId, planName, durationWeeks) => {
    try {
      const res = await fetch("http://localhost:3500/api/trainers/assign-plan", {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify({ memberId, planName, durationWeeks })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to assign plan");
      }
      
      return await res.json();
    } catch (error) {
      console.error("Assign plan error:", error);
      throw error;
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return <TrainerDashboardOverview key={`dashboard-${Date.now()}`} stats={stats} />;
      case "classes":
        return (
          <TrainerClassesTable
            classes={classes}
            membersInClasses={membersInClasses}
            loading={loading}
          />
        );
      case "attendance":
        return (
          <AttendanceManagement
            classes={classes}
            membersInClasses={membersInClasses}
            onMarkAttendance={handleMarkAttendance}
            loading={loading}
          />
        );
      case "members":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-white">My Members</h1>
            </div>
            <div className="bg-black/50 backdrop-blur-lg rounded-xl p-6 border border-red-500/20">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {membersInClasses.map((member) => (
                  <div key={member.enrollmentId} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                          {member.fName?.charAt(0)}{member.lName?.charAt(0)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-white">
                          {member.fName} {member.lName}
                        </div>
                        <div className="text-sm text-gray-400">{member.email}</div>
                        <div className="text-sm text-gray-400">Class: {member.className}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case "plans":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-white">My Workout Plans</h1>
            </div>
            <div className="bg-black/50 backdrop-blur-lg rounded-xl p-6 border border-red-500/20">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {plans.map((plan) => (
                  <div key={plan.planId} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-white">{plan.plan_name}</h4>
                      <span className="text-sm text-gray-400">{plan.duration_weeks} weeks</span>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">Assigned to: {plan.fName} {plan.lName}</p>
                    <p className="text-xs text-gray-500">
                      Assigned on: {new Date(plan.assigned_on).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case "assign-plans":
        return (
          <WorkoutPlanAssignment
            membersInClasses={membersInClasses}
            onAssignPlan={handleAssignPlan}
            loading={loading}
          />
        );
      case "stats":
        return (
          <TrainerStatistics
            stats={stats}
            classes={classes}
            membersInClasses={membersInClasses}
            plans={plans}
          />
        );
      default:
        return <TrainerDashboardOverview key={`dashboard-${Date.now()}`} stats={stats} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black">
      {/* Header */}
      <TrainerHeader 
        userName={user ? `${user.fName} ${user.lName}` : "Trainer"} 
        onLogout={handleLogout}
      />
      
      <div className="flex">
        {/* Sidebar */}
        <TrainerSidebar currentView={currentView} setCurrentView={setCurrentView} />

        {/* Main Content */}
        <div className="flex-1 p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default TrainerDash;