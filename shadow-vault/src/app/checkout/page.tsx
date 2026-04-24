"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();

  useEffect(() => {
    const svUser = localStorage.getItem("sv_user");
    
    if (svUser) {
        const user = JSON.parse(svUser);
        // Developer bypass
        if (user.role === 'dev') {
           router.push("/dashboard");
           return;
        }
    }
    
    // Standard user or unauthenticated user redirect to payment gateway
    router.push("/payment");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center">
       <div className="text-center">
         <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-red-500 border-r-transparent align-[-0.125em] mb-4"></div>
         <p className="text-red-400 font-mono text-sm tracking-widest">INITIATING SECURE PAYMENT GATEWAY...</p>
       </div>
    </div>
  );
}
