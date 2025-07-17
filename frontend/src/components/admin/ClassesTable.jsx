import React, { useState } from "react";
import SkeletonLoader from "../common/SkeletonLoader"; 
import Button from "../common/Button";
import { FaEdit, FaTrash, FaUserPlus, FaPlus } from "react-icons/fa";
import AssignMemberModal from "./modals/AssignMemberModal";
import { showConfirmAlert, showSuccessAlert, showErrorAlert } from "../../utils/sweetAlert";
import ClassModal from "./modals/ClassModal";

const ClassesTable = ({ classes, trainers, loading, error, onAddClass, onEditClass, onDeleteClass }) => {
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedClass, setSelectedClass] = useState({});

  const handleAdd = () => {
    setModalMode("add");
    setSelectedClass({});
    setModalOpen(true);
  };

  const handleEdit = (classObj) => {
    setModalMode("edit");
    setSelectedClass(classObj);
    setModalOpen(true);
  };

  const handleDelete = async (classObj) => {
    const result = await showConfirmAlert("Delete Class?", `Are you sure you want to delete ${classObj.className}?`, "Delete", "Cancel");
    if (result.isConfirmed && onDeleteClass) {
      try {
        await onDeleteClass(classObj);
        showSuccessAlert("Class deleted successfully");
      } catch (err) {
        showErrorAlert("Failed to delete class", err.message);
      }
    }
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === "add" && onAddClass) {
        await onAddClass(selectedClass, () => setModalOpen(false));
        showSuccessAlert("Class added successfully");
      } else if (modalMode === "edit" && onEditClass) {
        await onEditClass(selectedClass, () => setModalOpen(false));
        showSuccessAlert("Class updated successfully");
      }
    } catch (err) {
      showErrorAlert("Failed to submit class", err.message);
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
        <h2 className="text-2xl font-bold text-white">Classes</h2>
        <div className="flex gap-2">
          <Button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            onClick={() => setAssignModalOpen(true)}
            aria-label="Assign Member to Class"
          >
            <FaUserPlus /> Assign Member
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            onClick={handleAdd}
            aria-label="Add Class"
          >
            <FaPlus /> Add Class
          </Button>
        </div>
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
                  <td className="px-4 py-2">{(trainers.find(t => t.userId === classObj.trainerId)?.fName || "") + " " + (trainers.find(t => t.userId === classObj.trainerId)?.lName || "")}</td>
                  <td className="px-4 py-2">{classObj.genderSpecific}</td>
                  <td className="px-4 py-2">{classObj.seats}</td>
                  <td className="px-4 py-2">
                    <Button aria-label="Edit" onClick={() => handleEdit(classObj)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-xs mr-2 flex items-center gap-1"><FaEdit /></Button>
                    <Button aria-label="Delete" onClick={() => handleDelete(classObj)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-xs flex items-center gap-1"><FaTrash /></Button>
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
      {assignModalOpen && (
        <AssignMemberModal
          open={assignModalOpen}
          onClose={() => setAssignModalOpen(false)}
          onSuccess={() => setAssignModalOpen(false)}
        />
      )}
      <ClassModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        classObj={selectedClass}
        mode={modalMode}
        onSubmit={handleModalSubmit}
        onChange={setSelectedClass}
        trainers={trainers}
      />
    </div>
  );
};

export default ClassesTable; 