"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function UserDropdown() {
  const [user, setUser] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [reportId, setReportId] = useState("");
  const [reportReason, setReportReason] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const svUser = localStorage.getItem("sv_user");
    if (svUser) {
      setUser(JSON.parse(svUser));
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("sv_user");
    setUser(null);
    setIsOpen(false);
    router.push("/");
  };

  const submitFeedback = async () => {
    if (!feedbackText.trim()) return;
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: user.username, text: feedbackText })
    });
    if (res.ok) {
      setStatus("Feedback submitted successfully!");
      setShowFeedbackModal(false);
      setFeedbackText("");
      setIsOpen(false);
    }
  };

  const submitReport = async () => {
    if (!reportId.trim() || !reportReason.trim()) return;
    const res = await fetch("/api/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reporter: user.username, reportedId: reportId, reason: reportReason })
    });
    if (res.ok) {
      setStatus("User reported successfully. Our Dev Team will review this.");
      setShowReportModal(false);
      setReportId("");
      setReportReason("");
      setIsOpen(false);
    }
  };

  if (!user) {
    return (
      <Link href="/auth" className="relative group px-6 py-2 border border-fuchsia-700/50 hover:border-fuchsia-400 rounded bg-fuchsia-950/20 transition-all font-bold tracking-widest text-xs uppercase overflow-hidden">
        <div className="absolute inset-0 bg-fuchsia-500/20 translate-x-[-100%] group-hover:translate-x-[0%] transition-transform duration-500 ease-out"></div>
        <span className="relative z-10 text-fuchsia-300 group-hover:text-white drop-shadow-[0_0_5px_rgba(217,70,239,0.5)]">Enter Vault</span>
      </Link>
    );
  }

  // Generate random avatar gradient based on username length
  const colors = [
    "from-purple-500 to-fuchsia-500",
    "from-red-500 to-orange-500",
    "from-blue-500 to-purple-500",
    "from-emerald-500 to-teal-500"
  ];
  const color = colors[user.username.length % colors.length];
  const initial = user.username.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-10 h-10 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-lg shadow-[0_0_10px_rgba(217,70,239,0.3)] hover:shadow-[0_0_15px_rgba(217,70,239,0.6)] transition-all transform hover:scale-105`}
      >
        {initial}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-56 bg-zinc-950/90 backdrop-blur-xl border border-fuchsia-900/40 rounded-xl shadow-2xl py-2 z-50 animate-fade-in text-sm font-sans">
          <div className="px-4 py-3 border-b border-zinc-800 mb-2">
            <p className="text-zinc-400 text-xs tracking-widest uppercase mb-1">Logged in as</p>
            <p className="text-white font-bold truncate">{user.username}</p>
          </div>
          
          {pathname !== "/" && (
            <Link href="/" className="block px-4 py-2 text-zinc-300 hover:bg-fuchsia-900/30 hover:text-fuchsia-300 transition-colors">
              Home Page
            </Link>
          )}

          <Link href="/dashboard" className="block px-4 py-2 text-zinc-300 hover:bg-fuchsia-900/30 hover:text-fuchsia-300 transition-colors">
            Vault Dashboard
          </Link>
          <Link href="/checkout" className="block px-4 py-2 text-zinc-300 hover:bg-fuchsia-900/30 hover:text-fuchsia-300 transition-colors">
            Upgrade Premium
          </Link>
          <Link href="/support" className="block px-4 py-2 text-zinc-300 hover:bg-fuchsia-900/30 hover:text-fuchsia-300 transition-colors">
            Help & Support
          </Link>
          
          <button onClick={() => setShowFeedbackModal(true)} className="w-full text-left px-4 py-2 text-zinc-300 hover:bg-fuchsia-900/30 hover:text-fuchsia-300 transition-colors">
            Give Feedback
          </button>
          <button onClick={() => setShowReportModal(true)} className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-900/30 transition-colors">
            Report User
          </button>

          {user.role === 'dev' && (
            <Link href="/dev/dashboard" className="block px-4 py-2 mt-2 border-t border-zinc-800 text-red-400 font-bold tracking-widest text-xs hover:bg-red-900/20 transition-colors">
              DEV PANEL
            </Link>
          )}

          <div className="px-3 pt-2 mt-2 border-t border-zinc-800">
             <button onClick={handleLogout} className="w-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 py-2 rounded text-xs tracking-widest font-bold transition-colors">
               DISCONNECT
             </button>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] backdrop-blur-sm">
           <div className="bg-[#050508] border border-fuchsia-900/50 p-6 rounded-2xl w-full max-w-md shadow-2xl">
              <h3 className="text-xl font-bold text-fuchsia-400 mb-4 tracking-widest">SUBMIT FEEDBACK</h3>
              <textarea 
                 value={feedbackText}
                 onChange={(e) => setFeedbackText(e.target.value)}
                 className="w-full bg-zinc-900/80 border border-zinc-700 rounded p-3 text-zinc-200 outline-none focus:border-fuchsia-500 min-h-[100px] mb-4"
                 placeholder="How can we improve Shadow Vault?"
              ></textarea>
              <div className="flex justify-end gap-3">
                 <button onClick={() => setShowFeedbackModal(false)} className="px-4 py-2 text-zinc-400 hover:text-white transition-colors">Cancel</button>
                 <button onClick={submitFeedback} className="px-6 py-2 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded font-bold shadow-[0_0_15px_rgba(217,70,239,0.3)]">Submit</button>
              </div>
           </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] backdrop-blur-sm">
           <div className="bg-[#050508] border border-red-900/50 p-6 rounded-2xl w-full max-w-md shadow-2xl">
              <h3 className="text-xl font-bold text-red-500 mb-4 tracking-widest">REPORT MALICIOUS USER</h3>
              <p className="text-xs text-zinc-400 mb-4">Reports are sent directly to the Dev Panel for immediate evaluation.</p>
              
              <label className="block text-xs uppercase text-zinc-500 mb-1">Target ID</label>
              <input 
                 type="text"
                 value={reportId}
                 onChange={(e) => setReportId(e.target.value)}
                 className="w-full bg-zinc-900/80 border border-zinc-700 rounded p-3 text-zinc-200 outline-none focus:border-red-500 mb-4"
                 placeholder="e.g. nfs@69"
              />
              
              <label className="block text-xs uppercase text-zinc-500 mb-1">Reason for Report</label>
              <textarea 
                 value={reportReason}
                 onChange={(e) => setReportReason(e.target.value)}
                 className="w-full bg-zinc-900/80 border border-zinc-700 rounded p-3 text-zinc-200 outline-none focus:border-red-500 min-h-[100px] mb-4"
                 placeholder="Please provide specific details..."
              ></textarea>
              
              <div className="flex justify-end gap-3">
                 <button onClick={() => setShowReportModal(false)} className="px-4 py-2 text-zinc-400 hover:text-white transition-colors">Cancel</button>
                 <button onClick={submitReport} className="px-6 py-2 bg-red-700 hover:bg-red-600 text-white rounded font-bold shadow-[0_0_15px_rgba(220,38,38,0.3)]">Report to Devs</button>
              </div>
           </div>
        </div>
      )}

      {/* Success Status Modal */}
      {status && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[200] backdrop-blur-md">
          <div className="bg-[#050508] border border-emerald-500/50 p-8 rounded-2xl max-w-sm w-full text-center shadow-[0_0_30px_rgba(16,185,129,0.2)]">
            <div className="w-16 h-16 bg-emerald-950/30 border border-emerald-500/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-black tracking-widest text-emerald-500 mb-2 uppercase">Success</h3>
            <p className="text-sm text-zinc-400 mb-8 leading-relaxed">
              {status}
            </p>
            <button onClick={() => setStatus(null)} className="w-full bg-emerald-900/40 hover:bg-emerald-800/60 border border-emerald-700/50 text-emerald-200 px-4 py-3 rounded text-sm font-bold tracking-widest transition-all uppercase">
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
