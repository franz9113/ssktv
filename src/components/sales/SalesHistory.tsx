import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState, useMemo } from "react";
import { SalesSearch } from "./SalesSearch";
import { SalesTable } from "./SalesTable";
import { SalesPagination } from "./SalesPagination";


export default function SalesHistory() {
  const sales = useQuery(api.sales.getSalesHistory);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const filteredSales = useMemo(() => {
    if (!sales) return [];
    return sales.filter(s => s.roomName.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [sales, searchTerm]);

  const totalPages = Math.ceil(filteredSales.length / rowsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredSales.slice(start, start + rowsPerPage);
  }, [filteredSales, currentPage]);

  if (!sales) return <div className="p-8 text-slate-500 animate-pulse font-black">SYNCING...</div>;

  return (
    <div className="max-w-6xl space-y-6">
      <SalesSearch 
        searchTerm={searchTerm} 
        onSearchChange={(val) => { setSearchTerm(val); setCurrentPage(1); }} 
      />
      
      <SalesTable data={paginatedData} />
      
      <SalesPagination 
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredSales.length}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}