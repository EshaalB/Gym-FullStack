import React from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import Button from "../Button";

const TrainersTable = ({ 
  trainers, 
  loading, 
  onAddTrainer, 
  onEditTrainer, 
  onDeleteTrainer 
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Trainers Management</h1>
        <Button
          onClick={onAddTrainer}
          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <FaPlus className="mr-2" />
          Add Trainer
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
        </div>
      ) : (
        <div className="bg-black/50 backdrop-blur-lg rounded-xl overflow-hidden border border-red-500/20">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-red-600/50">
                <tr>
                  <th className="px-6 py-3 text-left text-white font-semibold">Name</th>
                  <th className="px-6 py-3 text-left text-white font-semibold">Email</th>
                  <th className="px-6 py-3 text-left text-white font-semibold">Specialization</th>
                  <th className="px-6 py-3 text-left text-white font-semibold">Experience</th>
                  <th className="px-6 py-3 text-left text-white font-semibold">Salary</th>
                  <th className="px-6 py-3 text-left text-white font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-red-500/20">
                {trainers.map((trainer) => (
                  <tr key={trainer.userId} className="hover:bg-red-500/10 transition-colors">
                    <td className="px-6 py-4 text-white">{trainer.fName} {trainer.lName}</td>
                    <td className="px-6 py-4 text-white">{trainer.email}</td>
                    <td className="px-6 py-4 text-white">{trainer.specialization}</td>
                    <td className="px-6 py-4 text-white">{trainer.experienceYears} years</td>
                    <td className="px-6 py-4 text-white">${trainer.salary?.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onEditTrainer(trainer)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
                          title="Edit Trainer"
                        >
                          <FaEdit className="mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => onDeleteTrainer(trainer.userId)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 transform hover:scale-105"
                          title="Delete Trainer"
                        >
                          <FaTrash className="mr-1" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainersTable; 