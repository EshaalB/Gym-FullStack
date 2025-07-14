import React, { useState } from "react";

const EditProfileModal = ({ isOpen, onClose, profile, onSave, loading, error }) => {
  const [form, setForm] = useState({
    fName: profile?.fName || "",
    lName: profile?.lName || "",
    email: profile?.email || "",
    gender: profile?.gender || "",
    dateOfBirth: profile?.dateOfBirth || "",
  });
  if (!isOpen) return null;
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl font-bold"
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Edit Profile</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <form onSubmit={e => { e.preventDefault(); onSave(form); }}>
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-gray-700">First Name</label>
            <input name="fName" value={form.fName} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-gray-700">Last Name</label>
            <input name="lName" value={form.lName} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-gray-700">Email</label>
            <input name="email" value={form.email} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" type="email" />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-gray-700">Gender</label>
            <select name="gender" value={form.gender} onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-gray-700">Date of Birth</label>
            <input name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" type="date" />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal; 