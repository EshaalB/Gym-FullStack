import React, { useEffect, useState } from "react";
import Button from "../../common/Button";

const AssignMemberModal = ({ open, onClose, onSuccess }) => {
  const [members, setMembers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedMember, setSelectedMember] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!open) return;
    setError("");
    setSuccess("");
    setSelectedMember("");
    setSelectedClass("");
    // Fetch all members
    fetch("/api/users?role=Member&page=1&limit=1000", {
      headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
    })
      .then((res) => res.json())
      .then((data) => setMembers(data.users || []));
    // Fetch all classes
    fetch("/api/classes", {
      headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
    })
      .then((res) => res.json())
      .then((data) => setClasses(data.classes || []));
  }, [open]);

  const handleAssign = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/classes/assign-member", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        },
        body: JSON.stringify({ memberId: selectedMember, classId: selectedClass })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to assign member");
      setSuccess("Member assigned successfully!");
      onSuccess && onSuccess();
      setTimeout(() => onClose(), 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-red-600" onClick={onClose}>&times;</button>
        <h2 className="text-xl font-bold mb-4">Assign Member to Class</h2>
        <form onSubmit={handleAssign} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Select Member</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={selectedMember}
              onChange={e => setSelectedMember(e.target.value)}
              required
            >
              <option value="">-- Select Member --</option>
              {members.map(m => (
                <option key={m.userId} value={m.userId}>
                  {m.fName} {m.lName} ({m.email})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Select Class</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
              required
            >
              <option value="">-- Select Class --</option>
              {classes.map(c => (
                <option key={c.classId} value={c.classId}>
                  {c.className}
                </option>
              ))}
            </select>
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <div className="flex justify-end gap-2">
            <Button type="button" className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded" onClick={onClose} title="Cancel">Cancel</Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded" disabled={loading} title="Assign">
              {loading ? "Assigning..." : "Assign"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignMemberModal; 