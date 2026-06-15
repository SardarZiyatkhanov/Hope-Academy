"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50 p-4"
      onClick={onClose}
    >
      <div
        className={cn(
          "w-full max-w-md rounded-card bg-white p-6 shadow-xl",
          className
        )}
        onClick={(event) => event.stopPropagation()}
      >
        {title && (
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-navy">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Bağla"
              className="text-gray-400 transition-colors hover:text-navy"
            >
              ✕
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
