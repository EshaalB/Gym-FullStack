import React, { useState, useEffect, useRef } from 'react';
import { FaBell, FaTimes, FaCheck, FaExclamationTriangle, FaInfoCircle, FaEnvelope } from 'react-icons/fa';
import toast from 'react-hot-toast';

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  // Sample notifications
  const sampleNotifications = [
    {
      id: 1,
      type: 'success',
      title: 'Class Booked Successfully',
      message: 'Your HIIT Cardio class has been booked for tomorrow at 9:00 AM',
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      read: false,
      action: 'view_booking'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Payment Due Soon',
      message: 'Your membership payment is due in 3 days. Please update your payment method.',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      read: false,
      action: 'payment_reminder'
    },
    {
      id: 3,
      type: 'info',
      title: 'New Workout Plan Available',
      message: 'Your trainer has assigned you a new workout plan. Check it out!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      read: true,
      action: 'view_plan'
    },
    {
      id: 4,
      type: 'success',
      title: 'Achievement Unlocked',
      message: 'Congratulations! You\'ve completed 10 classes this month.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      read: true,
      action: 'view_achievement'
    }
  ];

  useEffect(() => {
    setNotifications(sampleNotifications);
    setUnreadCount(sampleNotifications.filter(n => !n.read).length);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
    toast.success('All notifications marked as read');
  };

  const deleteNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    const notification = notifications.find(n => n.id === notificationId);
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const handleNotificationAction = (notification) => {
    markAsRead(notification.id);
    
    switch (notification.action) {
      case 'view_booking':
        // Navigate to bookings page
        toast.success('Navigating to your bookings...');
        break;
      case 'payment_reminder':
        // Navigate to payment page
        toast.success('Navigating to payment page...');
        break;
      case 'view_plan':
        // Navigate to workout plan
        toast.success('Opening your workout plan...');
        break;
      case 'view_achievement':
        // Navigate to achievements
        toast.success('Viewing your achievements...');
        break;
      default:
        break;
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <FaCheck className="text-green-400" />;
      case 'warning':
        return <FaExclamationTriangle className="text-yellow-400" />;
      case 'error':
        return <FaTimes className="text-red-400" />;
      case 'info':
        return <FaInfoCircle className="text-blue-400" />;
      default:
        return <FaEnvelope className="text-gray-400" />;
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getNotificationStyle = (type) => {
    switch (type) {
      case 'success':
        return 'border-l-4 border-green-400 bg-green-400/5';
      case 'warning':
        return 'border-l-4 border-yellow-400 bg-yellow-400/5';
      case 'error':
        return 'border-l-4 border-red-400 bg-red-400/5';
      case 'info':
        return 'border-l-4 border-blue-400 bg-blue-400/5';
      default:
        return 'border-l-4 border-gray-400 bg-gray-400/5';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-400 hover:text-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 rounded-lg"
        aria-label="Notifications"
      >
        <FaBell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-black/90 backdrop-blur-xl rounded-lg border border-white/10 shadow-xl z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h3 className="text-lg font-semibold text-white">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setShowDropdown(false)}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Close notifications"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center">
                <FaBell className="text-gray-400 text-2xl mx-auto mb-2" />
                <p className="text-gray-400">No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-white/10">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-white/5 transition-colors cursor-pointer ${
                      !notification.read ? 'bg-white/5' : ''
                    } ${getNotificationStyle(notification.type)}`}
                    onClick={() => handleNotificationAction(notification)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-white truncate">
                            {notification.title}
                          </h4>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="text-gray-400 hover:text-red-400 transition-colors ml-2"
                            aria-label="Delete notification"
                          >
                            <FaTimes className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-300 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-400">
                            {getTimeAgo(notification.timestamp)}
                          </span>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-white/10">
              <button
                onClick={() => {
                  // Navigate to all notifications page
                  toast.success('Opening all notifications...');
                  setShowDropdown(false);
                }}
                className="w-full text-center text-sm text-red-400 hover:text-red-300 transition-colors"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationSystem; 