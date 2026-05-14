import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export const metadata = {
  title: "Contact Us | PrintNepal",
  description: "Contact PrintNepal for print orders, file checks, delivery coordination, and production support."
};

type IconName = "phone" | "mail" | "map" | "clock" | "facebook" | "instagram" | "whatsapp" | "tiktok" | "linkedin" | "youtube" | "messenger" | "x";

const contactMethods = [
  {
    icon: "phone" as const,
    label: "Call",
    value: "+977 9748808237",
    href: "tel:+9779748808237",
    note: "Fastest for urgent print jobs and delivery coordination."
  },
  {
    icon: "mail" as const,
    label: "Email",
    value: "hello@printnepal.com",
    href: "mailto:hello@printnepal.com",
    note: "Best for artwork files, quotations, and production details."
  },
  {
    icon: "map" as const,
    label: "Visit",
    value: "Kathmandu, Nepal",
    href: "https://www.google.com/maps/search/?api=1&query=Kathmandu%20Nepal%20print%20shop",
    note: "Pickup, file review, and production consultation."
  },
  {
    icon: "clock" as const,
    label: "Hours",
    value: "Sun-Fri, 9:00 AM - 7:00 PM",
    href: "/order",
    note: "Online orders can be started anytime."
  }
];

const socialLinks = [
  { icon: "whatsapp" as const, label: "WhatsApp", handle: "+977 9748808237", href: "https://wa.me/9779748808237", tone: "bg-emerald-500" },
  { icon: "facebook" as const, label: "Facebook", handle: "@PrintNepal", href: "https://facebook.com/printnepal", tone: "bg-blue-600" },
  { icon: "instagram" as const, label: "Instagram", handle: "@printnepal", href: "https://instagram.com/printnepal", tone: "bg-pink-600" },
  { icon: "tiktok" as const, label: "TikTok", handle: "@printnepal", href: "https://www.tiktok.com/@printnepal", tone: "bg-neutral-950" },
  { icon: "messenger" as const, label: "Messenger", handle: "PrintNepal", href: "https://m.me/printnepal", tone: "bg-sky-500" },
  { icon: "linkedin" as const, label: "LinkedIn", handle: "PrintNepal", href: "https://www.linkedin.com/company/printnepal", tone: "bg-blue-700" },
  { icon: "youtube" as const, label: "YouTube", handle: "@PrintNepal", href: "https://www.youtube.com/@printnepal", tone: "bg-red-600" },
  { icon: "x" as const, label: "X", handle: "@printnepal", href: "https://x.com/printnepal", tone: "bg-black" }
];

const supportTopics = ["New print order", "Artwork file check", "Bulk quotation", "Delivery update", "Design help", "Partnership"];

