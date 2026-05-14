import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import KaraokeDashboard from "@/components/dashboard/KaraokeDashboard";
import Sidebar from "@/components/layout/Sidebar";
import SalesHistory from "@/components/sales/SalesHistory";
import Settings from "@/components/settings/Settings";
import LoginPage from "@/pages/Login";

function App() {
  const { userRole, isAdmin, isSuperAdmin, login, logout } = useAuth();
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
        canAccessSettings={isAdmin}
        onLogout={logout}
      />
      
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-24'}`}>
        <div className="p-8">
          {view === 'dashboard' && <KaraokeDashboard userRole={userRole} />}
          {view === 'sales' && <SalesHistory userRole={userRole} />}
          {view === 'settings' && isAdmin && <Settings userRole={userRole} isSuperAdmin={isSuperAdmin} />}
        </div>
      </main>
    </div>
  );
}

export default App;