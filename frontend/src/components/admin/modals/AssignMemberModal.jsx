import React, { useEffect, useState } from "react";
import Button from "../../common/Button";
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminClasses } from '../../../store/dashboardSlice';
import { logout } from '../../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Modal from '../../modals/Modal';

const AssignMemberModal = ({ open, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');
  const adminLoading = useSelector(state => state.dashboard.admin.loading);
  const [members, setMembers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedMember, setSelectedMember] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [memberClasses, setMemberClasses] = useState([]);

  // Fetch members and classes when modal opens
  useEffect(() => {
    if (open) {
      fetchMembers();
      fetchClasses();
    }
  }, [open]);

  const fetchMembers = async () => {
    try {
      const response = await fetch('http://localhost:3500/api/users?role=Member', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (response.status === 401) {
        dispatch(logout());
        navigate('/login');
        return;
      }
      if (!response.ok) throw new Error('Failed to fetch members');
      const data = await response.json();
      setMembers(data.users || []);
    } catch (err) {
      console.error('Error fetching members:', err);
      let message = err.message || 'Failed to fetch members';
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

  const fetchMemberClasses = async (memberId) => {
    try {
      const response = await fetch(`http://localhost:3500/api/users/${memberId}/classes`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (!response.ok) {
        // If 404 or other error, assume no classes
        setMemberClasses([]);
        return;
      }
      const data = await response.json();
      setMemberClasses(data.classes || []);
    } catch (err) {
      console.error('Error fetching member classes:', err);
      setMemberClasses([]);
    }
  };

  // Filter classes that the member isn't already enrolled in
  const eligibleClasses = classes.filter(c => 
    !memberClasses.some(mc => mc.classId === c.classId)
  );

  const handleAssign = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!selectedMember || !selectedClass) {
      setError("Please select both a member and a class");
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:3500/api/classes/assign-member', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          memberId: parseInt(selectedMember),
          classId: parseInt(selectedClass)
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Handle successful assignment
        const successMessage = data.message || 'Member assigned to class successfully';
        const memberName = data.memberName || 'Member';
        
        setSuccess(`${memberName} assigned successfully!`);
        toast.success(successMessage);
        
        // Refresh classes data
        await dispatch(fetchAdminClasses(accessToken));
        
        if (onSuccess) onSuccess();
        
        // Close modal after short delay
        setTimeout(() => {
          setSuccess("");
          handleClose();
        }, 1500);
      } else {
        // Handle assignment errors
        const errorMessage = data.error || data.message || 'Failed to assign member to class';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
      console.error('Assignment error:', err);
      const errorMessage = 'Network error: Failed to assign member to class';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedMember("");
    setSelectedClass("");
    setMemberClasses([]);
    setError("");
    setSuccess("");
    if (onClose) onClose();
  };

  const handleMemberChange = (memberId) => {
    setSelectedMember(memberId);
    setSelectedClass(""); // Reset class selection
    if (memberId) {
      fetchMemberClasses(memberId);
    } else {
      setMemberClasses([]);
    }
  };

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose} title="Assign Member to Class">
      {loading || adminLoading ? (
        <div className="text-white flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          <span className="ml-2">Processing assignment...</span>
        </div>
      ) : (
        <form onSubmit={handleAssign} className="space-y-5">
          <div>
            <label className="block mb-2 font-medium text-white">Select Member</label>
            <select
              className="w-full border border-white/10 rounded-lg px-4 py-3 bg-black/60 text-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
              value={selectedMember}
              onChange={e => handleMemberChange(e.target.value)}
              required
              disabled={loading}
            >
              <option value="">-- Select Member --</option>
              {members.map(m => (
                <option key={m.userId} value={m.userId}>
                  {m.fName} {m.lName} ({m.email})
                </option>
              ))}
            </select>
            
            {selectedMember && memberClasses.length > 0 && (
              <div className="mt-2 text-sm text-gray-200 bg-black/40 rounded p-3 border border-white/10">
                <span className="font-semibold text-blue-400">Current Classes:</span>
                <ul className="list-disc ml-5 mt-1">
                  {memberClasses.map(c => (
                    <li key={c.classId}>{c.className} (Trainer: {c.trainerName || c.trainerId})</li>
                  ))}
                </ul>
              </div>
            )}
            
            {selectedMember && memberClasses.length === 0 && (
              <div className="mt-2 text-sm text-gray-400">This member is not enrolled in any classes yet.</div>
            )}
          </div>
          
          <div>
            <label className="block mb-2 font-medium text-white">Select Class</label>
            <select
              className="w-full border border-white/10 rounded-lg px-4 py-3 bg-black/60 text-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
              required
              disabled={!selectedMember || loading}
            >
              <option value="">-- Select Class --</option>
              {eligibleClasses.map(c => (
                <option key={c.classId} value={c.classId}>
                  {c.className} (Trainer: {c.trainerName || 'TBD'}, {c.enrolledCount || 0}/{c.seats} seats, {c.genderSpecific || "Mixed"})
                </option>
              ))}
            </select>
            
            {selectedMember && eligibleClasses.length === 0 && (
              <div className="mt-2 text-sm text-yellow-400">This member is already enrolled in all available classes.</div>
            )}
          </div>

          {success && (
            <div className="text-green-400 text-sm p-3 bg-green-900/20 rounded-lg border border-green-500/30">
              {success}
            </div>
          )}
          
          {error && (
            <div className="text-red-400 text-sm p-3 bg-red-900/20 rounded-lg border border-red-500/30">
              {error}
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={loading || !selectedMember || !selectedClass}
              className="flex-1"
            >
              {loading ? 'Assigning...' : 'Assign Member'}
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

export default AssignMemberModal; 