function ContactIcon({ name }: { name: IconName }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.8
  };

  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">
      {name === "phone" ? <path {...common} d="M6.6 10.8c1.5 3 3.6 5.1 6.6 6.6l2.2-2.2 4.1 1v3.4c0 .8-.6 1.4-1.4 1.4C9.8 21 3 14.2 3 5.9c0-.8.6-1.4 1.4-1.4h3.4l1 4.1-2.2 2.2Z" /> : null}
      {name === "mail" ? <path {...common} d="M4 6h16v12H4zM4 7l8 6 8-6" /> : null}
      {name === "map" ? <path {...common} d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11ZM12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" /> : null}
      {name === "clock" ? <path {...common} d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7v5l3 2" /> : null}
      {name === "facebook" ? <path fill="currentColor" d="M14 8.4h2V5.2c-.4-.1-1.7-.2-3.2-.2-3.2 0-5.3 1.9-5.3 5.5v3.1H4v3.6h3.5V22h4.2v-4.8h3.5l.6-3.6h-4.1v-2.7c0-1 .3-2.5 2.3-2.5Z" /> : null}
      {name === "instagram" ? <><rect {...common} x="4" y="4" width="16" height="16" rx="4" /><path {...common} d="M9 12a3 3 0 1 0 6 0 3 3 0 0 0-6 0ZM17.5 6.8h.01" /></> : null}
      {name === "whatsapp" ? <path {...common} d="M5.5 18.5 6.8 15A7 7 0 1 1 9 17.2l-3.5 1.3ZM9.4 8.6c.2 3 2.4 5.1 5.5 5.9l1.1-1.6-2-.9-.8.8c-1.1-.5-1.9-1.3-2.4-2.4l.8-.8-.9-2-1.3 1Z" /> : null}
      {name === "tiktok" ? <path {...common} d="M14 4v10.2a4.2 4.2 0 1 1-4.2-4.2M14 4c.5 3 2.2 4.6 5 4.9" /> : null}
      {name === "linkedin" ? <><path fill="currentColor" d="M5 9h4v12H5zM7 3.5a2.2 2.2 0 1 1 0 4.4 2.2 2.2 0 0 1 0-4.4ZM11 9h3.8v1.7h.1c.5-1 1.8-2 3.7-2 4 0 4.7 2.6 4.7 6V21h-4v-5.1c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V21H11z" /></> : null}
      {name === "youtube" ? <path {...common} d="M21 8.5s-.2-1.4-.8-2c-.8-.8-1.7-.8-2.1-.9C15.2 5.4 12 5.4 12 5.4s-3.2 0-6.1.2c-.4.1-1.3.1-2.1.9-.6.6-.8 2-.8 2S2.8 10.2 2.8 12v1.6c0 1.8.2 3.5.2 3.5s.2 1.4.8 2c.8.8 1.9.8 2.4.9 1.7.2 5.8.2 5.8.2s3.2 0 6.1-.2c.4-.1 1.3-.1 2.1-.9.6-.6.8-2 .8-2s.2-1.8.2-3.5V12c0-1.8-.2-3.5-.2-3.5ZM10.5 15.3V9.6l5 2.9-5 2.8Z" /> : null}
      {name === "messenger" ? <path {...common} d="M12 4C7 4 3 7.7 3 12.2c0 2.4 1.1 4.5 2.9 6v2.8l2.7-1.5c1 .3 2.1.5 3.4.5 5 0 9-3.7 9-8.2S17 4 12 4ZM7.5 14.5l3-3.2 2.3 2.4 3.7-4.1-3 5.5-2.4-2.3-3.6 1.7Z" /> : null}
      {name === "x" ? <path fill="currentColor" d="M14 10.7 21.6 2h-1.8l-6.6 7.6L7.9 2H2l8 11.5L2 22h1.8l7-7.5 5.6 7.5H22l-8-11.3ZM11.5 13.6l-.8-1.1L4.2 3.4H7l5.2 7.3.8 1.1 6.8 9.5H17l-5.5-7.7Z" /> : null}
    </svg>
  );
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-paper text-ink">
      <Header />

      <section className="print-band">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(22rem,0.7fr)] lg:px-10">
          <div className="atelier-hero p-5 sm:p-7">
            <p className="eyebrow">Contact us</p>
            <h1 className="mt-4 text-4xl font-black leading-tight text-ink sm:text-6xl">Talk to PrintNepal.</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-graphite">
              Send artwork, request a quote, check production details, or coordinate pickup and delivery from one place.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a className="link-block" href="tel:+9779748808237">Call now</a>
              <a className="link-block" href="https://wa.me/9779748808237" rel="noreferrer" target="_blank">WhatsApp</a>
            </div>
          </div>

          <div className="grid gap-3">
            {contactMethods.map((method) => (
              <a
                className="atelier-card group grid gap-3 p-4 transition hover:-translate-y-1"
                href={method.href}
                key={method.label}
                rel={method.href.startsWith("http") ? "noreferrer" : undefined}
                target={method.href.startsWith("http") ? "_blank" : undefined}
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-mist text-press">
                    <ContactIcon name={method.icon} />
                  </span>
                  <span>
                    <span className="block text-xs font-black uppercase tracking-[0.18em] text-graphite">{method.label}</span>
                    <span className="mt-1 block text-base font-black text-ink">{method.value}</span>
                  </span>
                </span>
                <span className="text-sm leading-6 text-graphite">{method.note}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-12 sm:px-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(24rem,0.65fr)] lg:px-10">
        <div className="atelier-card p-5 sm:p-6">
          <p className="eyebrow">Send a message</p>
          <h2 className="mt-3 text-3xl font-black text-ink">Tell us what you need printed.</h2>
          <form className="mt-6 grid gap-4" action="mailto:hello@printnepal.com" method="post" encType="text/plain">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold text-ink">
                Name
                <input className="atelier-input min-h-12 px-4 text-sm outline-none" name="name" placeholder="Your name" required />
              </label>
              <label className="grid gap-2 text-sm font-bold text-ink">
                Phone
                <input className="atelier-input min-h-12 px-4 text-sm outline-none" name="phone" placeholder="+977" required />
              </label>
            </div>
            <label className="grid gap-2 text-sm font-bold text-ink">
              Email
              <input className="atelier-input min-h-12 px-4 text-sm outline-none" name="email" placeholder="you@example.com" type="email" />
            </label>
            <label className="grid gap-2 text-sm font-bold text-ink">
              Topic
              <select className="atelier-input min-h-12 px-4 text-sm outline-none" name="topic">
                {supportTopics.map((topic) => (
                  <option key={topic}>{topic}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-bold text-ink">
              Message
              <textarea className="atelier-input min-h-36 p-4 text-sm outline-none" name="message" placeholder="Product, quantity, size, deadline, delivery location, or artwork notes" required />
            </label>
            <button className="link-block w-fit" type="submit">Send message</button>
          </form>
        </div>

        <div className="grid gap-6">
          <div className="atelier-card p-5">
            <p className="eyebrow">Social media</p>
            <h2 className="mt-3 text-3xl font-black text-ink">Follow and message us.</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {socialLinks.map((social) => (
                <a
                  className="group flex items-center justify-between gap-4 rounded-lg bg-paper p-3 transition hover:-translate-y-1 hover:shadow-soft"
                  href={social.href}
                  key={social.label}
                  rel="noreferrer"
                  target="_blank"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span className={`flex h-11 w-11 shrink-0 items-center justify-center text-white ${social.tone}`}>
                      <ContactIcon name={social.icon} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-black text-ink">{social.label}</span>
                      <span className="block truncate text-xs font-bold uppercase tracking-[0.14em] text-graphite">{social.handle}</span>
                    </span>
                  </span>
                  <span className="text-sm font-black text-press">Open</span>
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-mist p-5 shadow-soft">
            <p className="text-xs font-black uppercase tracking-[0.08em] text-press">Production note</p>
            <p className="mt-3 text-sm leading-6 text-graphite">
              For accurate quotes, include product type, quantity, size, paper/material, finishing, deadline, and delivery location.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
