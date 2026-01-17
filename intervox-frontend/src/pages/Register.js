import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react"; // Fixed!

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Typewriter Logic
  const fullText = "INTERVOX";
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + fullText[index]);
        setIndex(index + 1);
      }, 150); // Speed of typing (150ms per letter)
      return () => clearTimeout(timeout);
    }
  }, [index]);

  const handleRegister = async () => {
    const res = await fetch("http://localhost:5000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (data.success) {
      alert("Account created successfully!");
      navigate("/");
    } else {
      alert("Registration failed: " + data.message);
    }
  };

 return (
  <div className="register-container">
      <div className="brand-header">
        {/* The text inside here is now dynamic */}
        <h1 className="intervox-3d" data-text={displayText}>
          {displayText}
          <span className="cursor">|</span>
        </h1>
        <p className="subtitle-neon">Master your next career move with AI-driven mock interviews and real-time performance analytics.</p>
      </div>

    {/* Registration Card */}
    <div className="center-card neon-border">
      <h2 className="neon-text">Register</h2>
      <div className="input-group">
        <input placeholder="Full Name" onChange={(e) => setName(e.target.value)} />
        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
      </div> <button className="cyber-button" onClick={handleRegister}>Create Account</button>
    </div>
  </div>
);
}

export default Register;
