"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  collection,
  collectionGroup,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ui/Toast";
import { ContactMessageDoc, LeadDoc, UserDoc } from "@/types";
import { Bell, Mail, MessageSquare, UserPlus, LucideIcon } from "lucide-react";

interface UnreadChatItem {
  studentId: string;
  studentName: string;
}

export function NotificationBell() {
  const { profile } = useAuth();
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [newLeads, setNewLeads] = useState<LeadDoc[]>([]);
  const [newMessages, setNewMessages] = useState<ContactMessageDoc[]>([]);
  const [unreadChats, setUnreadChats] = useState<UnreadChatItem[]>([]);
  const [students, setStudents] = useState<Record<string, UserDoc>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const isStaff = profile?.role === "manager" || profile?.role === "superadmin";

  useEffect(() => {
    if (!open) return;
    const handleClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  useEffect(() => {
    if (!isStaff) return;
    const studentsQuery = query(collection(db, "users"), where("role", "==", "student"));
    const unsubscribe = onSnapshot(studentsQuery, (snapshot) => {
      const map: Record<string, UserDoc> = {};
      snapshot.docs.forEach((docSnap) => {
        map[docSnap.id] = { uid: docSnap.id, ...docSnap.data() } as UserDoc;
      });
      setStudents(map);
    });
    return unsubscribe;
  }, [isStaff]);

  useEffect(() => {
    if (!isStaff) return;
    const leadsQuery = query(collection(db, "leads"), where("status", "==", "new"));
    let initial = true;
    const unsubscribe = onSnapshot(leadsQuery, (snapshot) => {
      if (!initial) {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const lead = change.doc.data() as LeadDoc;
            showToast(`Yeni lid: ${lead.name} ${lead.surname}`);
          }
        });
      }
      initial = false;
      setNewLeads(
        snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as LeadDoc))
      );
    });
    return unsubscribe;
  }, [isStaff, showToast]);

  useEffect(() => {
    if (!isStaff) return;
    const messagesQuery = query(collection(db, "contactMessages"), where("status", "==", "new"));
    let initial = true;
    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      if (!initial) {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const message = change.doc.data() as ContactMessageDoc;
            showToast(`Yeni mesaj: ${message.name}`);
          }
        });
      }
      initial = false;
      setNewMessages(
        snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as ContactMessageDoc))
      );
    });
    return unsubscribe;
  }, [isStaff, showToast]);

  useEffect(() => {
    if (!isStaff) return;
    const threadQuery = query(
      collectionGroup(db, "thread"),
      where("senderRole", "==", "student"),
      where("read", "==", false)
    );
    let initial = true;
    const unsubscribe = onSnapshot(threadQuery, (snapshot) => {
      if (!initial) {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const studentId = change.doc.ref.parent.parent?.id;
            const name = studentId ? students[studentId]?.name ?? "Tələbə" : "Tələbə";
            showToast(`Yeni mesaj: ${name}`);
          }
        });
      }
      initial = false;

      const byStudent = new Map<string, UnreadChatItem>();
      snapshot.docs.forEach((docSnap) => {
        const studentId = docSnap.ref.parent.parent?.id;
        if (!studentId || byStudent.has(studentId)) return;
        byStudent.set(studentId, {
          studentId,
          studentName: students[studentId]?.name ?? "Tələbə",
        });
      });
      setUnreadChats(Array.from(byStudent.values()));
    });
    return unsubscribe;
  }, [isStaff, students, showToast]);

  if (!isStaff) return null;

  const totalCount = newLeads.length + newMessages.length + unreadChats.length;

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Bildirişlər"
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-light hover:text-navy"
      >
        <Bell size={18} />
        {totalCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-pill bg-gold px-1 text-[10px] font-semibold text-white">
            {totalCount > 9 ? "9+" : totalCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-40 mt-2 w-80 rounded-card bg-white p-2 shadow-lg ring-1 ring-gray-100">
          {totalCount === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-gray-400">Yeni bildiriş yoxdur</p>
          ) : (
            <div className="flex flex-col gap-1">
              {newLeads.length > 0 && (
                <NotificationGroup
                  icon={UserPlus}
                  title="Yeni lidlər"
                  href="/admin/leads"
                  onClick={() => setOpen(false)}
                  items={newLeads.slice(0, 3).map((lead) => `${lead.name} ${lead.surname}`)}
                  count={newLeads.length}
                />
              )}
              {newMessages.length > 0 && (
                <NotificationGroup
                  icon={Mail}
                  title="Yeni mesajlar"
                  href="/admin/messages"
                  onClick={() => setOpen(false)}
                  items={newMessages.slice(0, 3).map((message) => message.name)}
                  count={newMessages.length}
                />
              )}
              {unreadChats.length > 0 && (
                <NotificationGroup
                  icon={MessageSquare}
                  title="Oxunmamış mesajlar"
                  href="/admin/chat"
                  onClick={() => setOpen(false)}
                  items={unreadChats.slice(0, 3).map((chat) => chat.studentName)}
                  count={unreadChats.length}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function NotificationGroup({
  icon: Icon,
  title,
  href,
  items,
  count,
  onClick,
}: {
  icon: LucideIcon;
  title: string;
  href: string;
  items: string[];
  count: number;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-start gap-3 rounded-[8px] p-3 transition-colors hover:bg-light"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-light text-blue">
        <Icon size={16} />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-navy">{title}</p>
          <span className="flex h-5 min-w-5 items-center justify-center rounded-pill bg-gold px-1.5 text-xs font-semibold text-white">
            {count}
          </span>
        </div>
        <p className="mt-0.5 truncate text-xs text-gray-400">{items.join(", ")}</p>
      </div>
    </Link>
  );
}
