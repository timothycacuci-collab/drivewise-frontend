import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { SteeringWheel, SignOut } from "@phosphor-icons/react";

export default function Header({ minimal = false }) {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const onLogout = async () => {
    await logout();
    nav("/");
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-stone-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10 py-5">
        <Link to="/" className="flex items-center gap-3 group" data-testid="brand-link">
          <div className="w-10 h-10 bg-stone-900 text-white flex items-center justify-center group-hover:bg-blue-600 transition-colors">
            <SteeringWheel weight="bold" size={22} />
          </div>
          <div className="font-display font-black text-xl tracking-tight">DriveWise</div>
        </Link>
        {!minimal && (
          <nav className="flex items-center gap-2 sm:gap-6">
            {user && user !== false ? (
              <>
                <Link to="/dashboard" className="hidden sm:block text-sm font-semibold text-stone-700 hover:text-blue-600 transition-colors" data-testid="nav-dashboard">Dashboard</Link>
                <Link to="/test/setup" className="hidden sm:block text-sm font-semibold text-stone-700 hover:text-blue-600 transition-colors" data-testid="nav-newtest">New Test</Link>
                <span className="hidden md:block text-sm text-stone-500 px-3 border-l border-stone-200">{user.name}</span>
                <button onClick={onLogout} data-testid="logout-btn" className="flex items-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-900 px-4 py-2 text-sm font-semibold transition-colors">
                  <SignOut size={16} />
                  <span className="hidden sm:inline">Sign out</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-semibold text-stone-700 hover:text-blue-600 transition-colors" data-testid="nav-login">Sign in</Link>
                <Link to="/register" className="bg-stone-900 text-white hover:bg-blue-600 px-5 py-2.5 text-sm font-bold tracking-wide transition-colors" data-testid="nav-register">Get started</Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
