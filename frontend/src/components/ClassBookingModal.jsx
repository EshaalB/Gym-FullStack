import React, { useState, useEffect } from 'react';
import { FaTimes, FaCalendarAlt, FaClock, FaUser, FaDumbbell, FaCheck } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';

const ClassBookingModal = ({ isOpen, onClose, onBook, userData }) => {
  const [availableClasses, setAvailableClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchAvailableClasses();
    }
  }, [isOpen]);

  const fetchAvailableClasses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('http://localhost:3500/api/classes/available-for-booking', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAvailableClasses(response.data);
    } catch (error) {
      console.error('Error fetching available classes:', error);
      toast.error('Failed to fetch available classes');
    } finally {
      setLoading(false);
    }
  };

  const handleBookClass = async () => {
    if (!selectedClass || !selectedDate) {
      toast.error('Please select a class and date');
      return;
    }

    setBookingLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post('http://localhost:3500/api/bookings/create', {
        classId: selectedClass.classId,
        bookingDate: selectedDate,
        userId: userData?.userId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Class booked successfully!');
      onBook(response.data);
      handleClose();
    } catch (error) {
      console.error('Error booking class:', error);
      toast.error(error.response?.data?.message || 'Failed to book class');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedClass(null);
    setSelectedDate('');
    onClose();
  };

  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FaCalendarAlt className="text-red-400" />
            Book a Class
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 rounded-lg p-1"
            aria-label="Close booking modal"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-400"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Class Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                <FaDumbbell className="inline mr-2 text-red-400" />
                Select Class
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableClasses.map((classItem) => (
                  <div
                    key={classItem.classId}
                    onClick={() => setSelectedClass(classItem)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      selectedClass?.classId === classItem.classId
                        ? 'border-red-400 bg-red-400/10'
                        : 'border-gray-600 hover:border-red-400/50'
                    }`}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setSelectedClass(classItem);
                      }
                    }}
                    aria-label={`Select ${classItem.className} class`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{classItem.className}</h3>
                        <p className="text-gray-400 text-sm">Trainer: {classItem.trainerName}</p>
                        <p className="text-gray-400 text-sm">Time: {classItem.classTime}</p>
                      </div>
                      {selectedClass?.classId === classItem.classId && (
                        <FaCheck className="text-red-400 text-xl" />
                      )}
                    </div>
                    <div className="mt-2 text-sm text-gray-300">
                      <p>Available Seats: {classItem.availableSeats}</p>
                      <p>Duration: {classItem.duration} minutes</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Date Selection */}
            {selectedClass && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  <FaCalendarAlt className="inline mr-2 text-red-400" />
                  Select Date
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {getAvailableDates().map((date) => {
                    const dateObj = new Date(date);
                    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                    const dayNumber = dateObj.getDate();
                    const isToday = date === new Date().toISOString().split('T')[0];
                    
                    return (
                      <button
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                          selectedDate === date
                            ? 'border-red-400 bg-red-400/10 text-white'
                            : 'border-gray-600 hover:border-red-400/50 text-gray-300'
                        }`}
                        aria-label={`Select ${date}`}
                      >
                        <div className="text-center">
                          <div className="text-sm font-medium">{dayName}</div>
                          <div className="text-lg font-bold">{dayNumber}</div>
                          {isToday && <div className="text-xs text-red-400">Today</div>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Selected Class Details */}
            {selectedClass && selectedDate && (
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
                <h3 className="text-lg font-semibold text-white mb-3">Booking Summary</h3>
                <div className="space-y-2 text-gray-300">
                  <div className="flex justify-between">
                    <span>Class:</span>
                    <span className="text-white">{selectedClass.className}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Trainer:</span>
                    <span className="text-white">{selectedClass.trainerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span className="text-white">
                      {new Date(selectedDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time:</span>
                    <span className="text-white">{selectedClass.classTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="text-white">{selectedClass.duration} minutes</span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-4">
              <button
                onClick={handleClose}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleBookClass}
                disabled={!selectedClass || !selectedDate || bookingLoading}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {bookingLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Booking...
                  </>
                ) : (
                  <>
                    <FaCheck className="w-4 h-4" />
                    Book Class
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassBookingModal; 