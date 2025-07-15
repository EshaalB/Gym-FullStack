import React from "react";
import SkeletonLoader from "../common/SkeletonLoader"; 
import Button from "../common/Button";
import { FaEdit, FaTrash, FaUserPlus } from "react-icons/fa";
import { useState } from "react";
import AssignMemberModal from "./modals/AssignMemberModal";

const ClassesTable = ({ classes, loading, error }) => {
  const [assignModalOpen, setAssignModalOpen] = useState(false);

  if (loading) {
    return <SkeletonLoader variant="table" />;
  }
  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }
  return (
    <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Classes</h2>
        <Button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          onClick={() => setAssignModalOpen(true)}
          aria-label="Assign Member to Class"
        >
          <FaUserPlus /> Assign Member
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-300">
          <caption className="sr-only">List of all classes</caption>
          <thead>
            <tr>
              <th className="px-4 py-2 text-left" scope="col">Class Name</th>
              <th className="px-4 py-2 text-left" scope="col">Trainer</th>
              <th className="px-4 py-2 text-left" scope="col">Gender</th>
              <th className="px-4 py-2 text-left" scope="col">Seats</th>
              <th className="px-4 py-2 text-left" scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {classes && classes.length > 0 ? (
              classes.map((classObj) => (
                <tr key={classObj.classId} className="border-b border-gray-700/30">
                  <td className="px-4 py-2">{classObj.className}</td>
                  <td className="px-4 py-2">{classObj.trainerId}</td>
                  <td className="px-4 py-2">{classObj.genderSpecific}</td>
                  <td className="px-4 py-2">{classObj.seats}</td>
                  <td className="px-4 py-2">
                    {/* Future: Edit/Delete buttons using Redux thunks */}
                    <Button aria-label="Edit" onClick={() => {/* TODO: add edit logic */}} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-xs mr-2 flex items-center gap-1"><FaEdit /></Button>
                    <Button aria-label="Delete" onClick={() => {/* TODO: add delete logic */}} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-xs flex items-center gap-1"><FaTrash /></Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center text-gray-400 py-6">No classes found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Assign Member Modal will be rendered here */}
      {assignModalOpen && (
        <AssignMemberModal
          open={assignModalOpen}
          onClose={() => setAssignModalOpen(false)}
          onSuccess={() => setAssignModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ClassesTable; 