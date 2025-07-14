import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserStats,
  fetchUserClasses,
  fetchUserPlans,
  fetchUserAttendance,
  fetchUserPayments,
  fetchUserProfile,
  fetchUserNotifications,
  selectUserStats,
  selectUserLoading,
  selectUserError,
  selectUserClasses,
  selectUserClassesLoading,
  selectUserClassesError,
  selectUserPlans,
  selectUserPlansLoading,
  selectUserPlansError,
  selectUserAttendanceError,
  selectUserPayments,
  selectUserPaymentsLoading,
  selectUserPaymentsError,
  selectUserProfile,
  selectUserProfileLoading,
  selectUserProfileError,
  selectUserNotifications,
  selectUserNotificationsLoading,
  selectUserNotificationsError,
  bookUserClass,
  selectUserBookingLoading,
  selectUserBookingError,
  renewMembership,
  contactTrainer,
  updateUserProfile,
  sendSupportRequest,
  selectUserRenewLoading,
  selectUserRenewError,
  selectUserContactTrainerLoading,
  selectUserContactTrainerError,
  selectUserUpdateProfileLoading,
  selectUserUpdateProfileError,
  selectUserSupportLoading,
  selectUserSupportError
} from "../store/dashboardSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import UserHeader from "../components/UserHeader";
import UserSidebar from "../components/UserSidebar";
import { FaPlus, FaRedo, FaEnvelope, FaChartBar, FaCalendarAlt, FaDumbbell, FaMoneyBill, FaUser, FaWeight } from "react-icons/fa";
import BookClassModal from "../components/BookClassModal";
import BMICalculator from "../components/BMICalculator";
import RenewMembershipModal from "../components/RenewMembershipModal";
import ContactTrainerModal from "../components/ContactTrainerModal";
import EditProfileModal from "../components/EditProfileModal";
import SupportModal from "../components/SupportModal";

// Add ProfileDetailsCard component
const ProfileDetailsCard = ({ profile, updateProfileLoading, updateProfileError, onSave }) => {
  const [editMode, setEditMode] = React.useState(false);
  const [form, setForm] = React.useState({
    fName: profile.fName || '',
    lName: profile.lName || '',
    email: profile.email || '',
    gender: profile.gender || '',
    dateOfBirth: profile.dateOfBirth || '',
  });
  React.useEffect(() => {
    setForm({
      fName: profile.fName || '',
      lName: profile.lName || '',
      email: profile.email || '',
      gender: profile.gender || '',
      dateOfBirth: profile.dateOfBirth || '',
    });
  }, [profile]);
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = e => {
    e.preventDefault();
    onSave(form);
    setEditMode(false);
  };
  return (
    <div className="text-white space-y-2">
      {updateProfileError && <div className="text-red-400">{updateProfileError}</div>}
      {editMode ? (
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="flex gap-2">
            <input name="fName" value={form.fName} onChange={handleChange} className="bg-black/30 border border-white/20 rounded px-2 py-1 w-1/2" placeholder="First Name" />
            <input name="lName" value={form.lName} onChange={handleChange} className="bg-black/30 border border-white/20 rounded px-2 py-1 w-1/2" placeholder="Last Name" />
          </div>
          <input name="email" value={form.email} onChange={handleChange} className="bg-black/30 border border-white/20 rounded px-2 py-1 w-full" placeholder="Email" type="email" />
          <select name="gender" value={form.gender} onChange={handleChange} className="bg-black/30 border border-white/20 rounded px-2 py-1 w-full">
            <option value="">Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} className="bg-black/30 border border-white/20 rounded px-2 py-1 w-full" type="date" />
          <div className="flex gap-2 mt-2">
            <button type="submit" disabled={updateProfileLoading} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50">{updateProfileLoading ? 'Saving...' : 'Save'}</button>
            <button type="button" onClick={() => setEditMode(false)} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold">Cancel</button>
          </div>
        </form>
      ) : (
        <>
          <div><b>Name:</b> {profile.fName} {profile.lName}</div>
          <div><b>Email:</b> {profile.email}</div>
          <div><b>Role:</b> {profile.userRole}</div>
          <div><b>Gender:</b> {profile.gender}</div>
          <div><b>Date of Birth:</b> {profile.dateOfBirth}</div>
          {profile.membershipStatus && <div><b>Membership Status:</b> {profile.membershipStatus}</div>}
          {profile.membershipExpiry && <div><b>Membership Expiry:</b> {profile.membershipExpiry}</div>}
          <div><b>Status:</b> {profile.isActive ? 'Active' : 'Inactive'}</div>
          <button className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold" onClick={() => setEditMode(true)}>Edit Profile</button>
        </>
      )}
    </div>
  );
};

