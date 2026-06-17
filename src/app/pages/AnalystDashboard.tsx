import React, { useState, useEffect } from "react";
import { Filter, ArrowUpDown, Download, ChevronDown, Settings2, Loader2 } from "lucide-react";
import { useClaims } from "../state/ClaimContext";
import { useNavigate, useSearchParams } from "react-router";

export function AnalystDashboard() {
  const { claims, fetchClaims, isLoading } = useClaims();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [dateSort, setDateSort] = useState<'desc' | 'asc'>('desc');

  const searchQuery = searchParams.get('q')?.toLowerCase() || '';

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  const filteredClaims = claims
    .filter(c => statusFilter === 'All' || c.status === statusFilter)
    .filter(c => 
      !searchQuery || 
      c.id.toLowerCase().includes(searchQuery) ||
      c.clientName.toLowerCase().includes(searchQuery) ||
      c.provider.toLowerCase().includes(searchQuery) ||
      c.type.toLowerCase().includes(searchQuery) ||
      c.status.toLowerCase().includes(searchQuery)
    )
    .sort((a, b) => {
      const dateA = new Date(a.dateSubmitted).getTime();
      const dateB = new Date(b.dateSubmitted).getTime();
      return dateSort === 'desc' ? dateB - dateA : dateA - dateB;
    });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Approved':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">Approved</span>;
      case 'Pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">Pending</span>;
      case 'Rejected':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">Rejected</span>;
      case 'Needs Info':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Needs Info</span>;
      default:
        return <span>{status}</span>;
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Incoming Claims</h2>
          <p className="text-gray-500 text-sm mt-0.5">Review and process health insurance claims.</p>
        </div>
      </div>

      {/* Main Table Section */}
      <div className="bg-white rounded-lg border border-gray-200 flex flex-col w-full shadow-sm">
        {/* Filters Row */}
        <div className="px-4 py-3 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Filter by Status */}
            <div className="relative group flex items-center">
              <div className="relative flex items-center">
                <Filter className="absolute left-2.5 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 text-gray-700 text-sm rounded-md pl-8 pr-7 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Needs Info">Needs Info</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <ChevronDown className="absolute right-2.5 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Sort by Date */}
            <div className="relative group flex items-center">
              <div className="relative flex items-center">
                <ArrowUpDown className="absolute left-2.5 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                <select 
                  value={dateSort}
                  onChange={(e) => setDateSort(e.target.value as 'desc' | 'asc')}
                  className="appearance-none bg-white border border-gray-200 text-gray-700 text-sm rounded-md pl-8 pr-7 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </select>
                <ChevronDown className="absolute right-2.5 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center justify-center p-1.5 text-gray-400 hover:text-gray-600 border border-transparent hover:border-gray-200 rounded-md transition-colors cursor-pointer">
               <Settings2 className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-1.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-medium py-1.5 px-3 rounded-md transition-colors focus:outline-none focus:ring-1 focus:ring-gray-200 cursor-pointer">
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200">
                <th className="py-1.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Claim ID</th>
                <th className="py-1.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Client Name</th>
                <th className="py-1.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date Submitted</th>
                <th className="py-1.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Claim Type</th>
                <th className="py-1.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Total Amount</th>
                <th className="py-1.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Current Status</th>
                <th className="py-1.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                    Loading claims...
                  </td>
                </tr>
              ) : filteredClaims.length > 0 ? (
                filteredClaims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="py-1.5 px-4 whitespace-nowrap">
                      <span className="font-medium text-indigo-600 text-sm">{claim.id}</span>
                    </td>
                    <td className="py-1.5 px-4 whitespace-nowrap text-sm text-gray-900 font-medium">{claim.clientName}</td>
                    <td className="py-1.5 px-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(claim.dateSubmitted).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-1.5 px-4 whitespace-nowrap text-sm text-gray-500">{claim.type}</td>
                    <td className="py-1.5 px-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      Rp {claim.amount.toLocaleString('id-ID', { minimumFractionDigits: 0 })}
                    </td>
                    <td className="py-1.5 px-4 whitespace-nowrap">
                      {getStatusBadge(claim.status)}
                    </td>
                    <td className="py-1.5 px-4 whitespace-nowrap text-right">
                      <button 
                        onClick={() => navigate(`/analyst/review/${claim.id}`)}
                        className="text-blue-700 hover:text-blue-900 text-sm font-medium transition-colors focus:outline-none cursor-pointer hover:underline underline-offset-2"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500 text-sm">
                    No claims found matching the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500 bg-white rounded-b-lg">
          <span>Showing <span className="font-medium text-gray-900">{filteredClaims.length}</span> of <span className="font-medium text-gray-900">{claims.length}</span> results</span>
          <div className="flex items-center gap-1">
            <button className="px-2 py-1 border border-gray-200 rounded text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" disabled>Prev</button>
            <button className="px-2.5 py-1 bg-indigo-50 text-indigo-600 font-medium border border-indigo-200 rounded cursor-pointer">1</button>
            <button className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-50 text-gray-600 transition-colors disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}