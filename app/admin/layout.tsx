import { AdminSidebar } from "@/components/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-mist lg:grid lg:grid-cols-[17rem_1fr]">
      <AdminSidebar />
      <main className="p-5 sm:p-8 lg:p-10">{children}</main>
    </div>
  );
}
