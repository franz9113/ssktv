import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import KaraokeDashboard from "@/components/dashboard/KaraokeDashboard";
import Sidebar from "@/components/layout/Sidebar";
import SalesHistory from "@/components/sales/SalesHistory";
import Settings from "@/components/settings/Settings";
import LoginAuth from "@/components/auth/LoginAuth";
import LoginPage from "@/pages/Login";

function App() {
  const { userRole, isAdmin, login, logout } = useAuth();
  const [view, setView] = useState<'dashboard' | 'sales' | 'settings'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (!userRole) {
    return <LoginPage onLoginSuccess={(role) => login(role)} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <Sidebar 
        currentView={view} 
        setView={setView} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
        isAdmin={isAdmin}
        onLogout={logout}
      />
      
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-24'}`}>
        <div className="p-8">
          {view === 'dashboard' && <KaraokeDashboard />}
          {view === 'sales' && <SalesHistory />}
          {view === 'settings' && isAdmin && <Settings isAdmin={isAdmin} />}
        </div>
      </main>
    </div>
  );
}

export default App;