"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [phantomChats, setPhantomChats] = useState<any[]>([]);
  const [permanentChats, setPermanentChats] = useState<any[]>([]);

  const [isCreatingPhantom, setIsCreatingPhantom] = useState(false);
  const [isCreatingPermanent, setIsCreatingPermanent] = useState(false);

  // Form states
  const [phantomMins, setPhantomMins] = useState("10");
  const [permName, setPermName] = useState("");

  const [joinModalId, setJoinModalId] = useState<string | null>(null);
  const [otpInput, setOtpInput] = useState("");
  const [newOtp, setNewOtp] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const svUser = localStorage.getItem("sv_user");
    if (!svUser) {
      router.push("/");
    } else {
      const parsedUser = JSON.parse(svUser);
      setUser(parsedUser);
      fetchChats(parsedUser.username);
    }
  }, [router]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const fetchChats = async (username: string) => {
    const res = await fetch(`/api/chats?username=${username}`);
    if (res.status === 403) {
      localStorage.removeItem("sv_user");
      router.push("/auth?banned=true");
      return;
    }
    const data = await res.json();
    if (res.ok && data) {
      setPhantomChats(data.phantomChats || []);
      setPermanentChats(data.permanentChats || []);
    }
  };

  const handleCreatePhantom = async () => {
    const res = await fetch("/api/chats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "phantom", creator: user.username, durationMinutes: phantomMins })
    });
    if (res.status === 403) {
      localStorage.removeItem("sv_user");
      router.push("/auth?banned=true");
      return;
    }
    const data = await res.json();
    if (res.ok) {
      setIsCreatingPhantom(false);
      // Give OTP to user via sleek modal
      setNewOtp(data.chat.otp);
      fetchChats(user.username);
    }
  };

  const handleCreatePermanent = async () => {
    const res = await fetch("/api/chats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "permanent", creator: user.username, name: permName })
    });
    if (res.status === 403) {
      localStorage.removeItem("sv_user");
      router.push("/auth?banned=true");
      return;
    }
    if (res.ok) {
      setIsCreatingPermanent(false);
      fetchChats(user.username);
    }
  };

  const joinPhantom = (chatId: string) => {
    // If not creator, ask for OTP via our simple local state
    const chat = phantomChats.find(c => c.id === chatId);
    if (chat.creator === user?.username) {
      // Bypass OTP for creator
      router.push(`/chat/phantom/${chatId}?otp=${chat.otp}`);
    } else {
      setJoinModalId(chatId);
    }
  };

  const submitOtpAndJoin = () => {
    if (joinModalId) {
      router.push(`/chat/phantom/${joinModalId}?otp=${otpInput}`);
    }
  };

  const logout = () => {
    localStorage.removeItem("sv_user");
    router.push("/");
  };

  if (!user) return <div className="min-h-screen bg-[#050508] flex items-center justify-center text-zinc-500">Loading Nyxus...</div>;

  return (
    <div className="min-h-screen bg-[#050508] p-8 text-zinc-200">
      <div className="max-w-6xl mx-auto space-y-10">

        <header className="flex justify-between items-end border-b border-purple-900/40 pb-6">
          <div>
            <h1 className="text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-600">
              NYXUS
            </h1>
            <p className="text-purple-400 mt-1">Logged in as <span className="text-white font-bold">{user.username}</span> {user.role === 'dev' && <span className="bg-red-900/50 text-red-400 text-xs px-2 py-1 rounded ml-2">DEV</span>}</p>
          </div>
          <div className="flex gap-4 mr-12">
            {user.role === 'dev' && (
              <button onClick={() => router.push("/dev/dashboard")} className="text-red-400 hover:text-red-300 text-sm border border-red-900/40 px-4 py-2 rounded-lg bg-red-950/20 transition-colors">
                Dev Panel
              </button>
            )}
            <button onClick={logout} className="text-zinc-400 hover:text-white text-sm">Log out</button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Phantom Chats Section */}
          <section className="bg-black/40 border border-purple-900/20 rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl"></div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-fuchsia-400">Phantom Chats</h2>
              <button
                onClick={() => setIsCreatingPhantom(!isCreatingPhantom)}
                className="bg-fuchsia-900/30 hover:bg-fuchsia-800/40 text-fuchsia-300 px-3 py-1.5 rounded text-sm transition-colors"
              >
                + New Phantom
              </button>
            </div>

            {isCreatingPhantom && (
              <div className="mb-6 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                <label className="block text-xs uppercase text-zinc-500 mb-2">Duration (Minutes)</label>
                <div className="flex gap-2">
                  <input type="number" min="1" value={phantomMins} onChange={e => setPhantomMins(e.target.value)} className="w-20 bg-black border border-zinc-700 rounded px-2 py-1 text-sm outline-none text-zinc-300" />
                  <button onClick={handleCreatePhantom} className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-sm px-4 rounded transition-colors">Create</button>
                </div>
              </div>
            )}

            <ul className="space-y-3">
              {phantomChats.map(chat => (
                <li key={chat.id} className="group bg-zinc-900/30 hover:bg-zinc-800/50 p-4 rounded-xl border border-zinc-800/50 hover:border-fuchsia-900/50 transition-all flex justify-between items-center cursor-pointer" onClick={() => joinPhantom(chat.id)}>
                  <div>
                    <span className="font-mono text-zinc-300">{chat.id}</span>
                    <p className="text-xs text-zinc-500 mt-1">Creator: {chat.creator}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-fuchsia-400/80 mb-1">Time Remaining: {Math.max(0, Math.floor((chat.expiresAt - Date.now()) / 60000))}m</p>
                    <span className="text-xs bg-fuchsia-900/20 text-fuchsia-400 px-2 py-1 rounded">Expiring</span>
                  </div>
                </li>
              ))}
              {phantomChats.length === 0 && <p className="text-sm text-zinc-600 italic">No active phantom chats.</p>}
            </ul>

          </section>

          {/* Permanent Chats Section */}
          <section className="bg-black/40 border border-purple-900/20 rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm">
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl"></div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-purple-400">Permanent Vaults</h2>
              <button
                onClick={() => setIsCreatingPermanent(!isCreatingPermanent)}
                className="bg-purple-900/30 hover:bg-purple-800/40 text-purple-300 px-3 py-1.5 rounded text-sm transition-colors"
              >
                + New Vault
              </button>
            </div>

            {isCreatingPermanent && (
              <div className="mb-6 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                <label className="block text-xs uppercase text-zinc-500 mb-2">Vault Name</label>
                <div className="flex gap-2">
                  <input type="text" value={permName} onChange={e => setPermName(e.target.value)} className="flex-1 bg-black border border-zinc-700 rounded px-2 py-1 text-sm outline-none text-zinc-300" placeholder="e.g. Area 51" />
                  <button onClick={handleCreatePermanent} className="bg-purple-600 hover:bg-purple-500 text-white text-sm px-4 rounded transition-colors">Create</button>
                </div>
              </div>
            )}

            <ul className="space-y-3">
              {permanentChats.map(chat => (
                <li key={chat.id} className="group bg-zinc-900/30 hover:bg-zinc-800/50 p-4 rounded-xl border border-zinc-800/50 hover:border-purple-900/50 transition-all flex justify-between items-center cursor-pointer" onClick={() => router.push(`/chat/permanent/${chat.id}`)}>
                  <div>
                    <span className="font-semibold text-zinc-200">{chat.name}</span>
                    <p className="text-xs text-zinc-500 mt-1">Creator: {chat.creator}</p>
                  </div>
                  <span className="text-xs bg-purple-900/20 text-purple-400 px-2 py-1 rounded">Permanent</span>
                </li>
              ))}
              {permanentChats.length === 0 && <p className="text-sm text-zinc-600 italic">No permanent chats exist.</p>}
            </ul>

          </section>

        </div>
      </div>

      {/* OTP Modal */}
      {joinModalId && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-[#050508] border border-fuchsia-900/40 p-6 rounded-2xl max-w-sm w-full">
            <h3 className="text-lg font-bold text-fuchsia-400 mb-2">Encrypted Phantom Room</h3>
            <p className="text-xs text-zinc-400 mb-4">Enter the exact OTP generated by the creator to access this temporary vault.</p>
            <input type="text" placeholder="Enter OTP" className="w-full bg-zinc-900/50 border border-zinc-800 p-2 rounded mb-4 text-center text-xl tracking-widest outline-none focus:border-fuchsia-500 text-zinc-200" value={otpInput} onChange={e => setOtpInput(e.target.value)} />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setJoinModalId(null)} className="px-4 py-2 text-sm text-zinc-400 hover:text-white">Cancel</button>
              <button onClick={submitOtpAndJoin} className="bg-fuchsia-600 hover:bg-fuchsia-500 px-4 py-2 rounded text-sm font-semibold shadow-lg shadow-fuchsia-900/20">Access</button>
            </div>
          </div>
        </div>
      )}

      {/* New OTP Display Modal */}
      {newOtp && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] backdrop-blur-sm">
          <div className="bg-[#050508] border border-fuchsia-500/50 p-8 rounded-2xl max-w-sm w-full text-center shadow-[0_0_30px_rgba(217,70,239,0.2)]">
            <h3 className="text-xl font-black tracking-widest text-white mb-2">VAULT SECURED</h3>
            <p className="text-sm text-zinc-400 mb-6 leading-relaxed">Your phantom vault is active. Share this one-time passcode securely.</p>
            
            <div className="bg-fuchsia-950/30 border border-fuchsia-500/30 p-4 rounded-lg mb-6 relative group cursor-pointer"
                 onClick={() => copyToClipboard(newOtp)}
            >
               <p className="text-4xl font-mono font-black text-fuchsia-400 tracking-[0.2em]">{newOtp}</p>
               <div className="absolute inset-0 bg-fuchsia-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <span className="text-xs font-bold text-white uppercase tracking-widest bg-fuchsia-600 px-3 py-1 rounded">
                    {isCopied ? "COPIED!" : "CLICK TO COPY"}
                  </span>
               </div>
            </div>

            <button onClick={() => setNewOtp(null)} className="w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-500 text-white px-4 py-3 rounded text-sm font-bold tracking-widest transition-all">
              ACKNOWLEDGE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
