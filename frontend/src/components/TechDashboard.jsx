import { useState, useEffect } from 'react';
import api from '../api';

export default function TechDashboard() {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const { data } = await api.get('/maintenance');
    setTasks(data);
  };

  useEffect(() => { fetchTasks(); }, []);

  const updateStatus = async (id, status) => {
    await api.patch(`/maintenance/${id}`, { status });
    fetchTasks();
  };

  return (
    <div className="dashboard-card">
      <div className="section-title">🔧 Maintenance Tasks</div>
      {tasks.length === 0 ? <p>No maintenance tasks.</p> : tasks.map(m => (
        <div className="item-card" key={m._id} style={{ marginBottom: '0.8rem' }}>
          <strong>{m.equipName}</strong><br />
          Issue: {m.issue}<br />
          Status: <span className="status-badge maint">{m.status}</span>
          <div className="flex-between">
            <button onClick={() => updateStatus(m._id, 'in-progress')}>🛠️ Start</button>
            <button className="btn-green" onClick={() => updateStatus(m._id, 'completed')}>✅ Complete</button>
          </div>
        </div>
      ))}
    </div>
  );
}