function Home() {
  return (
    <div className="home">
      <h1 className="neon" style={{ fontSize: "46px" }}>
        AI-Powered Interview Simulator
      </h1>

      <p style={{ marginTop: "20px", maxWidth: "700px", marginInline: "auto" }}>
        Practice realistic mock interviews with time limits, structured
        questions, and AI-driven feedback to boost your confidence and job
        readiness.
      </p>

      <div style={{ marginTop: "40px" }}>
        <button className="glow">Start Interview</button>
      </div>
    </div>
  );
}

export default Home;
