import { useState } from "react";
import { UserCog, DoorOpen, Database, ShieldCheck } from "lucide-react";
import UserManagement from "./UserManagement";
import RoomSettings from "./RoomSettings";
import DataBackup from "./DataBackup";

type SettingTab = "users" | "rooms" | "data";

export default function Settings({ isAdmin }: { isAdmin: boolean }) {
  const [activeTab, setActiveTab] = useState<SettingTab>("users");

  // Guard for non-admins (Double security)
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center p-20">
        <ShieldCheck className="w-16 h-16 text-red-500 mb-4 opacity-20" />
        <h2 className="font-black italic text-xl">ACCESS DENIED</h2>
        <p className="text-slate-500 text-xs uppercase tracking-widest mt-2">Admin privileges required.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-black italic">SYSTEM SETTINGS</h2>
        <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.3em]">Configure S&S KTV POS Environment</p>
      </header>

      {/* Settings Navigation */}
      <div className="flex gap-4 p-2 bg-slate-900/50 rounded-[2rem] border border-slate-800/50 w-fit">
        <TabButton 
          active={activeTab === "users"} 
          onClick={() => setActiveTab("users")} 
          icon={<UserCog size={18} />} 
          label="Staff" 
        />
        <TabButton 
          active={activeTab === "rooms"} 
          onClick={() => setActiveTab("rooms")} 
          icon={<DoorOpen size={18} />} 
          label="Rooms" 
        />
        <TabButton 
          active={activeTab === "data"} 
          onClick={() => setActiveTab("data")} 
          icon={<Database size={18} />} 
          label="Database" 
        />
      </div>

      {/* Render Sub-components */}
      <div className="mt-8">
        {activeTab === "users" && <UserManagement />}
        {activeTab === "rooms" && <RoomSettings />}
        {activeTab === "data" && <DataBackup />}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all
        ${active 
          ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
          : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"}`}
    >
      {icon}
      {label}
    </button>
  );
}