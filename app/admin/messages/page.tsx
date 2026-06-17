"use client";

import { useEffect, useState } from "react";
import { collection, doc, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { ContactMessageDoc } from "@/types";
import { Mail, MailOpen, Phone, Inbox, Check } from "lucide-react";
import { cn } from "@/lib/cn";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessageDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "contactMessages"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => {
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() } as ContactMessageDoc)));
      setLoading(false);
    });
  }, []);

  const markAsRead = async (id: string) => {
    await updateDoc(doc(db, "contactMessages", id), { status: "read" });
  };

  const unreadCount = messages.filter((m) => m.status === "new").length;

  return (
    <div className="flex flex-col gap-7">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-navy">Mesaj qutusu</h1>
          <p className="mt-0.5 text-sm text-gray-400">
            Cəmi <span className="font-semibold text-navy">{messages.length}</span> mesaj
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center rounded-full bg-blue-500 px-2 py-0.5 text-[11px] font-semibold text-white">
                {unreadCount} yeni
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Messages list */}
      <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy/5">
            <Inbox size={14} className="text-navy" />
          </span>
          <h2 className="text-sm font-semibold text-navy">Gələn mesajlar</h2>
        </div>

        <div className="divide-y divide-gray-50">
          {loading ? (
            <div className="flex flex-col gap-0">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-4 px-5 py-5">
                  <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="py-12">
              <EmptyState
                icon={Mail}
                title="Mesaj yoxdur"
                description="Əlaqə formundan göndərilən mesajlar burada görünəcək."
              />
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-4 px-5 py-5 transition-colors hover:bg-gray-50/50",
                  message.status === "new" && "bg-blue-50/30"
                )}
              >
                {/* Avatar */}
                <div className="shrink-0">
                  <Avatar name={message.name} className="h-10 w-10" />
                </div>

                {/* Content */}
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {message.status === "new" && (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                      )}
                      <p className="font-semibold text-navy">{message.name}</p>
                    </div>
                    <p className="text-xs text-gray-400">
                      {message.createdAt?.toDate
                        ? message.createdAt.toDate().toLocaleString("az-AZ")
                        : "—"}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                    <span>{message.email}</span>
                    {message.phone && (
                      <span className="flex items-center gap-1">
                        <Phone size={11} />
                        {message.phone}
                      </span>
                    )}
                  </div>

                  {message.subject && (
                    <p className="mt-1 text-sm font-semibold text-navy">{message.subject}</p>
                  )}
                  <p className="text-sm leading-relaxed text-gray-600">{message.message}</p>

                  {message.status === "new" && (
                    <div className="mt-2">
                      <Button
                        variant="ghost"
                        onClick={() => markAsRead(message.id)}
                        className="h-7 gap-1.5 px-3 text-xs font-medium text-green-600 hover:bg-green-50 hover:text-green-700"
                      >
                        <Check size={13} />
                        Oxundu et
                      </Button>
                    </div>
                  )}
                </div>

                {/* Status icon */}
                <div className="shrink-0 pt-0.5">
                  {message.status === "new" ? (
                    <Mail size={16} className="text-blue-500" />
                  ) : (
                    <MailOpen size={16} className="text-gray-300" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
