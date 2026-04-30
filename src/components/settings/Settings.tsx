import type { Id } from "../../../convex/_generated/dataModel";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { ShieldCheck, DoorOpen, User, Lock, KeyRound } from "lucide-react";

export default function Settings({ isAdmin }: { isAdmin: boolean }) {
  const rooms = useQuery(api.rooms.getRooms);
  const updateRoom = useMutation(api.rooms.updateRoom);
  const addRoom = useMutation(api.rooms.addRoom);

  // Security State
  const [adminUser, setAdminUser] = useState("admin_ktv");
  const [adminPass, setAdminPass] = useState("");
  const [staffPass, setStaffPass] = useState("");

  // Room Management State
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomRate, setNewRoomRate] = useState(150);

  if (!rooms) return <div className="p-8 text-slate-500 animate-pulse font-black uppercase tracking-widest">Syncing Settings...</div>;

  const handleAddRoom = async () => {
    if (!isAdmin) return alert("Unauthorized: Only Admin can add rooms.");
    if (!newRoomName.trim()) return alert("Please enter a room name.");
    await addRoom({ name: newRoomName, hourlyRate: newRoomRate });
    setNewRoomName("");
  };

  const handleRateChange = async (id: Id<"rooms">, name: string, newRate: string) => {
    if (!isAdmin) return alert("Unauthorized: Only Admin can change rates.");
    const numericRate = Number(newRate);
    if (isNaN(numericRate) || numericRate <= 0) return;
    await updateRoom({ id, name, hourlyRate: numericRate });
  };

  return (
    <div className="max-w-4xl space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* 1. SECURITY & ACCESS SECTION */}
      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 blur-[100px] rounded-full" />
        
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-blue-600/10 rounded-2xl text-blue-500">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-white uppercase italic">System Access</h2>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Manage Admin and Staff Credentials</p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Admin Credentials Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                <User size={12} /> Admin Username
              </label>
              <input 
                type="text" 
                value={adminUser}
                onChange={(e) => setAdminUser(e.target.value)}
                disabled={!isAdmin}
                className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl text-white font-bold outline-none focus:border-blue-500 disabled:opacity-50"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                <Lock size={12} /> Admin Password
              </label>
              <input 
                type="password" 
                placeholder="••••••••"
                disabled={!isAdmin}
                className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl text-white font-bold outline-none focus:border-blue-500 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Staff Password Row */}
          <div className="pt-6 border-t border-slate-800/50">
            <div className="max-w-md space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest ml-1">
                <KeyRound size={12} /> Staff Shared Access Pin
              </label>
              <input 
                type="text" 
                placeholder="e.g. KTV-STAFF-2026"
                disabled={!isAdmin}
                className="w-full bg-slate-950 border border-emerald-500/10 p-4 rounded-2xl text-emerald-400 font-mono font-bold outline-none focus:border-emerald-500 disabled:opacity-50"
              />
            </div>
          </div>

          <button 
            disabled={!isAdmin}
            className="w-full md:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl transition-all shadow-lg shadow-blue-900/40"
          >
            Update Security
          </button>
        </div>
      </div>

      {/* 2. ROOM MANAGEMENT SECTION */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 ml-4">
          <DoorOpen size={20} className="text-slate-500" />
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400">Room Management</h2>
        </div>

        {/* ADD NEW ROOM */}
        <div className="p-8 bg-blue-600/5 border border-blue-500/20 rounded-[2.5rem] flex flex-wrap gap-4 items-end shadow-xl">
          <div className="flex-1 min-w-[240px] space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-blue-400 ml-2">New Room Name</label>
            <input 
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              disabled={!isAdmin}
              className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl text-white outline-none focus:border-blue-500 transition-all placeholder:text-slate-700"
              placeholder="e.g. VIP Room 5"
            />
          </div>
          <div className="w-32 space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-blue-400 ml-2">Rate (₱)</label>
            <input 
              type="number"
              value={newRoomRate}
              onChange={(e) => setNewRoomRate(Number(e.target.value))}
              disabled={!isAdmin}
              className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl text-white text-center outline-none focus:border-blue-500 transition-all"
            />
          </div>
          <button 
            onClick={handleAddRoom}
            disabled={!isAdmin}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-black px-8 py-4 rounded-2xl transition-all uppercase tracking-widest text-[10px] h-[58px] shadow-lg shadow-blue-900/20"
          >
            Add Room
          </button>
        </div>
        
        {/* EXISTING ROOM LIST */}
        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div className="divide-y divide-slate-800">
            {rooms.map((room) => (
              <div key={room._id} className="p-6 flex items-center justify-between hover:bg-slate-800/30 transition-colors group">
                <div>
                  <p className="font-bold text-white text-lg group-hover:text-blue-400 transition-colors">{room.name}</p>
                  <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest">Rate: ₱{room.hourlyRate}/hr</p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 font-bold text-xs">₱</span>
                    <input 
                      type="number"
                      placeholder="New Rate"
                      className="w-28 bg-slate-950 border border-slate-800 p-2 pl-6 rounded-xl text-center text-white focus:border-blue-500 outline-none transition-all"
                      onBlur={(e) => handleRateChange(room._id, room.name, e.target.value)}
                      disabled={!isAdmin}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {!isAdmin && (
        <div className="mt-6 p-6 bg-amber-500/10 border border-amber-500/20 rounded-[2rem] text-center">
          <p className="text-amber-500 text-[10px] font-black uppercase tracking-[0.2em]">
            ⚠️ Administrative Access Required to Modify Credentials or Rates
          </p>
        </div>
      )}
    </div>
  );
}