import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Analytics() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUserName(userData.name || "User");

      // Fetch full history from Backend
      fetch(`http://localhost:5000/api/user-history/${userData.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setHistory(data.history);
        })
        .catch((err) => console.error("Error fetching history:", err));
    }
  }, []);

  return (
    <div className="dashboard-container" style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a', color: 'white' }}>
      {/* --- Sidebar (Same as Dashboard) --- */}
      <aside style={{ width: '250px', background: 'rgba(255, 255, 255, 0.03)', borderRight: '1px solid #00ff8844', padding: '20px' }}>
        <h2 className="neon" style={{ fontSize: '1.5rem', marginBottom: '40px' }}>IntervoX</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <button className="nav-btn" onClick={() => navigate("/dashboard")}>Dashboard</button>
          <button className="nav-btn" onClick={() => navigate("/select")}>Mock Sessions</button>
          <button className="nav-btn active">Performance Analytics</button>
          <button className="nav-btn" onClick={() => { localStorage.clear(); navigate("/login"); }}>Logout</button>
        </nav>
      </aside>

      {/* --- Main Content --- */}
      <main style={{ flex: 1, padding: '40px' }}>
        <h1 className="neon">Performance Analytics</h1>
        <p style={{ color: '#888', marginBottom: '30px' }}>Detailed breakdown for {userName}</p>

        <div className="glass-card" style={{ padding: '20px', borderRadius: '15px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,255,136,0.2)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #00ff8844', color: '#00ff88' }}>
                <th style={{ padding: '15px' }}>Date</th>
                <th style={{ padding: '15px' }}>Category</th>
                <th style={{ padding: '15px' }}>Score</th>
                <th style={{ padding: '15px' }}>Feedback Summary</th>
              </tr>
            </thead>
            <tbody>
              {history.length > 0 ? history.map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '15px' }}>{new Date(item.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: '15px' }}>{item.category}</td>
                  <td style={{ padding: '15px', fontWeight: 'bold', color: item.score > 70 ? '#00ff88' : '#ffcc00' }}>
                    {item.score}%
                  </td>
                  <td style={{ padding: '15px', color: '#aaa', fontSize: '0.9rem' }}>{item.feedback || "Good progress!"}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" style={{ padding: '30px', textAlign: 'center', color: '#555' }}>No interview data found yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default Analytics;