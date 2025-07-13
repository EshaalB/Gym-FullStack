import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

// Import components
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import DashboardOverview from "../components/admin/DashboardOverview";
import UsersTable from "../components/admin/UsersTable";
import TrainersTable from "../components/admin/TrainersTable";
import PlansTable from "../components/admin/PlansTable";
import ClassesTable from "../components/admin/ClassesTable";
import PaymentsTable from "../components/admin/PaymentsTable";
import UserModal from "../components/admin/modals/UserModal";
import ClassAssignmentModal from "../components/admin/modals/ClassAssignmentModal";
import Modal from "../components/Modal";
import Button from "../components/Button";

const AdminDash = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTrainers: 0,
    totalRevenue: 0,
    activeMemberships: 0,
  });
  const [users, setUsers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [classes, setClasses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userModal, setUserModal] = useState({ show: false, mode: "add", user: {} });
  const [trainerModal, setTrainerModal] = useState({ show: false, mode: "add", trainer: {} });
  const [planModal, setPlanModal] = useState({ show: false, mode: "add", plan: {} });
  const [classModal, setClassModal] = useState({ show: false, mode: "add", classObj: {} });
  const [classAssignmentModal, setClassAssignmentModal] = useState({ show: false, classData: {} });
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));

  // Get breadcrumb items based on current view
  const getBreadcrumbItems = () => {
    const baseItems = [{ label: "Admin Dashboard", path: "/admindash" }];
    
    switch (currentView) {
      case "dashboard":
        return baseItems;
      case "users":
        return [...baseItems, { label: "Users", path: "/admindash/users" }];
      case "trainers":
        return [...baseItems, { label: "Trainers", path: "/admindash/trainers" }];
      case "plans":
        return [...baseItems, { label: "Plans", path: "/admindash/plans" }];
      case "classes":
        return [...baseItems, { label: "Classes", path: "/admindash/classes" }];
      case "payments":
        return [...baseItems, { label: "Payments", path: "/admindash/payments" }];
      default:
        return baseItems;
    }
  };

  // Check authentication on mount
  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
      toast.error("Please login to access admin dashboard");
      return;
    }
    checkAuth();
  }, [accessToken, navigate]);

  useEffect(() => {
    if (currentView === "dashboard") fetchStats();
    if (currentView === "users") fetchUsers();
    if (currentView === "trainers") fetchTrainers();
    if (currentView === "plans") fetchPlans();
    if (currentView === "classes") fetchClasses();
    if (currentView === "payments") fetchPayments();
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
        toast.error("Please login to access admin dashboard");
      } else {
        // Fetch user info after successful auth
        await fetchUserInfo();
      }
    } catch (error) {
      localStorage.removeItem('accessToken');
      navigate("/login");
      toast.error("Please login to access admin dashboard");
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
    } catch (error) {
      console.error("Fetch user info error:", error);
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
      const [userStatsRes, revenueStatsRes] = await Promise.all([
        fetch("http://localhost:3500/api/users/stats/overview", { 
          headers: getAuthHeaders(),
          credentials: "include" 
        }).then(r => r.json()),
        fetch("http://localhost:3500/api/payments/stats/overview", { 
          headers: getAuthHeaders(),
          credentials: "include" 
        }).then(r => r.json()),
      ]);

      setStats({
        totalUsers: userStatsRes.totalUsers || 0,
        totalTrainers: userStatsRes.totalTrainers || 0,
        totalRevenue: revenueStatsRes.totalRevenue || 0,
        activeMemberships: userStatsRes.activeMemberships || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("Failed to fetch dashboard stats");
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3500/api/users", { 
        headers: getAuthHeaders(),
        credentials: "include" 
      });
      const data = await res.json();
      setUsers(data.users || []);
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const fetchTrainers = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3500/api/trainers", { 
        headers: getAuthHeaders(),
        credentials: "include" 
      });
      const data = await res.json();
      setTrainers(data.trainers || []);
    } catch (error) {
      toast.error("Failed to fetch trainers");
    } finally {
      setLoading(false);
    }
  };

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3500/api/plans", { 
        headers: getAuthHeaders(),
        credentials: "include" 
      });
      const data = await res.json();
      setPlans(data.plans || []);
    } catch (error) {
      toast.error("Failed to fetch plans");
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3500/api/classes", { 
        headers: getAuthHeaders(),
        credentials: "include" 
      });
      const data = await res.json();
      setClasses(data.classes || []);
    } catch (error) {
      toast.error("Failed to fetch classes");
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3500/api/payments/pending", { 
        headers: getAuthHeaders(),
        credentials: "include" 
      });
      const data = await res.json();
      setPayments(data.pendingPayments || []);
    } catch (error) {
      console.error("Fetch payments error:", error);
      toast.error("Failed to fetch payments");
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePayment = async (paymentId) => {
    try {
      const res = await fetch(`http://localhost:3500/api/payments/${paymentId}/status`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify({ status: 'Completed' })
      });
      
      if (res.ok) {
        Swal.fire({
          title: 'Approved!',
          text: 'Payment has been approved successfully.',
          icon: 'success',
          background: '#1f2937',
          color: '#ffffff',
          customClass: {
            popup: 'bg-gray-800 border border-gray-600',
            title: 'text-white',
            content: 'text-gray-300'
          }
        });
        fetchPayments();
      } else {
        toast.error("Failed to approve payment");
      }
    } catch (error) {
      console.error("Approve payment error:", error);
      toast.error("Failed to approve payment");
    }
  };

  const handleRejectPayment = async (paymentId) => {
    try {
      const res = await fetch(`http://localhost:3500/api/payments/${paymentId}/status`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify({ status: 'Failed' })
      });
      
      if (res.ok) {
        Swal.fire({
          title: 'Rejected!',
          text: 'Payment has been rejected.',
          icon: 'info',
          background: '#1f2937',
          color: '#ffffff',
          customClass: {
            popup: 'bg-gray-800 border border-gray-600',
            title: 'text-white',
            content: 'text-gray-300'
          }
        });
        fetchPayments();
      } else {
        toast.error("Failed to reject payment");
      }
    } catch (error) {
      console.error("Reject payment error:", error);
      toast.error("Failed to reject payment");
    }
  };

  // User CRUD operations
  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let res;
      if (userModal.mode === "add") {
        res = await fetch("http://localhost:3500/api/users", {
          method: "POST",
          headers: getAuthHeaders(),
          credentials: "include",
          body: JSON.stringify(userModal.user),
        });
      } else {
        res = await fetch(`http://localhost:3500/api/users/${userModal.user.userId}`, {
          method: "PUT",
          headers: getAuthHeaders(),
          credentials: "include",
          body: JSON.stringify(userModal.user),
        });
      }

      if (res.ok) {
        toast.success(`User ${userModal.mode === "add" ? "added" : "updated"} successfully`);
        setUserModal({ show: false, mode: "add", user: {} });
        fetchUsers();
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "Failed to save user");
      }
    } catch (error) {
      console.error("User operation error:", error);
      toast.error("Failed to save user");
    } finally {
      setLoading(false);
    }
  };

  const handleUserDelete = async (userId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      background: '#1f2937',
      color: '#ffffff',
      customClass: {
        popup: 'bg-gray-800 border border-gray-600',
        title: 'text-white',
        content: 'text-gray-300'
      }
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`http://localhost:3500/api/users/${userId}`, {
          method: "DELETE",
          headers: getAuthHeaders(),
          credentials: "include",
        });
        
        if (res.ok) {
          Swal.fire({
            title: 'Deleted!',
            text: 'User has been deleted successfully.',
            icon: 'success',
            background: '#1f2937',
            color: '#ffffff',
            customClass: {
              popup: 'bg-gray-800 border border-gray-600',
              title: 'text-white',
              content: 'text-gray-300'
            }
          });
          fetchUsers();
        } else {
          const errorData = await res.json();
          toast.error(errorData.error || "Failed to delete user");
        }
      } catch (error) {
        console.error("Delete user error:", error);
        toast.error("Failed to delete user");
      }
    }
  };

  // Trainer CRUD operations
  const handleTrainerSubmit = async (e) => {
    e.preventDefault();
    let res;
    if (trainerModal.mode === "add") {
      res = await fetch("http://localhost:3500/api/trainers", {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify(trainerModal.trainer),
      });
    } else {
      res = await fetch(`http://localhost:3500/api/trainers/${trainerModal.trainer.userId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify(trainerModal.trainer),
      });
    }

    if (res.ok) {
      toast.success(`Trainer ${trainerModal.mode === "add" ? "added" : "updated"} successfully`);
      setTrainerModal({ show: false, mode: "add", trainer: {} });
      fetchTrainers();
    } else {
      toast.error("Failed to save trainer");
    }
  };

  const handleTrainerDelete = async (userId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      background: '#1f2937',
      color: '#ffffff',
      customClass: {
        popup: 'bg-gray-800 border border-gray-600',
        title: 'text-white',
        content: 'text-gray-300'
      }
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`http://localhost:3500/api/trainers/${userId}`, {
          method: "DELETE",
          headers: getAuthHeaders(),
          credentials: "include",
        });
        if (res.ok) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Trainer has been deleted successfully.',
            icon: 'success',
            background: '#1f2937',
            color: '#ffffff',
            customClass: {
              popup: 'bg-gray-800 border border-gray-600',
              title: 'text-white',
              content: 'text-gray-300'
            }
          });
          fetchTrainers();
        } else {
          toast.error("Failed to delete trainer");
        }
      } catch (error) {
        toast.error("Failed to delete trainer");
      }
    }
  };

  // Plan CRUD operations
  const handlePlanSubmit = async (e) => {
    e.preventDefault();
    let res;
    if (planModal.mode === "add") {
      res = await fetch("http://localhost:3500/api/plans", {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify(planModal.plan),
      });
    } else {
      res = await fetch(`http://localhost:3500/api/plans/${planModal.plan.planId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify(planModal.plan),
      });
    }

    if (res.ok) {
      toast.success(`Plan ${planModal.mode === "add" ? "added" : "updated"} successfully`);
      setPlanModal({ show: false, mode: "add", plan: {} });
      fetchPlans();
    } else {
      toast.error("Failed to save plan");
    }
  };

  const handlePlanDelete = async (planId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      background: '#1f2937',
      color: '#ffffff',
      customClass: {
        popup: 'bg-gray-800 border border-gray-600',
        title: 'text-white',
        content: 'text-gray-300'
      }
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`http://localhost:3500/api/plans/${planId}`, {
          method: "DELETE",
          headers: getAuthHeaders(),
          credentials: "include",
        });
        if (res.ok) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Plan has been deleted successfully.',
            icon: 'success',
            background: '#1f2937',
            color: '#ffffff',
            customClass: {
              popup: 'bg-gray-800 border border-gray-600',
              title: 'text-white',
              content: 'text-gray-300'
            }
          });
          fetchPlans();
        } else {
          toast.error("Failed to delete plan");
        }
      } catch (error) {
        toast.error("Failed to delete plan");
      }
    }
  };

  // Class CRUD operations
  const handleClassSubmit = async (e) => {
    e.preventDefault();
    let res;
    if (classModal.mode === "add") {
      res = await fetch("http://localhost:3500/api/classes", {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify(classModal.classObj),
      });
    } else {
      res = await fetch(`http://localhost:3500/api/classes/${classModal.classObj.classId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify(classModal.classObj),
      });
    }

    if (res.ok) {
      toast.success(`Class ${classModal.mode === "add" ? "added" : "updated"} successfully`);
      setClassModal({ show: false, mode: "add", classObj: {} });
      fetchClasses();
    } else {
      toast.error("Failed to save class");
    }
  };

  const handleClassDelete = async (classId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      background: '#1f2937',
      color: '#ffffff',
      customClass: {
        popup: 'bg-gray-800 border border-gray-600',
        title: 'text-white',
        content: 'text-gray-300'
      }
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`http://localhost:3500/api/classes/${classId}`, {
          method: "DELETE",
          headers: getAuthHeaders(),
          credentials: "include",
        });
        if (res.ok) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Class has been deleted successfully.',
            icon: 'success',
            background: '#1f2937',
            color: '#ffffff',
            customClass: {
              popup: 'bg-gray-800 border border-gray-600',
              title: 'text-white',
              content: 'text-gray-300'
            }
          });
          fetchClasses();
        } else {
          toast.error("Failed to delete class");
        }
      } catch (error) {
        toast.error("Failed to delete class");
      }
    }
  };

  const handleClassAssignment = async (formData) => {
    try {
      const res = await fetch("http://localhost:3500/api/classes", {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Class assigned successfully");
        setClassAssignmentModal({ show: false, classData: {} });
        fetchClasses();
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "Failed to assign class");
      }
    } catch (error) {
      console.error("Class assignment error:", error);
      toast.error("Failed to assign class");
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return <DashboardOverview key={`dashboard-${Date.now()}`} stats={stats} />;
      case "users":
        return (
          <UsersTable
            users={users}
            loading={loading}
            onAddUser={() => setUserModal({ show: true, mode: "add", user: {} })}
            onEditUser={(user) => setUserModal({ show: true, mode: "edit", user: { ...user } })}
            onDeleteUser={handleUserDelete}
          />
        );
      case "trainers":
        return (
          <TrainersTable
            trainers={trainers}
            loading={loading}
            onAddTrainer={() => setTrainerModal({ show: true, mode: "add", trainer: {} })}
            onEditTrainer={(trainer) => setTrainerModal({ show: true, mode: "edit", trainer: { ...trainer } })}
            onDeleteTrainer={handleTrainerDelete}
          />
        );
      case "plans":
        return (
          <PlansTable
            plans={plans}
            loading={loading}
            onAddPlan={() => setPlanModal({ show: true, mode: "add", plan: {} })}
            onEditPlan={(plan) => setPlanModal({ show: true, mode: "edit", plan: { ...plan } })}
            onDeletePlan={handlePlanDelete}
          />
        );
      case "classes":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-white">Classes Management</h1>
              <div className="flex space-x-3">
                <Button
                  onClick={() => setClassAssignmentModal({ show: true, classData: {} })}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Assign Class to Trainer
                </Button>
                <Button
                  onClick={() => setClassModal({ show: true, mode: "add", classObj: {} })}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Add Class
                </Button>
              </div>
            </div>
            <ClassesTable
              classes={classes}
              loading={loading}
              onAddClass={() => setClassModal({ show: true, mode: "add", classObj: {} })}
              onEditClass={(classItem) => setClassModal({ show: true, mode: "edit", classObj: { ...classItem } })}
              onDeleteClass={handleClassDelete}
            />
          </div>
        );
      case "payments":
        return (
          <PaymentsTable
            payments={payments}
            loading={loading}
            onAddPayment={() => {
              const newPayment = {
                paymentId: Date.now(), // Simple ID generation
                userId: "", // Placeholder, will be selected
                amount: 0,
                paymentDate: new Date().toISOString().slice(0, 10),
                paymentMethod: "",
                paymentStatus: "Pending",
              };
              setPayments(prev => [...prev, newPayment]);
              setPayments(prev => [...prev, newPayment]);
            }}
            onEditPayment={(payment) => {
              const updatedPayment = payments.find(p => p.paymentId === payment.paymentId);
              if (updatedPayment) {
                updatedPayment.userId = payment.userId;
                updatedPayment.amount = payment.amount;
                updatedPayment.paymentDate = payment.paymentDate;
                updatedPayment.paymentMethod = payment.paymentMethod;
                updatedPayment.paymentStatus = payment.paymentStatus;
                setPayments(prev => prev.map(p => p.paymentId === payment.paymentId ? updatedPayment : p));
              }
            }}
            onDeletePayment={async (paymentId) => {
              const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ef4444',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'Cancel',
                background: '#1f2937',
                color: '#ffffff',
                customClass: {
                  popup: 'bg-gray-800 border border-gray-600',
                  title: 'text-white',
                  content: 'text-gray-300'
                }
              });

              if (result.isConfirmed) {
                try {
                  const res = await fetch(`http://localhost:3500/api/payments/${paymentId}`, {
                    method: "DELETE",
                    headers: getAuthHeaders(),
                    credentials: "include",
                  });
                  if (res.ok) {
                    Swal.fire({
                      title: 'Deleted!',
                      text: 'Payment has been deleted successfully.',
                      icon: 'success',
                      background: '#1f2937',
                      color: '#ffffff',
                      customClass: {
                        popup: 'bg-gray-800 border border-gray-600',
                        title: 'text-white',
                        content: 'text-gray-300'
                      }
                    });
                    fetchPayments();
                  } else {
                    toast.error("Failed to delete payment");
                  }
                } catch (error) {
                  toast.error("Failed to delete payment");
                }
              }
            }}
            onApprovePayment={handleApprovePayment}
            onRejectPayment={handleRejectPayment}
          />
        );
      default:
        return <DashboardOverview key={`dashboard-${Date.now()}`} stats={stats} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black">
      {/* Header */}
      <AdminHeader 
        userName={user ? `${user.fName} ${user.lName}` : "Admin"} 
        onLogout={handleLogout}
      />
      
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar currentView={currentView} setCurrentView={setCurrentView} />

        {/* Main Content */}
        <div className="flex-1 p-8">
          {renderContent()}
        </div>
      </div>

      {/* Modals */}
      <UserModal
        isOpen={userModal.show}
        onClose={() => setUserModal({ show: false, mode: "add", user: {} })}
        user={userModal.user}
        mode={userModal.mode}
        onSubmit={handleUserSubmit}
        onChange={(user) => setUserModal({ ...userModal, user })}
      />

      {/* Trainer Modal */}
      <Modal
        isOpen={trainerModal.show}
        onClose={() => setTrainerModal({ show: false, mode: "add", trainer: {} })}
        title={`${trainerModal.mode === "add" ? "Add" : "Edit"} Trainer`}
      >
        <form onSubmit={handleTrainerSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="First Name"
              value={trainerModal.trainer.fName || ""}
              onChange={(e) => setTrainerModal({ ...trainerModal, trainer: { ...trainerModal.trainer, fName: e.target.value } })}
              className="px-4 py-2 bg-black/50 border border-red-500/30 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none"
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={trainerModal.trainer.lName || ""}
              onChange={(e) => setTrainerModal({ ...trainerModal, trainer: { ...trainerModal.trainer, lName: e.target.value } })}
              className="px-4 py-2 bg-black/50 border border-red-500/30 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none"
              required
            />
          </div>
          <input
            type="email"
            placeholder="Email"
            value={trainerModal.trainer.email || ""}
            onChange={(e) => setTrainerModal({ ...trainerModal, trainer: { ...trainerModal.trainer, email: e.target.value } })}
            className="w-full px-4 py-2 bg-black/50 border border-red-500/30 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none"
            required
          />
          <input
            type="text"
            placeholder="Specialization"
            value={trainerModal.trainer.specialization || ""}
            onChange={(e) => setTrainerModal({ ...trainerModal, trainer: { ...trainerModal.trainer, specialization: e.target.value } })}
            className="w-full px-4 py-2 bg-black/50 border border-red-500/30 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Experience Years"
              value={trainerModal.trainer.experienceYears || ""}
              onChange={(e) => setTrainerModal({ ...trainerModal, trainer: { ...trainerModal.trainer, experienceYears: parseInt(e.target.value) } })}
              className="px-4 py-2 bg-black/50 border border-red-500/30 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none"
              required
            />
            <input
              type="number"
              placeholder="Salary"
              value={trainerModal.trainer.salary || ""}
              onChange={(e) => setTrainerModal({ ...trainerModal, trainer: { ...trainerModal.trainer, salary: parseFloat(e.target.value) } })}
              className="px-4 py-2 bg-black/50 border border-red-500/30 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none"
              required
            />
          </div>
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              onClick={() => setTrainerModal({ show: false, mode: "add", trainer: {} })}
              className="bg-gray-600 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-red-600 hover:bg-red-700">
              {trainerModal.mode === "add" ? "Add" : "Update"} Trainer
            </Button>
          </div>
        </form>
      </Modal>

      {/* Plan Modal */}
      <Modal
        isOpen={planModal.show}
        onClose={() => setPlanModal({ show: false, mode: "add", plan: {} })}
        title={`${planModal.mode === "add" ? "Add" : "Edit"} Plan`}
      >
        <form onSubmit={handlePlanSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Plan Name"
            value={planModal.plan.plan_name || ""}
            onChange={(e) => setPlanModal({ ...planModal, plan: { ...planModal.plan, plan_name: e.target.value } })}
            className="w-full px-4 py-2 bg-black/50 border border-red-500/30 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none"
            required
          />
          <select
            value={planModal.plan.memberId || ""}
            onChange={(e) => setPlanModal({ ...planModal, plan: { ...planModal.plan, memberId: parseInt(e.target.value) } })}
            className="w-full px-4 py-2 bg-black/50 border border-red-500/30 rounded-lg text-white focus:border-red-500 focus:outline-none"
            required
          >
            <option value="">Select Member</option>
            {users.map((user) => (
              <option key={user.userId} value={user.userId}>
                {user.fName} {user.lName}
              </option>
            ))}
          </select>
          <select
            value={planModal.plan.trainerId || ""}
            onChange={(e) => setPlanModal({ ...planModal, plan: { ...planModal.plan, trainerId: parseInt(e.target.value) } })}
            className="w-full px-4 py-2 bg-black/50 border border-red-500/30 rounded-lg text-white focus:border-red-500 focus:outline-none"
            required
          >
            <option value="">Select Trainer</option>
            {trainers.map((trainer) => (
              <option key={trainer.userId} value={trainer.userId}>
                {trainer.fName} {trainer.lName}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Duration (weeks)"
            value={planModal.plan.duration_weeks || ""}
            onChange={(e) => setPlanModal({ ...planModal, plan: { ...planModal.plan, duration_weeks: parseInt(e.target.value) } })}
            className="w-full px-4 py-2 bg-black/50 border border-red-500/30 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none"
            required
          />
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              onClick={() => setPlanModal({ show: false, mode: "add", plan: {} })}
              className="bg-gray-600 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-red-600 hover:bg-red-700">
              {planModal.mode === "add" ? "Add" : "Update"} Plan
            </Button>
          </div>
        </form>
      </Modal>

      {/* Class Modal */}
      <Modal
        isOpen={classModal.show}
        onClose={() => setClassModal({ show: false, mode: "add", classObj: {} })}
        title={`${classModal.mode === "add" ? "Add" : "Edit"} Class`}
      >
        <form onSubmit={handleClassSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Class Name"
            value={classModal.classObj.className || ""}
            onChange={(e) => setClassModal({ ...classModal, classObj: { ...classModal.classObj, className: e.target.value } })}
            className="w-full px-4 py-2 bg-black/50 border border-red-500/30 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none"
            required
          />
          <select
            value={classModal.classObj.trainerId || ""}
            onChange={(e) => setClassModal({ ...classModal, classObj: { ...classModal.classObj, trainerId: parseInt(e.target.value) } })}
            className="w-full px-4 py-2 bg-black/50 border border-red-500/30 rounded-lg text-white focus:border-red-500 focus:outline-none"
            required
          >
            <option value="">Select Trainer</option>
            {trainers.map((trainer) => (
              <option key={trainer.userId} value={trainer.userId}>
                {trainer.fName} {trainer.lName}
              </option>
            ))}
          </select>
          <select
            value={classModal.classObj.genderSpecific || ""}
            onChange={(e) => setClassModal({ ...classModal, classObj: { ...classModal.classObj, genderSpecific: e.target.value } })}
            className="w-full px-4 py-2 bg-black/50 border border-red-500/30 rounded-lg text-white focus:border-red-500 focus:outline-none"
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <input
            type="number"
            placeholder="Number of Seats"
            value={classModal.classObj.seats || ""}
            onChange={(e) => setClassModal({ ...classModal, classObj: { ...classModal.classObj, seats: parseInt(e.target.value) } })}
            className="w-full px-4 py-2 bg-black/50 border border-red-500/30 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none"
            required
          />
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              onClick={() => setClassModal({ show: false, mode: "add", classObj: {} })}
              className="bg-gray-600 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-red-600 hover:bg-red-700">
              {classModal.mode === "add" ? "Add" : "Update"} Class
            </Button>
          </div>
        </form>
      </Modal>

      {/* Class Assignment Modal */}
      <ClassAssignmentModal
        isOpen={classAssignmentModal.show}
        onClose={() => setClassAssignmentModal({ show: false, classData: {} })}
        classData={classAssignmentModal.classData}
        trainers={trainers}
        onSubmit={handleClassAssignment}
      />
    </div>
  );
};

export default AdminDash;