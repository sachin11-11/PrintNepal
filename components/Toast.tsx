"use client";

import { useEffect, useState } from "react";

export function Toast() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    function handleToast(event: Event) {
      const detail = (event as CustomEvent<string>).detail;
      setMessage(detail);
      window.setTimeout(() => setMessage(""), 3500);
    }

    window.addEventListener("printnepal:toast", handleToast);
    return () => window.removeEventListener("printnepal:toast", handleToast);
  }, []);

  if (!message) {
    return null;
  }

  return (
    <div className="fixed bottom-5 left-1/2 z-[80] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl border border-black/10 bg-white px-5 py-4 text-sm text-ink shadow-soft" role="status">
      {message}
    </div>
  );
}
