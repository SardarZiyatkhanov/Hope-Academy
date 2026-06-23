"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CONTACT } from "@/lib/constants";

export function WhatsAppButton() {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center justify-end gap-3">
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, x: 8, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="rounded-[12px] bg-white px-3.5 py-2.5 shadow-xl ring-1 ring-gray-100"
          >
            <p className="text-xs font-semibold text-gray-800">Sual ver</p>
            <p className="text-[10px] text-gray-400">Dərhal cavab alırıq</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="relative"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Outer pulse ring */}
        <span className="absolute -inset-2 animate-ping rounded-full bg-[#25D366] opacity-20" />
        {/* Inner glow ring */}
        <span className="absolute inset-0 animate-pulse rounded-full bg-[#25D366] opacity-30" />

        <motion.a
          href={`https://wa.me/${CONTACT.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp ilə yazın"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.2, type: "spring", stiffness: 200, damping: 15 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-[0_4px_24px_rgba(37,211,102,0.5)] transition-shadow hover:shadow-[0_6px_32px_rgba(37,211,102,0.65)]"
        >
          <svg viewBox="0 0 24 24" fill="white" className="h-7 w-7">
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 1.67c2.21 0 4.29.86 5.85 2.42a8.23 8.23 0 0 1 2.42 5.83c0 4.56-3.71 8.27-8.27 8.27a8.27 8.27 0 0 1-4.21-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.24 8.24 0 0 1-1.27-4.4c0-4.56 3.71-8.26 8.27-8.26zm-4.52 4.7c-.16 0-.43.06-.62.29-.19.23-.74.72-.74 1.75 0 1.03.76 2.03.86 2.17.11.14 1.5 2.34 3.69 3.19 1.82.71 2.19.62 2.59.58.4-.04 1.28-.52 1.46-1.03.18-.5.18-.93.13-1.03-.05-.09-.19-.15-.4-.26-.21-.11-1.27-.62-1.46-.7-.2-.07-.34-.11-.49.11-.14.21-.56.7-.69.85-.13.14-.26.16-.48.05-.23-.11-.97-.36-1.85-1.14-.69-.61-1.15-1.36-1.28-1.59-.13-.23-.01-.35.1-.48.1-.13.23-.32.34-.49.11-.16.15-.28.23-.45.07-.16.04-.31-.03-.45-.07-.14-.62-1.51-.85-2.06-.2-.45-.4-.39-.55-.4z" />
          </svg>
        </motion.a>
      </div>
    </div>
  );
}
