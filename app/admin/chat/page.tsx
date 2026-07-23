"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { Avatar } from "@/components/ui/Avatar";
import { ChatThread } from "@/components/features/ChatThread";
import { cn } from "@/lib/cn";
import { UserDoc } from "@/types";
import { MessageSquare, Search } from "lucide-react";

function ChatListItem({
  student,
  active,
  onClick,
}: {
  student: UserDoc;
  active: boolean;
  onClick: () => void;
}) {
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const q = query(
      collection(db, "messages", student.uid, "thread"),
      where("senderRole", "==", "student"),
      where("read", "==", false)
    );
    return onSnapshot(q, (snap) => setUnread(snap.size));
  }, [student.uid]);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-150",
        active
          ? "bg-navy text-white shadow-sm"
          : "text-navy hover:bg-gray-100"
      )}
    >
      <Avatar
        name={student.name}
        className={cn("h-8 w-8 shrink-0 text-xs", active && "ring-2 ring-white/30")}
      />
      <span className={cn("flex-1 truncate text-[13px] font-medium", active ? "text-white" : "text-navy")}>
        {student.name}
      </span>
      {unread > 0 && (
        <span
          className={cn(
            "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold",
            active ? "bg-white text-navy" : "bg-blue text-white"
          )}
        >
          {unread}
        </span>
      )}
    </button>
  );
}

export default function AdminChatPage() {
  const { user } = useAuth();
  const [students, setStudents] = useState<UserDoc[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const q = query(collection(db, "users"), where("role", "==", "student"));
    return onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({ uid: d.id, ...d.data() } as UserDoc));
      setStudents(list);
      setActiveId((cur) => cur ?? list[0]?.uid ?? null);
    });
  }, []);

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const activeStudent = students.find((s) => s.uid === activeId);

  return (
    <div className="flex flex-col gap-7">
      <div>
        <h1 className="text-xl font-bold text-navy">Mesajlar</h1>
        <p className="mt-0.5 text-sm text-gray-400">Tələbələrlə yazışmalar</p>
      </div>

      <div className="flex h-[calc(100vh-11rem)] overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        {/* Sidebar */}
        <div className="flex w-64 shrink-0 flex-col border-r border-gray-100">
          <div className="border-b border-gray-100 p-3">
            <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2">
              <Search size={13} className="shrink-0 text-gray-400" />
              <input
                type="text"
                placeholder="Axtar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-[13px] text-navy outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-2.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-navy/5">
              <MessageSquare size={12} className="text-navy" />
            </span>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Tələbələr
            </p>
            <span className="ml-auto rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-500">
              {students.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {filtered.map((student) => (
              <ChatListItem
                key={student.uid}
                student={student}
                active={student.uid === activeId}
                onClick={() => setActiveId(student.uid)}
              />
            ))}
            {filtered.length === 0 && (
              <p className="px-3 py-4 text-center text-xs text-gray-400">Tapılmadı</p>
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {activeId ? (
            <>
              {activeStudent && (
                <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-3.5">
                  <Avatar name={activeStudent.name} className="h-8 w-8 text-xs" />
                  <div>
                    <p className="text-sm font-semibold text-navy">{activeStudent.name}</p>
                    <p className="text-xs text-gray-400">{activeStudent.email}</p>
                  </div>
                </div>
              )}
              <div className="flex-1 overflow-hidden">
                <ChatThread studentId={activeId} currentUserId={user?.uid ?? ""} currentUserRole="manager" />
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <MessageSquare size={40} className="mx-auto mb-3 text-gray-200" />
                <p className="text-sm font-medium text-gray-400">Tələbə seçin</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
