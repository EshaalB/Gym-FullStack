import React from "react";
import SkeletonLoader from "../../common/SkeletonLoader";
import Button from "../../common/Button";

const TrainersTable = ({ trainers, loading, error }) => {
  if (loading) {
    return <SkeletonLoader variant="table" />;
  }
  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }
  return (
    <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Trainers</h2>
        {/* Future: Add Trainer button */}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-300">
          <caption className="sr-only">List of all trainers</caption>
          <thead>
            <tr>
              <th className="px-4 py-2 text-left" scope="col">Name</th>
              <th className="px-4 py-2 text-left" scope="col">Email</th>
              <th className="px-4 py-2 text-left" scope="col">Specialization</th>
              <th className="px-4 py-2 text-left" scope="col">Experience (years)</th>
              <th className="px-4 py-2 text-left" scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trainers && trainers.length > 0 ? (
              trainers.map((trainer) => (
                <tr key={trainer.userId} className="border-b border-gray-700/30">
                  <td className="px-4 py-2">{trainer.fName} {trainer.lName}</td>
                  <td className="px-4 py-2">{trainer.email}</td>
                  <td className="px-4 py-2">{trainer.specialization}</td>
                  <td className="px-4 py-2">{trainer.experienceYears}</td>
                  <td className="px-4 py-2">
                    {/* Future: Edit/Delete buttons using Redux thunks */}
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-xs mr-2">Edit</Button>
                    <Button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-xs">Delete</Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center text-gray-400 py-6">No trainers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrainersTable; 