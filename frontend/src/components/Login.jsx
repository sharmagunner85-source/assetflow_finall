import { useState } from 'react';
import api from '../api';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('alex@demo.com');
  const [password, setPassword] = useState('user123');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const { data } = await api.post('/auth/login', { email, password, role });
      onLogin(data);
    } catch (err) {
      setError('❌ Invalid credentials. Check email, password, and role.');
    }
  };

  return (
    <div className="login-container">
      <h2 style={{ marginBottom: '0.3rem' }}>📦 AssetFlow</h2>
      <p style={{ marginBottom: '1.2rem' }}>Equipment Borrowing + eSewa / PayPal Payment</p>
      {error && <p style={{ color: 'red', marginBottom: '0.5rem' }}>{error}</p>}
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <select value={role} onChange={e => setRole(e.target.value)}>
        <option value="user">👤 Standard User</option>
        <option value="admin">🛡️ Admin</option>
        <option value="technician">🔧 Technician</option>
      </select>
      <button style={{ marginTop: '1.2rem', width: '100%' }} onClick={handleLogin}>🔐 Login</button>
      <div style={{ marginTop: '1rem', background: '#f9f1e0', borderRadius: '24px', padding: '0.8rem' }}>
        <small>🧪 Demo: User (alex@demo.com / user123) | Admin (pratik@assetflow.com / pratik123) | Tech (subash@assetflow.com / subash123)</small>
      </div>
    </div>
  );
}