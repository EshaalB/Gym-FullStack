import React, { useEffect } from "react";
import Modal from "../../modals/Modal";
import Button from "../../common/Button";

const PaymentModal = ({ isOpen, onClose, payment, onSubmit, onChange, paymentMethods = [], fetchMethods }) => {
  useEffect(() => {
    if (isOpen && paymentMethods.length === 0 && fetchMethods) {
      fetchMethods();
    }
  }, [isOpen, paymentMethods, fetchMethods]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Payment">
      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-white mb-2">User Name</label>
          <input
            type="text"
            value={payment.userName || ""}
            disabled
            className="w-full px-4 py-3 bg-black/50 border border-red-500/30 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Amount</label>
            <input
              type="number"
              min="0"
              value={payment.amount || ""}
              onChange={(e) => onChange({ ...payment, amount: e.target.value })}
              className="w-full px-4 py-3 bg-black/50 border border-red-500/30 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Method</label>
            <select
              value={payment.paymentMethod || ""}
              onChange={e => onChange({ ...payment, paymentMethod: e.target.value })}
              className="w-full px-4 py-3 bg-black/50 border border-red-500/30 rounded-lg text-white focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
              required
            >
              <option value="">Select Method</option>
              {paymentMethods.map(method => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Date</label>
          <input
            type="date"
            value={payment.paymentDate ? payment.paymentDate.slice(0, 10) : ""}
            onChange={(e) => onChange({ ...payment, paymentDate: e.target.value })}
            className="w-full px-4 py-3 bg-black/50 border border-red-500/30 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
            required
          />
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
            Update Payment
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default PaymentModal; 