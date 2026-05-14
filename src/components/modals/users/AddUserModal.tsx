import { useEffect, useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { X, UserPlus, Shield, Users, Crown } from 'lucide-react';
import type { Doc } from '../../../../convex/_generated/dataModel';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserRole: 'admin' | 'super-admin';
  existingUser?: Doc<'users'> | null;
}

export default function AddUserModal({ isOpen, onClose, currentUserRole, existingUser }: AddUserModalProps) {
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("active");
  const [role, setRole] = useState<"staff" | "admin" | "super-admin">("staff");
  
  const createUser = useMutation(api.users.createUser);
  const updateUser = useMutation(api.users.updateUser);

  useEffect(() => {
    if (!existingUser) {
      setName("");
      setPin("");
      setUsername("");
      setPassword("");
      setStatus("active");
      setRole("staff");
      return;
    }

    setName(existingUser.name);
    setRole(existingUser.role as "staff" | "admin" | "super-admin");
    setStatus(existingUser.status);
    setPin(existingUser.pin || "");
    setUsername(existingUser.username || "");
    setPassword("");
  }, [existingUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (role === "staff") {
      if (pin.length < 4) return alert("PIN must be 4 digits!");
    } else {
      if (!username || !password) return alert("Username and password are required for admin accounts.");
    }

    if (currentUserRole === "admin" && role !== "staff") {
      return alert("Admin accounts can only create or edit staff users.");
    }

    const payload = {
      name,
      role,
      status,
      pin: role === "staff" ? pin || existingUser?.pin : undefined,
      username: role !== "staff" ? username || existingUser?.username : undefined,
      password: role !== "staff" ? password || existingUser?.password : undefined,
    };

    if (existingUser) {
      await updateUser({
        id: existingUser._id,
        ...payload,
      });
    } else {
      await createUser(payload);
    }

    setName("");
    setPin("");
    setUsername("");
    setPassword("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-[2.5rem] overflow-hidden">
        <div className="p-8 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black italic uppercase text-white">New Staff Registration</h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400"><X size={20}/></button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Name</label>
              <input 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Juan Dela Cruz"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm focus:border-blue-500 outline-none text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">System Role</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("staff")}
                  className={`p-4 rounded-2xl flex flex-col items-center gap-2 border transition-all ${role === "staff" ? "border-blue-500 bg-blue-500/10 text-blue-400" : "border-slate-800 text-slate-600"}`}
                >
                  <Users size={20} />
                  <span className="text-[10px] font-black uppercase">Staff</span>
                </button>
                <button
                  type="button"
                  onClick={() => currentUserRole === "super-admin" ? setRole("admin") : null}
                  className={`p-4 rounded-2xl flex flex-col items-center gap-2 border transition-all ${role === "admin" ? "border-amber-500 bg-amber-500/10 text-amber-500" : "border-slate-800 text-slate-600"}`}
                >
                  <Shield size={20} />
                  <span className="text-[10px] font-black uppercase">Admin</span>
                </button>
                {currentUserRole === "super-admin" && (
                  <button
                    type="button"
                    onClick={() => setRole("super-admin")}
                    className={`p-4 rounded-2xl flex flex-col items-center gap-2 border transition-all ${role === "super-admin" ? "border-violet-500 bg-violet-500/10 text-violet-500" : "border-slate-800 text-slate-600"}`}
                  >
                    <Crown size={20} />
                    <span className="text-[10px] font-black uppercase">Super</span>
                  </button>
                )}
              </div>
            </div>

            {role === "staff" ? (
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Login PIN (4-Digits)</label>
                <input 
                  required
                  type="password"
                  maxLength={4}
                  inputMode="numeric"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                  placeholder="••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center text-2xl tracking-[1em] font-black focus:border-blue-500 outline-none text-blue-500"
                />
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Login Username</label>
                  <input
                    required={!existingUser}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm focus:border-amber-500 outline-none text-white"
                    placeholder="admin username"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Password</label>
                  <input
                    required={!existingUser}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm focus:border-amber-500 outline-none text-white"
                    placeholder="••••••••"
                  />
                </div>
              </>
            )}

            <button type="submit" className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-blue-400 transition-colors">
              <UserPlus size={18}/> Register User
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}