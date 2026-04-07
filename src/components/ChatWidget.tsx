"use client";

import { useState } from "react";
import { MessageCircleMore, X } from "lucide-react";
import {
  TelegramIcon,
  ViberIcon,
  WhatsAppIcon,
  PhoneIcon,
} from "@/components/icons/MessengerIcons";
import { contacts } from "@/data/contacts";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  const channels = [
    {
      label: "Telegram",
      href: contacts.messengers.telegram,
      icon: <TelegramIcon size={20} className="text-sky-400" />,
      hoverBg: "hover:bg-sky-500/10",
    },
    {
      label: "Viber",
      href: contacts.messengers.viber,
      icon: <ViberIcon size={20} className="text-purple-400" />,
      hoverBg: "hover:bg-purple-500/10",
    },
    {
      label: "WhatsApp",
      href: contacts.messengers.whatsapp,
      icon: <WhatsAppIcon size={20} className="text-green-400" />,
      hoverBg: "hover:bg-green-500/10",
    },
    {
      label: "Зателефонувати",
      href: `tel:${contacts.phoneRaw}`,
      icon: <PhoneIcon size={20} className="text-[var(--color-accent)]" />,
      hoverBg: "hover:bg-[var(--color-accent)]/10",
    },
  ];

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40">
      {/* Popup */}
      <div
        className="absolute bottom-[calc(100%+0.75rem)] right-0 max-w-[calc(100vw-2rem)]"
        style={{
          transformOrigin: "bottom right",
          transform: isOpen ? "scale(1)" : "scale(0.95)",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "transform 200ms var(--ease-out), opacity 200ms var(--ease-out)",
        }}
      >
        <div className="card-premium">
          <div className="card-premium-inner p-2 min-w-[220px]">
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
                className={`flex items-center gap-3 px-4 min-h-[48px] rounded-xl text-[var(--color-foreground)] text-sm font-medium transition-colors duration-200 cursor-pointer ${channel.hoverBg}`}
              >
                {channel.icon}
                {channel.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* FAB */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-14 h-14 rounded-full bg-[var(--color-accent)] text-[var(--color-bg-deep)] flex items-center justify-center cursor-pointer active:scale-[0.93]"
        style={{
          boxShadow: "0 4px 24px rgba(201, 168, 76, 0.3)",
          transition: "transform 200ms var(--ease-out), box-shadow 200ms var(--ease-out)",
        }}
        aria-label="Зв'язатися з адвокатом"
      >
        {/* MessageCircleMore icon */}
        <span
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transform: isOpen ? "rotate(90deg) scale(0)" : "rotate(0deg) scale(1)",
            opacity: isOpen ? 0 : 1,
            transition: "transform 250ms var(--ease-out), opacity 250ms var(--ease-out)",
          }}
        >
          <MessageCircleMore size={24} />
        </span>

        {/* X icon */}
        <span
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transform: isOpen ? "rotate(0deg) scale(1)" : "rotate(-90deg) scale(0)",
            opacity: isOpen ? 1 : 0,
            transition: "transform 250ms var(--ease-out), opacity 250ms var(--ease-out)",
          }}
        >
          <X size={24} />
        </span>
      </button>
    </div>
  );
}