const UserDash = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const accessToken = localStorage.getItem('accessToken');
  const user = useSelector(state => state.auth.user);
  const [currentView, setCurrentView] = useState("/userdash");
  const [showBookModal, setShowBookModal] = useState(false);
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [showContactTrainerModal, setShowContactTrainerModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  // Selectors for all features
  const stats = useSelector(selectUserStats);
  const statsLoading = useSelector(selectUserLoading);
  const statsError = useSelector(selectUserError);

  const classes = useSelector(selectUserClasses);
  const classesLoading = useSelector(selectUserClassesLoading);
  const classesError = useSelector(selectUserClassesError);

  const plans = useSelector(selectUserPlans);
  const plansLoading = useSelector(selectUserPlansLoading);
  const plansError = useSelector(selectUserPlansError);

  const attendanceError = useSelector(selectUserAttendanceError);

  const payments = useSelector(selectUserPayments);
  const paymentsLoading = useSelector(selectUserPaymentsLoading);
  const paymentsError = useSelector(selectUserPaymentsError);

  const profile = useSelector(selectUserProfile);
  const profileLoading = useSelector(selectUserProfileLoading);
  const profileError = useSelector(selectUserProfileError);

  const notifications = useSelector(selectUserNotifications);
  const notificationsLoading = useSelector(selectUserNotificationsLoading);
  const notificationsError = useSelector(selectUserNotificationsError);

  const bookingLoading = useSelector(selectUserBookingLoading);
  const bookingError = useSelector(selectUserBookingError);

  const renewLoading = useSelector(selectUserRenewLoading);
  const renewError = useSelector(selectUserRenewError);
  const contactTrainerLoading = useSelector(selectUserContactTrainerLoading);
  const contactTrainerError = useSelector(selectUserContactTrainerError);
  const updateProfileLoading = useSelector(selectUserUpdateProfileLoading);
  const updateProfileError = useSelector(selectUserUpdateProfileError);
  const supportLoading = useSelector(selectUserSupportLoading);
  const supportError = useSelector(selectUserSupportError);

  useEffect(() => {
    if (!accessToken || !user) {
      navigate('/login');
      toast.error('Please login to access user dashboard');
      return;
    }
    dispatch(fetchUserStats({ accessToken, userId: user.userId }));
    dispatch(fetchUserClasses({ accessToken, userId: user.userId }));
    dispatch(fetchUserPlans({ accessToken, userId: user.userId }));
    dispatch(fetchUserAttendance({ accessToken, userId: user.userId }));
    dispatch(fetchUserPayments({ accessToken, userId: user.userId }));
    dispatch(fetchUserProfile({ accessToken, userId: user.userId }));
    dispatch(fetchUserNotifications({ accessToken, userId: user.userId }));
  }, [accessToken, user, dispatch, navigate]);

  useEffect(() => {
    if (statsError || classesError || plansError || attendanceError || paymentsError || profileError || notificationsError) {
      toast.error(statsError || classesError || plansError || attendanceError || paymentsError || profileError || notificationsError);
      if ((statsError || classesError || plansError || attendanceError || paymentsError || profileError || notificationsError)?.toLowerCase().includes('unauthorized')) {
        navigate('/login');
      }
    }
  }, [statsError, classesError, plansError, attendanceError, paymentsError, profileError, notificationsError, navigate]);

  // Book class handler
  const handleBookClass = async (classId) => {
    if (!classId) return;
    try {
      await dispatch(bookUserClass({ accessToken, userId: user.userId, classId })).unwrap();
      toast.success("Class booked successfully!");
      setShowBookModal(false);
      // Refresh classes
      dispatch(fetchUserClasses({ accessToken, userId: user.userId }));
    } catch (err) {
      toast.error(err || "Failed to book class");
    }
  };

  // Placeholder handlers for modal actions
  const handleRenewMembership = async (period) => {
    try {
      await dispatch(renewMembership({ accessToken, userId: user.userId, period })).unwrap();
      toast.success(`Membership renewed for ${period} month(s)!`);
      setShowRenewModal(false);
      // Refresh profile/membership data
      dispatch(fetchUserProfile({ accessToken, userId: user.userId }));
    } catch (err) {
      toast.error(err || "Failed to renew membership");
    }
  };
  const handleContactTrainer = async (message) => {
    try {
      // You may want to get trainerId from profile or state
      const trainerId = 1; // Replace with real trainerId
      await dispatch(contactTrainer({ accessToken, userId: user.userId, trainerId, message })).unwrap();
      toast.success("Message sent to trainer!");
      setShowContactTrainerModal(false);
    } catch (err) {
      toast.error(err || "Failed to send message to trainer");
    }
  };
  const handleEditProfile = async (updatedProfile) => {
    try {
      await dispatch(updateUserProfile({ accessToken, userId: user.userId, profile: updatedProfile })).unwrap();
      toast.success("Profile updated!");
      setShowEditProfileModal(false);
      // Refresh profile data
      dispatch(fetchUserProfile({ accessToken, userId: user.userId }));
    } catch (err) {
      toast.error(err || "Failed to update profile");
    }
  };
  const handleSupport = async ({ subject, message }) => {
    try {
      await dispatch(sendSupportRequest({ accessToken, userId: user.userId, subject, message })).unwrap();
      toast.success("Support request sent!");
      setShowSupportModal(false);
    } catch (err) {
      toast.error(err || "Failed to send support request");
    }
  };

  // Card component for consistent UI
  const Card = ({ title, icon, children }) => (
    <div className="bg-black/70 rounded-xl shadow-lg p-6 mb-6 border border-white/10">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-red-400 text-xl">{icon}</span>
        <h3 className="text-lg font-bold text-white">{title}</h3>
      </div>
      {children}
    </div>
  );

  // Main content based on currentView
  const renderContent = () => {
    switch (currentView) {
      case "/userdash":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Progress Tracking" icon={<FaChartBar />}>
                {statsLoading ? <div className="text-white">Loading...</div> : stats && (
                  <div className="text-white space-y-1">
                    <div>Total Classes: {stats.totalClasses ?? 0}</div>
                    <div>Classes Attended: {stats.classesAttended ?? 0}</div>
                    <div>Attendance Rate: {stats.attendanceRate ?? 0}%</div>
                    <div>Active Plans: {stats.activePlans ?? 0}</div>
                  </div>
                )}
              </Card>
              <Card title="Notifications" icon={<FaEnvelope />}>
                {notificationsLoading ? <div className="text-white">Loading...</div> : (
                  <ul className="text-white list-disc pl-5">
                    {notifications && notifications.length > 0 ? notifications.map((n, i) => (
                      <li key={n.id || i}>{n.message || n.text || JSON.stringify(n)}</li>
                    )) : <li>No notifications</li>}
                  </ul>
                )}
              </Card>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <Card title="Quick Actions" icon={<FaPlus />}>
                <div className="flex flex-wrap gap-3">
                  <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2" onClick={() => setShowBookModal(true)}><FaCalendarAlt /> Book Class</button>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2" onClick={() => setShowRenewModal(true)}><FaRedo /> Renew Membership</button>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2" onClick={() => setShowContactTrainerModal(true)}><FaEnvelope /> Contact Trainer</button>
                </div>
              </Card>
            </div>
            <BookClassModal
              isOpen={showBookModal || currentView === "/userdash/book"}
              onClose={() => { setShowBookModal(false); setCurrentView("/userdash"); }}
              availableClasses={classes}
              onBook={handleBookClass}
              loading={bookingLoading}
              error={bookingError}
            />
            <RenewMembershipModal
              isOpen={showRenewModal}
              onClose={() => setShowRenewModal(false)}
              currentStatus={profile?.membershipStatus || "Active"}
              expiryDate={profile?.membershipExpiry || "2024-12-31"}
              onRenew={handleRenewMembership}
              loading={renewLoading}
              error={renewError}
            />
            <ContactTrainerModal
              isOpen={showContactTrainerModal}
              onClose={() => setShowContactTrainerModal(false)}
              trainer={{ name: "John Doe", email: "trainer@example.com" }}
              onSend={handleContactTrainer}
              loading={contactTrainerLoading}
              error={contactTrainerError}
            />
            <EditProfileModal
              isOpen={showEditProfileModal}
              onClose={() => setShowEditProfileModal(false)}
              profile={profile}
              onSave={handleEditProfile}
              loading={updateProfileLoading}
              error={updateProfileError}
            />
            <SupportModal
              isOpen={showSupportModal}
              onClose={() => setShowSupportModal(false)}
              onSend={handleSupport}
              loading={supportLoading}
              error={supportError}
            />
          </>
        );
      case "/userdash/book":
        return (
          <>
            <BookClassModal
              isOpen={true}
              onClose={() => setCurrentView("/userdash")}
              availableClasses={classes}
              onBook={handleBookClass}
              loading={bookingLoading}
              error={bookingError}
            />
          </>
        );
      case "/userdash/classes":
        return (
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
                      <th className="px-4 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classes.map((c, i) => {
                      const isUpcoming = !c.classDate || new Date(c.classDate) >= new Date();
                      return (
                        <tr key={c.classId || i} className="border-t border-white/10">
                          <td className="px-4 py-2">{c.className}</td>
                          <td className="px-4 py-2">{c.classDay || c.day || ''}</td>
                          <td className="px-4 py-2">{c.trainerName || ''}</td>
                          <td className="px-4 py-2">{isUpcoming ? 'Upcoming' : 'Past'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-white">No classes found.</div>
            )}
          </Card>
        );
      case "/userdash/plans":
        return (
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
        );
      case "/userdash/payments":
        return (
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
                      <th className="px-4 py-2">Type</th>
                      <th className="px-4 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p, i) => (
                      <tr key={p.paymentId || i} className="border-t border-white/10">
                        <td className="px-4 py-2">{p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : ''}</td>
                        <td className="px-4 py-2">{p.amount ? `Rs. ${p.amount}` : ''}</td>
                        <td className="px-4 py-2">{p.paymentMethod || ''}</td>
                        <td className="px-4 py-2">{p.paymentType || ''}</td>
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
        );
      case "/userdash/profile":
        return (
          <Card title="Profile Overview" icon={<FaUser />}>
            {profileLoading ? (
              <div className="text-white">Loading...</div>
            ) : profileError ? (
              <div className="text-red-400">{profileError}</div>
            ) : profile ? (
              <ProfileDetailsCard
                profile={profile}
                updateProfileLoading={updateProfileLoading}
                updateProfileError={updateProfileError}
                onSave={handleEditProfile}
              />
            ) : (
              <div className="text-white">No profile data found.</div>
            )}
          </Card>
        );
      case "/userdash/support":
        return (
          <Card title="Support" icon={<FaEnvelope />}>
            <div className="text-white mb-4">For support, contact us at <a href="mailto:support@levelsgym.com" className="text-red-400 underline">support@levelsgym.com</a></div>
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold" onClick={() => setShowSupportModal(true)}>Send Support Request</button>
          </Card>
        );
      case "/userdash/bmi":
        return (
          <Card title="BMI Calculator" icon={<FaWeight />}>
            <BMICalculator />
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black flex flex-col">
      <UserHeader />
      <div className="flex flex-1">
        <div className="hidden md:block">
          <UserSidebar currentView={currentView} setCurrentView={setCurrentView} />
        </div>
        {/* Mobile Sidebar Toggle */}
        <div className="md:hidden flex items-center justify-between bg-black/60 px-4 py-3 border-b border-red-500/20">
          <button
            onClick={() => setCurrentView(currentView === "sidebar" ? "/userdash" : "sidebar")}
            className="text-white text-2xl focus:outline-none focus:ring-2 focus:ring-red-400"
            aria-label="Toggle sidebar"
          >
            &#9776;
          </button>
          <span className="text-lg font-bold text-white">User Panel</span>
        </div>
        {/* Main Content */}
        <main className="flex-1 p-3 sm:p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default UserDash;