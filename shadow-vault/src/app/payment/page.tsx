"use client";

export default function PaymentMock() {
  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center p-6 font-sans">
      <div className="bg-white text-zinc-900 rounded-xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col">
        <div className="bg-zinc-100 px-6 py-4 border-b border-zinc-200 flex justify-between items-center">
           <div className="font-bold text-lg flex items-center gap-2">
             <div className="w-6 h-6 bg-purple-600 rounded"></div>
             Shadow Vault
           </div>
           <div className="text-xl font-bold">$299.00</div>
        </div>
        
        <div className="p-6 space-y-6">
           <div>
             <h2 className="text-lg font-bold">Syndicate Protocol</h2>
             <p className="text-zinc-500 text-sm">3 months of unhinged access</p>
           </div>
           
           <div className="space-y-4 border-t border-zinc-200 pt-6">
             <h3 className="font-semibold">Payment Details</h3>
             <div className="space-y-2">
                <input type="email" placeholder="Email address" className="w-full border border-zinc-300 rounded p-3 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all" />
                <div className="border border-zinc-300 rounded overflow-hidden">
                   <input type="text" placeholder="Card number" className="w-full border-b border-zinc-300 p-3 outline-none focus:bg-purple-50" />
                   <div className="flex">
                      <input type="text" placeholder="MM / YY" className="w-1/2 border-r border-zinc-300 p-3 outline-none focus:bg-purple-50" />
                      <input type="text" placeholder="CVC" className="w-1/2 p-3 outline-none focus:bg-purple-50" />
                   </div>
                </div>
             </div>
           </div>
           
           <button onClick={() => alert("This is a mock payment gateway for the prototype! In production, this would process the payment and grant the premium tier.")} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded transition-colors shadow-lg shadow-purple-600/30">
             Pay $299.00
           </button>
           
           <p className="text-center text-xs text-zinc-400 mt-4 flex items-center justify-center gap-1">
             🔒 Powered by Mock Stripe
           </p>
        </div>
      </div>
    </div>
  );
}
