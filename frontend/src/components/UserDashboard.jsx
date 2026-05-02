import { useState, useEffect } from 'react';
import api from '../api';
import PaymentModal from './PaymentModal';

export default function UserDashboard() {
  const [equipment, setEquipment] = useState([]);
  const [borrows, setBorrows] = useState([]);
  const [penalties, setPenalties] = useState([]);
  const [payingPenalty, setPayingPenalty] = useState(null);

  const fetchAll = async () => {
    const [eq, bor, pen] = await Promise.all([
      api.get('/equipment'), api.get('/borrow/active'), api.get('/penalties')
    ]);
    setEquipment(eq.data.filter(e => e.status === 'available'));
    setBorrows(bor.data);
    setPenalties(pen.data);
  };

  useEffect(() => { fetchAll(); }, []);

  const requestBorrow = async (equipmentId) => {
    await api.post('/borrow/request', { equipmentId });
    alert('📨 Borrow request sent to admin!');
    fetchAll();
  };

  const returnItem = async (borrowId) => {
    await api.post(`/borrow/return/${borrowId}`);
    alert('✅ Item returned successfully!');
    fetchAll();
  };

  const reportDamage = async (equipmentId) => {
    const issue = prompt('Describe the damage:');
    if (!issue) return;
    await api.post('/maintenance', { equipmentId, issue });
    alert('🔧 Damage reported!');
    fetchAll();
  };

  const handlePay = async (penaltyId, method) => {
    await api.patch(`/penalties/${penaltyId}/pay`, { paymentMethod: method });
    alert(`✅ Paid via ${method === 'esewa' ? 'eSewa' : 'PayPal'}!`);
    setPayingPenalty(null);
    fetchAll();
  };

  const unpaid = penalties.filter(p => p.status === 'unpaid');
  const paid = penalties.filter(p => p.status === 'paid');

  return (
    <>
      {payingPenalty && (
        <PaymentModal penalty={payingPenalty} onPay={handlePay} onClose={() => setPayingPenalty(null)} />
      )}
      <div className="dashboard-card">
        <div className="section-title">📡 Available Equipment</div>
        <div className="equip-grid">
          {equipment.length === 0 ? <p>No available equipment.</p> : equipment.map(eq => (
            <div className="item-card" key={eq._id}>
              <strong>{eq.name}</strong><br />
              <span className="status-badge avail">✅ Available</span>
              <div>📍 {eq.location} | 💰 ${eq.dailyPenaltyRate}/day penalty</div>
              <div className="flex-between" style={{ marginTop: '0.7rem' }}>
                <button onClick={() => requestBorrow(eq._id)}>📥 Request Borrow</button>
                <button className="btn-outline" onClick={() => reportDamage(eq._id)}>⚠️ Report Damage</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="dashboard-card">
        <div className="section-title">📌 My Active Borrowings</div>
        {borrows.length === 0 ? <p>No active borrows.</p> : borrows.map(b => (
          <div className="item-card" key={b._id} style={{ marginBottom: '0.8rem' }}>
            <strong>{b.equipName}</strong> | Due: {new Date(b.dueDate).toLocaleDateString()}
            <div className="flex-between">
              <button onClick={() => returnItem(b._id)}>↩️ Return Item</button>
            </div>
          </div>
        ))}
      </div>
      <div className="dashboard-card">
        <div className="section-title">⚠️ Unpaid Penalties</div>
        {unpaid.length === 0 ? <p>✅ No unpaid penalties!</p> : unpaid.map(p => (
          <div className="penalty-row" key={p._id}>
            <div><strong>${p.amount}</strong> — {p.reason}<br /><small>{p.equipName}</small></div>
            <button className="btn-green" onClick={() => setPayingPenalty(p)}>💸 Pay Now</button>
          </div>
        ))}
        {paid.length > 0 && (
          <>
            <hr />
            <div className="section-title" style={{ fontSize: '1rem' }}>✅ Paid Penalties</div>
            {paid.map(p => (
              <div className="penalty-row" key={p._id} style={{ background: '#e9f5e9' }}>
                <span>${p.amount} — {p.reason} (PAID via {p.paymentMethod})</span>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
}