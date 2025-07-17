import React, { useState } from "react";
import SkeletonLoader from "../common/SkeletonLoader"; 
import Button from "../common/Button";
import { FaCheck, FaEdit } from "react-icons/fa";
import PaymentModal from "./modals/PaymentModal";

const PaymentsTable = ({ payments, loading, error, onApprovePayment, onEditPayment }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState({});

  const handleEdit = (payment) => {
    setSelectedPayment(payment);
    setModalOpen(true);
  };

  const handleApprove = async (payment) => {
    if (onApprovePayment) {
      await onApprovePayment(payment);
    }
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (onEditPayment) {
      await onEditPayment(selectedPayment, () => setModalOpen(false));
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
      <h2 className="text-2xl font-bold text-white mb-4">Payments</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-300">
          <caption className="sr-only">List of all payments</caption>
          <thead>
            <tr>
              <th className="px-4 py-2 text-left" scope="col">User</th>
              <th className="px-4 py-2 text-left" scope="col">Amount</th>
              <th className="px-4 py-2 text-left" scope="col">Method</th>
              <th className="px-4 py-2 text-left" scope="col">Date</th>
              <th className="px-4 py-2 text-left" scope="col">Status</th>
              <th className="px-4 py-2 text-left" scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments && payments.length > 0 ? (
              payments.map((payment) => (
                <tr key={payment.paymentId} className="border-b border-gray-700/30">
                  <td className="px-4 py-2">{payment.userName || 'Unknown'}</td>
                  <td className="px-4 py-2">${payment.amount}</td>
                  <td className="px-4 py-2">{payment.paymentMethod}</td>
                  <td className="px-4 py-2">{payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : "-"}</td>
                  <td className="px-4 py-2">{payment.status}</td>
                  <td className="px-4 py-2 flex gap-2">
                    {payment.status === "Pending" && (
                      <Button aria-label="Approve" onClick={() => handleApprove(payment)} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-xs flex items-center gap-1"><FaCheck /> Approve</Button>
                    )}
                    {payment.status !== "Completed" && (
                      <Button aria-label="Edit" onClick={() => handleEdit(payment)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-xs flex items-center gap-1"><FaEdit /> Edit</Button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center text-gray-400 py-6">No payments found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <PaymentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        payment={selectedPayment}
        mode="edit"
        onSubmit={handleModalSubmit}
        onChange={setSelectedPayment}
      />
    </div>
  );
};

export default PaymentsTable; 