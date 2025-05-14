"use client";
import { useState } from "react";
import { auth }       from "lib/firebase";
import { useRouter }  from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"client"|"contractor">("client");
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await createUserWithEmailAndPassword(auth, email, password);
    // TODO: save `role` in Firestore under /users/{uid}  
    router.push(`/${role}/dashboard`);
  }

  return (
    <form onSubmit={onSubmit} className="max-w-md mx-auto p-4 space-y-4">
      <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="Email" required className="w-full px-4 py-2 border rounded"/>
      <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" required className="w-full px-4 py-2 border rounded"/>
      <select value={role} onChange={e=>setRole(e.target.value as any)} className="w-full px-4 py-2 border rounded">
        <option value="client">Homeowner</option>
        <option value="contractor">Contractor</option>
      </select>
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Sign Up</button>
    </form>
  );
}
typescriptreact
import React from 'react';

const SignUpPage: React.FC = () => {
  return (
    <div>
      <h1>Sign Up Page - TODO: Implement sign-up form and logic</h1>
    </div>
  );
};

export default SignUpPage;