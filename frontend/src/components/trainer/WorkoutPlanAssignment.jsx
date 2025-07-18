import React, { useState, useEffect } from "react";
import { FaPlus, FaClipboardList, FaUser } from "react-icons/fa";
import toast from "react-hot-toast";

const WorkoutPlanAssignment = ({ membersInClasses = [], onAction }) => {
  const [plans, setPlans] = useState([]);
  const [fetchingPlans, setFetchingPlans] = useState(false);
  const [planError, setPlanError] = useState("");
  const [formData, setFormData] = useState({ planName: "", durationWeeks: "", memberId: "" });
  const [loading, setLoading] = useState(false);

  // Fetch all plans for this trainer (optional, for display)
  useEffect(() => {
    const fetchPlans = async () => {
      setFetchingPlans(true);
      setPlanError("");
      try {
        const accessToken = localStorage.getItem('accessToken');
        const res = await fetch("http://localhost:3500/api/plans/trainer", {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch plans");
        setPlans(data.plans || []);
      } catch (err) {
        setPlanError(err.message);
      } finally {
        setFetchingPlans(false);
      }
    };
    fetchPlans();
  }, [loading]);

  // Get unique members (remove duplicates by memberId)
  const uniqueMembers = (membersInClasses || []).filter((member, index, self) => 
    index === self.findIndex(m => m.memberId === member.memberId)
  );

  // Create and assign plan in one go
  const handleCreateAssign = async (e) => {
    e.preventDefault();
    if (!formData.planName || !formData.durationWeeks || !formData.memberId) {
      toast.error("Please fill in all fields and select a member");
      return;
    }
    setLoading(true);
    setPlanError("");
    try {
      const accessToken = localStorage.getItem('accessToken');
      const res = await fetch("http://localhost:3500/api/plans/trainer/create-assign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          memberId: formData.memberId,
          plan_name: formData.planName,
          duration_weeks: parseInt(formData.durationWeeks)
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create and assign plan");
      toast.success("Workout plan created and assigned!");
      setFormData({ planName: "", durationWeeks: "", memberId: "" });
      onAction && onAction();
    } catch (err) {
      setPlanError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-xl mx-auto">
      <form onSubmit={handleCreateAssign} className="bg-black/50 backdrop-blur-lg rounded-xl p-6 border border-red-500/20 space-y-4">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
          <FaPlus className="text-red-400" />
          <span>Create & Assign Workout Plan</span>
        </h3>
        <div>
          <label className="block text-white text-sm font-medium mb-2">Plan Name</label>
          <input type="text" name="planName" value={formData.planName} onChange={e => setFormData({ ...formData, planName: e.target.value })} placeholder="e.g., Beginner Strength Training" className="w-full px-4 py-2 bg-black/50 border border-red-500/30 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none" required />
        </div>
        <div>
          <label className="block text-white text-sm font-medium mb-2">Duration (weeks)</label>
          <input type="number" name="durationWeeks" value={formData.durationWeeks} onChange={e => setFormData({ ...formData, durationWeeks: e.target.value })} placeholder="e.g., 8" min="1" max="52" className="w-full px-4 py-2 bg-black/50 border border-red-500/30 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none" required />
        </div>
        <div>
          <label className="block text-white text-sm font-medium mb-2">Assign to Member</label>
          {uniqueMembers.length === 0 ? (
            <div className="text-gray-400">No members in your classes</div>
          ) : (
            <select name="memberId" value={formData.memberId} onChange={e => setFormData({ ...formData, memberId: e.target.value })} className="w-full px-4 py-2 bg-black/50 border border-red-500/30 rounded-lg text-white" required>
              <option value="">-- Select Member --</option>
              {uniqueMembers.map(member => (
                <option key={member.memberId} value={member.memberId}>
                  {member.fName} {member.lName}
                </option>
              ))}
            </select>
          )}
        </div>
        {planError && <div className="text-red-400 text-sm">{planError}</div>}
        <button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50" aria-busy={loading} aria-disabled={loading}>{loading ? "Assigning..." : "Create & Assign Plan"}</button>
      </form>
      <div className="bg-black/50 backdrop-blur-lg rounded-xl p-6 border border-red-500/20">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
          <FaClipboardList className="text-red-400" />
          <span>My Plans</span>
        </h3>
        {fetchingPlans ? <div className="text-white">Loading plans...</div> : plans.length === 0 ? <div className="text-gray-400">No plans created yet.</div> : (
          <ul className="space-y-2">
            {plans.map(plan => (
              <li key={plan.planId} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 flex justify-between items-center">
                <div>
                  <div className="font-semibold text-white">{plan.plan_name}</div>
                  <div className="text-sm text-gray-400">Duration: {plan.duration_weeks} weeks</div>
                  <div className="text-sm text-gray-400">Assigned to: {plan.memberId}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default WorkoutPlanAssignment; 