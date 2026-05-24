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

function getClientApp() {
  if (getApps().length > 0) return getApps()[0];

  const firebaseConfig = JSON.parse(
    process.env.NEXT_PUBLIC_FIREBASE_CONFIG || "{}"
  );

  return initializeApp(firebaseConfig);
}

const app = getClientApp();
const db = getFirestore(app);
const projectsRef = collection(db, "projects");

export async function fetchAllProjects(): Promise<Project[]> {
  const q = query(projectsRef, orderBy("order", "asc"));
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
  const docRef = doc(projectsRef, slug);
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
  await deleteDoc(doc(projectsRef, slug));
}

export async function updateProjectOrder(
  orderUpdates: { slug: string; order: number }[]
): Promise<void> {
  const batch = writeBatch(db);
  const now = Timestamp.now();
  for (const { slug, order } of orderUpdates) {
    batch.update(doc(projectsRef, slug), { order, updatedAt: now });
  }
  await batch.commit();
}
