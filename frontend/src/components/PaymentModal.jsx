export default function PaymentModal({ penalty, onPay, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h3>💸 Pay Penalty</h3>
        <p><strong>Amount: ${penalty.amount}</strong></p>
        <p><small>Reason: {penalty.reason}</small></p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', margin: '20px 0' }}>
          <button style={{ background: '#4caf50', borderRadius: '30px' }} onClick={() => onPay(penalty._id, 'esewa')}>
            🇳🇵 Pay with eSewa
          </button>
          <button style={{ background: '#0070ba', borderRadius: '30px' }} onClick={() => onPay(penalty._id, 'paypal')}>
            💳 PayPal
          </button>
        </div>
        <button className="btn-outline" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}