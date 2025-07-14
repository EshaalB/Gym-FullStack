import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks for admin dashboard
export const fetchAdminStats = createAsyncThunk(
  'dashboard/fetchAdminStats',
  async (accessToken) => {
    const response = await fetch('http://localhost:3500/api/users/stats/overview', {
      headers: { 'Authorization': `Bearer ${accessToken}` },
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch admin stats');
    return await response.json();
  }
);

export const fetchAdminUsers = createAsyncThunk(
  'dashboard/fetchAdminUsers',
  async ({ accessToken, page = 1, limit = 10 }) => {
    const response = await fetch(`http://localhost:3500/api/users?page=${page}&limit=${limit}`, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
      credentials: 'include',
    });
    if (!response.ok) {
      let errorMsg = 'Failed to fetch users';
      try {
        const errorData = await response.json();
        errorMsg = errorData.error || errorData.message || errorMsg;
        // Log the error details for debugging
        console.error('fetchAdminUsers error:', errorData);
      } catch (e) {
        // If response is not JSON
        console.error('fetchAdminUsers error: Non-JSON response', e);
      }
      throw new Error(errorMsg);
    }
    const data = await response.json();
    return { users: data.users, pagination: data.pagination };
  }
);

export const fetchAdminTrainers = createAsyncThunk(
  'dashboard/fetchAdminTrainers',
  async (accessToken) => {
    const response = await fetch('http://localhost:3500/api/trainers', {
      headers: { 'Authorization': `Bearer ${accessToken}` },
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch trainers');
    const data = await response.json();
    return data.trainers;
  }
);

export const fetchAdminPlans = createAsyncThunk(
  'dashboard/fetchAdminPlans',
  async (accessToken) => {
    const response = await fetch('http://localhost:3500/api/plans', {
      headers: { 'Authorization': `Bearer ${accessToken}` },
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch plans');
    const data = await response.json();
    return data.plans;
  }
);

export const fetchAdminClasses = createAsyncThunk(
  'dashboard/fetchAdminClasses',
  async (accessToken) => {
    const response = await fetch('http://localhost:3500/api/classes', {
      headers: { 'Authorization': `Bearer ${accessToken}` },
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch classes');
    const data = await response.json();
    return data.classes;
  }
);

export const fetchAdminPayments = createAsyncThunk(
  'dashboard/fetchAdminPayments',
  async (accessToken) => {
    const response = await fetch('http://localhost:3500/api/payments/pending', {
      headers: { 'Authorization': `Bearer ${accessToken}` },
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch payments');
    const data = await response.json();
    return data.pendingPayments;
  }
);

// Trainer dashboard thunks
export const fetchTrainerStats = createAsyncThunk(
  'dashboard/fetchTrainerStats',
  async (accessToken) => {
    const response = await fetch('http://localhost:3500/api/trainers/dashboard', {
      headers: { 'Authorization': `Bearer ${accessToken}` },
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch trainer stats');
    return await response.json();
  }
);

// Trainer classes thunk
export const fetchTrainerClasses = createAsyncThunk(
  'dashboard/fetchTrainerClasses',
  async (accessToken) => {
    const response = await fetch('http://localhost:3500/api/trainers/classes', {
      headers: { 'Authorization': `Bearer ${accessToken}` },
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch trainer classes');
    const data = await response.json();
    return data.classes;
  }
);

// Trainer attendance thunk
export const fetchTrainerAttendance = createAsyncThunk(
  'dashboard/fetchTrainerAttendance',
  async ({ accessToken, classId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:3500/api/attendance/class/${classId}`, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
        credentials: 'include',
      });
      if (!response.ok) {
        let errorMsg = 'Failed to fetch attendance';
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorData.message || errorMsg;
          // Log the error details for debugging
          console.error('fetchTrainerAttendance error:', errorData);
        } catch (e) {
          // If response is not JSON
          console.error('fetchTrainerAttendance error: Non-JSON response', e);
        }
        return rejectWithValue(errorMsg);
      }
      const data = await response.json();
      // Defensive: ensure attendance is always an array
      return Array.isArray(data.attendance) ? data.attendance : [];
    } catch (error) {
      console.error('fetchTrainerAttendance error:', error);
      return rejectWithValue(error.message || 'Failed to fetch attendance');
    }
  }
);

// Trainer workout plans thunk
export const fetchTrainerWorkoutPlans = createAsyncThunk(
  'dashboard/fetchTrainerWorkoutPlans',
  async (accessToken) => {
    const response = await fetch('http://localhost:3500/api/trainers/workout-plans', {
      headers: { 'Authorization': `Bearer ${accessToken}` },
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch workout plans');
    const data = await response.json();
    return data.workoutPlans;
  }
);

export const markTrainerAttendance = createAsyncThunk(
  'dashboard/markTrainerAttendance',
  async ({ accessToken, classId, memberId, status }, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:3500/api/attendance/mark', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        credentials: 'include',
        body: JSON.stringify({ classId, memberId, attendanceStatus: status }),
      });
      if (!response.ok) {
        let errorMsg = 'Failed to mark attendance';
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorData.message || errorMsg;
          console.error('markTrainerAttendance error:', errorData);
        } catch (e) {
          console.error('markTrainerAttendance error: Non-JSON response', e);
        }
        return rejectWithValue(errorMsg);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('markTrainerAttendance error:', error);
      return rejectWithValue(error.message || 'Failed to mark attendance');
    }
  }
);

export const updateTrainerAttendance = createAsyncThunk(
  'dashboard/updateTrainerAttendance',
  async ({ accessToken, enrollmentId, currDate, attendanceStatus }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:3500/api/attendance/${enrollmentId}/${currDate}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        credentials: 'include',
        body: JSON.stringify({ attendanceStatus }),
      });
      if (!response.ok) {
        let errorMsg = 'Failed to update attendance';
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorData.message || errorMsg;
          console.error('updateTrainerAttendance error:', errorData);
        } catch (e) {
          console.error('updateTrainerAttendance error: Non-JSON response', e);
        }
        return rejectWithValue(errorMsg);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('updateTrainerAttendance error:', error);
      return rejectWithValue(error.message || 'Failed to update attendance');
    }
  }
);

export const assignTrainerWorkoutPlan = createAsyncThunk(
  'dashboard/assignTrainerWorkoutPlan',
  async ({ accessToken, memberId, planName, durationWeeks }, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:3500/api/trainers/workout-plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        credentials: 'include',
        body: JSON.stringify({ memberId, plan_name: planName, duration_weeks: durationWeeks }),
      });
      if (!response.ok) {
        let errorMsg = 'Failed to assign workout plan';
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorData.message || errorMsg;
          console.error('assignTrainerWorkoutPlan error:', errorData);
        } catch (e) {
          console.error('assignTrainerWorkoutPlan error: Non-JSON response', e);
        }
        return rejectWithValue(errorMsg);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('assignTrainerWorkoutPlan error:', error);
      return rejectWithValue(error.message || 'Failed to assign workout plan');
    }
  }
);

// User dashboard thunks
export const fetchUserStats = createAsyncThunk(
  'dashboard/fetchUserStats',
  async ({ accessToken, userId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:3500/api/users/stats?userId=${userId}`, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
        credentials: 'include',
      });
      if (!response.ok) {
        let errorMsg = `Failed to fetch user stats (${response.status})`;
        if (response.status === 401) errorMsg = 'Unauthorized: Please login again.';
        if (response.status === 403) errorMsg = 'Forbidden: You do not have access.';
        if (response.status === 500) errorMsg = 'Server error. Please try again later.';
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorData.message || errorMsg;
        } catch { /* ignore */ }
        return rejectWithValue(errorMsg);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch user stats');
    }
  }
);

export const fetchUserClasses = createAsyncThunk(
  'dashboard/fetchUserClasses',
  async ({ accessToken, userId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:3500/api/users/${userId}/classes`, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
        credentials: 'include',
      });
      if (!response.ok) {
        let errorMsg = `Failed to fetch user classes (${response.status})`;
        if (response.status === 401) errorMsg = 'Unauthorized: Please login again.';
        if (response.status === 403) errorMsg = 'Forbidden: You do not have access.';
        if (response.status === 500) errorMsg = 'Server error. Please try again later.';
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorData.message || errorMsg;
        } catch { /* ignore */ }
        return rejectWithValue(errorMsg);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch user classes');
    }
  }
);

export const fetchUserPlans = createAsyncThunk(
  'dashboard/fetchUserPlans',
  async ({ accessToken, userId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:3500/api/plans/user/${userId}`, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
        credentials: 'include',
      });
      if (!response.ok) {
        let errorMsg = `Failed to fetch user plans (${response.status})`;
        if (response.status === 401) errorMsg = 'Unauthorized: Please login again.';
        if (response.status === 403) errorMsg = 'Forbidden: You do not have access.';
        if (response.status === 500) errorMsg = 'Server error. Please try again later.';
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorData.message || errorMsg;
        } catch { /* ignore */ }
        return rejectWithValue(errorMsg);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch user plans');
    }
  }
);

export const fetchUserAttendance = createAsyncThunk(
  'dashboard/fetchUserAttendance',
  async ({ accessToken, userId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:3500/api/attendance/user/${userId}`, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
        credentials: 'include',
      });
      if (!response.ok) {
        let errorMsg = `Failed to fetch user attendance (${response.status})`;
        if (response.status === 401) errorMsg = 'Unauthorized: Please login again.';
        if (response.status === 403) errorMsg = 'Forbidden: You do not have access.';
        if (response.status === 500) errorMsg = 'Server error. Please try again later.';
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorData.message || errorMsg;
        } catch { /* ignore */ }
        return rejectWithValue(errorMsg);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch user attendance');
    }
  }
);

export const fetchUserPayments = createAsyncThunk(
  'dashboard/fetchUserPayments',
  async ({ accessToken, userId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:3500/api/payments/user/${userId}`, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
        credentials: 'include',
      });
      if (!response.ok) {
        let errorMsg = `Failed to fetch user payments (${response.status})`;
        if (response.status === 401) errorMsg = 'Unauthorized: Please login again.';
        if (response.status === 403) errorMsg = 'Forbidden: You do not have access.';
        if (response.status === 500) errorMsg = 'Server error. Please try again later.';
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorData.message || errorMsg;
        } catch { /* ignore */ }
        return rejectWithValue(errorMsg);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch user payments');
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'dashboard/fetchUserProfile',
  async ({ accessToken, userId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:3500/api/users/${userId}`, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
        credentials: 'include',
      });
      if (!response.ok) {
        let errorMsg = `Failed to fetch user profile (${response.status})`;
        if (response.status === 401) errorMsg = 'Unauthorized: Please login again.';
        if (response.status === 403) errorMsg = 'Forbidden: You do not have access.';
        if (response.status === 500) errorMsg = 'Server error. Please try again later.';
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorData.message || errorMsg;
        } catch { /* ignore */ }
        return rejectWithValue(errorMsg);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch user profile');
    }
  }
);

export const fetchUserNotifications = createAsyncThunk(
  'dashboard/fetchUserNotifications',
  async ({ accessToken, userId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:3500/api/notifications/user/${userId}`, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
        credentials: 'include',
      });
      if (!response.ok) {
        let errorMsg = `Failed to fetch user notifications (${response.status})`;
        if (response.status === 401) errorMsg = 'Unauthorized: Please login again.';
        if (response.status === 403) errorMsg = 'Forbidden: You do not have access.';
        if (response.status === 500) errorMsg = 'Server error. Please try again later.';
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorData.message || errorMsg;
        } catch { /* ignore */ }
        return rejectWithValue(errorMsg);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch user notifications');
    }
  }
);

export const bookUserClass = createAsyncThunk(
  'dashboard/bookUserClass',
  async ({ accessToken, userId, classId }, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:3500/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        credentials: 'include',
        body: JSON.stringify({ userId, classId }),
      });
      if (!response.ok) {
        let errorMsg = `Failed to book class (${response.status})`;
        if (response.status === 401) errorMsg = 'Unauthorized: Please login again.';
        if (response.status === 403) errorMsg = 'Forbidden: You do not have access.';
        if (response.status === 500) errorMsg = 'Server error. Please try again later.';
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorData.message || errorMsg;
        } catch { /* ignore */ }
        return rejectWithValue(errorMsg);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to book class');
    }
  }
);

export const renewMembership = createAsyncThunk(
  'dashboard/renewMembership',
  async ({ accessToken, userId, period }, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:3500/api/memberships/renew', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        credentials: 'include',
        body: JSON.stringify({ userId, period }),
      });
      if (!response.ok) {
        let errorMsg = `Failed to renew membership (${response.status})`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorData.message || errorMsg;
        } catch { /* ignore */ }
        return rejectWithValue(errorMsg);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to renew membership');
    }
  }
);

export const contactTrainer = createAsyncThunk(
  'dashboard/contactTrainer',
  async ({ accessToken, userId, trainerId, message }, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:3500/api/messages/trainer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        credentials: 'include',
        body: JSON.stringify({ userId, trainerId, message }),
      });
      if (!response.ok) {
        let errorMsg = `Failed to send message to trainer (${response.status})`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorData.message || errorMsg;
        } catch { /* ignore */ }
        return rejectWithValue(errorMsg);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to send message to trainer');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'dashboard/updateUserProfile',
  async ({ accessToken, userId, profile }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:3500/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        credentials: 'include',
        body: JSON.stringify(profile),
      });
      if (!response.ok) {
        let errorMsg = `Failed to update profile (${response.status})`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorData.message || errorMsg;
        } catch { /* ignore */ }
        return rejectWithValue(errorMsg);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update profile');
    }
  }
);

