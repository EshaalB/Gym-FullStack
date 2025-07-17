// LEGACY/UNUSED: This modal is not used in the current admin dashboard. Use AssignMemberModal instead. Safe to delete if not referenced elsewhere.
import React, { useState, useEffect } from 'react';
import { FaTimes, FaUser, FaDumbbell, FaCalendarAlt } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';

const ClassAssignmentModal = ({ isOpen, onClose, onAssign }) => {
  const [formData, setFormData] = useState({
    userId: '',
    classId: ''
  });
  const [availableClasses, setAvailableClasses] = useState([]);
  const [availableMembers, setAvailableMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchAvailableClasses();
    }
  }, [isOpen]);

  useEffect(() => {
    if (formData.classId) {
      fetchAvailableMembers(formData.classId);
    }
  }, [formData.classId]);

  const fetchAvailableClasses = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('http://localhost:3500/api/classes/available-for-assignment', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAvailableClasses(response.data);
    } catch (error) {
      console.error('Error fetching available classes:', error);
      toast.error('Failed to fetch available classes');
    }
  };

  const fetchAvailableMembers = async (classId) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`http://localhost:3500/api/classes/available-members?classId=${classId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAvailableMembers(response.data);
    } catch (error) {
      console.error('Error fetching available members:', error);
      toast.error('Failed to fetch available members');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.userId || !formData.classId) {
      toast.error('Please select both a member and a class');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post('http://localhost:3500/api/classes/assign-user', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success(response.data.message || 'User assigned to class successfully');
      onAssign(formData);
      handleClose();
    } catch (error) {
      console.error('Error assigning user to class:', error);
      toast.error(error.response?.data?.message || 'Failed to assign user to class');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ userId: '', classId: '' });
    setSelectedClass(null);
    setAvailableMembers([]);
    onClose();
  };

  const handleClassChange = (classId) => {
    setFormData(prev => ({ ...prev, classId, userId: '' }));
    const selected = availableClasses.find(c => c.classId === parseInt(classId));
    setSelectedClass(selected);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FaUser className="text-red-400" />
            Assign Member to Class
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Class Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <FaDumbbell className="inline mr-2 text-red-400" />
              Select Class
            </label>
            <select
              value={formData.classId}
              onChange={(e) => handleClassChange(e.target.value)}
              className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              required
            >
              <option value="">Choose a class...</option>
              {availableClasses.map((classItem) => (
                <option key={classItem.classId} value={classItem.classId}>
                  {classItem.className} - {classItem.trainerName} 
                  ({classItem.enrolledCount}/{classItem.seats} enrolled)
                </option>
              ))}
            </select>
          </div>

          {/* Class Details */}
          {selectedClass && (
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
              <h3 className="text-lg font-semibold text-white mb-2">{selectedClass.className}</h3>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                <div>
                  <span className="text-red-400">Trainer:</span> {selectedClass.trainerName}
                </div>
                <div>
                  <span className="text-red-400">Available Seats:</span> {selectedClass.seats - selectedClass.enrolledCount}
                </div>
                <div>
                  <span className="text-red-400">Enrolled:</span> {selectedClass.enrolledCount}/{selectedClass.seats}
                </div>
              </div>
            </div>
          )}

          {/* Member Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <FaUser className="inline mr-2 text-green-400" />
              Select Member
            </label>
            <select
              value={formData.userId}
              onChange={(e) => setFormData(prev => ({ ...prev, userId: e.target.value }))}
              className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
              disabled={!formData.classId}
            >
              <option value="">
                {formData.classId ? 'Choose a member...' : 'Please select a class first'}
              </option>
              {availableMembers.map((member) => (
                <option key={member.userId} value={member.userId}>
                  {member.fullName} - {member.membershipType} ({member.email})
                </option>
              ))}
            </select>
            {!formData.classId && (
              <p className="text-sm text-gray-400 mt-1">
                Select a class first to see available members
              </p>
            )}
          </div>

          {/* Selected Member Details */}
          {formData.userId && (
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
              {(() => {
                const member = availableMembers.find(m => m.userId === parseInt(formData.userId));
                return member ? (
                  <>
                    <h3 className="text-lg font-semibold text-white mb-2">{member.fullName}</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                      <div>
                        <span className="text-green-400">Email:</span> {member.email}
                      </div>
                      <div>
                        <span className="text-green-400">Membership:</span> {member.membershipType}
                      </div>
                      <div>
                        <span className="text-green-400">Status:</span> {member.membershipStatus}
                      </div>
                    </div>
                  </>
                ) : null;
              })()}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.userId || !formData.classId}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Assigning...
                </>
              ) : (
                <>
                  <FaUser className="w-4 h-4" />
                  Assign to Class
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClassAssignmentModal; 