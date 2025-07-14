import React, { useState } from "react";

const SupportModal = ({ isOpen, onClose, onSend, loading, error }) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
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
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Support Request</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-gray-700">Subject</label>
          <input value={subject} onChange={e => setSubject(e.target.value)} className="w-full border rounded-lg px-3 py-2" />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-gray-700">Message</label>
          <textarea value={message} onChange={e => setMessage(e.target.value)} className="w-full border rounded-lg px-3 py-2" rows={4} />
        </div>
        <button
          onClick={() => onSend({ subject, message })}
          disabled={loading || !subject.trim() || !message.trim()}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Request"}
        </button>
      </div>
    </div>
  );
};

export default SupportModal; 