"use client";

import { useEffect, useState } from "react";
import { collection, doc, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { ContactMessageDoc } from "@/types";
import { Mail, MailOpen, Phone } from "lucide-react";
import { cn } from "@/lib/cn";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessageDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const messagesQuery = query(collection(db, "contactMessages"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      setMessages(
        snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as ContactMessageDoc))
      );
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const markAsRead = async (id: string) => {
    await updateDoc(doc(db, "contactMessages", id), { status: "read" });
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-navy">Mesaj qutusu</h1>

      <div className="flex flex-col gap-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-24 w-full rounded-card" />
          ))
        ) : messages.length === 0 ? (
          <div className="rounded-card bg-white">
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
                "rounded-card bg-white p-4 sm:p-6",
                message.status === "new" && "ring-1 ring-blue/20"
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    {message.status === "new" && (
                      <span className="h-2 w-2 rounded-full bg-blue" aria-hidden />
                    )}
                    <p className="font-medium text-navy">{message.name}</p>
                  </div>
                  <p className="mt-1 text-xs text-gray-400">
                    {message.email}
                    {message.phone && (
                      <span className="ml-2 inline-flex items-center gap-1">
                        <Phone size={12} className="inline" /> {message.phone}
                      </span>
                    )}
                  </p>
                  {message.subject && (
                    <p className="mt-2 text-sm font-medium text-navy">{message.subject}</p>
                  )}
                  <p className="mt-1 text-sm text-gray-600">{message.message}</p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <p className="text-xs text-gray-400">
                    {message.createdAt?.toDate
                      ? message.createdAt.toDate().toLocaleString("az-AZ")
                      : "—"}
                  </p>
                  {message.status === "new" && (
                    <Button variant="ghost" onClick={() => markAsRead(message.id)}>
                      <MailOpen size={16} />
                      Oxundu et
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
