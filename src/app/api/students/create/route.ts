import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { generateSecurePassword } from "@/lib/utils/generatePassword";
import { sendCredentialsEmail } from "@/lib/email/sendPasswordEmail";

export async function POST(req: NextRequest) {
  try {
    // 1. Verify the caller is a signed-in, approved teacher
    const token = req.headers.get("authorization")?.split("Bearer ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = await adminAuth.verifyIdToken(token);
    const callerSnap = await adminDb.collection("users").doc(decoded.uid).get();
    const caller = callerSnap.data();

    if (!caller || caller.role !== "teacher" || caller.status !== "approved") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 2. Validate input
    const { name, email, grade } = await req.json();
    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    // 3. Generate password server-side — never chosen by the user
    const password = generateSecurePassword();

    // 4. Create the Firebase Auth user
    const newUser = await adminAuth.createUser({ email, password, displayName: name });

    // 5. Create the Firestore profile
    await adminDb.collection("users").doc(newUser.uid).set({
      role: "student",
      status: "approved",
      name,
      email,
      createdAt: new Date(),
      createdBy: decoded.uid,
    });

    if (grade) {
      await adminDb.collection("students").doc(newUser.uid).set({ grade });
    }

    // 6. Email the password — never included in this response
    await sendCredentialsEmail({ to: email, name, password, role: "student" });

    return NextResponse.json({ success: true, uid: newUser.uid });
  } catch (error) {
    console.error("Add student error:", error instanceof Error ? error.message : "unknown");
    return NextResponse.json({ error: "Failed to create student" }, { status: 500 });
  }
}