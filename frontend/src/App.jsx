import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import BarLoader from "./components/common/BarLoader";
import ScrollProgress from "./components/common/ScrollProgress";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Landing from "./pages/Landing.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Plans from "./pages/Plans.jsx";
import Trainers from "./pages/Trainers.jsx";
import Contact from "./pages/Contact.jsx";
import SignUp from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import UserDash from "./pages/UserDash.jsx";
import TrainerDash from "./pages/TrainerDash.jsx";
import AdminDash from "./pages/AdminDash.jsx";

// Auto-redirect component for authenticated users
const AutoRedirect = ({ children }) => {
  const location = useLocation();
  
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        const currentPath = location.pathname;
        
        // If user is on login/signup page but already authenticated, redirect to appropriate dashboard
        if (currentPath === '/login' || currentPath === '/signup') {
          switch (user.userRole) {
            case 'Admin':
              window.location.href = '/admindash';
              break;
            case 'Trainer':
              window.location.href = '/trainerdash';
              break;
            case 'Member':
              window.location.href = '/userdash';
              break;
            default:
              window.location.href = '/userdash';
          }
        }
      } catch (error) {
        // Clear invalid data
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userData');
      }
    }
  }, [location.pathname]);
  
  return children;
};

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const ShowNavbar = () => {
    const location = useLocation();
    // Show Navbar on all pages except dashboards
    return !["/userdash", "/trainerdash", "/admindash"].includes(location.pathname) ? <Navbar /> : null;
  };

  const MainContent = () => {
    const location = useLocation();
    const pathnames = location.pathname.split("/").filter((x) => x);
    const showBreadcrumb = pathnames.length > 0 && location.pathname !== "/";
    
    const paddingTop = showBreadcrumb ? "pt-32" : "pt-20";

    return (
      <main className={paddingTop}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/trainers" element={<Trainers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected Dashboard Routes */}
          <Route 
            path="/userdash" 
            element={
              <ProtectedRoute allowedRoles={['Member']}>
                <UserDash />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/trainerdash" 
            element={
              <ProtectedRoute allowedRoles={['Trainer']}>
                <TrainerDash />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admindash" 
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminDash />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch all route - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    );
  };

  return (
    <Router>
      {loading ? (
        <div className="h-screen w-screen flex items-center justify-center bg-black">
          <BarLoader />
        </div>
      ) : (
        <AutoRedirect>
          <ShowNavbar />
          <MainContent />
          <Footer />
          <ScrollProgress />
          
          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(0, 0, 0, 0.9)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '500',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#ffffff',
                },
                style: {
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#ffffff',
                },
                style: {
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                },
              },
              loading: {
                iconTheme: {
                  primary: '#3b82f6',
                  secondary: '#ffffff',
                },
                style: {
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                },
              },
            }}
          />
        </AutoRedirect>
      )}
    </Router>
  );
};

export default App;
