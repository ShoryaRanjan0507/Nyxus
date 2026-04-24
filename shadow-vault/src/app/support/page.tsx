"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, MessageSquare, Send, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function SupportPage() {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, subject, message }),
      });

      if (res.ok) {
        setStatus("Your transmission has been received by Shadow Command. We will respond if necessary.");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        throw new Error("Failed to transmit query.");
      }
    } catch (err) {
      setStatus("CRITICAL ERROR: Failed to reach support node.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] text-zinc-200 selection:bg-purple-500/30">
      <nav className="fixed w-full z-50 glass-panel backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="font-black text-2xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-500">
            SHADOW VAULT
          </Link>
          <Link href="/" className="text-xs uppercase tracking-widest font-semibold text-zinc-400 hover:text-fuchsia-400 transition-colors">
            Back to Grid
          </Link>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-black text-white tracking-tighter mb-4">SHADOW SUPPORT</h1>
          <p className="text-zinc-400 text-lg">Encrypted communication channel with our technical operative nodes.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12">
          <div className="space-y-8">
            <div>
               <h3 className="text-fuchsia-400 font-bold uppercase tracking-widest text-xs mb-4">Contact Protocols</h3>
               <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm text-zinc-300">
                     <Mail className="w-4 h-4 text-purple-500" />
                     formywork387@gmail.com
                  </div>
                  <div className="flex items-center gap-3 text-sm text-zinc-300">
                     <MessageSquare className="w-4 h-4 text-purple-500" />
                     Encrypted Direct Channel
                  </div>
                  <div className="flex items-center gap-3 text-sm text-zinc-300">
                     <ShieldCheck className="w-4 h-4 text-purple-500" />
                     256-bit AES Submissions
                  </div>
               </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="glass-panel p-8 rounded-2xl border border-purple-900/30">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-fuchsia-500/80 mb-2 pl-1">Return Identifier (Email)</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/50 border border-fuchsia-900/40 rounded-xl px-4 py-3 text-zinc-200 outline-none focus:border-fuchsia-500/70 focus:bg-fuchsia-950/20 transition-all"
                    placeholder="agent@encrypted.net"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-fuchsia-500/80 mb-2 pl-1">Query Subject</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-black/50 border border-fuchsia-900/40 rounded-xl px-4 py-3 text-zinc-200 outline-none focus:border-fuchsia-500/70 focus:bg-fuchsia-950/20 transition-all"
                    placeholder="Technical Assistance / Access Issue"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-fuchsia-500/80 mb-2 pl-1">Detailed Transmission</label>
                  <textarea
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    className="w-full bg-black/50 border border-fuchsia-900/40 rounded-xl px-4 py-3 text-zinc-200 outline-none focus:border-fuchsia-500/70 focus:bg-fuchsia-950/20 transition-all resize-none"
                    placeholder="Detail your request for the shadow nodes..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-700 to-fuchsia-600 hover:from-purple-600 hover:to-fuchsia-500 text-white font-bold py-4 rounded-xl tracking-widest text-sm transition-all shadow-lg shadow-purple-900/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? "TRANSMITTING..." : (
                    <>
                      <Send className="w-4 h-4" />
                      INITIATE TRANSMISSION
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Status Modal */}
      {status && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] backdrop-blur-md p-4">
          <div className="bg-[#050508] border border-fuchsia-500/50 p-8 rounded-2xl max-w-sm w-full text-center shadow-2xl">
            <div className="w-16 h-16 bg-fuchsia-950/30 border border-fuchsia-500/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-fuchsia-500" />
            </div>
            <h3 className="text-xl font-black tracking-widest text-white mb-2 uppercase">Transmission Status</h3>
            <p className="text-sm text-zinc-400 mb-8 leading-relaxed">
              {status}
            </p>
            <button onClick={() => setStatus(null)} className="w-full bg-fuchsia-900/40 hover:bg-fuchsia-800/60 border border-fuchsia-700/50 text-fuchsia-200 px-4 py-3 rounded text-sm font-bold tracking-widest transition-all uppercase">
              Acknowledge
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
