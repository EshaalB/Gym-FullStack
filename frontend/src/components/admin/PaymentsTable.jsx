import React from "react";
import SkeletonLoader from "../common/SkeletonLoader"; 
import Button from "../common/Button";

const PaymentsTable = ({ payments, loading, error }) => {
  if (loading) {
    return <SkeletonLoader variant="table" />;
  }
  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }
  return (
    <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Pending Payments</h2>
        {/* Future: Add Payment button */}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-300">
          <caption className="sr-only">List of all pending payments</caption>
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
                  <td className="px-4 py-2">
                    {/* Future: Approve/Reject buttons using Redux thunks */}
                    <Button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-xs mr-2">Approve</Button>
                    <Button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-xs">Reject</Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center text-gray-400 py-6">No pending payments found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentsTable; 