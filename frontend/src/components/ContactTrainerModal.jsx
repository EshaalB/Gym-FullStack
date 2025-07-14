import React, { useState } from "react";

const ContactTrainerModal = ({ isOpen, onClose, trainer, onSend, loading, error }) => {
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
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Contact Trainer</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <div className="mb-4 text-gray-800">
          <div><b>Trainer:</b> {trainer?.name || "N/A"}</div>
          <div><b>Email:</b> {trainer?.email || "N/A"}</div>
        </div>
        <textarea
          className="w-full border rounded-lg px-3 py-2 mb-4"
          rows={4}
          placeholder="Type your message..."
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <button
          onClick={() => onSend(message)}
          disabled={loading || !message.trim()}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </div>
    </div>
  );
};

export default ContactTrainerModal; 