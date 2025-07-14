import React, { useState } from "react";
import { FaPlus, FaClipboardList, FaUser, FaCalendar } from "react-icons/fa";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { assignTrainerWorkoutPlan, selectTrainerPlanAssignLoading, selectTrainerPlanAssignError } from "../../store/dashboardSlice";

const WorkoutPlanAssignment = ({ membersInClasses = [] }) => {
  const dispatch = useDispatch();
  const loading = useSelector(selectTrainerPlanAssignLoading);
  const error = useSelector(selectTrainerPlanAssignError);
  const [selectedMember, setSelectedMember] = useState("");
  const [planData, setPlanData] = useState({
    planName: "",
    durationWeeks: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlanData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedMember) {
      toast.error("Please select a member");
      return;
    }

    if (!planData.planName || !planData.durationWeeks) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const accessToken = localStorage.getItem('accessToken');
      await dispatch(assignTrainerWorkoutPlan({ accessToken, memberId: selectedMember, planName: planData.planName, durationWeeks: parseInt(planData.durationWeeks) })).unwrap();
      toast.success("Workout plan assigned successfully!");
      setSelectedMember("");
      setPlanData({ planName: "", durationWeeks: "" });
    } catch (error) {
      toast.error(error || "Failed to assign workout plan");
    }
  };

  // Get unique members (remove duplicates by memberId)
  const uniqueMembers = (membersInClasses || []).filter((member, index, self) => 
    index === self.findIndex(m => m.memberId === member.memberId)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Assign Workout Plans</h1>
        <div className="flex items-center space-x-4">
          <div className="bg-red-600/20 border border-red-500/30 rounded-lg px-4 py-2">
            <div className="flex items-center space-x-2">
              <FaClipboardList className="text-red-400" />
              <span className="text-red-400 font-semibold">
                {uniqueMembers.length} Members
              </span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="text-center text-red-400 font-semibold py-2">{error}</div>
      )}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Member Selection */}
          <div className="bg-black/50 backdrop-blur-lg rounded-xl p-6 border border-red-500/20">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
              <FaUser className="text-red-400" />
              <span>Select Member</span>
            </h3>
            
            {uniqueMembers.length === 0 ? (
              <div className="text-center py-8">
                <FaUser className="text-4xl text-gray-600 mx-auto mb-2" />
                <p className="text-gray-400">No members in your classes</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {uniqueMembers.map((member) => (
                  <button
                    key={member.memberId}
                    onClick={() => setSelectedMember(member.memberId)}
                    className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${
                      selectedMember === member.memberId
                        ? "bg-red-600 text-white"
                        : "bg-gray-800/50 text-white hover:bg-gray-700/50"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                          {member.fName?.charAt(0)}{member.lName?.charAt(0)}
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold">{member.fName} {member.lName}</div>
                        <div className="text-sm opacity-75">{member.email}</div>
                        <div className="text-sm opacity-75">Class: {member.className}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Plan Assignment Form */}
          <div className="bg-black/50 backdrop-blur-lg rounded-xl p-6 border border-red-500/20">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
              <FaPlus className="text-red-400" />
              <span>Create Workout Plan</span>
            </h3>
            
            {selectedMember ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Plan Name
                  </label>
                  <input
                    type="text"
                    name="planName"
                    value={planData.planName}
                    onChange={handleInputChange}
                    placeholder="e.g., Beginner Strength Training"
                    className="w-full px-4 py-2 bg-black/50 border border-red-500/30 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Duration (weeks)
                  </label>
                  <input
                    type="number"
                    name="durationWeeks"
                    value={planData.durationWeeks}
                    onChange={handleInputChange}
                    placeholder="e.g., 8"
                    min="1"
                    max="52"
                    className="w-full px-4 py-2 bg-black/50 border border-red-500/30 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
                >
                  <FaPlus className="mr-2 inline" />
                  Assign Workout Plan
                </button>
              </form>
            ) : (
              <div className="text-center py-12">
                <FaClipboardList className="text-6xl text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Select a Member</h3>
                <p className="text-gray-400">Choose a member from the left to assign a workout plan</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-black/50 backdrop-blur-lg rounded-xl p-6 border border-red-500/20">
        <h3 className="text-lg font-semibold text-white mb-3">Instructions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
            <p>Select a member from your classes who needs a workout plan</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
            <p>Create a personalized workout plan with appropriate duration</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
            <p>The plan will be automatically assigned to the selected member</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutPlanAssignment; 