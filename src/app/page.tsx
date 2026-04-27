"use client";

import Link from "next/link";
import UserDropdown from "@/components/UserDropdown";
import { motion } from "framer-motion";
import { Timer, Landmark, ShieldAlert } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050508] text-zinc-200 overflow-x-hidden selection:bg-purple-500/30">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
         {/* The user's eye image background */}
         <div className="absolute inset-0 bg-[url('/eye-bg.jpg')] bg-cover bg-center bg-no-repeat opacity-70 blur-[3px]"></div>
         
         {/* Very subtle dark overlay */}
         <div className="absolute inset-0 bg-black/30"></div>
         
         {/* Subtle ambient lighting */}
         <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[150px] animate-blob mix-blend-screen"></div>
         <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-fuchsia-900/10 rounded-full blur-[150px] animate-blob-slow mix-blend-screen"></div>
      </div>

      {/* Modern Navigation */}
      <nav className="fixed w-full z-50 glass-panel border-b-0 border-purple-900/10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="font-black text-2xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-500 hover:drop-shadow-[0_0_10px_rgba(217,70,239,0.8)] transition-all cursor-default">
            NYXUS
          </div>
          <div className="hidden md:flex gap-8 text-xs uppercase tracking-widest font-semibold text-zinc-400">
             <a href="#features" className="hover:text-fuchsia-400 transition-colors">Features</a>
             <a href="#reviews" className="hover:text-fuchsia-400 transition-colors">Testimonials</a>
             <a href="#faq" className="hover:text-fuchsia-400 transition-colors">FAQ</a>
             <a href="#pricing" className="hover:text-fuchsia-400 transition-colors">Pricing</a>
             <Link href="/support" className="hover:text-fuchsia-400 transition-colors">Support</Link>
          </div>
          <UserDropdown />
        </div>
      </nav>

      <main className="relative z-10">
        {/* HERO SECTION */}
        <section className="pt-40 pb-32 px-6 max-w-7xl mx-auto min-h-[90vh] flex flex-col justify-center items-center text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block py-1 px-3 rounded-full border border-purple-500/30 bg-purple-900/10 text-purple-300 text-xs font-mono mb-8 animate-pulse"
          >
            V 2.0 PROTOCOL INITIATED — ENCRYPTION ACTIVE
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-8 leading-tight"
          >
             TOTAL PRIVACY. <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-fuchsia-500 to-purple-500 animate-gradient-x drop-shadow-[0_0_20px_rgba(217,70,239,0.4)]">Zero Trace.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="max-w-2xl text-lg text-zinc-400 mb-12 leading-relaxed text-left"
          >
            The next generation of anonymous communication. Deploy self-destructing phantom chats with OTPs, or maintain heavily monitored permanent vaults equipped with state-of-the-art safety APIs.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-6"
          >
             <Link href="/auth" className="px-8 py-4 bg-gradient-to-r from-purple-700 to-fuchsia-600 hover:from-purple-600 hover:to-fuchsia-500 text-white font-bold tracking-widest text-sm rounded-lg shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] transition-all hover:-translate-y-1 backdrop-blur-md">
               INITIALIZE CONNECTION
             </Link>
             <a href="#features" className="px-8 py-4 bg-zinc-900/40 border border-zinc-700/50 hover:border-purple-500/50 hover:bg-zinc-800/80 text-zinc-300 font-bold tracking-widest text-sm rounded-lg transition-all backdrop-blur-md">
               NYXUS PROTOCOLS
             </a>
          </motion.div>
        </section>

        {/* MARQUEE */}
        <div className="border-y border-purple-900/30 bg-black/40 overflow-hidden py-4">
           <div className="flex whitespace-nowrap animate-marquee">
              <span className="text-purple-400/50 font-black text-3xl mx-8 tracking-widest uppercase">Encryption Active • No Logs Maintained • Untraceable Footprint • Automated Nuking • Total Anonymity •</span>
              <span className="text-purple-400/50 font-black text-3xl mx-8 tracking-widest uppercase">Encryption Active • No Logs Maintained • Untraceable Footprint • Automated Nuking • Total Anonymity •</span>
           </div>
        </div>

        {/* FEATURES SECTION */}
        <section id="features" className="py-32 px-6 max-w-7xl mx-auto">
          <h2 className="text-4xl text-center font-black tracking-widest mb-20 text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500">SYSTEM ARCHITECTURE</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-panel p-8 rounded-2xl hover:border-purple-500/50 transition-colors group">
               <motion.div 
                 initial={{ scale: 0.8, opacity: 0.5 }}
                 whileInView={{ scale: 1.3, opacity: 1 }}
                 transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
                 viewport={{ once: false, amount: 0.5 }}
                 className="h-14 w-14 rounded-lg bg-fuchsia-900/30 border border-fuchsia-700/50 flex items-center justify-center mb-10 mx-auto shadow-[0_0_15px_rgba(217,70,239,0.3)]"
               >
                 <Timer className="w-7 h-7 text-fuchsia-400" />
               </motion.div>
               <h3 className="text-xl font-bold mb-4 text-white text-center">Phantom Vaults</h3>
               <p className="text-zinc-400 text-sm leading-relaxed">Temporary spaces generated with rigorous timer controls. Once the countdown expires, the room is permanently eradicated. Access granted via precise 6-digit OTPs.</p>
            </div>
            <div className="glass-panel p-8 rounded-2xl hover:border-purple-500/50 transition-colors group">
               <motion.div 
                 initial={{ scale: 0.8, opacity: 0.5 }}
                 whileInView={{ scale: 1.3, opacity: 1 }}
                 transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
                 viewport={{ once: false, amount: 0.5 }}
                 className="h-14 w-14 rounded-lg bg-purple-900/30 border border-purple-700/50 flex items-center justify-center mb-10 mx-auto shadow-[0_0_15px_rgba(168,85,247,0.3)]"
               >
                 <Landmark className="w-7 h-7 text-purple-400" />
               </motion.div>
               <h3 className="text-xl font-bold mb-4 text-white text-center">Permanent Hubs</h3>
               <p className="text-zinc-400 text-sm leading-relaxed">Establish enduring communities. Secured by an aggressive backend Safety API that actively intercepts, logs, and annihilates toxic behavior instantly before it hits the DB.</p>
            </div>
            <div className="glass-panel p-8 rounded-2xl hover:border-purple-500/50 transition-colors group">
               <motion.div 
                 initial={{ scale: 0.8, opacity: 0.5 }}
                 whileInView={{ scale: 1.3, opacity: 1 }}
                 transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
                 viewport={{ once: false, amount: 0.5 }}
                 className="h-14 w-14 rounded-lg bg-red-900/30 border border-red-700/50 flex items-center justify-center mb-10 mx-auto shadow-[0_0_15px_rgba(239,68,68,0.3)]"
               >
                 <ShieldAlert className="w-7 h-7 text-red-400" />
               </motion.div>
               <h3 className="text-xl font-bold mb-4 text-white text-center">Admin Override</h3>
               <p className="text-zinc-400 text-sm leading-relaxed">System-wide surveillance and control protocols allowed exclusively for verified internal Developer Nodes. Banish malicious actors universally.</p>
            </div>
          </div>
        </section>

        {/* NETWORK IMAGE DIVIDER */}
        <section className="relative w-full overflow-hidden bg-black py-10 border-y border-purple-900/20">
           <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent pointer-events-none z-10"></div>
           <img src="/cyber-network.png" alt="Dark Web Terminal Network" className="w-full h-96 object-cover opacity-60 mix-blend-screen" />
        </section>

        {/* CUSTOMER REVIEWS */}
        <section id="reviews" className="py-32 bg-black/60 border-y border-purple-900/20 relative">
          <div className="max-w-7xl mx-auto px-6">
             <h2 className="text-4xl md:text-5xl font-black mb-16 px-4 border-l-4 border-fuchsia-600">VOICES FROM THE NYXUS</h2>
             <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { user: "Cipher_X", text: "The timed annihilation feature on Phantom chats is flawless. Best tool we've used in years." },
                  { user: "NullSector", text: "Safety API integration is rapid. I tried injecting bad packets into a permanent vault and got instantly walled." },
                  { user: "AnonGhost", text: "Sleek, dark, elegant. It does exactly what it says: leaves zero trace. A true 10/10 app." },
                  { user: "ByteBandit", text: "The OTP bypass layer is very secure. I wouldn't trust any other vault for my communications." }
                ].map((r, i) => (
                  <div key={i} className="bg-zinc-900/40 p-6 border border-zinc-800 rounded-lg hover:border-fuchsia-500/30 hover:bg-zinc-800/60 transition-all cursor-default">
                     <div className="flex text-fuchsia-500 mb-4 text-lg">★★★★★</div>
                     <p className="text-zinc-300 text-sm leading-relaxed italic mb-6">&quot;{r.text}&quot;</p>
                     <p className="text-xs font-mono text-fuchsia-400 font-bold">— {r.user}</p>
                  </div>
                ))}
             </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="py-32 px-6 max-w-5xl mx-auto">
          <h2 className="text-4xl text-center font-black tracking-widest mb-16">ACCESS TIERS</h2>
          <div className="grid md:grid-cols-2 gap-8">
             <motion.div 
               initial={{ opacity: 0, x: -50 }}
               whileInView={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.6 }}
               viewport={{ once: true }}
               className="glass-panel p-8 rounded-2xl border border-purple-900/50 hover:border-fuchsia-500/50 transition-all flex flex-col justify-between"
             >
                <div>
                   <h3 className="text-2xl font-bold text-white mb-2">Standard Grid</h3>
                   <div className="text-fuchsia-500 font-black text-4xl mb-6">Free</div>
                   <p className="text-zinc-400 text-sm mb-6 leading-relaxed">Essential anonymity for standard operations. Perfect for temporary exchanges and verified permanent hubs.</p>
                   <ul className="space-y-3 text-sm text-zinc-300 mb-8">
                      <li className="flex items-center gap-2"><span className="text-fuchsia-500">✓</span> Ephemeral Phantom Chats</li>
                      <li className="flex items-center gap-2"><span className="text-fuchsia-500">✓</span> Permanent Vault Creation</li>
                      <li className="flex items-center gap-2"><span className="text-fuchsia-500">✓</span> OTP Secure Entry</li>
                      <li className="flex items-center gap-2"><span className="text-purple-400">⚡</span> Safety API Moderated</li>
                   </ul>
                </div>
                <Link href="/auth" className="block text-center w-full py-3 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/50 hover:border-purple-500/50 text-white font-bold tracking-widest text-sm rounded transition-all">
                   ENTER FREE TIER
                </Link>
             </motion.div>
             <motion.div 
               initial={{ opacity: 0, x: 50 }}
               whileInView={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.6 }}
               viewport={{ once: true }}
               className="glass-panel p-8 rounded-2xl border border-red-900/50 hover:border-red-500/50 transition-all flex flex-col justify-between relative overflow-hidden group"
             >
                <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-black tracking-widest py-1 px-8 translate-x-8 translate-y-4 rotate-45 shadow-[0_0_10px_rgba(220,38,38,0.8)]">UNHINGED</div>
                <div>
                   <h3 className="text-2xl font-bold text-red-400 mb-2">Syndicate Protocol</h3>
                   <div className="text-red-500 font-black text-4xl mb-6">$299<span className="text-lg text-zinc-500 font-normal">/3 months</span></div>
                   <p className="text-zinc-400 text-sm mb-6 leading-relaxed">Absolute, uncompromised freedom. By passing the Safety API entirely. For those who require total operational silence.</p>
                   <ul className="space-y-3 text-sm text-zinc-300 mb-8">
                      <li className="flex items-center gap-2"><span className="text-red-500">✓</span> Everything in Standard Grid</li>
                      <li className="flex items-center gap-2"><span className="text-red-500">✓</span> Priority Node Routing</li>
                      <li className="flex items-center gap-2 text-white font-bold"><span className="text-red-500 text-lg">☠</span> Totally UNHINGED Phantom Chats</li>
                      <li className="flex items-center gap-2"><span className="text-red-500">✓</span> Zero Heuristic Filtering</li>
                   </ul>
                </div>
                <a href="/checkout" className="block text-center w-full py-3 bg-gradient-to-r from-red-900 to-red-950 hover:from-red-800 hover:to-red-900 border border-red-700/50 text-white font-bold tracking-widest text-sm rounded shadow-[0_0_15px_rgba(220,38,38,0.3)] transition-all">
                   ACQUIRE CLEARANCE
                </a>
             </motion.div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-32 px-6 max-w-4xl mx-auto">
          <h2 className="text-4xl text-center font-black tracking-widest mb-16">FREQUENTLY ASKED QUESTIONS</h2>
          <div className="space-y-4">
            {[
              { q: "Is the Safety API active on Phantom Chats?", a: "Yes, for standard users. While messages are ephemeral and leave no trace, the Safety API actively intercepts illegal operations in real-time. Unhinged (unfiltered) access is only available on the Syndicate Protocol premium tier." },
              { q: "Can I retrieve heavily nuked messages?", a: "Absolutely not. They are purged from the memory buffers entirely. Once the vault expires, the data ceases to exist." },
              { q: "Who manages the Permanent Vaults?", a: "The user who registers the Vault holds Maker priority, granting them exclusive privileges to locally blackout users from their room." }
            ].map((faq, i) => (
               <div key={i} className="border border-purple-900/30 bg-black/60 p-6 rounded-lg group hover:border-fuchsia-600/50 transition-all">
                  <h4 className="text-lg font-bold text-white mb-2 font-mono drop-shadow-md">{faq.q}</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed">{faq.a}</p>
               </div>
            ))}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-purple-900/30 bg-black pt-16 pb-8 relative z-10">
         <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2">
               <h3 className="font-black text-2xl tracking-widest text-fuchsia-500 mb-4">NYXUS</h3>
               <p className="text-zinc-500 text-sm max-w-sm">Providing absolute asynchronous anonymity since inception. Secure your data, leave no footprints, build communities in the shadows.</p>
            </div>
            <div>
               <h4 className="text-white font-bold tracking-widest mb-4">PLATFORM</h4>
               <ul className="space-y-2 text-zinc-400 text-sm">
                  <li><a href="#features" className="hover:text-fuchsia-400 transition-colors">Features</a></li>
                  <li><a href="#reviews" className="hover:text-fuchsia-400 transition-colors">Testimonials</a></li>
                  <li><Link href="/auth" className="hover:text-fuchsia-400 transition-colors">Secure Login</Link></li>
               </ul>
            </div>
            <div>
               <h4 className="text-white font-bold tracking-widest mb-4">ASSISTANCE</h4>
               <ul className="space-y-2 text-zinc-400 text-sm">
                  <li><Link href="/support" className="hover:text-fuchsia-400 transition-colors">Help & Support</Link></li>
                  <li><a href="#faq" className="hover:text-fuchsia-400 transition-colors">FAQ</a></li>
                  <li><span className="cursor-not-allowed text-zinc-600">Service Status</span></li>
               </ul>
            </div>
         </div>
         <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-zinc-900 text-center text-zinc-600 text-xs flex flex-col md:flex-row justify-between items-center">
            <p>© {new Date().getFullYear()} NYXUS PROTOCOL. All automated rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
               <span className="hover:text-zinc-400 cursor-pointer">Privacy Policy</span>
               <span className="hover:text-zinc-400 cursor-pointer">Terms of Service</span>
            </div>
         </div>
      </footer>
    </div>
  );
}
