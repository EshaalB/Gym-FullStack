import React, { useState } from "react";
import SkeletonLoader from "../common/SkeletonLoader";
import Button from "../common/Button";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { showConfirmAlert, showSuccessAlert } from "../../utils/sweetAlert";
import TrainerModal from "./modals/TrainerModal";

const TrainersTable = ({ trainers, loading, error, onAddTrainer, onEditTrainer, onDeleteTrainer }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedTrainer, setSelectedTrainer] = useState({});

  const handleAdd = () => {
    setModalMode("add");
    setSelectedTrainer({});
    setModalOpen(true);
  };

  const handleEdit = (trainer) => {
    setModalMode("edit");
    setSelectedTrainer(trainer);
    setModalOpen(true);
  };

  const handleDelete = async (trainer) => {
    const result = await showConfirmAlert("Delete Trainer?", `Are you sure you want to delete ${trainer.fName} ${trainer.lName}?`, "Delete", "Cancel");
    if (result.isConfirmed && onDeleteTrainer) {
      onDeleteTrainer(trainer);
    }
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (modalMode === "add" && onAddTrainer) {
      await onAddTrainer(selectedTrainer, () => setModalOpen(false));
      showSuccessAlert("Trainer added successfully");
    } else if (modalMode === "edit" && onEditTrainer) {
      await onEditTrainer(selectedTrainer, () => setModalOpen(false));
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
        <h2 className="text-2xl font-bold text-white">Trainers</h2>
        <Button onClick={handleAdd} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <FaPlus /> Add Trainer
        </Button>
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
                    <Button aria-label="Edit" onClick={() => handleEdit(trainer)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-xs mr-2 flex items-center gap-1"><FaEdit /></Button>
                    <Button aria-label="Delete" onClick={() => handleDelete(trainer)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-xs flex items-center gap-1"><FaTrash /></Button>
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
      <TrainerModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        trainer={selectedTrainer}
        mode={modalMode}
        onSubmit={handleModalSubmit}
        onChange={setSelectedTrainer}
      />
    </div>
  );
};

export default TrainersTable; 