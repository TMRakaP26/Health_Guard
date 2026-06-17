import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useClaims, Claim } from '../state/ClaimContext';
import { 
  FileText, ZoomIn, ZoomOut, RotateCw, Download,
  AlertCircle, CheckCircle2, XCircle, HelpCircle,
  User, Hash, Activity, Banknote, ChevronDown, Check
} from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const STATUS_OPTIONS = [
  { value: 'Pending', label: 'Pending Review', color: 'bg-amber-100 text-amber-800', icon: AlertCircle, iconColor: 'text-amber-600' },
  { value: 'Approved', label: 'Approved', color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle2, iconColor: 'text-emerald-600' },
  { value: 'Rejected', label: 'Rejected', color: 'bg-rose-100 text-rose-800', icon: XCircle, iconColor: 'text-rose-600' },
  { value: 'Needs Info', label: 'Needs Info', color: 'bg-blue-100 text-blue-800', icon: HelpCircle, iconColor: 'text-blue-600' }
];

export function AnalystReview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { claims, updateClaimStatus } = useClaims();
  
  const claim = claims.find(c => c.id === id);
  
  const [status, setStatus] = useState<Claim['status']>(claim?.status || 'Pending');
  const [notes, setNotes] = useState(claim?.notes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!claim) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500">
        Claim not found
      </div>
    );
  }

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await updateClaimStatus(claim.id, status, notes);
      navigate('/analyst');
    } catch (err) {
      console.error('Failed to update claim status:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-slate-50/50">
      {/* Claim Context Header */}
      <div className="px-8 py-5 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
        <div>
          <div className="flex items-center gap-4 mb-1">
            <h1 className="text-2xl font-semibold text-slate-900">Claim #{claim.id}</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2 ${STATUS_OPTIONS.find(o => o.value === status)?.color}`}>
              {status === 'Pending' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>}
              {STATUS_OPTIONS.find(o => o.value === status)?.label}
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Submitted on {new Date(claim.dateSubmitted).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} via HealthGuard Platform
          </p>
        </div>
        <div className="flex items-center gap-3">
           <button 
             onClick={() => navigate('/analyst')}
             className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
           >
             Cancel Review
           </button>
        </div>
      </div>

      {/* Split Screen Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PANE - Details and Document Viewer */}
        <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6">
          {/* Top Data Cards */}
          <div className="flex flex-col shrink-0 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 flex items-center justify-between border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md shrink-0"><User size={14} /></div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Client Name</span>
              </div>
              <p className="text-sm font-medium text-slate-900 truncate max-w-[50%]">{claim.clientName}</p>
            </div>
            
            <div className="px-5 py-3.5 flex items-center justify-between border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-md shrink-0"><Hash size={14} /></div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Provider Name</span>
              </div>
              <p className="text-sm font-medium text-slate-900 truncate max-w-[50%]">{claim.provider}</p>
            </div>
            
            <div className="px-5 py-3.5 flex items-center justify-between border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-purple-50 text-purple-600 rounded-md shrink-0"><Activity size={14} /></div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Diagnosis Code</span>
              </div>
              <p className="text-sm font-medium text-slate-900 truncate max-w-[50%]">{claim.type}</p>
            </div>
            
            <div className="px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-md shrink-0"><Banknote size={14} /></div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Billed</span>
              </div>
              <p className="text-sm font-medium text-slate-900 truncate max-w-[50%]">Rp {claim.amount.toLocaleString('id-ID', { minimumFractionDigits: 0 })}</p>
            </div>
          </div>

          {/* Document Viewer Container */}
          <div className="flex-1 min-h-[500px] flex flex-col bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80 shrink-0">
              <div className="flex items-center gap-3">
                <FileText size={18} className="text-blue-600" />
                <div>
                  <div className="text-sm font-medium text-slate-900 leading-none mb-1">Hospital_Invoice_SJ.pdf</div>
                  <div className="text-xs text-slate-500">Page 1 of 3 • 4.1 MB</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-1">
                <button className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors cursor-pointer" title="Zoom Out"><ZoomOut size={16} /></button>
                <span className="text-xs font-medium px-2 text-slate-700">100%</span>
                <button className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors cursor-pointer" title="Zoom In"><ZoomIn size={16} /></button>
                <div className="w-px h-4 bg-slate-200 mx-1"></div>
                <button className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors cursor-pointer" title="Rotate"><RotateCw size={16} /></button>
                <button className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors cursor-pointer" title="Download"><Download size={16} /></button>
              </div>
            </div>
            
            <div className="flex-1 bg-slate-200/40 p-8 overflow-auto flex justify-center items-start shadow-inner">
              <div className="w-full max-w-3xl bg-white shadow-md border border-slate-200 rounded-sm min-h-[800px] p-6 relative">
                <ImageWithFallback 
                  src="https://images.unsplash.com/photo-1625980344922-a4df108b2bd0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3NwaXRhbCUyMGJpbGwlMjBpbnZvaWNlfGVufDF8fHx8MTc3ODc3MTk1Nnww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Generic Hospital Bill Placeholder"
                  className="w-full h-auto object-contain mix-blend-multiply opacity-80 blur-[4px] pointer-events-none select-none"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-slate-200 shadow-sm text-slate-500 font-medium text-sm">
                    Document Preview Protected
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANE - Action Panel */}
        <div className="w-[360px] bg-white border-l border-slate-200 flex flex-col shrink-0 shadow-[-4px_0_15px_-5px_rgba(0,0,0,0.05)]">
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Decision Panel</h2>
              <p className="text-sm text-slate-500 mt-1">Review the documentation and submit a final determination.</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Claim Status</label>
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full bg-white border border-slate-200 text-left text-sm rounded-lg focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 px-3 py-2.5 shadow-sm transition-all hover:border-slate-300 outline-none flex items-center justify-between cursor-pointer"
                >
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center w-fit gap-1.5 ${STATUS_OPTIONS.find(o => o.value === status)?.color}`}>
                    {(() => {
                      const opt = STATUS_OPTIONS.find(o => o.value === status);
                      const Icon = opt?.icon;
                      return Icon ? <Icon size={14} className={opt.iconColor} /> : null;
                    })()}
                    {STATUS_OPTIONS.find(o => o.value === status)?.label}
                  </span>
                  <ChevronDown size={18} className={`text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1.5 bg-white border border-slate-200 rounded-lg shadow-lg py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    {STATUS_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setStatus(option.value as Claim['status']);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-50 flex items-center justify-between transition-colors cursor-pointer ${status === option.value ? 'bg-slate-50' : ''}`}
                      >
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${option.color}`}>
                          <option.icon size={14} className={option.iconColor} />
                          {option.label}
                        </span>
                        {status === option.value && <Check size={16} className="text-slate-900" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${status !== 'Pending' && status !== 'Approved' ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
              {status === 'Rejected' && (
                <div className="bg-rose-50 border border-rose-100 rounded-lg p-3 text-sm text-rose-800 flex gap-2.5">
                  <AlertCircle size={18} className="text-rose-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">Rejection requires a detailed explanation in the notes section referencing the specific policy clause.</p>
                </div>
              )}
              {status === 'Needs Info' && (
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-blue-800 flex gap-2.5">
                  <HelpCircle size={18} className="text-blue-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">Please specify exactly what documents or information are missing from the provider or client.</p>
                </div>
              )}
            </div>

            <div className="space-y-2 flex flex-col h-56">
              <label htmlFor="notes" className="flex items-center justify-between text-sm font-medium text-slate-700">
                Analyst Notes
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded">Internal</span>
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter findings, policy references, or reasons for decision..."
                className="w-full flex-1 p-3.5 border border-slate-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-sm resize-none transition-all outline-none leading-relaxed text-slate-800 placeholder:text-slate-400"
              ></textarea>
            </div>
          </div>

          <div className="p-6 border-t border-slate-200 bg-slate-50/50 flex flex-col gap-3 shrink-0">
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>Submitting...</>
              ) : (
                <><CheckCircle2 size={16} /> Submit Decision</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}