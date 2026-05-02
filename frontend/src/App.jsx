import { useState, useEffect } from 'react';
import Login from './components/Login';
import Header from './components/Header';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import TechDashboard from './components/TechDashboard';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('assetflow_user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleLogin = (userData) => {
    localStorage.setItem('assetflow_user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('assetflow_user');
    setUser(null);
  };

  if (!user) return <Login onLogin={handleLogin} />;

  return (
    <div className="app-wrapper">
      <Header user={user} onLogout={handleLogout} />
      {user.role === 'user' && <UserDashboard user={user} />}
      {user.role === 'admin' && <AdminDashboard user={user} />}
      {user.role === 'technician' && <TechDashboard user={user} />}
    </div>
  );
}