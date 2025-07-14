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
  },
  user: {
    stats: {},
    classes: [],
    plans: [],
    attendance: [],
    payments: [],
    loading: false,
    error: null,
    modals: {},
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

export const { setAdminModal } = dashboardSlice.actions;
export default dashboardSlice.reducer; 