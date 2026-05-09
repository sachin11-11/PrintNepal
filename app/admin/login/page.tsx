import { AdminLoginForm } from "@/components/AdminLoginForm";

export const metadata = {
  title: "Admin Login | PrintNepal"
};

export default function AdminLoginPage() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center">
      <AdminLoginForm />
    </section>
  );
}
