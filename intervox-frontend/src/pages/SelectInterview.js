import { useNavigate } from "react-router-dom";

function SelectInterview() {
  const navigate = useNavigate();

  return (
    <div className="center-card">
      <h2 className="neon">Select Interview Type</h2>

      {/* We pass the type as a query parameter in the URL  */}
      <button onClick={() => navigate("/interview?type=HR")}>HR Interview</button>
      <button onClick={() => navigate("/interview?type=Technical")}>Technical Interview</button>
      <button onClick={() => navigate("/interview?type=Behavioral")}>Behavioral Interview</button>
    </div>
  );
}

export default SelectInterview;