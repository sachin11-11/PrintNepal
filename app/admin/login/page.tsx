import { AdminLoginForm } from "@/components/AdminLoginForm";

export const metadata = {
  title: "Admin Login | PrintNepal"
};

export default function AdminLoginPage({ searchParams }: { searchParams: { next?: string } }) {
  return (
    <section className="mx-auto grid min-h-screen max-w-6xl items-center gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[1fr_28rem] lg:px-10">
      <div className="atelier-hero p-6 sm:p-8">
        <a className="text-sm font-black tracking-[0.12em] text-ink" href="/">PRINTNEPAL</a>
        <p className="eyebrow mt-10">Admin control</p>
        <h1 className="mt-4 max-w-2xl text-5xl font-black leading-tight text-ink">Manage print production from one console.</h1>
        <p className="mt-5 max-w-xl text-sm leading-6 text-graphite">
          Orders, catalogues, templates, materials, artwork uploads, and payment states stay behind authenticated admin access.
        </p>
      </div>
      <div>
        <AdminLoginForm nextPath={searchParams.next} />
      </div>
    </section>
  );
}
