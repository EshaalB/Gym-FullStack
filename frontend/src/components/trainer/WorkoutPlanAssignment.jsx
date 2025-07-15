import React, { useState, useEffect } from "react";
import { FaPlus, FaClipboardList, FaUser, FaCalendar } from "react-icons/fa";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { assignTrainerWorkoutPlan } from "../../store/dashboardSlice";

const WorkoutPlanAssignment = ({ membersInClasses = [], onAction }) => {
  const dispatch = useDispatch();
  const [tab, setTab] = useState("plans");
  const [plans, setPlans] = useState([]);
  const [fetchingPlans, setFetchingPlans] = useState(false);
  const [planError, setPlanError] = useState("");
  const [addPlanData, setAddPlanData] = useState({ planName: "", durationWeeks: "" });
  const [addPlanLoading, setAddPlanLoading] = useState(false);
  const [selectedMember, setSelectedMember] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [assignLoading, setAssignLoading] = useState(false);

  // Fetch all plans for this trainer
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
  }, [addPlanLoading, assignLoading]);

  // Get unique members (remove duplicates by memberId)
  const uniqueMembers = (membersInClasses || []).filter((member, index, self) => 
    index === self.findIndex(m => m.memberId === member.memberId)
  );

  // Add new plan (for trainer, this is assign to member)
  const handleAddPlan = async (e) => {
    e.preventDefault();
    if (!addPlanData.planName || !addPlanData.durationWeeks || !selectedMember) {
      toast.error("Please fill in all fields and select a member");
      return;
    }
    setAddPlanLoading(true);
    setPlanError("");
    try {
      const accessToken = localStorage.getItem('accessToken');
      const res = await fetch("http://localhost:3500/api/plans/trainer/assign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({ memberId: selectedMember, plan_name: addPlanData.planName, duration_weeks: parseInt(addPlanData.durationWeeks) })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add plan");
      toast.success("Workout plan assigned!");
      setAddPlanData({ planName: "", durationWeeks: "" });
      setSelectedMember("");
      onAction && onAction();
    } catch (err) {
      setPlanError(err.message);
    } finally {
      setAddPlanLoading(false);
    }
  };

  // Assign plan to member
  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedMember || !selectedPlan) {
      toast.error("Select a member and a plan");
      return;
    }
    setAssignLoading(true);
    try {
      const accessToken = localStorage.getItem('accessToken');
      await dispatch(assignTrainerWorkoutPlan({ accessToken, memberId: selectedMember, planName: plans.find(p => p.planId === parseInt(selectedPlan))?.plan_name, durationWeeks: plans.find(p => p.planId === parseInt(selectedPlan))?.duration_weeks })).unwrap();
      toast.success("Plan assigned to member!");
      setSelectedMember("");
      setSelectedPlan("");
      onAction && onAction();
    } catch (err) {
      toast.error(err.message || "Failed to assign plan");
    } finally {
      setAssignLoading(false);
    }
  };

  return (
    <div className="space-y-6" aria-live="polite">
      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button className={`px-4 py-2 rounded-t-lg font-semibold ${tab === "plans" ? "bg-red-700 text-white" : "bg-black/50 text-gray-300"}`} onClick={() => setTab("plans")}>My Workout Plans</button>
        <button className={`px-4 py-2 rounded-t-lg font-semibold ${tab === "assign" ? "bg-red-700 text-white" : "bg-black/50 text-gray-300"}`} onClick={() => setTab("assign")}>Assign Plan</button>
      </div>

      {/* My Workout Plans Tab */}
      {tab === "plans" && (
        <div className="space-y-6">
          <form onSubmit={handleAddPlan} className="bg-black/50 backdrop-blur-lg rounded-xl p-6 border border-red-500/20 space-y-4">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
              <FaPlus className="text-red-400" />
              <span>Add New Workout Plan</span>
            </h3>
            <div>
              <label className="block text-white text-sm font-medium mb-2">Plan Name</label>
              <input type="text" name="planName" value={addPlanData.planName} onChange={e => setAddPlanData({ ...addPlanData, planName: e.target.value })} placeholder="e.g., Beginner Strength Training" className="w-full px-4 py-2 bg-black/50 border border-red-500/30 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none" required />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">Duration (weeks)</label>
              <input type="number" name="durationWeeks" value={addPlanData.durationWeeks} onChange={e => setAddPlanData({ ...addPlanData, durationWeeks: e.target.value })} placeholder="e.g., 8" min="1" max="52" className="w-full px-4 py-2 bg-black/50 border border-red-500/30 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none" required />
            </div>
            {planError && <div className="text-red-400 text-sm">{planError}</div>}
            <button type="submit" disabled={addPlanLoading} className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50" aria-busy={addPlanLoading} aria-disabled={addPlanLoading}>{addPlanLoading ? "Adding..." : "Add Plan"}</button>
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
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Assign Plan Tab */}
      {tab === "assign" && (
        <form onSubmit={handleAssign} className="space-y-6">
          <div className="bg-black/50 backdrop-blur-lg rounded-xl p-6 border border-red-500/20">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
              <FaUser className="text-red-400" />
              <span>Select Member</span>
            </h3>
            {uniqueMembers.length === 0 ? <div className="text-center py-8"><FaUser className="text-4xl text-gray-600 mx-auto mb-2" /><p className="text-gray-400">No members in your classes</p></div> : <div className="space-y-3 max-h-96 overflow-y-auto">{uniqueMembers.map(member => (<button key={member.memberId} type="button" onClick={() => setSelectedMember(member.memberId)} className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${selectedMember === member.memberId ? "bg-red-600 text-white" : "bg-gray-800/50 text-white hover:bg-gray-700/50"}`}><div className="flex items-center space-x-3"><div className="flex-shrink-0 h-10 w-10"><div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">{member.fName?.charAt(0)}{member.lName?.charAt(0)}</div></div><div><div className="font-semibold">{member.fName} {member.lName}</div><div className="text-sm opacity-75">{member.email}</div><div className="text-sm opacity-75">Class: {member.className}</div></div></div></button>))}</div>}
          </div>
          <div className="bg-black/50 backdrop-blur-lg rounded-xl p-6 border border-red-500/20">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
              <FaClipboardList className="text-red-400" />
              <span>Select Plan</span>
            </h3>
            {plans.length === 0 ? <div className="text-gray-400">No plans available. Create a plan first.</div> : <select className="w-full px-4 py-2 bg-black/50 border border-red-500/30 rounded-lg text-white" value={selectedPlan} onChange={e => setSelectedPlan(e.target.value)} required><option value="">-- Select Plan --</option>{plans.map(plan => (<option key={plan.planId} value={plan.planId}>{plan.plan_name} ({plan.duration_weeks} weeks)</option>))}</select>}
          </div>
          <button type="submit" disabled={assignLoading} className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50" aria-busy={assignLoading} aria-disabled={assignLoading}>{assignLoading ? "Assigning..." : "Assign Plan"}</button>
        </form>
      )}
    </div>
  );
};

export default WorkoutPlanAssignment; 