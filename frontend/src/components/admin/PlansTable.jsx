import React from "react";
import SkeletonLoader from "../SkeletonLoader";
import Button from "../Button";

const PlansTable = ({ plans, loading, error }) => {
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
        {/* Future: Add Plan button */}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-300">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Plan Name</th>
              <th className="px-4 py-2 text-left">Member</th>
              <th className="px-4 py-2 text-left">Trainer</th>
              <th className="px-4 py-2 text-left">Duration (weeks)</th>
              <th className="px-4 py-2 text-left">Assigned On</th>
              <th className="px-4 py-2 text-left">Actions</th>
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
                    {/* Future: Edit/Delete buttons using Redux thunks */}
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-xs mr-2">Edit</Button>
                    <Button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-xs">Delete</Button>
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
    </div>
  );
};

export default PlansTable; 