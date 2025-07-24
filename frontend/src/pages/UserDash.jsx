import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import UserSidebar from "../components/user/UserSidebar";
import { FaDumbbell, FaCalendarAlt, FaMoneyBill, FaWeight } from "react-icons/fa";
import {
  fetchUserPlans,
  fetchUserClasses,
  fetchUserPayments,
  selectUserPlans,
  selectUserPlansLoading,
  selectUserPlansError,
  selectUserClasses,
  selectUserClassesLoading,
  selectUserClassesError,
  selectUserPayments,
  selectUserPaymentsLoading,
  selectUserPaymentsError,
} from "../store/dashboardSlice";
import { setUser, setToken } from '../store/authSlice';
import { logout } from '../store/authSlice';

const DashboardNavbar = ({ user, onLogout }) => (
  <nav className="w-full bg-black/80 border-b border-red-500/30 px-8 py-4 flex items-center justify-between">
    <div className="text-2xl font-bold text-red-500 tracking-wide">Levels Gym</div>
    <div className="flex items-center gap-6">
      <span className="text-white text-lg">Welcome{user?.fName ? `, ${user.fName}` : ''}!</span>
      <button
        onClick={onLogout}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold"
      >
        Logout
      </button>
    </div>
  </nav>
);

const BMICalculator = () => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState("");

  const calculateBMI = (e) => {
    e.preventDefault();
    if (!height || !weight) return;
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (h > 0 && w > 0) {
      const bmiValue = w / (h * h);
      setBmi(bmiValue.toFixed(2));
      if (bmiValue < 18.5) setCategory("Underweight");
      else if (bmiValue < 25) setCategory("Normal weight");
      else if (bmiValue < 30) setCategory("Overweight");
      else setCategory("Obese");
    }
  };

  return (
    <div className="bg-black/70 rounded-xl shadow-lg p-6 mb-6 border border-white/10">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-red-400 text-xl"><FaWeight /></span>
        <h3 className="text-lg font-bold text-white">BMI Calculator</h3>
      </div>
      <form onSubmit={calculateBMI} className="space-y-2">
        <input
          type="number"
          placeholder="Height (cm)"
          value={height}
          onChange={e => setHeight(e.target.value)}
          className="bg-black/30 border border-white/20 rounded px-2 py-1 w-full text-white"
        />
        <input
          type="number"
          placeholder="Weight (kg)"
          value={weight}
          onChange={e => setWeight(e.target.value)}
          className="bg-black/30 border border-white/20 rounded px-2 py-1 w-full text-white"
        />
        <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold w-full">Calculate</button>
      </form>
      {bmi && (
        <div className="mt-4 text-white">
          <div><b>BMI:</b> {bmi}</div>
          <div><b>Category:</b> {category}</div>
        </div>
      )}
    </div>
  );
};

