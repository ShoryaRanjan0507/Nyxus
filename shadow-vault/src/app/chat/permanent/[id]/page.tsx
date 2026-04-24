"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";

export default function PermanentChatRoom({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [user, setUser] = useState<any>(null);
  const [chat, setChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [error, setError] = useState("");
  const [safetyError, setSafetyError] = useState<string | null>(null);

  const fetchChat = async () => {
     if (!user) return;
     const res = await fetch(`/api/chats/permanent/${id}`);
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
      const interval = setInterval(fetchChat, 3000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const res = await fetch(`/api/chats/permanent/${id}`, {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ action: "send", sender: user.username, text: inputText })
    });
    
    const data = await res.json();
    if (res.ok) {
      setInputText("");
      fetchChat();
    } else {
      // Safety API block triggers this.
      setSafetyError(data.error || "Message flagged by Safety API.");
    }
  };

  const banUser = async (banUsername: string) => {
    const res = await fetch(`/api/chats/permanent/${id}`, {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ action: "ban", sender: user.username, banUsername })
    });
    if (res.ok) {
      alert(`User ${banUsername} was banned from this vault.`);
    } else {
       alert((await res.json()).error);
    }
  };

  const leaveChat = async () => {
      const res = await fetch(`/api/chats/permanent/${id}`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ action: "leave", sender: user.username })
      });
      if (res.ok) {
         router.push("/dashboard");
      }
  };

  if (error) {
     return <div className="min-h-screen bg-[#050508] text-red-500 flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4">ACCESS DENIED</h2>
        <p>{error}</p>
        <button onClick={() => router.push("/dashboard")} className="mt-8 text-purple-400 underline">Return to Dashboard</button>
     </div>;
  }

  if (!chat) return <div className="min-h-screen bg-[#050508] flex items-center justify-center text-zinc-500">Connecting...</div>;

  const isCreator = user.username === chat.creator;

  return (
    <div className="min-h-screen bg-[#050508] text-zinc-200 flex flex-col">
       <header className="p-4 border-b border-purple-900/30 bg-black/50 flex justify-between items-center z-10 sticky top-0 backdrop-blur-md">
         <div>
            <h1 className="text-xl font-bold text-purple-400">{chat.name}</h1>
            <p className="text-xs text-zinc-500">Permanent Vault • Creator: {chat.creator}</p>
         </div>
         <div className="flex gap-4 items-center mr-16">
             <button onClick={() => router.push("/dashboard")} className="text-sm text-zinc-400 hover:text-white transition">Dashboard</button>
             <button onClick={leaveChat} className="text-xs bg-red-900/20 text-red-400 border border-red-900/50 hover:bg-red-800/40 px-3 py-1.5 rounded transition">
               Exit Vault
             </button>
         </div>
       </header>

       <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
          {messages.map(msg => (
             <div key={msg.id} className="bg-zinc-900/40 p-3 rounded-lg border border-purple-900/20 w-max max-w-full shadow-lg shadow-purple-900/5">
                <div className="flex items-center gap-4 mb-2 border-b border-zinc-800/80 pb-1">
                   <span className="text-xs font-bold text-purple-300">{msg.sender}</span>
                   {isCreator && msg.sender !== user?.username && (
                      <button onClick={() => banUser(msg.sender)} className="text-[10px] bg-red-900/30 text-red-400 hover:bg-red-800/50 px-2 py-0.5 rounded transition">
                        Ban User
                      </button>
                   )}
                </div>
                <p className="text-sm text-zinc-100">{msg.text}</p>
             </div>
          ))}
          {messages.length === 0 && <p className="text-sm text-zinc-500 italic text-center mt-10">Start the conversation in {chat.name}.</p>}
       </main>

       <footer className="p-4 bg-black/80 border-t border-zinc-800/50 fixed bottom-0 w-full backdrop-blur-md">
          <form onSubmit={sendMessage} className="max-w-4xl mx-auto flex gap-2">
             <input type="text" value={inputText} onChange={e => setInputText(e.target.value)} className="flex-1 bg-zinc-900/80 border border-zinc-700/50 rounded-lg px-4 py-2 text-sm outline-none focus:border-purple-500/50 text-white" placeholder="Message the vault..." />
             <button type="submit" className="bg-purple-600 hover:bg-purple-500 px-6 py-2 rounded-lg text-sm font-bold shadow-lg shadow-purple-900/50 transition">Send</button>
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
