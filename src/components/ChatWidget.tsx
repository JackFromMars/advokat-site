"use client";

import { useState } from "react";
import { contacts } from "@/data/contacts";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  const channels = [
    {
      label: "Telegram",
      href: contacts.messengers.telegram,
      icon: "💬",
      color: "hover:bg-sky-500/20",
    },
    {
      label: "Viber",
      href: contacts.messengers.viber,
      icon: "📱",
      color: "hover:bg-purple-500/20",
    },
    {
      label: "WhatsApp",
      href: contacts.messengers.whatsapp,
      icon: "📲",
      color: "hover:bg-green-500/20",
    },
    {
      label: "Зателефонувати",
      href: `tel:${contacts.phoneRaw}`,
      icon: "📞",
      color: "hover:bg-amber-500/20",
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="absolute bottom-16 right-0 glass p-3 mb-2 min-w-[200px] space-y-1">
          {channels.map((channel) => (
            <a
              key={channel.label}
              href={channel.href}
              target={channel.href.startsWith("http") ? "_blank" : undefined}
              rel={
                channel.href.startsWith("http")
                  ? "noopener noreferrer"
                  : undefined
              }
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-white text-sm font-medium transition-colors ${channel.color}`}
            >
              <span className="text-lg">{channel.icon}</span>
              {channel.label}
            </a>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-full shadow-lg shadow-amber-500/25 flex items-center justify-center transition-all hover:scale-105"
        aria-label="Зв'язатися з адвокатом"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>
    </div>
  );
}
