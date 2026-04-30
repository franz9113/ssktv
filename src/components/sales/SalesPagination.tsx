import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export const SalesPagination = ({ currentPage, totalPages, totalItems, onPageChange }: PaginationProps) => (
  <footer className="p-6 bg-slate-950/50 border border-slate-800 rounded-[2rem] mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
    <p className="text-[10px] font-black uppercase text-slate-600 tracking-widest">
      Total Records: {totalItems}
    </p>
    <div className="flex items-center gap-2">
      <button 
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="p-2 rounded-xl bg-slate-800 text-slate-400 disabled:opacity-20 hover:bg-slate-700 transition-all"
      >
        <ChevronLeft size={16} />
      </button>

      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i + 1}
          onClick={() => onPageChange(i + 1)}
          className={`w-8 h-8 rounded-xl text-[10px] font-black transition-all ${
            currentPage === i + 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'bg-slate-800 text-slate-500 hover:bg-slate-700'
          }`}
        >
          {i + 1}
        </button>
      ))}

      <button 
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="p-2 rounded-xl bg-slate-800 text-slate-400 disabled:opacity-20 hover:bg-slate-700 transition-all"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  </footer>
);