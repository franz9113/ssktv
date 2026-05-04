import { useState } from "react";
import { Lock, User, ShieldAlert, Loader2 } from "lucide-react"; // Added Loader2
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

interface LoginProps {
  onLogin: (role: "admin" | "staff") => void;
}

export default function LoginAuth({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Get settings from Convex
  const settings = useQuery(api.settings.getSettings); 
  const isLoading = settings === undefined; // Convex returns undefined while loading

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!settings) {
      setError("Security database offline. Please contact Admin.");
      return;
    }

    const { adminUsername, adminPassword, staffPassword } = settings;

    // Normalize input
    const inputUser = username.trim().toLowerCase();
    const targetAdminUser = adminUsername.toLowerCase();

    // Admin Check
    if (inputUser === targetAdminUser && password === adminPassword) {
      onLogin("admin");
    } 
    // Staff Check
    else if (password === staffPassword && (!inputUser || inputUser === "staff")) {
      onLogin("staff");
    } 
    else {
      setError("Invalid credentials. Access denied.");
    }
  };

  return (
    <div className="h-screen w-screen bg-slate-950 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 blur-[100px] rounded-full" />
        
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black italic text-white tracking-tighter">S&S KTV</h1>
          <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mt-2">Management System</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 flex items-center gap-2">
              <User size={12} /> Username
            </label>
            <input 
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl text-white outline-none focus:border-blue-500 transition-all disabled:opacity-50"
              placeholder="admin_user"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 flex items-center gap-2">
              <Lock size={12} /> Access Password
            </label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl text-white text-2xl tracking-[0.3em] outline-none focus:border-blue-500 transition-all disabled:opacity-50"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-black uppercase tracking-widest animate-in fade-in zoom-in duration-300">
              <ShieldAlert size={14} /> {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-lg shadow-blue-900/40 transition-all active:scale-95 mt-4 flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Syncing Security...
              </>
            ) : (
              "Authorize Entry"
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-800/50 text-center">
          <div className="flex items-center justify-center gap-2 text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">
            <div className={`w-1.5 h-1.5 rounded-full ${isLoading ? 'bg-amber-500' : 'bg-emerald-500'} animate-pulse`} />
            {isLoading ? 'Establishing Secure Link...' : 'Security Shield Active'}
          </div>
        </div>
      </div>
    </div>
  );
}