const UserDash = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const token = useSelector(state => state.auth.token);
  const [currentView, setCurrentView] = useState("/userdash");

  // Sync Redux state from localStorage on mount (if needed)
  useEffect(() => {
    if (!user) {
      const userData = localStorage.getItem('userData');
      if (userData) {
        try {
          dispatch(setUser(JSON.parse(userData)));
        } catch {/* ignore JSON parse errors */}
      }
    }
    if (!token) {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        dispatch(setToken(accessToken));
      }
    }
  }, [dispatch, user, token]);

  useEffect(() => {
    if (!token || !user) {
      navigate('/login');
      return;
    }
    dispatch(fetchUserPlans({ accessToken: token, userId: user.userId }));
    dispatch(fetchUserClasses({ accessToken: token, userId: user.userId }));
    dispatch(fetchUserPayments({ accessToken: token, userId: user.userId }));
  }, [token, user, dispatch, navigate]);

  // Selectors
  const plans = useSelector(selectUserPlans);
  const plansLoading = useSelector(selectUserPlansLoading);
  const plansError = useSelector(selectUserPlansError);

  const classes = useSelector(selectUserClasses);
  const classesLoading = useSelector(selectUserClassesLoading);
  const classesError = useSelector(selectUserClassesError);

  const payments = useSelector(selectUserPayments);
  const paymentsLoading = useSelector(selectUserPaymentsLoading);
  const paymentsError = useSelector(selectUserPaymentsError);

  // Card component
  const Card = ({ title, icon, children }) => (
    <div className="bg-black/70 rounded-xl shadow-lg p-6 mb-6 border border-white/10">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-red-400 text-xl">{icon}</span>
        <h3 className="text-lg font-bold text-white">{title}</h3>
      </div>
      {children}
    </div>
  );

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userData');
    navigate('/login');
  };

  return (
    <div className="min-h-screen w-full bg-black flex flex-col">
      <DashboardNavbar user={user} onLogout={handleLogout} />
      <div className="flex flex-1">
        <UserSidebar currentView={currentView} setCurrentView={setCurrentView} />
        <main className="flex-1 px-8 py-10 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Workout Plans */}
            <Card title="Workout Plans" icon={<FaDumbbell />}>
              {plansLoading ? (
                <div className="text-white">Loading...</div>
              ) : plansError ? (
                <div className="text-red-400">{plansError}</div>
              ) : plans && plans.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-white border border-white/10 rounded-lg">
                    <thead>
                      <tr className="bg-black/40">
                        <th className="px-4 py-2">Plan Name</th>
                        <th className="px-4 py-2">Duration</th>
                        <th className="px-4 py-2">Start Date</th>
                        <th className="px-4 py-2">End Date</th>
                        <th className="px-4 py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {plans.map((p, i) => (
                        <tr key={p.planId || i} className="border-t border-white/10">
                          <td className="px-4 py-2">{p.planName || p.name || ''}</td>
                          <td className="px-4 py-2">{p.durationWeeks ? `${p.durationWeeks} weeks` : p.duration || ''}</td>
                          <td className="px-4 py-2">{p.startDate ? new Date(p.startDate).toLocaleDateString() : ''}</td>
                          <td className="px-4 py-2">{p.endDate ? new Date(p.endDate).toLocaleDateString() : ''}</td>
                          <td className="px-4 py-2">{p.status || 'Active'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-white">No workout plans found.</div>
              )}
            </Card>

            {/* Classes */}
            <Card title="My Classes" icon={<FaCalendarAlt />}>
              {classesLoading ? (
                <div className="text-white">Loading...</div>
              ) : classesError ? (
                <div className="text-red-400">{classesError}</div>
              ) : classes && classes.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-white border border-white/10 rounded-lg">
                    <thead>
                      <tr className="bg-black/40">
                        <th className="px-4 py-2">Class Name</th>
                        <th className="px-4 py-2">Day</th>
                        <th className="px-4 py-2">Trainer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classes.map((c, i) => (
                        <tr key={c.classId || i} className="border-t border-white/10">
                          <td className="px-4 py-2">{c.className}</td>
                          <td className="px-4 py-2">{c.classDay || c.day || ''}</td>
                          <td className="px-4 py-2">{c.trainerName || ''}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-white">No classes found.</div>
              )}
            </Card>

            {/* Payments */}
            <Card title="Payment History" icon={<FaMoneyBill />}>
              {paymentsLoading ? (
                <div className="text-white">Loading...</div>
              ) : paymentsError ? (
                <div className="text-red-400">{paymentsError}</div>
              ) : payments && payments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-white border border-white/10 rounded-lg">
                    <thead>
                      <tr className="bg-black/40">
                        <th className="px-4 py-2">Date</th>
                        <th className="px-4 py-2">Amount</th>
                        <th className="px-4 py-2">Method</th>
                        <th className="px-4 py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((p, i) => (
                        <tr key={p.paymentId || i} className="border-t border-white/10">
                          <td className="px-4 py-2">{p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : ''}</td>
                          <td className="px-4 py-2">{p.amount ? `Rs. ${p.amount}` : ''}</td>
                          <td className="px-4 py-2">{p.paymentMethod || ''}</td>
                          <td className="px-4 py-2">{p.status || ''}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-white">No payments found.</div>
              )}
            </Card>

            {/* BMI Calculator */}
            <BMICalculator />
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDash;