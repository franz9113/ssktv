import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { SalesSearch } from "./SalesSearch";
import { SalesTable } from "./SalesTable";
import { SalesPagination } from "./SalesPagination";
import { ReceiptText, SearchX } from "lucide-react";
import LoadingState from "@/components/layout/LoadingState";

function useSalesLogic(sales: any[] | undefined, searchTerm: string, currentPage: number) {
  const rowsPerPage = 10;

  // 1. Filter data based on search term
  const filteredSales = useMemo(() => {
    if (!sales) return [];
    
    return sales
      .filter((s) => s.roomName.toLowerCase().includes(searchTerm.toLowerCase()))
      .map((s) => ({
        ...s,
        // FORCE duration to be a whole number here
        duration: Math.round(s.duration || 0) 
      }));
  }, [sales, searchTerm]);

  // 2. Calculate totals for the filtered set (The "Math" trick)
  const stats = useMemo(() => {
    return filteredSales.reduce(
      (acc, s) => ({
        totalRevenue: acc.totalRevenue + s.totalAmount,
        totalCount: acc.totalCount + 1,
      }),
      { totalRevenue: 0, totalCount: 0 }
    );
  }, [filteredSales]);

  // Paginate the filtered data
  const totalPages = Math.ceil(filteredSales.length / rowsPerPage) || 1;
  
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredSales.slice(start, start + rowsPerPage);
  }, [filteredSales, currentPage]);

  return { filteredSales, paginatedData, totalPages, stats };
}

export default function SalesHistory() {
  const sales = useQuery(api.sales.getSalesHistory);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { filteredSales, paginatedData, totalPages, stats } = useSalesLogic(
    sales,
    searchTerm,
    currentPage
  );

  // Loading State
  if (!sales) return <LoadingState message="FETCHING SALES RECORDS" />;

  return (
    <div className="max-w-6xl space-y-8 animate-in fade-in duration-700">
      {/* HEADER & STATS */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black italic text-white flex items-center gap-3">
            <ReceiptText className="text-blue-500" /> SALES AUDIT
          </h2>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mt-1">
            Transaction History & Revenue Logs
          </p>
        </div>

        {/* Quick Stats Card */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-6 px-8">
          <div>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Filtered Total</p>
            <p className="text-xl font-black text-emerald-400">₱{stats.totalRevenue.toLocaleString()}</p>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Entries</p>
            <p className="text-xl font-black text-white">{stats.totalCount}</p>
          </div>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-slate-900/50 p-2 rounded-[2rem] border border-slate-800/50">
        <SalesSearch
          searchTerm={searchTerm}
          onSearchChange={(val) => {
            setSearchTerm(val);
            setCurrentPage(1); // Crucial: Reset to page 1 on new search
          }}
        />
      </div>

      {/* TABLE SECTION */}
      {filteredSales.length > 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <SalesTable data={paginatedData} />
        </div>
      ) : (
        <div className="p-20 text-center bg-slate-900/30 rounded-[3rem] border border-dashed border-slate-800 flex flex-col items-center">
          <SearchX size={48} className="text-slate-700 mb-4" />
          <p className="text-slate-500 font-black uppercase tracking-widest text-xs">
            No transactions found for "{searchTerm}"
          </p>
        </div>
      )}

      {/* PAGINATION */}
      <div className="pt-4">
        <SalesPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredSales.length}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}