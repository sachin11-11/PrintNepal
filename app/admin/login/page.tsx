import { AdminLoginForm } from "@/components/AdminLoginForm";

export const metadata = {
  title: "Admin Login | PrintNepal"
};

export default function AdminLoginPage({ searchParams }: { searchParams: { next?: string } }) {
  return (
    <section className="mx-auto grid min-h-screen max-w-md items-center px-5 py-10 sm:px-8">
      <div className="w-full">
        <AdminLoginForm nextPath={searchParams.next} />
      </div>
    </section>
  );
}
