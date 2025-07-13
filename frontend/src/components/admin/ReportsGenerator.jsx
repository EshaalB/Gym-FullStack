import React, { useState, useEffect } from 'react';
import { FaDownload, FaChartBar, FaUsers, FaDollarSign, FaCalendarAlt, FaFilePdf, FaFileExcel } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';

const ReportsGenerator = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState('monthly');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  const reportTypes = [
    {
      id: 'monthly',
      name: 'Monthly Performance Report',
      icon: FaCalendarAlt,
      description: 'Comprehensive monthly overview of gym performance'
    },
    {
      id: 'revenue',
      name: 'Revenue Analysis Report',
      icon: FaDollarSign,
      description: 'Detailed financial performance and revenue trends'
    },
    {
      id: 'membership',
      name: 'Membership Analytics Report',
      icon: FaUsers,
      description: 'Member retention, growth, and engagement metrics'
    },
    {
      id: 'class',
      name: 'Class Performance Report',
      icon: FaChartBar,
      description: 'Class attendance, popularity, and trainer performance'
    }
  ];

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('http://localhost:3500/api/reports/list', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      const response = await axios.post('http://localhost:3500/api/reports/generate', {
        reportType: selectedReport,
        dateRange: dateRange
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Report generated successfully!');
      fetchReports();
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async (reportId, format = 'pdf') => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`http://localhost:3500/api/reports/${reportId}/download?format=${format}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report-${reportId}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success(`Report downloaded as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Error downloading report:', error);
      toast.error('Failed to download report');
    }
  };

  const getReportIcon = (reportType) => {
    const report = reportTypes.find(r => r.id === reportType);
    return report ? report.icon : FaChartBar;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
      <div className="flex items-center gap-2 mb-6">
        <FaChartBar className="text-red-400 text-xl" />
        <h2 className="text-2xl font-bold text-white">Reports Generator</h2>
      </div>

      <div className="space-y-6">
        {/* Report Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Select Report Type
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reportTypes.map((report) => {
              const Icon = report.icon;
              return (
                <div
                  key={report.id}
                  onClick={() => setSelectedReport(report.id)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    selectedReport === report.id
                      ? 'border-red-400 bg-red-400/10'
                      : 'border-gray-600 hover:border-red-400/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`text-xl ${selectedReport === report.id ? 'text-red-400' : 'text-gray-400'}`} />
                    <div>
                      <h3 className="text-lg font-semibold text-white">{report.name}</h3>
                      <p className="text-sm text-gray-400">{report.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Date Range Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-full px-4 py-3 bg-black/50 backdrop-blur-sm border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              className="w-full px-4 py-3 bg-black/50 backdrop-blur-sm border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-300"
            />
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={generateReport}
          disabled={loading}
          className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Generating Report...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <FaChartBar className="w-4 h-4" />
              Generate Report
            </div>
          )}
        </button>

        {/* Generated Reports List */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Generated Reports</h3>
          {reports.length === 0 ? (
            <div className="text-center py-8">
              <FaChartBar className="text-gray-400 text-3xl mx-auto mb-3" />
              <p className="text-gray-400">No reports generated yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((report) => {
                const Icon = getReportIcon(report.reportType);
                return (
                  <div
                    key={report.id}
                    className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className="text-red-400 text-xl" />
                        <div>
                          <h4 className="text-white font-medium">{report.name}</h4>
                          <p className="text-sm text-gray-400">
                            Generated on {formatDate(report.generatedAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => downloadReport(report.id, 'pdf')}
                          className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                          title="Download as PDF"
                        >
                          <FaFilePdf className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => downloadReport(report.id, 'excel')}
                          className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
                          title="Download as Excel"
                        >
                          <FaFileExcel className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Report Features */}
        <div className="bg-gray-800/30 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-3">Report Features</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <FaChartBar className="text-red-400" />
              <span>Performance Metrics & Analytics</span>
            </div>
            <div className="flex items-center gap-2">
              <FaUsers className="text-red-400" />
              <span>Member Growth & Retention</span>
            </div>
            <div className="flex items-center gap-2">
              <FaDollarSign className="text-red-400" />
              <span>Revenue Analysis & Trends</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-red-400" />
              <span>Class Attendance & Popularity</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsGenerator; 