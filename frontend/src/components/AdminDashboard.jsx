import { useState, useEffect } from 'react';
import api from '../api';

export default function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [penalties, setPenalties] = useState([]);
  const [newEq, setNewEq] = useState({ name: '', category: '', location: '', dailyPenaltyRate: 5 });

  const fetchAll = async () => {
    const [req, eq, pen] = await Promise.all([
      api.get('/borrow/requests'), api.get('/equipment'), api.get('/penalties')
    ]);
    setRequests(req.data);
    setEquipment(eq.data);
    setPenalties(pen.data);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleRequest = async (id, approve) => {
    await api.patch(`/borrow/requests/${id}`, { approve });
    fetchAll();
  };

  const addEquipment = async () => {
    if (!newEq.name) return alert('Enter equipment name');
    await api.post('/equipment', newEq);
    setNewEq({ name: '', category: '', location: '', dailyPenaltyRate: 5 });
    fetchAll();
  };

  const removeEquipment = async (id) => {
    if (!confirm('Permanently remove this equipment?')) return;
    await api.delete(`/equipment/${id}`);
    fetchAll();
  };

  const markPaid = async (id) => {
    await api.patch(`/penalties/${id}/mark-paid`);
    fetchAll();
  };

  return (
    <>
      <div className="dashboard-card">
        <div className="section-title">⏳ Pending Borrow Requests</div>
        {requests.length === 0 ? <p>No pending requests.</p> : requests.map(r => (
          <div className="item-card" key={r._id} style={{ marginBottom: '0.8rem' }}>
            <strong>{r.equipName}</strong> by {r.userName}
            <div className="flex-between">
              <button className="btn-green" onClick={() => handleRequest(r._id, true)}>✅ Approve</button>
              <button className="btn-red" onClick={() => handleRequest(r._id, false)}>❌ Reject</button>
            </div>
          </div>
        ))}
      </div>
      <div className="dashboard-card">
        <div className="section-title">📦 Manage Equipment</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
          {['name', 'category', 'location'].map(f => (
            <input key={f} placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
              value={newEq[f]} onChange={e => setNewEq({ ...newEq, [f]: e.target.value })}
              style={{ width: '22%', minWidth: '120px' }} />
          ))}
          <input placeholder="$/day" type="number" value={newEq.dailyPenaltyRate}
            onChange={e => setNewEq({ ...newEq, dailyPenaltyRate: e.target.value })}
            style={{ width: '10%', minWidth: '80px' }} />
          <button onClick={addEquipment}>➕ Add</button>
        </div>
        <table>
          <thead><tr><th>Equipment</th><th>Status</th><th>Penalty Rate</th><th>Action</th></tr></thead>
          <tbody>
            {equipment.map(eq => (
              <tr key={eq._id}>
                <td>{eq.name}</td>
                <td><span className={`status-badge ${eq.status === 'available' ? 'avail' : eq.status === 'borrowed' ? 'borrowed' : 'maint'}`}>{eq.status}</span></td>
                <td>${eq.dailyPenaltyRate}</td>
                <td><button className="btn-red" onClick={() => removeEquipment(eq._id)}>🗑️</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="dashboard-card">
        <div className="section-title">💰 Penalty Management</div>
        <table>
          <thead><tr><th>User</th><th>Equipment</th><th>Amount</th><th>Reason</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {penalties.map(p => (
              <tr key={p._id}>
                <td>{p.userName}</td>
                <td>{p.equipName}</td>
                <td>${p.amount}</td>
                <td>{p.reason}</td>
                <td>{p.status}</td>
                <td>{p.status === 'unpaid' ? <button onClick={() => markPaid(p._id)}>✅ Mark Paid</button> : 'Paid'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}