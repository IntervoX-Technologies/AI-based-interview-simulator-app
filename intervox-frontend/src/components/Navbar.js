import { useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation(); // To check which page we are on

  return (
    <nav className="navbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', background: 'rgba(0,0,0,0.8)', borderBottom: '1px solid #00ff8844' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        {/* --- BACK BUTTON --- */}
        {/* Only show back button if we are NOT on the dashboard */}
        {location.pathname !== "/dashboard" && (
          <button 
            onClick={() => navigate(-1)} 
            style={{ 
              background: 'none', 
              border: '1px solid #00ff88', 
              color: '#00ff88', 
              borderRadius: '5px', 
              padding: '5px 12px', 
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            ← Back
          </button>
        )}
        
        <h2 className="link" onClick={() => navigate("/dashboard")} style={{ cursor: 'pointer', margin: 0 }}>
          IntervoX
        </h2>
      </div>

      <button onClick={() => { localStorage.clear(); navigate("/login"); }} className="logout-btn">
        Logout
      </button>
    </nav> 
  );
}

export default Navbar;