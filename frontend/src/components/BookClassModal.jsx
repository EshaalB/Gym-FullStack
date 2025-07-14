import React, { useState } from "react";

const BookClassModal = ({ isOpen, onClose, availableClasses, onBook, loading, error }) => {
  const [selectedClass, setSelectedClass] = useState(null);

  if (!isOpen) return null;

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
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Book a Class</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <div className="mb-4">
          <label className="block mb-2 font-semibold text-gray-700">Select a class:</label>
          <select
            className="w-full border rounded-lg px-3 py-2"
            value={selectedClass || ''}
            onChange={e => setSelectedClass(e.target.value)}
          >
            <option value="" disabled>Select a class</option>
            {availableClasses && availableClasses.length > 0 ? availableClasses.map(c => (
              <option key={c.classId} value={c.classId}>
                {c.className} ({c.classDay || c.day || ''}) - Trainer: {c.trainerName || ''}
              </option>
            )) : <option disabled>No classes available</option>}
          </select>
        </div>
        <button
          onClick={() => onBook(selectedClass)}
          disabled={!selectedClass || loading}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50"
        >
          {loading ? "Booking..." : "Book Class"}
        </button>
      </div>
    </div>
  );
};

export default BookClassModal; 