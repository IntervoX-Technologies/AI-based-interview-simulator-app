import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SelectInterview from "./pages/SelectInterview";
import HRInterview from "./pages/HRInterview";
import TechnicalInterview from "./pages/TechnicalInterview";
import BehavioralInterview from "./pages/BehavioralInterview";
import Interview from "./pages/Interview"; // Import the new file
import Analytics from "./pages/Analytics"; // Import the new file


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
         <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/select" element={<ProtectedRoute><SelectInterview /></ProtectedRoute>} />
        <Route path="/hr" element={<ProtectedRoute><HRInterview /></ProtectedRoute>} />
        <Route path="/technical" element={<ProtectedRoute><TechnicalInterview /></ProtectedRoute>} />
        <Route path="/behavioral" element={<ProtectedRoute><BehavioralInterview /></ProtectedRoute>} />
        <Route path="/interview" element={<Interview />} />
         <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
