"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("sv_user");
    if (user) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setStatus("");
    setLoading(true);

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      if (isLogin) {
        localStorage.setItem("sv_user", JSON.stringify(data.user));
        router.push("/dashboard");
      } else {
        setIsLogin(true);
        setStatus("Identity Registered! Please access the Nyxus terminal.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#050508]">
      <Link href="/" className="absolute top-8 left-8 text-zinc-500 hover:text-purple-400 z-50 text-sm tracking-widest uppercase transition-colors">
        ← Back to Grid
      </Link>
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-900/40 rounded-full blur-[120px] pointer-events-none animate-blob"></div>

      <div className="w-full max-w-md p-8 rounded-2xl glass-panel shadow-2xl relative z-10 transition-all">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-600 tracking-widest drop-shadow-[0_0_15px_rgba(147,51,234,0.5)]">
            NYXUS
          </h1>
          <p className="text-purple-400/60 text-xs mt-2 uppercase tracking-[0.2em]">Secure Terminal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
             <label className="block text-fuchsia-500/80 text-[10px] uppercase tracking-widest font-bold mb-1 pl-1">Identity Alias</label>
             <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black/50 border border-fuchsia-900/40 rounded-xl px-4 py-3 text-zinc-200 outline-none focus:border-fuchsia-500/70 focus:bg-fuchsia-950/20 transition-all shadow-inner"
                placeholder="Agent Designation"
             />
          </div>
          <div>
             <label className="block text-fuchsia-500/80 text-[10px] uppercase tracking-widest font-bold mb-1 pl-1">Passkey</label>
             <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-fuchsia-900/40 rounded-xl px-4 py-3 text-zinc-200 outline-none focus:border-fuchsia-500/70 focus:bg-fuchsia-950/20 transition-all shadow-inner"
                placeholder="••••••••"
             />
          </div>

          {(error || status) && (
            <div className={`border ${error ? "border-rose-900/50 bg-rose-950/30 text-rose-400" : "border-emerald-900/50 bg-emerald-950/30 text-emerald-400"} text-xs font-semibold p-3 rounded-lg text-center backdrop-blur-sm animate-pulse`}>
              {error || status}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full relative group overflow-hidden bg-zinc-900 border border-fuchsia-700 hover:border-fuchsia-400 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 mt-6"
          >
             <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-fuchsia-600/30 translate-x-[-100%] group-hover:translate-x-[0%] transition-transform duration-500 ease-out"></div>
             <span className="relative z-10 block tracking-widest text-sm drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
                {loading ? "Authenticating..." : isLogin ? "INITIATE LOGIN" : "REGISTER IDENTITY"}
             </span>
          </button>
        </form>

        <div className="mt-8 text-center border-t border-fuchsia-900/30 pt-6">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs text-zinc-500 hover:text-fuchsia-400 transition-colors uppercase tracking-widest"
          >
            {isLogin ? "Require Access? Register." : "Have Credentials? Login."}
          </button>
        </div>
      </div>
    </div>
  );
}
