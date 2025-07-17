import React, { useEffect, useState } from "react";
import Button from "../../common/Button";
import { useDispatch, useSelector } from 'react-redux';
import { assignMemberToClass, fetchAdminClasses } from '../../../store/dashboardSlice';
import { logout } from '../../../store/authSlice';
import { useNavigate } from 'react-router-dom';

const AssignMemberModal = ({ open, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');
  const adminLoading = useSelector(state => state.dashboard.admin.loading);
  const adminError = useSelector(state => state.dashboard.admin.error);
  const [members, setMembers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedMember, setSelectedMember] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [memberClasses, setMemberClasses] = useState([]);

  // Fetch all data on open
  useEffect(() => {
    if (!open) return;
    setError("");
    setSuccess("");
    setSelectedMember("");
    setSelectedClass("");
    setMemberClasses([]);
    setLoading(true);
    const token = accessToken;
    Promise.all([
      fetch("http://localhost:3500/api/users?role=Member&page=1&limit=1000", {
        headers: { Authorization: `Bearer ${token}` }
      }).then(async res => {
        if (res.status === 401) throw new Error('Session expired. Please log in again.');
        if (!res.ok) throw new Error('Failed to fetch members');
        return res.json();
      }),
      fetch("http://localhost:3500/api/classes?all=true", {
        headers: { Authorization: `Bearer ${token}` }
      }).then(async res => {
        if (res.status === 401) throw new Error('Session expired. Please log in again.');
        if (!res.ok) throw new Error('Failed to fetch classes');
        return res.json();
      })
    ])
      .then(([membersData, classesData]) => {
        setMembers(membersData.users || []);
        setClasses(classesData.classes || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch members or classes');
        setLoading(false);
        if (err.message && err.message.includes('Session expired')) {
          setTimeout(() => {
            dispatch(logout());
            navigate('/login');
          }, 1500);
        }
      });
  }, [open]);

  // Fetch member's current classes when a member is selected
  useEffect(() => {
    if (!selectedMember) {
      setMemberClasses([]);
      return;
    }
    const token = accessToken;
    fetch(`http://localhost:3500/api/users/${selectedMember}/classes`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async res => {
        if (res.status === 401) throw new Error('Session expired. Please log in again.');
        if (!res.ok) throw new Error('Failed to fetch member classes');
        return res.json();
      })
      .then(data => setMemberClasses(data.classes || []))
      .catch((err) => {
        setError(err.message || 'Failed to fetch member classes');
        if (err.message && err.message.includes('Session expired')) {
          setTimeout(() => {
            dispatch(logout());
            navigate('/login');
          }, 1500);
        }
      });
  }, [selectedMember]);

  // Filter out classes already enrolled, gender, and seat eligibility
  const eligibleClasses = classes.filter(c => {
    if (!selectedMember) return true;
    if (memberClasses.some(mc => mc.classId === c.classId)) return false;
    const member = members.find(m => m.userId === parseInt(selectedMember));
    if (!member) return false;
    if (c.genderSpecific !== 'Any' && c.genderSpecific !== member.gender) return false;
    if ((c.enrolledCount || 0) >= c.seats) return false;
    return true;
  });

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
      await dispatch(assignMemberToClass({ accessToken, memberId: parseInt(selectedMember), classId: parseInt(selectedClass) })).unwrap();
      setSuccess("Member assigned to class successfully");
      await dispatch(fetchAdminClasses(accessToken));
      onSuccess && onSuccess();
      setTimeout(() => {
        setSuccess("");
        onClose && onClose();
      }, 1200);
    } catch (err) {
      setError(err.message || err);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Assign Member to Class</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors text-2xl">×</button>
        </div>
        {loading || adminLoading ? (
          <div className="text-white">Loading...</div>
        ) : error || adminError ? (
          <div className="text-red-400 mb-4">{error || adminError}</div>
        ) : (
          <form onSubmit={handleAssign} className="space-y-5">
            <div>
              <label className="block mb-1 font-medium text-white">Select Member</label>
              <select
                className="w-full border border-white/10 rounded-lg px-4 py-3 bg-black/60 text-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
                value={selectedMember}
                onChange={e => {
                  setSelectedMember(e.target.value);
                  setSelectedClass("");
                }}
                required
              >
                <option value="">-- Select Member --</option>
                {members.map(m => (
                  <option key={m.userId} value={m.userId}>
                    {m.fName} {m.lName}
                  </option>
                ))}
              </select>
              {selectedMember && memberClasses.length > 0 && (
                <div className="mt-2 text-sm text-gray-200 bg-black/40 rounded p-2 border border-white/10">
                  <span className="font-semibold">Current Classes:</span>
                  <ul className="list-disc ml-5">
                    {memberClasses.map(c => (
                      <li key={c.classId}>{c.className} (Trainer: {c.trainerName || c.trainerId})</li>
                    ))}
                  </ul>
                </div>
              )}
              {selectedMember && memberClasses.length === 0 && (
                <div className="mt-2 text-sm text-gray-400">This member is not enrolled in any class.</div>
              )}
            </div>
            <div>
              <label className="block mb-1 font-medium text-white">Select Class</label>
              <select
                className="w-full border border-white/10 rounded-lg px-4 py-3 bg-black/60 text-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
                value={selectedClass}
                onChange={e => setSelectedClass(e.target.value)}
                required
                disabled={!selectedMember}
              >
                <option value="">-- Select Class --</option>
                {eligibleClasses.map(c => (
                  <option key={c.classId} value={c.classId}>
                    {c.className} (Trainer: {c.trainerName || c.trainerId}, {c.enrolledCount || 0}/{c.seats} seats, {c.genderSpecific || "Any"})
                  </option>
                ))}
              </select>
            </div>
            {success && <div className="text-green-400 text-sm">{success}</div>}
            {error && <div className="text-red-400 text-sm">{error}</div>}
            <div className="flex justify-end gap-2">
              <Button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg">Cancel</Button>
              <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg" disabled={loading || adminLoading}>Assign</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AssignMemberModal; 