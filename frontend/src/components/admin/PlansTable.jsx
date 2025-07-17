import React, { useState } from "react";
import { useDispatch } from "react-redux";
import SkeletonLoader from "../common/SkeletonLoader";
import Button from "../common/Button";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { showConfirmAlert, showSuccessAlert, showErrorAlert } from "../../utils/sweetAlert";
import PlanModal from "./modals/PlanModal";
import { addAdminPlan, editAdminPlan, deleteAdminPlan, fetchAdminPlans } from "../../store/dashboardSlice";

const PlansTable = ({ plans, loading, error }) => {
  const dispatch = useDispatch();
  const accessToken = localStorage.getItem("accessToken");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedPlan, setSelectedPlan] = useState({});

  const handleAdd = () => {
    setModalMode("add");
    setSelectedPlan({});
    setModalOpen(true);
  };

  const handleEdit = (plan) => {
    setModalMode("edit");
    setSelectedPlan(plan);
    setModalOpen(true);
  };

  const handleDelete = async (plan) => {
    const result = await showConfirmAlert(
      "Delete Plan?",
      `Are you sure you want to delete ${plan.plan_name}?`,
      "Delete",
      "Cancel"
    );
    if (result.isConfirmed) {
      try {
        await dispatch(deleteAdminPlan({ accessToken, planId: plan.planId })).unwrap();
        showSuccessAlert("Plan deleted successfully");
        dispatch(fetchAdminPlans(accessToken));
      } catch (err) {
        showErrorAlert(err.message || "Failed to delete plan");
      }
    }
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    // Validation
    if (!selectedPlan.plan_name || !selectedPlan.memberId || !selectedPlan.trainerId) {
      showErrorAlert("Missing Fields", "Plan name, member, and trainer are required.");
      return;
    }
    // Convert IDs to numbers
    const planToSubmit = {
      ...selectedPlan,
      memberId: Number(selectedPlan.memberId),
      trainerId: Number(selectedPlan.trainerId),
    };
    try {
      if (modalMode === "add") {
        await dispatch(addAdminPlan({ accessToken, plan: planToSubmit })).unwrap();
        showSuccessAlert("Plan added successfully");
      } else {
        await dispatch(editAdminPlan({ accessToken, planId: planToSubmit.planId, plan: planToSubmit })).unwrap();
        showSuccessAlert("Plan updated successfully");
      }
      setModalOpen(false);
      dispatch(fetchAdminPlans(accessToken));
    } catch (err) {
      showErrorAlert(err.message || "Failed to submit plan");
    }
  };

  if (loading) {
    return <SkeletonLoader variant="table" />;
  }
  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }
  return (
    <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Workout Plans</h2>
        <Button onClick={handleAdd} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <FaPlus /> Add Plan
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-300">
          <caption className="sr-only">List of all workout plans</caption>
          <thead>
            <tr>
              <th className="px-4 py-2 text-left" scope="col">Plan Name</th>
              <th className="px-4 py-2 text-left" scope="col">Member</th>
              <th className="px-4 py-2 text-left" scope="col">Trainer</th>
              <th className="px-4 py-2 text-left" scope="col">Duration (weeks)</th>
              <th className="px-4 py-2 text-left" scope="col">Assigned On</th>
              <th className="px-4 py-2 text-left" scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {plans && plans.length > 0 ? (
              plans.map((plan) => (
                <tr key={plan.planId} className="border-b border-gray-700/30">
                  <td className="px-4 py-2">{plan.plan_name}</td>
                  <td className="px-4 py-2">{plan.memberId || "-"}</td>
                  <td className="px-4 py-2">{plan.trainerId || "-"}</td>
                  <td className="px-4 py-2">{plan.duration_weeks}</td>
                  <td className="px-4 py-2">{plan.assigned_on ? new Date(plan.assigned_on).toLocaleDateString() : "-"}</td>
                  <td className="px-4 py-2">
                    <Button aria-label="Edit" onClick={() => handleEdit(plan)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-xs mr-2 flex items-center gap-1"><FaEdit /></Button>
                    <Button aria-label="Delete" onClick={() => handleDelete(plan)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-xs flex items-center gap-1"><FaTrash /></Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center text-gray-400 py-6">No plans found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <PlanModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        plan={selectedPlan}
        mode={modalMode}
        onSubmit={handleModalSubmit}
        onChange={setSelectedPlan}
      />
    </div>
  );
};

export default PlansTable; 