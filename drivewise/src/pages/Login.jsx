import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Header from "@/components/Header";
import { useAuth, formatApiErrorDetail } from "@/contexts/AuthContext";
import { SignIn } from "@phosphor-icons/react";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      nav("/dashboard");
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || "Sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-stone-50 min-h-screen">
      <Header />
      <div className="max-w-md mx-auto px-6 py-20">
        <div className="text-xs uppercase tracking-[0.3em] font-bold text-stone-500 mb-4">Welcome back</div>
        <h1 className="font-display text-4xl md:text-5xl font-black tracking-tight text-stone-900 mb-10">Sign in.</h1>

        <form onSubmit={onSubmit} className="space-y-6" data-testid="login-form">
          <Field label="Email" type="email" value={email} setValue={setEmail} testid="login-email" />
          <Field label="Password" type="password" value={password} setValue={setPassword} testid="login-password" />
          <button type="submit" disabled={loading} data-testid="login-submit" className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-8 py-5 font-bold tracking-wide transition-colors">
            <SignIn weight="bold" size={20} /> {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-stone-200 text-sm text-stone-600">
          New to DriveWise? <Link to="/register" className="font-bold text-blue-600 hover:underline" data-testid="goto-register">Create an account</Link>
        </div>
      </div>
    </div>
  );
}

function Field({ label, type = "text", value, setValue, testid }) {
  return (
    <div>
      <label className="block mb-2 text-xs font-bold text-stone-900 uppercase tracking-[0.2em]">{label}</label>
      <input
        required
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        data-testid={testid}
        className="w-full bg-white border border-stone-300 px-4 py-4 text-base focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all"
      />
    </div>
  );
}
