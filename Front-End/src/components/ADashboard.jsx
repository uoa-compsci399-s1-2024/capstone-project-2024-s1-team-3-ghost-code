import React from 'react';

function AdminDashboard() {
  return (
    <div className="Adashboard">
      <div className="VerifyLogo">
        {/* Verify Logo */}
      </div>
      <div className="options">
        <div className="option">Dashboard</div>
        <div className="option">Edit Quiz</div>
        <div className="option">Clinicians</div>
        <div className="option">Statistics</div>
      </div>
      <div className="bottom-option">Settings</div>
    </div>
  );
}

export default AdminDashboard;
