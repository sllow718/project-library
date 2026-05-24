"use client";

import { useEffect, useState } from "react";

interface ToastMessage {
  id: number;
  type: "success" | "error";
  text: string;
}

let toastId = 0;
const listeners: Set<(msg: ToastMessage) => void> = new Set();

export function showToast(type: "success" | "error", text: string) {
  const msg = { id: ++toastId, type, text };
  listeners.forEach((fn) => fn(msg));
}

export default function ToastContainer() {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handler = (msg: ToastMessage) => {
      setMessages((prev) => [...prev, msg]);
      setTimeout(() => {
        setMessages((prev) => prev.filter((m) => m.id !== msg.id));
      }, 4000);
    };
    listeners.add(handler);
    return () => { listeners.delete(handler); };
  }, []);

  if (messages.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`px-4 py-2.5 rounded-lg text-sm font-medium shadow-lg animate-toast-in
            ${msg.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"}`}
        >
          {msg.type === "success" ? "✓ " : "✗ "}
          {msg.text}
        </div>
      ))}
    </div>
  );
}
