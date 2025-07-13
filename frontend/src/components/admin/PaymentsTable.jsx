import React from "react";
import { FaCheck, FaTimes, FaClock, FaUser, FaDollarSign, FaCreditCard } from "react-icons/fa";
import Button from "../Button";

const PaymentsTable = ({ 
  payments, 
  loading, 
  onApprovePayment, 
  onRejectPayment 
}) => {
  const getStatusBadge = (status) => {
    const colors = {
      'Pending': 'bg-yellow-600 text-white',
      'Completed': 'bg-green-600 text-white',
      'Failed': 'bg-red-600 text-white',
      'Cancelled': 'bg-gray-600 text-white'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[status] || 'bg-gray-600 text-white'}`}>
        {status}
      </span>
    );
  };

  const getPaymentMethodIcon = (method) => {
    const icons = {
      'Cash': '💵',
      'Credit Card': '💳',
      'Debit Card': '💳',
      'Online': '🌐'
    };
    return icons[method] || '💰';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Payments Management</h1>
        <div className="flex items-center space-x-4">
          <div className="bg-yellow-600/20 border border-yellow-500/30 rounded-lg px-4 py-2">
            <div className="flex items-center space-x-2">
              <FaClock className="text-yellow-400" />
              <span className="text-yellow-400 font-semibold">
                {payments.filter(p => p.status === 'Pending').length} Pending
              </span>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading payments...</p>
        </div>
      ) : (
        <div className="bg-black/50 backdrop-blur-lg rounded-xl overflow-hidden border border-red-500/20 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-red-600/80 to-red-800/80">
                <tr>
                  <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wider">Method</th>
                  <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-red-500/20">
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-400">
                      <div className="flex flex-col items-center space-y-2">
                        <FaCreditCard className="text-4xl text-gray-600" />
                        <p className="text-lg">No payments found</p>
                        <p className="text-sm">All payments have been processed</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  payments.map((payment) => (
                    <tr key={payment.paymentId} className="hover:bg-red-500/10 transition-all duration-200 group">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                              <FaUser />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">
                              {payment.fName} {payment.lName}
                            </div>
                            <div className="text-sm text-gray-400">{payment.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <FaDollarSign className="text-green-400" />
                          <span className="text-white font-semibold">
                            ${parseFloat(payment.amount).toFixed(2)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{getPaymentMethodIcon(payment.paymentMethod)}</span>
                          <span className="text-white">{payment.paymentMethod}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white">{payment.paymentType}</td>
                      <td className="px-6 py-4 text-white">{formatDate(payment.paymentDate)}</td>
                      <td className="px-6 py-4">{getStatusBadge(payment.status)}</td>
                      <td className="px-6 py-4">
                        {payment.status === 'Pending' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => onApprovePayment(payment.paymentId)}
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 transform hover:scale-105"
                              title="Approve Payment"
                            >
                              <FaCheck className="mr-1" />
                              Approve
                            </button>
                            <button
                              onClick={() => onRejectPayment(payment.paymentId)}
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 transform hover:scale-105"
                              title="Reject Payment"
                            >
                              <FaTimes className="mr-1" />
                              Reject
                            </button>
                          </div>
                        )}
                        {payment.status !== 'Pending' && (
                          <span className="text-gray-400 text-sm">
                            {payment.status === 'Completed' ? 'Processed' : 'Handled'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsTable; 