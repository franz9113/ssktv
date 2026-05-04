import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Doc } from "../../../../convex/_generated/dataModel";

interface EditRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Doc<"rooms"> | null;
}

export default function EditRoomModal({ isOpen, onClose, room }: EditRoomModalProps) {
  const [name, setName] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const updateRoom = useMutation(api.rooms.updateRoom);

  // Pre-fill the form when a room is selected
  useEffect(() => {
    if (room) {
      setName(room.name);
      setHourlyRate(room.hourlyRate.toString());
    }
  }, [room]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!room) return;
    
    await updateRoom({
      id: room._id,
      name,
      hourlyRate: Number(hourlyRate),
    });
    onClose();
  };

  if (!isOpen || !room) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-[2rem] p-8 space-y-6">
        <h3 className="text-xl font-black italic uppercase text-white">Edit {room.name}</h3>
        
        <div className="space-y-4">
          <input 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-white" 
            placeholder="Room Name"
          />
          <input 
            type="number"
            value={hourlyRate} 
            onChange={(e) => setHourlyRate(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-white" 
            placeholder="Hourly Rate (PHP)"
          />
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 p-4 text-slate-500 font-bold uppercase text-xs">Cancel</button>
          <button type="submit" className="flex-1 bg-blue-600 p-4 rounded-xl text-white font-bold uppercase text-xs">Save Changes</button>
        </div>
      </form>
    </div>
  );
}