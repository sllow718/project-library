import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDocs,
  setDoc,
  deleteDoc,
  doc,
  writeBatch,
  Timestamp,
} from "firebase/firestore";
import type { Project, ProjectFormData } from "./types";

let app: ReturnType<typeof initializeApp>;
let db: ReturnType<typeof getFirestore>;

function parseFirebaseConfig(): object {
  const raw = process.env.NEXT_PUBLIC_FIREBASE_CONFIG;
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    // Vercel may double-wrap NEXT_PUBLIC_ values in quotes
    try {
      return JSON.parse(JSON.parse(raw));
    } catch {
      console.error("Failed to parse NEXT_PUBLIC_FIREBASE_CONFIG:", raw);
      return {};
    }
  }
}

function getClientApp() {
  if (!app) {
    const firebaseConfig = parseFirebaseConfig();
    app = initializeApp(firebaseConfig);
  }
  return app;
}

function getDb() {
  if (!db) {
    db = getFirestore(getClientApp());
  }
  return db;
}

function getProjectsRef() {
  return collection(getDb(), "projects");
}

export async function fetchAllProjects(): Promise<Project[]> {
  const q = query(getProjectsRef(), orderBy("order", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    slug: doc.id,
    ...doc.data(),
  })) as Project[];
}

export async function saveProject(
  slug: string,
  data: ProjectFormData,
  existingOrder?: number
): Promise<void> {
  const docRef = doc(getProjectsRef(), slug);
  const now = Timestamp.now();
  await setDoc(docRef, {
    title: data.title,
    description: data.description,
    icon: data.icon,
    category: data.category,
    tags: data.tags,
    liveUrl: data.liveUrl,
    repoUrl: data.repoUrl || null,
    status: data.status,
    order: existingOrder ?? 0,
    body: data.body,
    updatedAt: now,
    createdAt: existingOrder !== undefined ? undefined : now,
  }, { merge: true });
}

export async function deleteProject(slug: string): Promise<void> {
  await deleteDoc(doc(getProjectsRef(), slug));
}

export async function updateProjectOrder(
  orderUpdates: { slug: string; order: number }[]
): Promise<void> {
  const batch = writeBatch(getDb());
  const now = Timestamp.now();
  for (const { slug, order } of orderUpdates) {
    batch.update(doc(getProjectsRef(), slug), { order, updatedAt: now });
  }
  await batch.commit();
}
