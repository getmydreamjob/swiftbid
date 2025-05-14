"use client";
import { useState } from "react";
import { auth }      from "lib/firebase";
import { db }        from "lib/firestore";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function SignInPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const router                  = useRouter();
  const googleProvider          = new GoogleAuthProvider();

  async function onEmailSignIn(e: React.FormEvent) {
    e.preventDefault();
    await signInWithEmailAndPassword(auth, email, password);
  }
  async function onGoogleSignIn() {
    await signInWithPopup(auth, googleProvider);
  }

  onAuthStateChanged(auth, async user => {
    if (!user) return;
    const snap = await getDoc(doc(db, "users", user.uid));
    const data = snap.data();
    router.push(`/${data?.role || "client"}/dashboard`);
  });

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      {/* Google sign-in button */}
      {/* Email/password form */}
    </div>
  );
}