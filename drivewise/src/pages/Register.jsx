import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Header from "@/components/Header";
import { useAuth, formatApiErrorDetail } from "@/contexts/AuthContext";
import { UserPlus } from "@phosphor-icons/react";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success(`Welcome, ${name}!`);
      nav("/test/setup");
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-stone-50 min-h-screen">
      <Header />
      <div className="max-w-md mx-auto px-6 py-20">
        <div className="text-xs uppercase tracking-[0.3em] font-bold text-stone-500 mb-4">Start your journey</div>
        <h1 className="font-display text-4xl md:text-5xl font-black tracking-tight text-stone-900 mb-10">Create account.</h1>

        <form onSubmit={onSubmit} className="space-y-6" data-testid="register-form">
          <Field label="Name" value={name} setValue={setName} testid="register-name" />
          <Field label="Email" type="email" value={email} setValue={setEmail} testid="register-email" />
          <Field label="Password" type="password" value={password} setValue={setPassword} testid="register-password" />
          <button type="submit" disabled={loading} data-testid="register-submit" className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-8 py-5 font-bold tracking-wide transition-colors">
            <UserPlus weight="bold" size={20} /> {loading ? "Creating…" : "Create account"}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-stone-200 text-sm text-stone-600">
          Already a member? <Link to="/login" className="font-bold text-blue-600 hover:underline" data-testid="goto-login">Sign in</Link>
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
