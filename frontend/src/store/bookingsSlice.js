import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  bookings: [],
  loading: false,
  error: null,
};

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    fetchBookingsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchBookingsSuccess(state, action) {
      state.loading = false;
      state.bookings = action.payload;
      state.error = null;
    },
    fetchBookingsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    addBooking(state, action) {
      state.bookings.push(action.payload);
    },
    cancelBooking(state, action) {
      state.bookings = state.bookings.filter(b => b.id !== action.payload);
    },
    clearBookings(state) {
      state.bookings = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const { fetchBookingsStart, fetchBookingsSuccess, fetchBookingsFailure, addBooking, cancelBooking, clearBookings } = bookingsSlice.actions;
export default bookingsSlice.reducer; 