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
      <body>
        {children}
        <Toast />
      </body>
    </html>
  );
}
