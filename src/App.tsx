import { useEffect, useState } from "react";
import KaraokeDashboard from "@/components/dashboard/KaraokeDashboard";
import Sidebar from "@/components/layout/Sidebar";
import SalesHistory from "@/components/sales/SalesHistory";
import Settings from "./components/settings/Settings";

function App() {
  const [view, setView] = useState<'dashboard' | 'sales' | 'settings'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Change this to 'false' to see the Staff view
  // Change this to 'true' to see your Admin/Settings view
  const [isAdmin, setIsAdmin] = useState(false); 
  const [currentView, setCurrentView] = useState<'dashboard' | 'sales' | 'settings'>('dashboard');

  useEffect(() => {
  if (!isAdmin && currentView === 'settings') {
    setCurrentView('dashboard');
  }
}, [isAdmin, currentView]);

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <Sidebar 
      currentView={view} 
      setView={setView} 
      isOpen={isSidebarOpen} 
      setIsOpen={setIsSidebarOpen}
      isAdmin={false} // Change to true to show settings in sidebar
    />
      
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-24'}`}>
        <div className="p-8">
          {view === 'dashboard' && <KaraokeDashboard />}
          {view === 'sales' && <SalesHistory />}
          {currentView === 'settings' && isAdmin && <Settings isAdmin={isAdmin} />}
        </div>
      </main>
    </div>
  );
}

export default App;