export const sendSupportRequest = createAsyncThunk(
  'dashboard/sendSupportRequest',
  async ({ accessToken, userId, subject, message }, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:3500/api/support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        credentials: 'include',
        body: JSON.stringify({ userId, subject, message }),
      });
      if (!response.ok) {
        let errorMsg = `Failed to send support request (${response.status})`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorData.message || errorMsg;
        } catch { /* ignore */ }
        return rejectWithValue(errorMsg);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to send support request');
    }
  }
);

const initialState = {
  admin: {
    stats: {},
    users: [],
    usersPagination: { page: 1, limit: 10, total: 0, totalPages: 1, hasNext: false, hasPrev: false },
    trainers: [],
    plans: [],
    classes: [],
    payments: [],
    loading: false,
    error: null,
    modals: {
      user: { show: false, mode: 'add', user: {} },
      trainer: { show: false, mode: 'add', trainer: {} },
      plan: { show: false, mode: 'add', plan: {} },
      class: { show: false, mode: 'add', classObj: {} },
      classAssignment: { show: false, classData: {} },
    },
  },
  trainer: {
    stats: {},
    classes: [],
    members: [],
    plans: [],
    attendance: [],
    workoutPlans: [],
    loading: false,
    error: null,
    modals: {},
    planAssignLoading: false,
    planAssignError: null,
  },
  user: {
    stats: {},
    classes: [],
    plans: [],
    attendance: [],
    payments: [],
    profile: {},
    notifications: [],
    loading: false,
    error: null,
    modals: {},
    // Add loading/error for each feature
    classesLoading: false,
    classesError: null,
    plansLoading: false,
    plansError: null,
    attendanceLoading: false,
    attendanceError: null,
    paymentsLoading: false,
    paymentsError: null,
    profileLoading: false,
    profileError: null,
    notificationsLoading: false,
    notificationsError: null,
    bookingLoading: false,
    bookingError: null,
    renewLoading: false,
    renewError: null,
    contactTrainerLoading: false,
    contactTrainerError: null,
    updateProfileLoading: false,
    updateProfileError: null,
    supportLoading: false,
    supportError: null,
  },
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setAdminModal(state, action) {
      state.admin.modals = { ...state.admin.modals, ...action.payload };
    },
    // Add reducers for updating dashboard data, toggling modals, etc.
  },
  extraReducers: (builder) => {
    builder
      // Stats
      .addCase(fetchAdminStats.pending, (state) => {
        state.admin.loading = true;
        state.admin.error = null;
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.admin.loading = false;
        state.admin.stats = action.payload;
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.admin.loading = false;
        state.admin.error = action.error.message;
      })
      // Users
      .addCase(fetchAdminUsers.pending, (state) => {
        state.admin.loading = true;
        state.admin.error = null;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.admin.loading = false;
        state.admin.users = action.payload.users;
        state.admin.usersPagination = action.payload.pagination || initialState.admin.usersPagination;
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.admin.loading = false;
        state.admin.error = action.error.message;
      })
      // Trainers
      .addCase(fetchAdminTrainers.pending, (state) => {
        state.admin.loading = true;
        state.admin.error = null;
      })
      .addCase(fetchAdminTrainers.fulfilled, (state, action) => {
        state.admin.loading = false;
        state.admin.trainers = action.payload;
      })
      .addCase(fetchAdminTrainers.rejected, (state, action) => {
        state.admin.loading = false;
        state.admin.error = action.error.message;
      })
      // Plans
      .addCase(fetchAdminPlans.pending, (state) => {
        state.admin.loading = true;
        state.admin.error = null;
      })
      .addCase(fetchAdminPlans.fulfilled, (state, action) => {
        state.admin.loading = false;
        state.admin.plans = action.payload;
      })
      .addCase(fetchAdminPlans.rejected, (state, action) => {
        state.admin.loading = false;
        state.admin.error = action.error.message;
      })
      // Classes
      .addCase(fetchAdminClasses.pending, (state) => {
        state.admin.loading = true;
        state.admin.error = null;
      })
      .addCase(fetchAdminClasses.fulfilled, (state, action) => {
        state.admin.loading = false;
        state.admin.classes = action.payload;
      })
      .addCase(fetchAdminClasses.rejected, (state, action) => {
        state.admin.loading = false;
        state.admin.error = action.error.message;
      })
      // Payments
      .addCase(fetchAdminPayments.pending, (state) => {
        state.admin.loading = true;
        state.admin.error = null;
      })
      .addCase(fetchAdminPayments.fulfilled, (state, action) => {
        state.admin.loading = false;
        state.admin.payments = action.payload;
      })
      .addCase(fetchAdminPayments.rejected, (state, action) => {
        state.admin.loading = false;
        state.admin.error = action.error.message;
      })
      // Trainer stats
      .addCase(fetchTrainerStats.pending, (state) => {
        state.trainer.loading = true;
        state.trainer.error = null;
      })
      .addCase(fetchTrainerStats.fulfilled, (state, action) => {
        state.trainer.loading = false;
        state.trainer.stats = action.payload;
      })
      .addCase(fetchTrainerStats.rejected, (state, action) => {
        state.trainer.loading = false;
        state.trainer.error = action.error.message;
      })
      // Trainer classes
      .addCase(fetchTrainerClasses.pending, (state) => {
        state.trainer.loading = true;
        state.trainer.error = null;
      })
      .addCase(fetchTrainerClasses.fulfilled, (state, action) => {
        state.trainer.loading = false;
        state.trainer.classes = action.payload;
      })
      .addCase(fetchTrainerClasses.rejected, (state, action) => {
        state.trainer.loading = false;
        state.trainer.error = action.error.message;
      })
      // Trainer attendance
      .addCase(fetchTrainerAttendance.pending, (state) => {
        state.trainer.loading = true;
        state.trainer.error = null;
      })
      .addCase(fetchTrainerAttendance.fulfilled, (state, action) => {
        state.trainer.loading = false;
        state.trainer.attendance = action.payload;
      })
      .addCase(fetchTrainerAttendance.rejected, (state, action) => {
        state.trainer.loading = false;
        state.trainer.error = action.error.message;
      })
      // Trainer workout plans
      .addCase(fetchTrainerWorkoutPlans.pending, (state) => {
        state.trainer.loading = true;
        state.trainer.error = null;
      })
      .addCase(fetchTrainerWorkoutPlans.fulfilled, (state, action) => {
        state.trainer.loading = false;
        state.trainer.workoutPlans = action.payload;
      })
      .addCase(fetchTrainerWorkoutPlans.rejected, (state, action) => {
        state.trainer.loading = false;
        state.trainer.error = action.error.message;
      })
      // Plan assignment
      .addCase(assignTrainerWorkoutPlan.pending, (state) => {
        state.trainer.planAssignLoading = true;
        state.trainer.planAssignError = null;
      })
      .addCase(assignTrainerWorkoutPlan.fulfilled, (state) => {
        state.trainer.planAssignLoading = false;
        state.trainer.planAssignError = null;
      })
      .addCase(assignTrainerWorkoutPlan.rejected, (state, action) => {
        state.trainer.planAssignLoading = false;
        state.trainer.planAssignError = action.payload || action.error.message;
      })
      // User stats
      .addCase(fetchUserStats.pending, (state) => {
        state.user.loading = true;
        state.user.error = null;
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.user.loading = false;
        state.user.stats = action.payload;
      })
      .addCase(fetchUserStats.rejected, (state, action) => {
        state.user.loading = false;
        state.user.error = action.payload || action.error.message;
      })
      // User classes
      .addCase(fetchUserClasses.pending, (state) => {
        state.user.classesLoading = true;
        state.user.classesError = null;
      })
      .addCase(fetchUserClasses.fulfilled, (state, action) => {
        state.user.classesLoading = false;
        state.user.classes = action.payload.classes || [];
      })
      .addCase(fetchUserClasses.rejected, (state, action) => {
        state.user.classesLoading = false;
        state.user.classesError = action.payload || action.error.message;
      })
      // User plans
      .addCase(fetchUserPlans.pending, (state) => {
        state.user.plansLoading = true;
        state.user.plansError = null;
      })
      .addCase(fetchUserPlans.fulfilled, (state, action) => {
        state.user.plansLoading = false;
        state.user.plans = action.payload.plans || [];
      })
      .addCase(fetchUserPlans.rejected, (state, action) => {
        state.user.plansLoading = false;
        state.user.plansError = action.payload || action.error.message;
      })
      // User attendance
      .addCase(fetchUserAttendance.pending, (state) => {
        state.user.attendanceLoading = true;
        state.user.attendanceError = null;
      })
      .addCase(fetchUserAttendance.fulfilled, (state, action) => {
        state.user.attendanceLoading = false;
        state.user.attendance = action.payload.attendance || [];
      })
      .addCase(fetchUserAttendance.rejected, (state, action) => {
        state.user.attendanceLoading = false;
        state.user.attendanceError = action.payload || action.error.message;
      })
      // User payments
      .addCase(fetchUserPayments.pending, (state) => {
        state.user.paymentsLoading = true;
        state.user.paymentsError = null;
      })
      .addCase(fetchUserPayments.fulfilled, (state, action) => {
        state.user.paymentsLoading = false;
        state.user.payments = action.payload.payments || [];
      })
      .addCase(fetchUserPayments.rejected, (state, action) => {
        state.user.paymentsLoading = false;
        state.user.paymentsError = action.payload || action.error.message;
      })
      // User profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.user.profileLoading = true;
        state.user.profileError = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.user.profileLoading = false;
        state.user.profile = action.payload.user || {};
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.user.profileLoading = false;
        state.user.profileError = action.payload || action.error.message;
      })
      // User notifications
      .addCase(fetchUserNotifications.pending, (state) => {
        state.user.notificationsLoading = true;
        state.user.notificationsError = null;
      })
      .addCase(fetchUserNotifications.fulfilled, (state, action) => {
        state.user.notificationsLoading = false;
        state.user.notifications = action.payload.notifications || [];
      })
      .addCase(fetchUserNotifications.rejected, (state, action) => {
        state.user.notificationsLoading = false;
        state.user.notificationsError = action.payload || action.error.message;
      })
      // Book class
      .addCase(bookUserClass.pending, (state) => {
        state.user.bookingLoading = true;
        state.user.bookingError = null;
      })
      .addCase(bookUserClass.fulfilled, (state) => {
        state.user.bookingLoading = false;
        state.user.bookingError = null;
      })
      .addCase(bookUserClass.rejected, (state, action) => {
        state.user.bookingLoading = false;
        state.user.bookingError = action.payload || action.error.message;
      })
      // Renew membership
      .addCase(renewMembership.pending, (state) => {
        state.user.renewLoading = true;
        state.user.renewError = null;
      })
      .addCase(renewMembership.fulfilled, (state) => {
        state.user.renewLoading = false;
        state.user.renewError = null;
      })
      .addCase(renewMembership.rejected, (state, action) => {
        state.user.renewLoading = false;
        state.user.renewError = action.payload || action.error.message;
      })
      // Contact trainer
      .addCase(contactTrainer.pending, (state) => {
        state.user.contactTrainerLoading = true;
        state.user.contactTrainerError = null;
      })
      .addCase(contactTrainer.fulfilled, (state) => {
        state.user.contactTrainerLoading = false;
        state.user.contactTrainerError = null;
      })
      .addCase(contactTrainer.rejected, (state, action) => {
        state.user.contactTrainerLoading = false;
        state.user.contactTrainerError = action.payload || action.error.message;
      })
      // Update profile
      .addCase(updateUserProfile.pending, (state) => {
        state.user.updateProfileLoading = true;
        state.user.updateProfileError = null;
      })
      .addCase(updateUserProfile.fulfilled, (state) => {
        state.user.updateProfileLoading = false;
        state.user.updateProfileError = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.user.updateProfileLoading = false;
        state.user.updateProfileError = action.payload || action.error.message;
      })
      // Support request
      .addCase(sendSupportRequest.pending, (state) => {
        state.user.supportLoading = true;
        state.user.supportError = null;
      })
      .addCase(sendSupportRequest.fulfilled, (state) => {
        state.user.supportLoading = false;
        state.user.supportError = null;
      })
      .addCase(sendSupportRequest.rejected, (state, action) => {
        state.user.supportLoading = false;
        state.user.supportError = action.payload || action.error.message;
      });
  },
});

