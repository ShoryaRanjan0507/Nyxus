"use client";

import { usePathname } from "next/navigation";
import UserDropdown from "./UserDropdown";

export default function GlobalUserDropdown() {
  const pathname = usePathname();
  
  // Don't render floating dropdown on home page, auth, or support
  if (pathname === "/" || pathname === "/auth" || pathname === "/support") return null;

  return (
    <div className="fixed top-6 right-6 z-[100]">
      <UserDropdown />
    </div>
  );
}
