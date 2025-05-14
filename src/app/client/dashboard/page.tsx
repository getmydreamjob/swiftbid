"use client";

import { useState, useEffect } from "react";
import { auth } from "lib/firebase";
import { db } from "lib/firestore";
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, query, where, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function ClientDashboard() {
  const [user, loading] = useAuthState(auth);
  const [requests, setRequests] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
      return;
    }
    if (user) {
      (async () => {
        const q = query(
          collection(db, "requests"),
          where("clientId", "==", user.uid)
        );
        const snap = await getDocs(q);
        setRequests(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      })();
    }
  }, [user, loading, router]);

  return (
    <div>
    </div>
  );
}
