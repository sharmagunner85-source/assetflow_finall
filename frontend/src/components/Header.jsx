export default function Header({ user, onLogout }) {
  const roleLabel = user.role === 'admin' ? 'Admin Hub' : user.role === 'technician' ? 'Tech Desk' : 'Borrower Portal';
  return (
    <div className="site-header">
      <div className="brand">
        <h2>🏷️ AssetFlow · {roleLabel}</h2>
        <p>⚙️ Equipment Borrowing System</p>
      </div>
      <div className="user-card">
        <span>👤 {user.name}</span>
        <span className="role-tag">{user.role.toUpperCase()}</span>
        <button className="btn-outline" onClick={onLogout}>🚪 Exit</button>
      </div>
    </div>
  );
}