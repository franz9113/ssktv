import { Database, Download, RefreshCw } from "lucide-react";

export default function DataBackup() {
  return (
    <div className="max-w-2xl space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 space-y-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-blue-500/10 rounded-2xl">
            <Database className="text-blue-500" />
          </div>
          <div>
            <h3 className="font-black italic text-white uppercase">System Database</h3>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Convex Cloud Deployment</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 pt-4">
          <button className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:border-blue-500/50 transition-colors group">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Export Sales History (CSV)</span>
            <Download size={18} className="text-slate-600 group-hover:text-blue-500" />
          </button>
          
          <button className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:border-emerald-500/50 transition-colors group">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sync Global State</span>
            <RefreshCw size={18} className="text-slate-600 group-hover:text-emerald-500" />
          </button>
        </div>
      </div>
    </div>
  );
}