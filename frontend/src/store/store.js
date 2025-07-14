import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import bookingsReducer from './bookingsSlice';
import dashboardReducer from './dashboardSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    bookings: bookingsReducer,
    dashboard: dashboardReducer,
    // Add more slices as you refactor features
  },
});

export default store; 