"use client";

import { usePathname } from "next/navigation";
import { AdminSidebar } from "./AdminSidebar";

export function AdminLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-mist">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-mist lg:grid lg:grid-cols-[18rem_1fr]">
      <AdminSidebar />
      <main className="p-5 sm:p-8 lg:p-10">{children}</main>
    </div>
  );
}
