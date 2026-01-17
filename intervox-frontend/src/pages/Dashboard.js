import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

// Connect to your backend socket server
const socket = io("http://localhost:5000");

function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("User");

  // State for real data from MySQL
  const [dbStats, setDbStats] = useState({
    completed: 0,
    avgScore: 0,
    totalQuestions: 0
  });

  // Reusable function to fetch data
  const fetchRealTimeStats = (userId) => {
    fetch(`http://localhost:5000/api/user-stats/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setDbStats(data.stats);
        }
      })
      .catch((err) => console.error("Error fetching stats:", err));
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUserName(userData.name || "User");

        // 1. Initial Data Fetch
        fetchRealTimeStats(userData.id);

        // 2. LISTEN for real-time updates from Socket.io
        socket.on("update_analytics", (data) => {
          if (data.userId === userData.id) {
            console.log("Real-time update triggered!");
            fetchRealTimeStats(userData.id);
          }
        });

      } catch (e) {
        setUserName("User");
      }
    }

    // Cleanup socket listener on unmount
    return () => {
      socket.off("update_analytics");
    };
  }, []);

  // Updated stats array with 3D icon classes
  const stats = [
    { label: "Interviews Completed", value: dbStats.completed, iconClass: "cube-3d" },
    { label: "Avg. Confidence Score", value: `${dbStats.avgScore}%`, iconClass: "pyramid-3d" },
    { label: "Total Questions Faced", value: dbStats.totalQuestions, iconClass: "sphere-3d" }
  ];

  return (
    <div className="dashboard-container" style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a' }}>
      
      {/* --- Sidebar Navigation --- */}
      <aside style={{ width: '250px', background: 'rgba(255, 255, 255, 0.03)', borderRight: '1px solid #00ff8844', padding: '20px' }}>
        <h2 className="neon" style={{ fontSize: '1.5rem', marginBottom: '40px' }}>IntervoX</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <button className="nav-btn active" onClick={() => navigate("/")}>Dashboard</button>
          <button className="nav-btn" onClick={() => navigate("/select")}>Mock Sessions</button>
          <button className="nav-btn" onClick={() => navigate("/analytics")}>Performance Analytics</button>

          <hr style={{ border: '0.5px solid #00ff8822', margin: '10px 0' }} />

          {/* --- DYNAMIC BUTTONS LOGIC --- */}
          {!localStorage.getItem("user") ? (
            <>
              <button className="nav-btn" onClick={() => navigate("/login")}>Login</button>
              <button className="nav-btn" onClick={() => navigate("/register")}>Register</button>
            </>
          ) : (
            <>
              
              <button className="nav-btn" 
                onClick={() => { localStorage.clear(); window.location.reload(); }} 
                style={{ color: '#ff4444' }}>
                Logout
              </button>
            </>
          )}
        </nav>
      </aside>

      {/* --- Main Content Area --- */}
      <main style={{ flex: 1, padding: '40px', textAlign: 'left' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
          <div>
            <h1 className="neon" style={{ margin: 0 }}>Welcome , {userName}!</h1>
            <p style={{ color: '#888' }}>Ready to conquer your next interview?</p>
          </div>
          <div className="user-avatar" style={{ border: '2px solid #00ff88', borderRadius: '50%', padding: '10px' }}>👤</div>
        </header>

        {/* --- 3D INTERACTIVE STATS GRID --- */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          {stats.map((stat, index) => (
            <div key={index} className="glass-card stat-card" style={{ padding: '20px', borderRadius: '15px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,255,136,0.2)', textAlign: 'center' }}>
              <div className="icon-container">
                <div className={stat.iconClass}></div>
              </div>
              <h3 style={{ color: '#ccc', fontSize: '0.9rem', margin: '10px 0' }}>{stat.label}</h3>
              <p style={{ color: '#00ff88', fontSize: '1.8rem', fontWeight: 'bold', margin: 0 }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* --- Primary Action Section --- */}
        <section className="glass-card" style={{ padding: '40px', textAlign: 'center', borderRadius: '20px', background: 'linear-gradient(135deg, rgba(0,255,136,0.1) 0%, rgba(0,0,0,0) 100%)' }}>
          <div className="cube" style={{ margin: '0 auto 20px', color: '#00ff88', fontWeight: 'bold' }}>
              I N T E R V O X
          </div>
          <h2 style={{ color: 'white' }}>The AI-Powered Interview Simulator</h2>
          <p style={{ color: '#aaa', maxWidth: '500px', margin: '10px auto 30px' }}>
            Practice makes perfect. Start a tailored session now and receive real-time feedback.
          </p>
          <button onClick={() => navigate("/select")} className="glow" style={{ padding: '15px 40px', fontSize: '1.1rem', background: '#00ff88', color: 'black', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
            Start Mock Interview
          </button>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;