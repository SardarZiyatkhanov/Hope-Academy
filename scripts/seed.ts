import { config } from "dotenv";

config({ path: ".env.local" });

import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  setDoc,
  Timestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const DEMO_PASSWORD = "demo1234";

async function getOrCreateUser(email: string, password: string) {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    return credential.user.uid;
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "auth/email-already-in-use") {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      return credential.user.uid;
    }
    throw error;
  }
}

async function main() {
  console.log("Creating auth users and profiles...");

  const managerId = await getOrCreateUser("manager@demo.com", DEMO_PASSWORD);
  await setDoc(doc(db, "users", managerId), {
    email: "manager@demo.com",
    name: "Aytən Həsənova",
    role: "manager",
    createdAt: serverTimestamp(),
  });

  const studentId = await getOrCreateUser("student@demo.com", DEMO_PASSWORD);

  const studentDoc = await getDoc(doc(db, "users", studentId));
  if (studentDoc.exists()) {
    console.log("Demo data already exists, skipping.");
    return;
  }

  await setDoc(doc(db, "users", studentId), {
    email: "student@demo.com",
    name: "Nigar Jabbarova",
    role: "student",
    managerId,
    phone: "+994501234567",
    createdAt: serverTimestamp(),
  });

  const superadminId = await getOrCreateUser("admin@demo.com", DEMO_PASSWORD);
  await setDoc(doc(db, "users", superadminId), {
    email: "admin@demo.com",
    name: "Hope Academy Admin",
    role: "superadmin",
    createdAt: serverTimestamp(),
  });

  console.log("Creating universities...");
  const universities = [
    {
      name: "TU Berlin",
      country: "Almaniya",
      city: "Berlin",
      ieltsMin: 6.5,
      tuitionPerYear: 0,
      specialties: ["Computer Science", "Mechanical Engineering"],
    },
    {
      name: "TU Delft",
      country: "Niderland",
      city: "Delft",
      ieltsMin: 6.5,
      tuitionPerYear: 2000,
      specialties: ["Data Science", "Civil Engineering"],
    },
    {
      name: "Charles University",
      country: "Çexiya",
      city: "Praga",
      ieltsMin: 6.0,
      tuitionPerYear: 3000,
      specialties: ["Economics", "Medicine"],
    },
  ];

  const universityIds: Record<string, string> = {};
  for (const university of universities) {
    const universityRef = await addDoc(collection(db, "universities"), {
      ...university,
      createdAt: serverTimestamp(),
    });
    universityIds[university.name] = universityRef.id;
  }

  console.log("Creating applications...");
  const applications = [
    {
      university: "TU Berlin",
      program: "M.Sc. Computer Science",
      status: "docs_ready",
      notes: "Menencer diplom yoxlayır",
    },
    {
      university: "TU Delft",
      program: "M.Sc. Data Science",
      status: "accepted",
      notes: "Viza üçün əlaqə saxlayın",
    },
    {
      university: "Charles University",
      program: "M.Sc. Economics",
      status: "reviewing",
      notes: "Cavab 4-6 həftə ərzində",
    },
  ];

  for (const application of applications) {
    const university = universities.find((item) => item.name === application.university);
    if (!university) continue;

    await addDoc(collection(db, "applications"), {
      studentId,
      universityId: universityIds[application.university],
      universityName: university.name,
      universityCountry: university.country,
      program: application.program,
      status: application.status,
      notes: application.notes,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      statusHistory: [
        {
          status: application.status,
          changedAt: Timestamp.now(),
          changedBy: managerId,
        },
      ],
    });
  }

  console.log("Creating leads...");
  const leads = [
    {
      name: "Kamran",
      surname: "Əliyev",
      phone: "+994557654321",
      email: "kamran.aliyev@example.com",
      country: "Almaniya",
      level: "master",
      specialty: "Computer Science",
      status: "new",
    },
    {
      name: "Leyla",
      surname: "Mustafayeva",
      phone: "+994701234567",
      email: "leyla.mustafayeva@example.com",
      country: "Belçika",
      level: "bachelor",
      specialty: "Business",
      status: "consultation",
    },
  ];

  for (const lead of leads) {
    await addDoc(collection(db, "leads"), {
      ...lead,
      assignedTo: managerId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  console.log("Creating documents...");
  const documents = [
    { type: "passport", name: "Pasport.pdf" },
    { type: "diploma", name: "Diplom.pdf" },
    { type: "ielts", name: "IELTS_6.5.pdf" },
  ];

  for (const document of documents) {
    await addDoc(collection(db, "documents"), {
      studentId,
      type: document.type,
      name: document.name,
      fileUrl: "#",
      fileSize: 0,
      mimeType: "application/pdf",
      uploadedBy: studentId,
      uploadedAt: serverTimestamp(),
    });
  }

  console.log("Creating chat messages...");
  const messages = [
    { sender: "manager", text: "Salam Nigar, sənədləriniz alındı." },
    { sender: "student", text: "Salam, nə vaxt cavab gözlənilir?" },
    { sender: "manager", text: "TU Berlin adətən 4-6 həftə ərzində cavab verir." },
  ];

  for (const message of messages) {
    await addDoc(collection(db, "messages", studentId, "thread"), {
      senderId: message.sender === "manager" ? managerId : studentId,
      senderRole: message.sender,
      text: message.text,
      createdAt: serverTimestamp(),
      read: message.sender === "manager",
    });
  }

  console.log("Done.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
