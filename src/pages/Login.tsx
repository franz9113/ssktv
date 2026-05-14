import { useState, useEffect, useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Shield, Users, Crown } from "lucide-react";

type LoginRole = "staff" | "admin" | "super-admin";

interface LoginPageProps {
  onLoginSuccess: (role: LoginRole) => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [selectedRole, setSelectedRole] = useState<LoginRole>("staff");
  const [pin, setPin] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  // 1. Logic to delete the last digit (Backspace)
  const handleDelete = useCallback(() => {
    setPin((prev) => prev.slice(0, -1));
  }, []);

  const loginUser = useMutation(api.auth.loginUser);

  const handleStaffLogin = useCallback(async () => {
    const result = await loginUser({ role: "staff", pin });
    if (result?.role === "staff") {
      onLoginSuccess("staff");
    } else {
      setError(result?.error || "Invalid staff PIN");
      setPin("");
    }
  }, [loginUser, onLoginSuccess, pin]);

  const handleCredentialLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const result = await loginUser({
      role: selectedRole,
      username,
      password,
    });

    if (result?.role) {
      onLoginSuccess(result.role as LoginRole);
    } else {
      setError(result?.error || "Invalid credentials");
      setPassword("");
    }
  };

  // 2. Keyboard Event Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedRole !== "staff") return; // Only capture keypad input for staff login

      if (/^[0-9]$/.test(e.key)) {
        if (pin.length < 4) setPin((prev) => prev + e.key);
      } else if (e.key === "Backspace") {
        handleDelete();
      } else if (e.key === "Enter") {
        handleStaffLogin();
      } else if (e.key === "Escape") {
        setPin("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pin, selectedRole, handleDelete, handleStaffLogin]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-black italic text-white tracking-tighter">SS KTV</h1>
          <p className="text-slate-500 text-[10px] uppercase font-bold tracking-[0.2em] mt-2">Management System v1.0</p>
        </div>

        <div className="bg-slate-900 p-1 rounded-2xl flex border border-slate-800">
          <button
            onClick={() => setSelectedRole("staff")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase transition-all ${selectedRole === "staff" ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Users size={16} /> Staff
          </button>
          <button
            onClick={() => setSelectedRole("admin")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase transition-all ${selectedRole === "admin" ? 'bg-amber-500 text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Shield size={16} /> Admin
          </button>
          <button
            onClick={() => setSelectedRole("super-admin")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase transition-all ${selectedRole === "super-admin" ? 'bg-violet-500 text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Crown size={16} /> Super
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl">
          {error && (
            <div className="text-red-400 text-sm font-semibold uppercase tracking-[0.2em] mb-4">
              {error}
            </div>
          )}

          {selectedRole === "staff" ? (
            <div className="space-y-6">
              <div className="flex justify-center gap-3">
                {[1, 2, 3, 4].map((_, i) => (
                  <div key={i} className={`w-4 h-4 rounded-full border-2 ${pin.length > i ? 'bg-blue-500 border-blue-500' : 'border-slate-700'}`} />
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, "C", 0, "OK"].map((btn) => (
                  <button
                    key={btn.toString()}
                    className="h-16 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-black text-xl transition-all active:scale-95"
                    onClick={() => {
                      if (btn === "C") handleDelete();
                      else if (btn === "OK") handleStaffLogin();
                      else if (pin.length < 4) setPin((prev) => prev + btn);
                    }}
                  >
                    {btn}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleCredentialLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Username</label>
                <input
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl text-white outline-none focus:border-amber-500 transition-all"
                  placeholder="Enter username"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Password</label>
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl text-white outline-none focus:border-amber-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
              <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 py-4 rounded-2xl text-slate-950 font-black uppercase text-xs mt-4 transition-all">
                Access Dashboard
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}