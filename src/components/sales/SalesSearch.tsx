import { Search } from "lucide-react";

interface SalesSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const SalesSearch = ({ searchTerm, onSearchChange }: SalesSearchProps) => (
  <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-6 rounded-[2rem] border border-slate-800 shadow-xl">
    <div>
      <h1 className="text-2xl font-black italic text-white uppercase tracking-tighter">Sales Ledger</h1>
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Operational Revenue History</p>
    </div>
    
    <div className="flex items-center gap-3">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
        <input 
          type="text"
          placeholder="FILTER BY ROOM..."
          className="bg-slate-950 border border-slate-800 rounded-2xl py-3 pl-10 pr-4 text-[10px] font-black uppercase tracking-widest text-white focus:border-blue-500 outline-none w-64 transition-all"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      {/* <button className="p-3 bg-slate-800 hover:bg-slate-700 rounded-2xl text-slate-400 transition-colors">
        <FileSpreadsheet size={18} />
      </button> */}
    </div>
  </header>
);