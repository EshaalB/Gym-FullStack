import React from "react";
import Modal from "../../../components/common/Modal"; 
import Button from "../../../components/common/Button";

const UserModal = ({ isOpen, onClose, user, mode, onSubmit, onChange }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${mode === "add" ? "Add" : "Edit"} User`}>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">First Name</label>
            <input
              type="text"
              placeholder="Enter first name"
              value={user.fName || ""}
              onChange={(e) => onChange({ ...user, fName: e.target.value })}
              className="w-full px-4 py-3 bg-black/50 border border-red-500/30 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Last Name</label>
            <input
              type="text"
              placeholder="Enter last name"
              value={user.lName || ""}
              onChange={(e) => onChange({ ...user, lName: e.target.value })}
              className="w-full px-4 py-3 bg-black/50 border border-red-500/30 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-white mb-2">Email</label>
          <input
            type="email"
            placeholder="Enter email address"
            value={user.email || ""}
            onChange={(e) => onChange({ ...user, email: e.target.value })}
            className="w-full px-4 py-3 bg-black/50 border border-red-500/30 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
            required
          />
        </div>

        {mode === "add" && (
          <div>
            <label className="block text-sm font-medium text-white mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter password (min 6 characters)"
              value={user.password || ""}
              onChange={(e) => onChange({ ...user, password: e.target.value })}
              className="w-full px-4 py-3 bg-black/50 border border-red-500/30 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
              minLength="6"
              required={mode === "add"}
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Date of Birth</label>
            <input
              type="date"
              value={user.dateofBirth || ""}
              onChange={(e) => onChange({ ...user, dateofBirth: e.target.value })}
              className="w-full px-4 py-3 bg-black/50 border border-red-500/30 rounded-lg text-white focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Gender</label>
            <select
              value={user.gender || ""}
              onChange={(e) => onChange({ ...user, gender: e.target.value })}
              className="w-full px-4 py-3 bg-black/50 border border-red-500/30 rounded-lg text-white focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">User Role</label>
          <select
            value={user.userRole || ""}
            onChange={(e) => onChange({ ...user, userRole: e.target.value })}
            className="w-full px-4 py-3 bg-black/50 border border-red-500/30 rounded-lg text-white focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
            required
          >
            <option value="">Select Role</option>
            <option value="Member">Member</option>
            <option value="Trainer">Trainer</option>
            <option value="Admin">Admin</option>
          </select>
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
            {mode === "add" ? "Add" : "Update"} User
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default UserModal; 