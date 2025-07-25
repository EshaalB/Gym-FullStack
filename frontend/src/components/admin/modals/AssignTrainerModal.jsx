import React, { useEffect, useState } from "react";
import Button from "../../common/Button";
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminClasses, fetchAdminTrainers } from '../../../store/dashboardSlice';
import { logout } from '../../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaUserTie } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Modal from '../../modals/Modal';

const AssignTrainerModal = ({ open, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');
  const adminLoading = useSelector(state => state.dashboard.admin.loading);
  
  const [trainers, setTrainers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch trainers and classes when modal opens
  useEffect(() => {
    if (open) {
      fetchTrainers();
      fetchClasses();
    }
  }, [open]);

  const fetchTrainers = async () => {
    try {
      const response = await fetch('http://localhost:3500/api/trainers?all=true', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (response.status === 401) {
        dispatch(logout());
        navigate('/login');
        return;
      }
      if (!response.ok) throw new Error('Failed to fetch trainers');
      const data = await response.json();
      setTrainers(data.trainers || []);
    } catch (err) {
      console.error('Error fetching trainers:', err);
      let message = err.message || 'Failed to fetch trainers';
      if (message === "Failed to fetch" || message.includes("fetch")) {
        message = "Unable to connect to server. Please check your connection and try again.";
      }
      setError(message);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await fetch('http://localhost:3500/api/classes', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (response.status === 401) {
        dispatch(logout());
        navigate('/login');
        return;
      }
      if (!response.ok) throw new Error('Failed to fetch classes');
      const data = await response.json();
      setClasses(data.classes || []);
    } catch (err) {
      console.error('Error fetching classes:', err);
      let message = err.message || 'Failed to fetch classes';
      if (message === "Failed to fetch" || message.includes("fetch")) {
        message = "Unable to connect to server. Please check your connection and try again.";
      }
      setError(message);
    }
  };

  // Filter trainers who have less than 3 classes (workload constraint)
  const eligibleTrainers = trainers.filter(trainer => {
    const trainerClassCount = classes.filter(c => c.trainerId === trainer.userId).length;
    return trainerClassCount < 3; // Assuming max 3 classes per trainer
  });

  // Filter classes that can have trainers assigned
  const eligibleClasses = classes; // For simplicity, show all classes

  const handleAssign = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!selectedTrainer || !selectedClass) {
      setError("Please select both a trainer and a class");
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:3500/api/classes/assign-trainer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          trainerId: parseInt(selectedTrainer),
          classId: parseInt(selectedClass)
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Handle successful assignment
        const successMessage = data.message || 'Trainer assigned to class successfully';
        const trainerName = data.trainerName || 'Trainer';
        
        setSuccess(`${trainerName} assigned successfully!`);
        toast.success(successMessage);
        
        // Refresh data
        await dispatch(fetchAdminClasses(accessToken));
        await dispatch(fetchAdminTrainers(accessToken));
        
        if (onSuccess) onSuccess();
        
        // Close modal after short delay
        setTimeout(() => {
          setSuccess("");
          handleClose();
        }, 1500);
      } else {
        // Handle assignment errors
        const errorMessage = data.error || data.message || 'Failed to assign trainer to class';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
      console.error('Assignment error:', err);
      const errorMessage = 'Network error: Failed to assign trainer to class';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedTrainer("");
    setSelectedClass("");
    setError("");
    setSuccess("");
    if (onClose) onClose();
  };

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose} title="Assign Trainer to Class">
      {loading || adminLoading ? (
        <div className="text-white flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          <span className="ml-2">Processing assignment...</span>
        </div>
      ) : (
        <form onSubmit={handleAssign} className="space-y-5">
          <div>
            <label className="block mb-2 font-medium text-white">Select Trainer</label>
            <select
              className="w-full border border-white/10 rounded-lg px-4 py-3 bg-black/60 text-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
              value={selectedTrainer}
              onChange={e => setSelectedTrainer(e.target.value)}
              required
              disabled={loading}
            >
              <option value="">-- Select Trainer --</option>
              {eligibleTrainers.map(trainer => {
                const classCount = classes.filter(c => c.trainerId === trainer.userId).length;
                return (
                  <option key={trainer.userId} value={trainer.userId}>
                    {trainer.fName} {trainer.lName} ({trainer.specialization || 'General'}) - {classCount} classes
                  </option>
                );
              })}
            </select>
            
            {trainers.length > 0 && eligibleTrainers.length === 0 && (
              <div className="mt-2 text-sm text-yellow-400">
                All trainers are at maximum capacity (3 classes each).
              </div>
            )}
          </div>

          <div>
            <label className="block mb-2 font-medium text-white">Select Class</label>
            <select
              className="w-full border border-white/10 rounded-lg px-4 py-3 bg-black/60 text-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
              required
              disabled={loading}
            >
              <option value="">-- Select Class --</option>
              {eligibleClasses.map(classObj => {
                const currentTrainer = trainers.find(t => t.userId === classObj.trainerId);
                return (
                  <option key={classObj.classId} value={classObj.classId}>
                    {classObj.className}
                    {currentTrainer ? 
                      ` (Currently: ${currentTrainer.fName} ${currentTrainer.lName})` : 
                      ' (No trainer assigned)'
                    }
                  </option>
                );
              })}
            </select>
          </div>

          {success && (
            <div className="text-green-400 mb-4 p-3 bg-green-900/20 rounded-lg border border-green-500/30">
              {success}
            </div>
          )}

          {error && (
            <div className="text-red-400 mb-4 p-3 bg-red-900/20 rounded-lg border border-red-500/30">
              {error}
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={loading || !selectedTrainer || !selectedClass}
              className="flex-1"
            >
              {loading ? 'Assigning...' : 'Assign Trainer'}
            </Button>
            <Button
              type="button"
              onClick={handleClose}
              variant="secondary"
              className="px-6"
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default AssignTrainerModal; 