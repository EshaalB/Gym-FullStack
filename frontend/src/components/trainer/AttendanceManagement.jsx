import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaCheck, FaTimes, FaCalendar, FaUsers, FaDumbbell, FaHistory, FaFileExport, FaFilter, FaUserCheck, FaUserTimes, FaUserClock, FaClock, FaPlus, FaCheckCircle } from "react-icons/fa";
import toast from "react-hot-toast";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import "./AttendanceCalendar.css";
import { useSelector } from "react-redux";

const AttendanceManagement = ({ classes = [], membersInClasses = [] }) => {
  const token = useSelector(state => state.auth.token);
  const [selectedClass, setSelectedClass] = useState(classes[0]?.classId || null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [attendanceData, setAttendanceData] = useState({});
  const [memberHistory, setMemberHistory] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [exporting, setExporting] = useState(false);
  const [calendarIndicators, setCalendarIndicators] = useState({}); // { 'YYYY-MM-DD': true }
  const [alreadyMarked, setAlreadyMarked] = useState({}); // { 'YYYY-MM-DD': true }
  const [loadingIndicators, setLoadingIndicators] = useState(false);

  // Fetch attendance indicators for the month (for calendar dots/ticks)
  const fetchMarkedDays = async () => {
    if (!selectedClass || !token) return;
    setLoadingIndicators(true);
    try {
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth() + 1;
      const res = await fetch(`http://localhost:3500/api/attendance/class/${selectedClass}?year=${year}&month=${month}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch attendance days');
      const data = await res.json();
      const indicators = {};
      const marked = {};
      (data.markedDays || []).forEach(day => {
        indicators[day] = true;
        marked[day] = true;
      });
      setCalendarIndicators(indicators);
      setAlreadyMarked(marked);
    } catch (err) {
      setCalendarIndicators({});
      setAlreadyMarked({});
      toast.error("Failed to fetch attendance indicators");
    }
    setLoadingIndicators(false);
  };

  useEffect(() => {
    fetchMarkedDays();
    // eslint-disable-next-line
  }, [selectedClass, selectedDate, token]);

  const handleClassSelect = (e) => {
    setSelectedClass(e.target.value);
    setAttendanceData({});
    setShowModal(false);
  };

  // Calendar day click handler
  const handleDayClick = (date) => {
    if (!selectedClass) {
      toast.error("Please select a class first");
      return;
    }
    if (getSelectedClassMembers().length === 0) {
      toast.error("No members in this class");
      return;
    }
    const dateStr = date.toISOString().split('T')[0];
    if (alreadyMarked[dateStr]) {
      toast.error("Attendance already marked for this day");
      return;
    }
    setSelectedDate(date);
    setShowModal(true);
    setAttendanceData({});
  };

  // Get members for selected class
  const getSelectedClassMembers = () => {
    if (!selectedClass) return [];
    return (membersInClasses || []).filter(member => member.classId === selectedClass);
  };

  // Attendance status for a member
  const getAttendanceStatus = (memberId) => {
    return attendanceData[memberId] || null;
  };

  // Mark attendance for a member
  const handleAttendanceChange = (memberId, status) => {
    setAttendanceData(prev => ({ ...prev, [memberId]: status }));
  };

  // Bulk mark all
  const handleBulkMark = (status) => {
    const members = getSelectedClassMembers();
    const newData = {};
    members.forEach(m => { newData[m.memberId] = status; });
    setAttendanceData(newData);
  };

  // Submit attendance for the selected day
  const handleSubmitAttendance = async () => {
    if (!selectedClass) {
      toast.error("Please select a class first");
      return;
    }
    const attendanceEntries = Object.entries(attendanceData);
    if (attendanceEntries.length === 0) {
      toast.error("Please mark attendance for at least one member");
      return;
    }
    const dateStr = selectedDate.toISOString().split('T')[0];
    if (alreadyMarked[dateStr]) {
      toast.error("Attendance already marked for this day");
      return;
    }
    try {
      for (const [memberId, status] of attendanceEntries) {
        if (!memberId || !status) {
          toast.error("Invalid attendance data");
          return;
        }
      }
      await Promise.all(attendanceEntries.map(async ([memberId, status]) => {
        const payload = {
          memberId: Number(memberId),
          classId: Number(selectedClass),
          attendanceStatus: status,
          date: dateStr
        };
        const res = await fetch('http://localhost:3500/api/attendance/mark', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
        let data = {};
        try { data = await res.json(); } catch {}
        if (!res.ok) {
          toast.error(data.error || `Failed for member ${memberId}`);
          throw new Error(data.error || `Failed for member ${memberId}`);
        }
      }));
      toast.success("Attendance marked successfully!");
      setShowModal(false);
      // Refresh indicators after marking
      fetchMarkedDays();
    } catch (err) {
      toast.error(err.message || "Failed to mark attendance");
    }
  };

  // Fetch member history
  const handleShowHistory = async (member) => {
    setMemberHistory(member);
    setHistoryLoading(true);
    setHistoryData([]);
    try {
      const res = await fetch(`http://localhost:3500/api/attendance/member/${member.memberId}?classId=${selectedClass}`,
        { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await res.json();
      setHistoryData(data.attendance || []);
    } catch {
      setHistoryData([]);
      toast.error("Failed to fetch member history");
    }
    setHistoryLoading(false);
  };

  // Export to Excel using exceljs
  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const res = await fetch(`http://localhost:3500/api/attendance/class/${selectedClass}?month=${selectedDate.getMonth() + 1}&year=${selectedDate.getFullYear()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch attendance data');
      const data = await res.json();
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet('Attendance');
      sheet.columns = [
        { header: 'Date', key: 'date', width: 15 },
        { header: 'Member', key: 'member', width: 25 },
        { header: 'Status', key: 'status', width: 12 },
      ];
      (data.attendance || []).forEach(row => {
        sheet.addRow({ date: row.date, member: row.memberName, status: row.status });
      });
      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buffer]), `attendance_${selectedClass}_${selectedDate.getFullYear()}_${selectedDate.getMonth() + 1}.xlsx`);
      toast.success("Exported Excel file!");
    } catch {
      toast.error("Failed to export Excel");
    }
    setExporting(false);
  };

  // Attendance summary for the month
  const getMonthlySummary = () => {
    // TODO: Calculate from fetched data
    return { present: 0, absent: 0, late: 0 };
  };

  // Filtered members in modal
  const filteredMembers = getSelectedClassMembers().filter(m => {
    if (!filterStatus) return true;
    return attendanceData[m.memberId] === filterStatus;
  });

  return (
    <div className="space-y-8 flex flex-col items-center w-full">
      {/* Class Picker */}
      <div className="flex flex-col items-center w-full mb-4 glassy-box">
        <label className="text-lg font-semibold text-white mb-2">Select Class</label>
        <select
          value={selectedClass || ''}
          onChange={handleClassSelect}
          className="w-full max-w-xs px-4 py-2 rounded-lg bg-black/60 border border-red-500/30 text-white focus:border-red-500 focus:outline-none glassy-input"
        >
          <option value="" disabled>Select a class</option>
          {classes.map(cls => (
            <option key={cls.classId} value={cls.classId}>{cls.className}</option>
          ))}
        </select>
      </div>
      {/* Calendar */}
      <div className="flex flex-col items-center w-full glassy-box p-6 rounded-2xl">
        <Calendar
          onClickDay={handleDayClick}
          value={selectedDate}
          className="custom-calendar-theme w-full max-w-2xl rounded-xl shadow-lg border border-red-500/30 bg-black/60 text-white glassy-calendar"
          tileClassName={({ date }) => {
            if (date.toDateString() === new Date().toDateString()) return "calendar-today";
            const key = date.toISOString().split('T')[0];
            if (calendarIndicators[key]) return "calendar-attendance-marked calendar-attendance-full";
            return null;
          }}
          prevLabel={<span className="text-red-400">&#8592;</span>}
          nextLabel={<span className="text-red-400">&#8594;</span>}
          prev2Label={null}
          next2Label={null}
          tileContent={({ date }) => {
            const key = date.toISOString().split('T')[0];
            return (
              <div className="flex flex-col items-center justify-center">
                {calendarIndicators[key] && <FaCheckCircle className="text-green-400 text-lg mt-1 glassy-tick" title="Attendance marked" />}
                {!alreadyMarked[key] && (
                  <span
                    className="mt-1 p-1 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs flex items-center glassy-add-btn cursor-pointer"
                    style={{ minWidth: 24, minHeight: 24 }}
                    onClick={e => { e.stopPropagation(); handleDayClick(date); }}
                    title="Add/Mark Attendance"
                    tabIndex={0}
                    role="button"
                    aria-label="Add/Mark Attendance"
                  >
                    <FaPlus />
                  </span>
                )}
              </div>
            );
          }}
        />
        {/* Monthly summary */}
        <div className="flex gap-4 mt-4">
          <span className="text-green-400 flex items-center gap-1"><FaUserCheck title="Present" /> Present: {getMonthlySummary().present}</span>
          <span className="text-red-400 flex items-center gap-1"><FaUserTimes title="Absent" /> Absent: {getMonthlySummary().absent}</span>
          <span className="text-yellow-400 flex items-center gap-1"><FaUserClock title="Late" /> Late: {getMonthlySummary().late}</span>
        </div>
      </div>
      {/* Export Button */}
      <div className="flex flex-wrap gap-2 items-center justify-center w-full glassy-box">
        <button onClick={handleExportCSV} className="flex items-center gap-2 bg-black/50 border border-red-500/30 text-white px-4 py-2 rounded-lg hover:bg-red-700/30 transition-all duration-200 glassy-btn" title="Export to Excel">
          <FaFileExport /> {exporting ? "Exporting..." : "Export Excel"}
        </button>
      </div>
      {/* Attendance Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-black/80 rounded-xl p-8 w-full max-w-2xl relative border border-red-500/30 glassy-modal shadow-2xl">
            <button onClick={() => setShowModal(false)} className="absolute top-2 right-2 text-white text-2xl" title="Close">&times;</button>
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              Mark Attendance <FaCalendar className="text-red-400" title="Attendance" />
            </h2>
            <div className="text-gray-400 mb-4">{selectedDate.toDateString()}</div>
            {/* Bulk actions and filters */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button onClick={() => handleBulkMark('P')} className="bg-green-600 text-white px-3 py-1 rounded-lg flex items-center gap-1 glassy-btn" title="Mark all present"><FaUserCheck /> All Present</button>
              <button onClick={() => handleBulkMark('A')} className="bg-red-600 text-white px-3 py-1 rounded-lg flex items-center gap-1 glassy-btn" title="Mark all absent"><FaUserTimes /> All Absent</button>
              <button onClick={() => handleBulkMark('L')} className="bg-yellow-600 text-white px-3 py-1 rounded-lg flex items-center gap-1 glassy-btn" title="Mark all late"><FaUserClock /> All Late</button>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="bg-black border border-red-500/30 text-white px-2 py-1 rounded-lg glassy-input" title="Filter by status">
                <option value="">All</option>
                <option value="P">Present</option>
                <option value="A">Absent</option>
                <option value="L">Late</option>
              </select>
            </div>
            {/* Members list */}
            <div className="max-h-72 overflow-y-auto space-y-2">
              {filteredMembers.length === 0 ? (
                <div className="text-gray-400 text-center py-8">No members found.</div>
              ) : filteredMembers.map((member) => (
                <div key={member.memberId} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3 border border-gray-700 glassy-row">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold" title={member.fName + ' ' + member.lName}>
                      {member.fName?.charAt(0)}{member.lName?.charAt(0)}
                    </div>
                    <div className="font-semibold text-white">{member.fName} {member.lName}</div>
                    <div className="text-sm text-gray-400">{member.email}</div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <button onClick={() => handleAttendanceChange(member.memberId, 'P')} className={`px-3 py-1 rounded-lg ${getAttendanceStatus(member.memberId) === 'P' ? 'bg-green-600 text-white' : 'bg-gray-600 text-white hover:bg-green-600'} glassy-btn`} title="Present"><FaCheck /></button>
                    <button onClick={() => handleAttendanceChange(member.memberId, 'A')} className={`px-3 py-1 rounded-lg ${getAttendanceStatus(member.memberId) === 'A' ? 'bg-red-600 text-white' : 'bg-gray-600 text-white hover:bg-red-600'} glassy-btn`} title="Absent"><FaTimes /></button>
                    <button onClick={() => handleAttendanceChange(member.memberId, 'L')} className={`px-3 py-1 rounded-lg ${getAttendanceStatus(member.memberId) === 'L' ? 'bg-yellow-600 text-white' : 'bg-gray-600 text-white hover:bg-yellow-600'} glassy-btn`} title="Late"><FaClock /></button>
                    <button onClick={() => handleShowHistory(member)} className="ml-2 text-blue-400 hover:underline flex items-center gap-1 glassy-btn" title="View history"><FaHistory /> History</button>
                  </div>
                </div>
              ))}
            </div>
            {/* Submit button */}
            <div className="flex justify-end mt-4">
              <button onClick={handleSubmitAttendance} className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-all duration-200 glassy-btn" title="Submit Attendance">
                Submit Attendance
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Member History Side Panel */}
      {memberHistory && (
        <div className="fixed inset-y-0 right-0 w-full max-w-md bg-black/70 backdrop-blur-lg border border-red-500/30 z-40 glassy-modal">
          <div className="flex justify-between items-center p-4 border-b border-red-500/30">
            <h3 className="text-xl font-semibold text-white">History for {memberHistory.fName} {memberHistory.lName}</h3>
            <button onClick={() => setMemberHistory(null)} className="text-white text-2xl" title="Close">&times;</button>
          </div>
          {historyLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto mb-4"></div>
              <p className="text-white text-lg">Loading history...</p>
            </div>
          ) : historyData.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No attendance history found for this member.</p>
            </div>
          ) : (
            <div className="max-h-full overflow-y-auto p-4 space-y-3">
              {historyData.map((entry, index) => (
                <div key={index} className="bg-gray-800/50 rounded-lg p-3 border border-gray-700 glassy-row">
                  <p className="text-sm text-gray-400">Date: {new Date(entry.date).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-400">Status: {entry.attendanceStatus}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AttendanceManagement;