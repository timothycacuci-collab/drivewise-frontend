import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import TestSetup from "@/pages/TestSetup";
import TestRunner from "@/pages/TestRunner";
import TestResults from "@/pages/TestResults";

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading || user === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-stone-500 text-sm uppercase tracking-[0.2em]" data-testid="loading-indicator">Loading…</div>
      </div>
    );
  }
  if (user === false) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
      <Route path="/test/setup" element={<Protected><TestSetup /></Protected>} />
      <Route path="/test/run/:sessionId" element={<Protected><TestRunner /></Protected>} />
      <Route path="/test/results/:resultId" element={<Protected><TestResults /></Protected>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
