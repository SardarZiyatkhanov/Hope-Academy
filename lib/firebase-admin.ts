import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let _app: App | undefined;

function getAdminApp(): App {
  if (_app) return _app;
  if (getApps().length > 0) {
    _app = getApps()[0];
    return _app;
  }

  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (serviceAccount) {
    _app = initializeApp({ credential: cert(JSON.parse(serviceAccount)) });
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    _app = initializeApp();
  } else {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (projectId) {
      _app = initializeApp({ projectId });
    } else {
      throw new Error(
        "FIREBASE_SERVICE_ACCOUNT_KEY, GOOGLE_APPLICATION_CREDENTIALS, or NEXT_PUBLIC_FIREBASE_PROJECT_ID is required",
      );
    }
  }
  return _app;
}

let _auth: Auth | undefined;
let _db: Firestore | undefined;

export function getAdminAuth(): Auth {
  if (!_auth) _auth = getAuth(getAdminApp());
  return _auth;
}

export function getAdminDb(): Firestore {
  if (!_db) _db = getFirestore(getAdminApp());
  return _db;
}
