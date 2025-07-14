import React, { useState } from "react";

const RenewMembershipModal = ({ isOpen, onClose, currentStatus, expiryDate, onRenew, loading, error }) => {
  const [period, setPeriod] = useState(1);
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
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Renew Membership</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <div className="mb-4 text-gray-800">
          <div><b>Status:</b> {currentStatus}</div>
          <div><b>Expiry:</b> {expiryDate}</div>
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-semibold text-gray-700">Renew for:</label>
          <select
            className="w-full border rounded-lg px-3 py-2"
            value={period}
            onChange={e => setPeriod(Number(e.target.value))}
          >
            <option value={1}>1 Month</option>
            <option value={3}>3 Months</option>
            <option value={6}>6 Months</option>
            <option value={12}>12 Months</option>
          </select>
        </div>
        <button
          onClick={() => onRenew(period)}
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Renew Membership"}
        </button>
      </div>
    </div>
  );
};

export default RenewMembershipModal; 