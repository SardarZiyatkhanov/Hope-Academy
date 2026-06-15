"use client";

import { useRef, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Download, FileText, Upload } from "lucide-react";
import { db, storage } from "@/lib/firebase";
import { DocumentDoc, DocumentType } from "@/types";
import { DOCUMENT_TYPE_LABELS } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_SIZE = 10 * 1024 * 1024;

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface DocumentListProps {
  studentId: string;
  documents: DocumentDoc[];
  uploadedBy: string;
  documentType?: DocumentType;
}

export function DocumentList({
  studentId,
  documents,
  uploadedBy,
  documentType = "other",
}: DocumentListProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      showToast("Yalnız PDF, JPG, PNG və DOCX formatları dəstəklənir");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    if (file.size > MAX_SIZE) {
      showToast("Fayl ölçüsü 10MB-dan çox ola bilməz");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setUploading(true);
    try {
      const path = `documents/${studentId}/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      const fileUrl = await getDownloadURL(storageRef);

      await addDoc(collection(db, "documents"), {
        studentId,
        type: documentType,
        name: file.name,
        fileUrl,
        fileSize: file.size,
        mimeType: file.type,
        uploadedBy,
        uploadedAt: serverTimestamp(),
      });
      showToast("Sənəd uğurla yükləndi");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {documents.length === 0 && (
        <p className="text-sm text-gray-400">Hələ sənəd yüklənməyib</p>
      )}
      {documents.map((document) => (
        <div
          key={document.id}
          className="flex items-center gap-3 rounded-card border border-gray-100 bg-white p-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-light text-blue">
            <FileText size={18} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-navy">{document.name}</p>
            <p className="text-xs text-gray-500">
              {DOCUMENT_TYPE_LABELS[document.type]} · {formatSize(document.fileSize)}
            </p>
          </div>
          <a
            href={document.fileUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Yüklə"
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-light hover:text-navy"
          >
            <Download size={16} />
          </a>
        </div>
      ))}

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".pdf,.jpg,.jpeg,.png,.docx"
        onChange={handleUpload}
      />
      <Button
        type="button"
        variant="ghost"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="border border-dashed border-gray-300"
      >
        <Upload size={16} />
        {uploading ? "Yüklənir..." : "Sənəd yüklə"}
      </Button>
    </div>
  );
}