// Selectors
export const selectAdminStats = (state) => state.dashboard.admin.stats;
export const selectAdminUsers = (state) => state.dashboard.admin.users;
export const selectAdminUsersPagination = (state) => state.dashboard.admin.usersPagination;
export const selectAdminTrainers = (state) => state.dashboard.admin.trainers;
export const selectAdminPlans = (state) => state.dashboard.admin.plans;
export const selectAdminClasses = (state) => state.dashboard.admin.classes;
export const selectAdminPayments = (state) => state.dashboard.admin.payments;
export const selectAdminLoading = (state) => state.dashboard.admin.loading;
export const selectAdminError = (state) => state.dashboard.admin.error;

// Trainer selectors
export const selectTrainerStats = (state) => state.dashboard.trainer.stats;
export const selectTrainerLoading = (state) => state.dashboard.trainer.loading;
export const selectTrainerError = (state) => state.dashboard.trainer.error;
export const selectTrainerClasses = (state) => state.dashboard.trainer.classes;
export const selectTrainerAttendance = (state) => state.dashboard.trainer.attendance;
export const selectTrainerAttendanceError = (state) => state.dashboard.trainer.error;
export const selectTrainerAttendanceLoading = (state) => state.dashboard.trainer.loading;
export const selectTrainerWorkoutPlans = (state) => state.dashboard.trainer.workoutPlans;
export const selectTrainerPlanAssignLoading = (state) => state.dashboard.trainer.planAssignLoading;
export const selectTrainerPlanAssignError = (state) => state.dashboard.trainer.planAssignError;

