"use client";

import { useState, useMemo } from "react";
import { jsPDF } from "jspdf";

export function AdvancedTable({ title = "PayLoop Data", headers = [], data = [], filterColumn = "" }) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" | "desc"
  const [filterValue, setFilterValue] = useState("All");

  // Determine unique filter options if a filterColumn is specified
  const filterOptions = useMemo(() => {
    if (!filterColumn) return [];
    const values = data.map(item => String(item[filterColumn] || ""));
    return ["All", ...Array.from(new Set(values))];
  }, [data, filterColumn]);

  // Handle Sort Toggle
  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  // Filter & Search & Sort Rows
  const processedData = useMemo(() => {
    let result = [...data];

    // 1. Filter
    if (filterColumn && filterValue !== "All") {
      result = result.filter(item => String(item[filterColumn]) === filterValue);
    }

    // 2. Search
    if (search.trim() !== "") {
      const query = search.toLowerCase();
      result = result.filter(row => {
        return headers.some(header => {
          const val = String(row[header.key] || "").toLowerCase();
          return val.includes(query);
        });
      });
    }

    // 3. Sort
    if (sortKey) {
      result.sort((a, b) => {
        let valA = a[sortKey];
        let valB = b[sortKey];

        // Handle numbers
        if (typeof valA === "number" && typeof valB === "number") {
          return sortOrder === "asc" ? valA - valB : valB - valA;
        }

        // Handle strings
        valA = String(valA || "").toLowerCase();
        valB = String(valB || "").toLowerCase();

        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, headers, search, sortKey, sortOrder, filterColumn, filterValue]);

  // Export to CSV
  const exportToCSV = () => {
    const csvHeaders = headers.map(h => `"${h.label}"`).join(",");
    const csvRows = processedData.map(row => 
      headers.map(h => {
        const val = String(row[h.key] || "").replace(/"/g, '""');
        return `"${val}"`;
      }).join(",")
    );
    const csvContent = "data:text/csv;charset=utf-8," + [csvHeaders, ...csvRows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${title.toLowerCase().replace(/\s+/g, "_")}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to PDF using jsPDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(title, 14, 20);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);

    let startY = 38;
    const rowHeight = 10;
    const colWidth = 180 / headers.length;

    // Table Header
    doc.setFillColor(109, 61, 242);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    headers.forEach((h, index) => {
      doc.rect(14 + index * colWidth, startY, colWidth, rowHeight, "F");
      doc.text(h.label, 16 + index * colWidth, startY + 6);
    });

    startY += rowHeight;

    // Table Data
    doc.setTextColor(17, 24, 39);
    doc.setFont("helvetica", "normal");
    processedData.forEach((row, rowIndex) => {
      // Alternate row backgrounds
      if (rowIndex % 2 === 0) {
        doc.setFillColor(245, 247, 251);
      } else {
        doc.setFillColor(255, 255, 255);
      }

      headers.forEach((h, index) => {
        const x = 14 + index * colWidth;
        doc.rect(x, startY, colWidth, rowHeight, "F");
        
        let val = String(row[h.key] || "");
        if (val.length > 25) val = val.substring(0, 22) + "...";
        
        doc.text(val, x + 2, startY + 6);
      });
      startY += rowHeight;

      // Handle page break
      if (startY > 270) {
        doc.addPage();
        startY = 20;
      }
    });

    doc.save(`${title.toLowerCase().replace(/\s+/g, "_")}_export.pdf`);
  };

  return (
    <div className="advanced-table-wrapper grid gap-4">
      {/* Controls: Search, Filter, Export */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between bg-white/40 dark:bg-slate-900/40 p-4 rounded-lg border border-[var(--border)] backdrop-blur-sm shadow-sm transition-colors duration-200">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Table Search */}
          <input
            className="flex-1 min-w-[200px] max-w-sm rounded-md border border-[var(--border)] bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-1 focus:ring-violet-500 focus:border-transparent transition-all"
            placeholder="Quick search table..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Table Category Filter */}
          {filterColumn && (
            <select
              className="rounded-md border border-[var(--border)] bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 outline-none focus:ring-1 focus:ring-violet-500 transition-all"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            >
              {filterOptions.map(option => (
                <option key={option} value={option}>
                  Filter: {option}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button 
            onClick={exportToCSV}
            className="button-secondary h-8 text-[11px] font-black rounded-md flex items-center gap-1.5 shadow-sm border-slate-200 hover:bg-slate-50 transition-all"
            type="button"
          >
            📊 CSV
          </button>
          <button 
            onClick={exportToPDF}
            className="button-secondary h-8 text-[11px] font-black rounded-md flex items-center gap-1.5 shadow-sm border-slate-200 hover:bg-slate-50 transition-all"
            type="button"
          >
            📄 PDF
          </button>
        </div>
      </div>

      {/* Actual Data Table */}
      <div className="overflow-x-auto rounded-lg border border-[var(--border)] bg-white dark:bg-[#0f172a] shadow-md transition-colors duration-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-[var(--border)]">
              {headers.map(h => (
                <th 
                  key={h.key}
                  onClick={() => handleSort(h.key)}
                  className="px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 cursor-pointer select-none hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    {h.label}
                    <span className="text-[10px] text-slate-400">
                      {sortKey === h.key ? (sortOrder === "asc" ? "▲" : "▼") : "↕"}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {processedData.length > 0 ? (
              processedData.map((row, rowIndex) => (
                <tr 
                  key={row.id || rowIndex}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-900/40 transition-colors duration-100"
                >
                  {headers.map(h => (
                    <td 
                      key={h.key} 
                      className="px-4 py-3.5 text-xs font-bold text-slate-700 dark:text-slate-300"
                    >
                      {row[h.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td 
                  colSpan={headers.length} 
                  className="px-4 py-8 text-center text-xs text-slate-400 dark:text-slate-500 font-semibold"
                >
                  No records matching your search query.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Row Counter Footer */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 font-bold px-1">
        <span>Showing {processedData.length} of {data.length} records</span>
      </div>
    </div>
  );
}
