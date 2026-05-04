import { Users, UserPlus } from "lucide-react";
import AddUserModal from "../modals/users/AddUserModal";
import { useState } from "react";

export default function UserManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <><div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-black italic text-white uppercase">Staff Profiles</h3>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Manage access and permissions</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
        onClick={() => setIsModalOpen(true)}>
          <UserPlus size={16} /> Add Staff
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 text-center border-dashed">
        <Users className="mx-auto text-slate-800 mb-4" size={48} />
        <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Staff management logic coming soon...</p>
      </div>
    </div>

      <AddUserModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      /></>
    
  );
}