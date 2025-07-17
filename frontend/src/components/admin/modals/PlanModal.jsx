import React, { useEffect, useState } from "react";
import Modal from "../../modals/Modal";
import Button from "../../common/Button";

const PlanModal = ({ isOpen, onClose, plan, mode, onSubmit, onChange }) => {
  const [members, setMembers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setError("");
    const token = localStorage.getItem("accessToken");
    Promise.all([
      fetch("/api/users?role=Member&page=1&limit=1000", {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => res.json()),
      fetch("/api/trainers", {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => res.json())
    ])
      .then(([membersData, trainersData]) => {
        setMembers(membersData.users || []);
        setTrainers(trainersData.trainers || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch members or trainers");
        setLoading(false);
      });
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${mode === "add" ? "Add" : "Edit"} Workout Plan`}>
      <form onSubmit={onSubmit} className="space-y-6">
        {loading ? (
          <div className="text-white">Loading members and trainers...</div>
        ) : error ? (
          <div className="text-red-400">{error}</div>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Plan Name</label>
              <input
                type="text"
                placeholder="Enter plan name"
                value={plan.plan_name || ""}
                onChange={e => onChange({ ...plan, plan_name: e.target.value })}
                className="w-full px-4 py-3 bg-black/50 border border-red-500/30 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Member</label>
                <select
                  value={plan.memberId || ""}
                  onChange={e => onChange({ ...plan, memberId: e.target.value })}
                  className="w-full px-4 py-3 bg-black/50 border border-red-500/30 rounded-lg text-white focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
                  required
                >
                  <option value="">Select Member</option>
                  {members.map(m => (
                    <option key={m.userId} value={m.userId}>
                      {m.fName} {m.lName} ({m.email})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Trainer</label>
                <select
                  value={plan.trainerId || ""}
                  onChange={e => onChange({ ...plan, trainerId: e.target.value })}
                  className="w-full px-4 py-3 bg-black/50 border border-red-500/30 rounded-lg text-white focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
                  required
                >
                  <option value="">Select Trainer</option>
                  {trainers.map(t => (
                    <option key={t.userId} value={t.userId}>
                      {t.fName} {t.lName} ({t.email})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Duration (weeks)</label>
              <input
                type="number"
                min="1"
                value={plan.duration_weeks || ""}
                onChange={e => onChange({ ...plan, duration_weeks: e.target.value })}
                className="w-full px-4 py-3 bg-black/50 border border-red-500/30 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
                required
              />
            </div>
          </>
        )}
        <div className="flex justify-end space-x-4 pt-4">
          <Button
            type="button"
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
            disabled={loading}
          >
            {mode === "add" ? "Add" : "Update"} Plan
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default PlanModal; 