"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DevDashboard() {
  const router = useRouter();
  const [logs, setLogs] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [supportQueries, setSupportQueries] = useState<any[]>([]);
  const [banInput, setBanInput] = useState("");
  const [user, setUser] = useState<any>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const svUser = localStorage.getItem("sv_user");
    if (!svUser) return router.push("/");
    const parsed = JSON.parse(svUser);
    if (parsed.role !== "dev") return router.push("/dashboard");
    setUser(parsed);
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    const res = await fetch("/api/dev/logs");
    const data = await res.json();
    if (res.ok) {
      setLogs(data.logs || []);
      setFeedbacks(data.feedbacks || []);
      setSupportQueries(data.supportQueries || []);
    }
  };

  const handleBan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!banInput.trim()) return;
    const res = await fetch("/api/dev/ban", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ username: banInput })
    });
    const data = await res.json();
    if (res.ok) {
       setStatus(`Success: ${data.message}`);
       setBanInput("");
    } else {
       setStatus(`Error: ${data.error}`);
    }
  };

  const initiateBulkBan = () => {
    setShowConfirm(true);
  };

  const handleBulkBan = async () => {
    setShowConfirm(false);
    const res = await fetch("/api/dev/ban-all", { method: "POST" });
    const data = await res.json();
    if (res.ok) {
       setStatus(data.message);
    } else {
       setStatus(`Error: ${data.error}`);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#050508] p-8 text-zinc-200">
       <div className="max-w-6xl mx-auto space-y-8">
          <header className="flex justify-between items-center border-b border-red-900/40 pb-6 relative">
             <div>
                <h1 className="text-3xl font-black tracking-widest text-red-500">SYSTEM OVERRIDE</h1>
                <p className="text-red-400 mt-1">Developer Admin Panel</p>
             </div>
             <button onClick={() => router.push("/dashboard")} className="text-sm text-red-400 hover:text-white border border-red-900/40 px-4 py-2 rounded">
                 Back to Dashboard
             </button>
          </header>

          <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <section className="bg-black/60 border border-red-900/30 rounded-xl p-6">
                <h2 className="text-xl font-bold text-red-400 mb-4">Global Execution</h2>
                <p className="text-xs text-zinc-400 mb-6 font-mono">Permanently ban any user identity from the Shadow Vault network.</p>
                <form onSubmit={handleBan} className="flex gap-2">
                   <input type="text" value={banInput} onChange={e => setBanInput(e.target.value)} placeholder="Target Username" className="flex-1 bg-zinc-900 border border-red-900/50 rounded lg px-4 py-2 text-sm outline-none text-white focus:border-red-500" />
                   <button type="submit" className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-2 rounded">EXECUTE BAN</button>
                </form>
             </section>

             {/* Feedbacks Section */}
             <section className="bg-black/60 border border-fuchsia-900/30 rounded-xl p-6 flex flex-col relative overflow-hidden mb-6">
                <div className="absolute top-0 right-0 bg-fuchsia-900/5 blur-3xl w-full h-full pointer-events-none"></div>
                
                <h2 className="text-xl font-bold text-fuchsia-400 mb-1 relative z-10">User Feedbacks</h2>
                <p className="text-xs text-zinc-400 font-mono mb-6 relative z-10">Direct submissions from the global grid.</p>

                <div className="flex-1 overflow-y-auto space-y-3 relative z-10 max-h-[30vh] pr-2">
                   {feedbacks.slice().reverse().map((fb, i) => (
                      <div key={i} className="bg-zinc-950 p-4 rounded-lg border border-fuchsia-900/20 shadow-md">
                         <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
                            <span className="font-mono text-zinc-200 text-sm">User: <span className="font-bold text-fuchsia-400">{fb.username}</span></span>
                            <span className="text-xs text-zinc-500 font-mono mt-1 sm:mt-0">{new Date(fb.timestamp).toLocaleString()}</span>
                         </div>
                         <p className="text-sm font-mono text-fuchsia-200 bg-fuchsia-950/20 p-2 border-l-2 border-fuchsia-500">
                           "{fb.text}"
                         </p>
                      </div>
                   ))}
                   {feedbacks.length === 0 && <p className="text-sm text-zinc-600 italic">No feedback received yet.</p>}
                </div>
             </section>

             {/* Support Queries Section */}
             <section className="bg-black/60 border border-purple-900/30 rounded-xl p-6 flex flex-col relative overflow-hidden mb-6">
                <div className="absolute top-0 right-0 bg-purple-900/5 blur-3xl w-full h-full pointer-events-none"></div>
                
                <h2 className="text-xl font-bold text-purple-400 mb-1 relative z-10">Support Transmissions</h2>
                <p className="text-xs text-zinc-400 font-mono mb-6 relative z-10">Inbound queries from the encrypted contact node.</p>

                <div className="flex-1 overflow-y-auto space-y-4 relative z-10 max-h-[40vh] pr-2">
                   {supportQueries.slice().reverse().map((q, i) => (
                      <div key={i} className="bg-zinc-950 p-5 rounded-lg border border-purple-900/20 shadow-md">
                         <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2">
                            <div>
                               <p className="text-sm font-bold text-white uppercase tracking-wider">{q.subject}</p>
                               <p className="text-[10px] text-purple-400 font-mono">{q.email}</p>
                            </div>
                            <div className="text-right">
                               <span className="text-[10px] bg-purple-900/40 text-purple-200 px-2 py-1 rounded-full">{new Date(q.timestamp).toLocaleString()}</span>
                               <p className={`text-[10px] mt-1 font-black ${q.status === 'open' ? 'text-red-500' : 'text-emerald-500'}`}>STATUS: {q.status?.toUpperCase() || 'OPEN'}</p>
                            </div>
                         </div>
                         <div className="text-sm font-mono text-zinc-300 bg-zinc-900/50 p-3 border-l-2 border-purple-500 rounded-r">
                           {q.message}
                         </div>
                      </div>
                   ))}
                   {supportQueries.length === 0 && <p className="text-sm text-zinc-600 italic">No inbound transmissions detected.</p>}
                </div>
             </section>

             <section className="bg-black/60 border border-red-900/30 rounded-xl p-6 flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-red-900/10 blur-3xl w-full h-full pointer-events-none"></div>
                
                <div className="flex justify-between items-start mb-6 relative z-10">
                   <div>
                     <h2 className="text-xl font-bold text-red-400 mb-1">Safety API Incidents</h2>
                     <p className="text-xs text-zinc-400 font-mono">Intercepted packets from the permanent vault heuristic filters.</p>
                   </div>
                   <button onClick={initiateBulkBan} className="bg-red-900/40 hover:bg-red-800 text-red-200 border border-red-700 shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-all px-4 py-2 rounded text-xs font-bold tracking-widest">
                      BANISH ALL VIOLATORS
                   </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 relative z-10 max-h-[60vh] pr-2">
                   {logs.slice().reverse().map((log, i) => (
                      <div key={i} className="bg-zinc-950 p-4 rounded-lg border border-red-900/40 shadow-md">
                         <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 pb-2 border-b border-red-900/20">
                            <span className="font-mono text-zinc-200 text-sm">Target Identity: <span className="font-bold text-red-400 uppercase tracking-widest">{log.username}</span></span>
                            <span className="text-xs text-zinc-500 font-mono mt-1 sm:mt-0">{new Date(log.timestamp).toLocaleString()} • {log.communityId}</span>
                         </div>
                         <p className="text-sm font-mono text-red-200 bg-red-950/30 p-2 border-l-2 border-red-500">
                           <span className="text-red-500 mr-2">{"[INTERCEPTED]:"}</span>"{log.message}"
                         </p>
                      </div>
                   ))}
                   {logs.length === 0 && <p className="text-sm text-zinc-600 italic">No violations detected in the global grid.</p>}
                </div>
             </section>
          </main>
       </div>

     {/* Status Modal */}
     {status && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[200] backdrop-blur-md">
          <div className="bg-[#050508] border border-zinc-700/50 p-8 rounded-2xl max-w-sm w-full text-center shadow-2xl">
            <h3 className="text-xl font-black tracking-widest text-white mb-2 uppercase">System Update</h3>
            <p className="text-sm text-zinc-400 mb-8 leading-relaxed font-mono">
              {status}
            </p>
            <button onClick={() => setStatus(null)} className="w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded text-sm font-bold tracking-widest transition-all">
              ACKNOWLEDGE
            </button>
          </div>
        </div>
     )}

     {/* Bulk Ban Confirmation Modal */}
     {showConfirm && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[200] backdrop-blur-md">
          <div className="bg-[#050508] border border-red-600/50 p-8 rounded-2xl max-w-md w-full text-center shadow-[0_0_50px_rgba(220,38,38,0.3)] animate-shake">
            <div className="w-20 h-20 bg-red-900/20 border border-red-500/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-2xl font-black tracking-tighter text-red-500 mb-2 uppercase">TERMINATION PROTOCOL</h3>
            <p className="text-sm text-zinc-400 mb-8 leading-relaxed font-mono">
              WARNING: Are you sure you want to permanently ban ALL users found in the Safety Logs? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button onClick={() => setShowConfirm(false)} className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 py-3 rounded font-bold tracking-widest text-xs transition-all">
                ABORT
              </button>
              <button onClick={handleBulkBan} className="flex-1 bg-red-700 hover:bg-red-600 text-white py-3 rounded font-bold tracking-widest text-xs transition-all shadow-lg shadow-red-900/50">
                CONFIRM BANISHMENT
              </button>
            </div>
          </div>
        </div>
     )}
   </div>
  );
}
