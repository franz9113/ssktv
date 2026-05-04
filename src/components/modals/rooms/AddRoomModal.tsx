import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { X, Save } from "lucide-react";

export default function AddRoomModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [name, setName] = useState("");
  const [rate, setRate] = useState("");
  const createRoom = useMutation(api.rooms.addRoom);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createRoom({ name, hourlyRate: Number(rate) });
    setName("");
    setRate("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-[2.5rem] overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black italic">ADD NEW ROOM</h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Room Name / Number</label>
              <input 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. VIP ROOM 01"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Hourly Rate (₱)</label>
              <input 
                required
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                placeholder="500"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2 mt-4 transition-all"
            >
              <Save size={18} /> Save Unit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}