import { useState } from "react";
import { useQuery } from "convex/react";
import { Plus, Trash2, Settings2 } from "lucide-react"; 

import { api } from "../../../convex/_generated/api";
import { Doc } from "../../../convex/_generated/dataModel";

import LoadingState from "../layout/LoadingState";
import AddRoomModal from "../modals/rooms/AddRoomModal";
import EditRoomModal from "../modals/rooms/EditRoomModal";


interface RoomSettingsProps {
  userRole: "staff" | "admin" | "super-admin";
}

export default function RoomSettings({ userRole }: RoomSettingsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Doc<"rooms"> | null>(null);
  const isSuperAdmin = userRole === "super-admin";
  
  const rooms = useQuery(api.rooms.getRooms);

  if (!rooms) return <LoadingState message="FETCHING ROOM CONFIG" />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-4 duration-500">
      {isSuperAdmin && (
        <button 
          className="h-full min-h-[150px] border-2 border-dashed border-slate-800 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group"
          onClick={() => setIsModalOpen(true)}
        >
          <div className="p-3 bg-slate-900 rounded-full group-hover:scale-110 transition-transform">
            <Plus className="text-blue-500" />
          </div>
          <span className="font-black text-[10px] uppercase tracking-widest text-slate-500">Add New Unit</span>
        </button>
      )}

      {/* Existing Rooms List */}
      {rooms.map((room) => (
        <div key={room._id} className="bg-slate-900 border border-slate-800 p-6 rounded-[2.5rem] flex items-center justify-between group hover:border-slate-700 transition-all">
          <div>
            <h4 className="font-black italic text-lg text-white">{room.name}</h4>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Base Rate: ₱{room.hourlyRate}/hr</p>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => isSuperAdmin && setEditingRoom(room)}
              className={`p-4 rounded-2xl transition-all ${isSuperAdmin ? 'hover:bg-blue-500/10 text-slate-600 hover:text-blue-400' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
            >
              <Settings2 size={20} />
            </button>

            <button 
              onClick={() => isSuperAdmin && undefined}
              className={`p-4 rounded-2xl transition-all ${isSuperAdmin ? 'hover:bg-red-500/10 text-slate-600 hover:text-red-500' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      ))}

      <AddRoomModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
      
      <EditRoomModal 
        room={editingRoom} 
        onClose={() => setEditingRoom(null)} 
        isOpen={!editingRoom}
      />
    </div>
  );
}