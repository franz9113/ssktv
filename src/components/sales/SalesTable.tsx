import React from 'react';
interface Sale {
  _id: string;
  _creationTime: number;
  roomName: string;
  duration: number;
  totalAmount: number;
}

export const SalesTable = React.memo(({ data }: { data: Sale[] }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-800/30 border-b border-slate-800">
            <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Timestamp</th>
            <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Room Assignment</th>
            <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-center">Usage</th>
            <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">Revenue</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/50">
          {data.map((sale) => {
            const dateObj = new Date(sale._creationTime);
            const dateStr = dateObj.toLocaleDateString();
            const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            return (
              <tr key={sale._id} className="hover:bg-blue-500/5 transition-colors group">
                <td className="p-6">
                  <p className="text-white font-bold text-sm">{dateStr}</p>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
                    {timeStr}
                  </p>
                </td>
                <td className="p-6">
                  <span className="bg-slate-950 border border-blue-500/20 text-blue-400 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest group-hover:border-blue-500/50 transition-colors">
                    {sale.roomName}
                  </span>
                </td>
                <td className="p-6 text-center text-slate-300 font-mono text-xs">
                  {sale.duration.toFixed(1)}h
                </td>
                <td className="p-6 text-right font-black text-emerald-400 text-lg">
                  ₱{sale.totalAmount.toLocaleString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {data.length === 0 && (
        <div className="py-20 text-center text-slate-600 text-xs font-black uppercase italic tracking-widest">
          No matching records found
        </div>
      )}
    </div>
  );
});

// Always set a DisplayName when using memo for easier debugging in React DevTools
SalesTable.displayName = "SalesTable";