"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Avatar } from "@/components/ui/Avatar";
import { ChatThread } from "@/components/features/ChatThread";
import { cn } from "@/lib/cn";
import { UserDoc } from "@/types";

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
    const unreadQuery = query(
      collection(db, "messages", student.uid, "thread"),
      where("senderRole", "==", "student"),
      where("read", "==", false)
    );
    const unsubscribe = onSnapshot(unreadQuery, (snapshot) => setUnread(snapshot.size));
    return unsubscribe;
  }, [student.uid]);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-[8px] px-3 py-2.5 text-left transition-colors",
        active ? "bg-blue text-white" : "hover:bg-light"
      )}
    >
      <Avatar name={student.name} />
      <span className={cn("flex-1 text-sm font-medium", active ? "text-white" : "text-navy")}>
        {student.name}
      </span>
      {unread > 0 && (
        <span
          className={cn(
            "flex h-5 min-w-5 items-center justify-center rounded-pill px-1.5 text-xs font-semibold",
            active ? "bg-white text-blue" : "bg-gold text-white"
          )}
        >
          {unread}
        </span>
      )}
    </button>
  );
}

export default function AdminChatPage() {
  const [students, setStudents] = useState<UserDoc[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const studentsQuery = query(collection(db, "users"), where("role", "==", "student"));
    const unsubscribe = onSnapshot(studentsQuery, (snapshot) => {
      const list = snapshot.docs.map(
        (docSnap) => ({ uid: docSnap.id, ...docSnap.data() } as UserDoc)
      );
      setStudents(list);
      setActiveId((current) => current ?? list[0]?.uid ?? null);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="flex h-[calc(100vh-7rem)] overflow-hidden rounded-card bg-white">
      <div className="w-64 shrink-0 overflow-y-auto border-r border-gray-100 p-3">
        <h2 className="mb-2 px-3 text-xs font-semibold uppercase text-gray-400">Tələbələr</h2>
        <div className="flex flex-col gap-1">
          {students.map((student) => (
            <ChatListItem
              key={student.uid}
              student={student}
              active={student.uid === activeId}
              onClick={() => setActiveId(student.uid)}
            />
          ))}
          {students.length === 0 && <p className="px-3 text-sm text-gray-400">Tələbə yoxdur</p>}
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeId ? (
          <ChatThread studentId={activeId} currentUserRole="manager" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            Tələbə seçin
          </div>
        )}
      </div>
    </div>
  );
}
