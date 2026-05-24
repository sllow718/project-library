import { initializeApp, getApps, cert, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import type { Project } from "./types";

function getAdminApp() {
  if (getApps().length > 0) return getApps()[0];

  if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
    return initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID!,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
    });
  }

  return initializeApp({
    credential: applicationDefault(),
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
}

const app = getAdminApp();
const db = getFirestore(app);
const projectsRef = db.collection("projects");

export async function getLiveProjects(): Promise<Project[]> {
  const snapshot = await projectsRef
    .where("status", "==", "live")
    .orderBy("order", "asc")
    .get();

  return snapshot.docs.map((doc) => ({
    slug: doc.id,
    ...doc.data(),
  })) as Project[];
}

export async function getLiveProjectBySlug(slug: string): Promise<Project | null> {
  const doc = await projectsRef.doc(slug).get();
  if (!doc.exists) return null;
  const data = doc.data() as Omit<Project, "slug">;
  if (data.status !== "live") return null;
  return { slug: doc.id, ...data } as Project;
}

export async function getAllProjectSlugs(): Promise<string[]> {
  const snapshot = await projectsRef.select().get();
  return snapshot.docs.map((doc) => doc.id);
}

export async function getAllProjects(): Promise<Project[]> {
  const snapshot = await projectsRef.orderBy("order", "asc").get();
  return snapshot.docs.map((doc) => ({
    slug: doc.id,
    ...doc.data(),
  })) as Project[];
}
