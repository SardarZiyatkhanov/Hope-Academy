"use client";

import { useEffect, useRef, useState } from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { MessageSquare, Paperclip, Send } from "lucide-react";
import { db, storage } from "@/lib/firebase";
import { MessageDoc } from "@/types";
import { cn } from "@/lib/cn";
import { useToast } from "@/components/ui/Toast";

const ALLOWED_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const AZ_MONTHS = [
  "Yan", "Fev", "Mar", "Apr", "May", "İyn",
  "İyl", "Avq", "Sen", "Okt", "Noy", "Dek",
];

function formatMessageTime(timestamp: Timestamp | null | undefined): string {
  if (!timestamp) return "";
  const date = timestamp.toDate();
  const now = new Date();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const time = `${hours}:${minutes}`;

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) return time;
  return `${date.getDate()} ${AZ_MONTHS[date.getMonth()]}, ${time}`;
}

interface ChatThreadProps {
  studentId: string;
  currentUserId: string;
  currentUserRole: "student" | "manager";
}

export function ChatThread({ studentId, currentUserId, currentUserRole }: ChatThreadProps) {
  const [messages, setMessages] = useState<MessageDoc[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const threadQuery = query(
      collection(db, "messages", studentId, "thread"),
      orderBy("createdAt", "asc")
    );
    const unsubscribe = onSnapshot(threadQuery, (snapshot) => {
      setMessages(
        snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as MessageDoc))
      );
    });
    return unsubscribe;
  }, [studentId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setSending(true);
    try {
      await addDoc(collection(db, "messages", studentId, "thread"), {
        senderId: currentUserId,
        senderRole: currentUserRole,
        text: trimmed,
        createdAt: serverTimestamp(),
        read: false,
      });
      setText("");
    } catch {
      showToast("Mesaj göndərilərkən xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.");
    } finally {
      setSending(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.has(file.type)) {
      showToast("Yalnız PDF, JPG, PNG və DOCX formatları dəstəklənir");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      showToast("Fayl ölçüsü 10MB-dan çox ola bilməz");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setSending(true);
    try {
      const path = `chat/${studentId}/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      const fileUrl = await getDownloadURL(storageRef);

      await addDoc(collection(db, "messages", studentId, "thread"), {
        senderId: currentUserId,
        senderRole: currentUserRole,
        fileUrl,
        fileName: file.name,
        createdAt: serverTimestamp(),
        read: false,
      });
    } catch {
      showToast("Fayl yüklənərkən xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.");
    } finally {
      setSending(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  /* Find the last message sent by the current user for read-receipt display */
  const lastOwnMessageIndex = (() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].senderRole === currentUserRole) return i;
    }
    return -1;
  })();

  const hasText = text.trim().length > 0;

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {/* Empty state */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-gray-400">
            <MessageSquare size={40} strokeWidth={1.5} />
            <p className="text-sm">Hələ mesaj yoxdur &mdash; söhbətə başlayın!</p>
          </div>
        )}

        {messages.map((message, index) => {
          const mine = message.senderRole === currentUserRole;
          const showReceipt = mine && index === lastOwnMessageIndex;
          return (
            <div key={message.id} className={cn("flex flex-col", mine ? "items-end" : "items-start")}>
              <div
                className={cn(
                  "max-w-[80%] rounded-card px-4 py-2 text-sm",
                  mine ? "bg-blue text-white" : "bg-light text-navy"
                )}
              >
                {message.text && <p>{message.text}</p>}
                {message.fileUrl && (
                  <a
                    href={message.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                  >
                    {message.fileName ?? "Fayl"}
                  </a>
                )}
                {/* Timestamp */}
                <p
                  className={cn(
                    "mt-1 text-[10px] leading-none",
                    mine ? "text-white/60 text-right" : "text-gray-400"
                  )}
                >
                  {formatMessageTime(message.createdAt)}
                </p>
              </div>
              {/* Read receipt — shown only after the last message sent by the current user */}
              {showReceipt && (
                <span className="mt-0.5 mr-1 text-[10px] text-gray-400">
                  {message.read ? "Oxundu ✓✓" : "Göndərildi ✓"}
                </span>
              )}
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      <div className="flex items-center gap-2 border-t border-gray-200 p-3">
        <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.docx" onChange={handleFileUpload} />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          aria-label="Fayl əlavə et"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-light hover:text-navy"
        >
          <Paperclip size={18} />
        </button>
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") sendMessage();
          }}
          maxLength={2000}
          placeholder="Mesaj yazın..."
          className="flex-1 rounded-pill border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <button
          type="button"
          onClick={sendMessage}
          disabled={sending || !hasText}
          aria-label="Göndər"
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors",
            hasText
              ? "bg-blue text-white hover:bg-blue/90"
              : "bg-gray-100 text-gray-400 cursor-default"
          )}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
