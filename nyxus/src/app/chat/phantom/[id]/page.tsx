"use client";

import { useEffect, useState, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldAlert } from "lucide-react";

export default function PhantomChatRoom({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id } = use(params);
  const otp = searchParams.get("otp") || "";

  const [user, setUser] = useState<any>(null);
  const [chat, setChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [error, setError] = useState("");
  const [safetyError, setSafetyError] = useState<string | null>(null);

  const fetchChat = async () => {
     if (!user) return;
     const res = await fetch(`/api/chats/phantom/${id}?otp=${otp}`);
     const data = await res.json();
     if (!res.ok) {
       setError(data.error);
     } else {
       setChat(data.chat);
       setMessages(data.chat.messages);
     }
  };

  useEffect(() => {
    const svUser = localStorage.getItem("sv_user");
    if (!svUser) return router.push("/");
    setUser(JSON.parse(svUser));
  }, []);

  useEffect(() => {
    if (user) {
      fetchChat();
      const interval = setInterval(fetchChat, 3000); // Poll every 3s
      return () => clearInterval(interval);
    }
  }, [user]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const res = await fetch(`/api/chats/phantom/${id}`, {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ action: "send", sender: user.username, text: inputText })
    });
    const data = await res.json();
    if (res.ok) {
      setInputText("");
      fetchChat();
    } else {
      setSafetyError(data.error || "Message flagged by Safety API.");
    }
  };

  const banUser = async (banUsername: string) => {
    const res = await fetch(`/api/chats/phantom/${id}`, {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ action: "ban", sender: user.username, banUsername })
    });
    if (res.ok) {
      alert(`User ${banUsername} was banned from this phantom chat.`);
    } else {
      alert("Failed to ban: " + (await res.json()).error);
    }
  };

  if (error) {
     return <div className="min-h-screen bg-[#050508] text-red-500 flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4">ACCESS DENIED</h2>
        <p>{error}</p>
        <button onClick={() => router.push("/dashboard")} className="mt-8 text-fuchsia-400 underline">Return to Dashboard</button>
     </div>;
  }

  if (!chat) return <div className="min-h-screen bg-[#050508] flex items-center justify-center text-zinc-500">Decrypting...</div>;

  return (
    <div className="min-h-screen bg-[#050508] text-zinc-200 flex flex-col">
       <header className="p-4 border-b border-fuchsia-900/30 bg-black/50 flex justify-between items-center z-10 sticky top-0">
         <div>
            <h1 className="text-xl font-bold text-fuchsia-400">Phantom Room: {chat.id}</h1>
            <p className="text-xs text-zinc-500">Self-destructs in: {Math.max(0, Math.floor((chat.expiresAt - Date.now()) / 60000))} mins</p>
         </div>
         <button onClick={() => router.push("/dashboard")} className="text-sm text-zinc-400 hover:text-white mr-16">Leave Room</button>
       </header>

       <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
          {messages.map(msg => (
             <div key={msg.id} className="bg-zinc-900/40 p-3 rounded-lg border border-zinc-800/50 w-max max-w-full">
                <div className="flex items-center gap-4 mb-2 border-b border-zinc-800 pb-1">
                   <span className="text-xs font-bold text-fuchsia-300">{msg.sender}</span>
                   {msg.sender !== user?.username && (
                      <button onClick={() => banUser(msg.sender)} className="text-[10px] bg-red-900/30 text-red-400 hover:bg-red-800/50 px-2 py-0.5 rounded transition">
                        Ban User
                      </button>
                   )}
                </div>
                <p className="text-sm text-zinc-100">{msg.text}</p>
             </div>
          ))}
          {messages.length === 0 && <p className="text-sm text-zinc-500 italic text-center mt-10">This room is silent. Speak up.</p>}
       </main>

       <footer className="p-4 bg-black/80 border-t border-zinc-800/50 fixed bottom-0 w-full">
          <form onSubmit={sendMessage} className="max-w-4xl mx-auto flex gap-2">
             <input type="text" value={inputText} onChange={e => setInputText(e.target.value)} className="flex-1 bg-zinc-900/80 border border-zinc-700/50 rounded-lg px-4 py-2 text-sm outline-none focus:border-fuchsia-500/50 text-white" placeholder="Send an untraceable message..." />
             <button type="submit" className="bg-fuchsia-600 hover:bg-fuchsia-500 px-6 py-2 rounded-lg text-sm font-bold shadow-lg shadow-fuchsia-900/50 transition">Send</button>
          </form>
       </footer>

       {safetyError && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[200] backdrop-blur-md">
            <div className="bg-[#050508] border border-red-600/50 p-8 rounded-2xl max-w-sm w-full text-center shadow-[0_0_30px_rgba(220,38,38,0.2)]">
              <div className="w-16 h-16 bg-red-900/20 border border-red-500/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldAlert className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-black tracking-widest text-red-500 mb-2 uppercase">Safety Violation</h3>
              <p className="text-sm text-zinc-400 mb-8 leading-relaxed">
                {safetyError}
              </p>
              <button onClick={() => setSafetyError(null)} className="w-full bg-red-900/40 hover:bg-red-800/60 border border-red-700/50 text-red-200 px-4 py-3 rounded text-sm font-bold tracking-widest transition-all">
                ACKNOWLEDGE
              </button>
            </div>
          </div>
        )}
    </div>
  );
}
