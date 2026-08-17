import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";
import type { UserProfile } from "@/types/auth";

export class AuthServiceError extends Error {}

export async function signInUser(email: string, password: string) {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return credential.user;
  } catch (error) {
    const code = (error as any)?.code as string | undefined;
    console.error("FIREBASE ERROR CODE:", code); // temporary — remove once confirmed working

    if (
      code === "auth/invalid-credential" ||
      code === "auth/user-not-found" ||
      code === "auth/wrong-password"
    ) {
      throw new AuthServiceError("Invalid email or password");
    }
    if (code === "auth/too-many-requests") {
      throw new AuthServiceError("Too many attempts. Please try again later.");
    }
    throw new AuthServiceError("Something went wrong. Please try again.");
  }
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snapshot = await getDoc(doc(db, "users", uid));
  if (!snapshot.exists()) return null;
  return { uid, ...snapshot.data() } as UserProfile;
}

export async function signOutUser() {
  await firebaseSignOut(auth);
}