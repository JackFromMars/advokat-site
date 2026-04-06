"use client";

import { useState } from "react";
import { MessageCircleMore, X } from "lucide-react";
import { TelegramIcon, ViberIcon, WhatsAppIcon, PhoneIcon } from "@/components/icons/MessengerIcons";
import { contacts } from "@/data/contacts";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  const channels = [
    {
      label: "Telegram",
      href: contacts.messengers.telegram,
      icon: <TelegramIcon size={20} className="text-sky-400" />,
      color: "hover:bg-sky-500/20",
    },
    {
      label: "Viber",
      href: contacts.messengers.viber,
      icon: <ViberIcon size={20} className="text-purple-400" />,
      color: "hover:bg-purple-500/20",
    },
    {
      label: "WhatsApp",
      href: contacts.messengers.whatsapp,
      icon: <WhatsAppIcon size={20} className="text-green-400" />,
      color: "hover:bg-green-500/20",
    },
    {
      label: "Зателефонувати",
      href: `tel:${contacts.phoneRaw}`,
      icon: <PhoneIcon size={20} className="text-[var(--color-accent)]" />,
      color: "hover:bg-amber-500/20",
    },
  ];

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      {isOpen && (
        <div
          className="absolute bottom-16 right-0 glass p-2 sm:p-3 mb-2 min-w-[180px] sm:min-w-[200px] space-y-1 max-w-[calc(100vw-2rem)]"
          style={{ borderColor: "var(--color-border)" }}
        >
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
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--color-foreground)] text-sm font-medium transition-colors cursor-pointer min-h-[44px] ${channel.color}`}
            >
              {channel.icon}
              {channel.label}
            </a>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-full shadow-lg shadow-amber-500/25 flex items-center justify-center transition-all hover:scale-105 cursor-pointer"
        aria-label="Зв'язатися з адвокатом"
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <MessageCircleMore size={24} />
        )}
      </button>
    </div>
  );
}
