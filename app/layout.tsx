import type { Metadata } from "next";
import { Toast } from "@/components/Toast";
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
                document.documentElement.dataset.theme = savedTheme === "night" || savedTheme === "light" ? savedTheme : "light";
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
