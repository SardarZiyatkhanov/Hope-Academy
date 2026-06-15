"use client";

import { useEffect, useRef, useState } from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Paperclip, Send } from "lucide-react";
import { db, storage } from "@/lib/firebase";
import { MessageDoc } from "@/types";
import { cn } from "@/lib/cn";

interface ChatThreadProps {
  studentId: string;
  currentUserRole: "student" | "manager";
}

export function ChatThread({ studentId, currentUserRole }: ChatThreadProps) {
  const [messages, setMessages] = useState<MessageDoc[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  }, [messages.length]);

  const sendMessage = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setSending(true);
    await addDoc(collection(db, "messages", studentId, "thread"), {
      senderId: studentId,
      senderRole: currentUserRole,
      text: trimmed,
      createdAt: serverTimestamp(),
      read: false,
    });
    setText("");
    setSending(false);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSending(true);
    try {
      const path = `chat/${studentId}/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      const fileUrl = await getDownloadURL(storageRef);

      await addDoc(collection(db, "messages", studentId, "thread"), {
        senderId: studentId,
        senderRole: currentUserRole,
        fileUrl,
        fileName: file.name,
        createdAt: serverTimestamp(),
        read: false,
      });
    } finally {
      setSending(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-400">Hələ mesaj yoxdur</p>
        )}
        {messages.map((message) => {
          const mine = message.senderRole === currentUserRole;
          return (
            <div key={message.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
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
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      <div className="flex items-center gap-2 border-t border-gray-100 p-3">
        <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileUpload} />
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
          placeholder="Mesaj yazın..."
          className="flex-1 rounded-pill border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <button
          type="button"
          onClick={sendMessage}
          disabled={sending || !text.trim()}
          aria-label="Göndər"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue text-white transition-colors disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