// User selectors
export const selectUserStats = (state) => state.dashboard.user.stats;
export const selectUserLoading = (state) => state.dashboard.user.loading;
export const selectUserError = (state) => state.dashboard.user.error;
export const selectUserClasses = (state) => state.dashboard.user.classes;
export const selectUserClassesLoading = (state) => state.dashboard.user.classesLoading;
export const selectUserClassesError = (state) => state.dashboard.user.classesError;
export const selectUserPlans = (state) => state.dashboard.user.plans;
export const selectUserPlansLoading = (state) => state.dashboard.user.plansLoading;
export const selectUserPlansError = (state) => state.dashboard.user.plansError;
export const selectUserAttendance = (state) => state.dashboard.user.attendance;
export const selectUserAttendanceLoading = (state) => state.dashboard.user.attendanceLoading;
export const selectUserAttendanceError = (state) => state.dashboard.user.attendanceError;
export const selectUserPayments = (state) => state.dashboard.user.payments;
export const selectUserPaymentsLoading = (state) => state.dashboard.user.paymentsLoading;
export const selectUserPaymentsError = (state) => state.dashboard.user.paymentsError;
export const selectUserProfile = (state) => state.dashboard.user.profile;
export const selectUserProfileLoading = (state) => state.dashboard.user.profileLoading;
export const selectUserProfileError = (state) => state.dashboard.user.profileError;
export const selectUserNotifications = (state) => state.dashboard.user.notifications;
export const selectUserNotificationsLoading = (state) => state.dashboard.user.notificationsLoading;
export const selectUserNotificationsError = (state) => state.dashboard.user.notificationsError;
export const selectUserBookingLoading = (state) => state.dashboard.user.bookingLoading;
export const selectUserBookingError = (state) => state.dashboard.user.bookingError;
export const selectUserRenewLoading = (state) => state.dashboard.user.renewLoading;
export const selectUserRenewError = (state) => state.dashboard.user.renewError;
export const selectUserContactTrainerLoading = (state) => state.dashboard.user.contactTrainerLoading;
export const selectUserContactTrainerError = (state) => state.dashboard.user.contactTrainerError;
export const selectUserUpdateProfileLoading = (state) => state.dashboard.user.updateProfileLoading;
export const selectUserUpdateProfileError = (state) => state.dashboard.user.updateProfileError;
export const selectUserSupportLoading = (state) => state.dashboard.user.supportLoading;
export const selectUserSupportError = (state) => state.dashboard.user.supportError;

export const { setAdminModal } = dashboardSlice.actions;
export default dashboardSlice.reducer; 