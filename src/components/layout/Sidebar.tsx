import { LayoutDashboard, History, Settings, LogOut, ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarProps {
  currentView: 'dashboard' | 'sales' | 'settings';
  setView: (view: 'dashboard' | 'sales' | 'settings') => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isAdmin: boolean; // Add this prop to control visibility
}

export default function Sidebar({ currentView, setView, isOpen, setIsOpen, isAdmin }: SidebarProps) {
  
  // Conditionally build the menu
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'sales', label: 'Sales History', icon: History },
    // Only include settings if the user is an admin
    ...(isAdmin ? [{ id: 'settings', label: 'Settings', icon: Settings }] : []),
  ];

  return (
    <aside className={`fixed left-0 top-0 h-screen bg-slate-900 border-r border-slate-800 transition-all duration-300 z-50 flex flex-col ${isOpen ? 'w-64' : 'w-20'}`}>
      
      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-3 top-10 bg-blue-600 rounded-full p-1 border-2 border-slate-950 hover:bg-blue-500 transition-colors z-[60]"
      >
        {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      {/* Logo Area */}
      <div className={`p-6 mb-4 ${!isOpen && 'items-center'} flex flex-col`}>
        <h1 className={`text-2xl font-black italic transition-all drop-shadow-[0_0_10px_rgba(59,130,246,0.3)] ${
          !isOpen ? 'scale-75 text-white' : 'text-white'
        }`}>
          {isOpen ? 'S&S KTV' : 'S&S'}
        </h1>
        {isOpen && (
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mt-1">
            Management
          </p>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id as any)}
            className={`flex items-center gap-4 w-full p-4 rounded-2xl transition-all ${
              currentView === item.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            } ${!isOpen && 'justify-center'}`}
            title={!isOpen ? item.label : ''}
          >
            <item.icon size={20} />
            {isOpen && <span className="font-bold uppercase text-[10px] tracking-widest">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* System Status / Logout */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <button
          onClick={() => console.log("Logout triggered")}
          className={`flex items-center gap-4 w-full p-4 rounded-2xl transition-all text-slate-400 hover:bg-red-500/10 hover:text-red-500 ${!isOpen && 'justify-center'}`}
          title={!isOpen ? 'Logout' : ''}
        >
          <LogOut size={20} />
          {isOpen && <span className="font-bold uppercase text-[10px] tracking-widest">Logout</span>}
        </button>

        <div className={`flex items-center gap-3 pt-2 ${!isOpen && 'justify-center'}`}>
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          {isOpen && <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">System Live</span>}
        </div>
      </div>
    </aside>
  );
}