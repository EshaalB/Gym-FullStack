import React from "react";
import Modal from "../../modals/Modal";
import Button from "../../common/Button";

const ClassModal = ({ isOpen, onClose, classObj, mode, onSubmit, onChange, trainers = [] }) => {
  // Remove useEffect and local trainers state
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${mode === "add" ? "Add" : "Edit"} Class`}>
      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Class Name</label>
          <input
            type="text"
            placeholder="Enter class name"
            value={classObj.className || ""}
            onChange={(e) => onChange({ ...classObj, className: e.target.value })}
            className="w-full px-4 py-3 bg-black/50 border border-red-500/30 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Trainer</label>
          <select
            value={classObj.trainerId || ""}
            onChange={e => onChange({ ...classObj, trainerId: e.target.value })}
            className="w-full px-4 py-3 bg-black/50 border border-red-500/30 rounded-lg text-white focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
            required
          >
            <option value="">Select Trainer</option>
            {trainers.map(t => (
              <option key={t.userId} value={t.userId}>
                {t.fName} {t.lName} ({t.email})
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Gender Specific</label>
            <select
              value={classObj.genderSpecific || ""}
              onChange={(e) => onChange({ ...classObj, genderSpecific: e.target.value })}
              className="w-full px-4 py-3 bg-black/50 border border-red-500/30 rounded-lg text-white focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
              required
            >
              <option value="">Select</option>
              <option value="Any">Any</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Seats</label>
            <input
              type="number"
              min="1"
              value={classObj.seats || ""}
              onChange={(e) => onChange({ ...classObj, seats: e.target.value })}
              className="w-full px-4 py-3 bg-black/50 border border-red-500/30 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
              required
            />
          </div>
        </div>
        <div className="flex justify-end space-x-4 pt-4">
          <Button
            type="button"
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            {mode === "add" ? "Add" : "Update"} Class
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ClassModal; 