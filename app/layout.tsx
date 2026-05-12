import type { Metadata } from "next";
import { Toast } from "@/components/Toast";
import "polotno/polotno.blueprint.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "PrintNepal | Premium Print Shop in Nepal",
  description:
    "Premium print shop in Nepal for wedding catalogs, custom stickers, laptop wrappers, business cards, art prints, and more."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const savedTheme = localStorage.getItem("printnepal-theme");
                const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "night" : "light";
                document.documentElement.dataset.theme = savedTheme === "night" || savedTheme === "light" ? savedTheme : preferredTheme;
              } catch {}
            `
          }}
        />
      </head>
      <body>
        {children}
        <Toast />
      </body>
    </html>
  );
}
