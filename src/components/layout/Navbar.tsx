// src/components/layout/Navbar.tsx
"use client";

import { auth } from "lib/firebase";
import { db } from "lib/firestore"; // Import db
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Menu, Briefcase, Search, UserCircle, Bell, HomeIcon, PlusCircleIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore'; // Import doc and getDoc
import { NotificationBell } from '@/components/shared/NotificationBell';

const navLinks = [
  { href: '/', label: 'Home', icon: <HomeIcon className="h-4 w-4" /> },
  { href: '/client/create-bid', label: 'Post a Project', icon: <PlusCircleIcon className="h-4 w-4" /> },
  { href: '/contractor/dashboard', label: 'Find Projects', icon: <Search className="h-4 w-4" /> },
  // { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> }, // Example for a generic dashboard
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, loading, error] = useAuthState(auth);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!mounted) {
    return ( // Return a basic skeleton or null during SSR to avoid hydration issues with isScrolled
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center space-x-2">
            <Briefcase className="h-7 w-7 text-primary" />
            <span className="font-bold text-xl text-primary">SwiftBid</span>
          </Link>
          {/* Basic structure for skeleton */}
          <div className="flex items-center space-x-2">
             <div className="h-8 w-20 bg-muted rounded-md animate-pulse"></div>
             <div className="h-8 w-8 bg-muted rounded-full animate-pulse"></div>
          </div>
        </div>
      </header>
    );
  }

  async function go(destination: "post"|"find") {
    if (user) {
      const snap = await getDoc(doc(db, "users", user.uid));
      const role = snap.data()?.role;
      if (destination === "post" && role === "client") router.push("/client/dashboard");
      if (destination === "find" && role === "contractor") router.push("/contractor/dashboard");
    } else {
      router.push('/auth/signin');
    }
  };

  const filteredNavLinks = navLinks.filter(link => link.href === '/'); // Only keep the 'Home' link for now

  return (
    <header className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ease-in-out ${isScrolled ? 'border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm' : 'border-transparent bg-background'}`}>
      <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2 group">
          <Briefcase className="h-7 w-7 text-primary transition-transform group-hover:rotate-[-5deg] group-hover:scale-110" />
          <span className="font-bold text-xl text-primary">SwiftBid</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          {filteredNavLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
 {
            user ? (
              <>
                <Button variant="ghost" size="sm" onClick={() => go("post")} className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">
                  Post a Project
                </Button>
                <Button variant="ghost" size="sm" onClick={() => go("find")} className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">
                  Find Projects
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => router.push('/auth/signin')} className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">
                   Login
                </Button>
                <Button variant="ghost" size="sm" onClick={() => router.push('/auth/signup')} className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">
                  Sign Up
                </Button>
              </>
            )
          }
        </nav>

        <div className="flex items-center space-x-3">
          <NotificationBell />
 {
            user ? ( // Show sign out button when authenticated
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <UserCircle className="mr-2 h-4 w-4" /> Sign Out
              </Button>
            ) : (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/auth/signin">
                    <UserCircle className="mr-2 h-4 w-4" /> Login
                  </Link>
                </Button>
                <Button size="sm" asChild>
                   <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </>
            )
          }

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[340px] p-6 bg-card">
              <div className="flex flex-col space-y-6">
                <Link href="/" className="flex items-center space-x-2 mb-6">
                  <Briefcase className="h-7 w-7 text-primary" />
                  <span className="font-bold text-xl text-primary">SwiftBid</span>
                </Link>
 {
                  filteredNavLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="flex items-center space-x-3 rounded-md p-2 text-lg font-medium text-foreground hover:bg-muted hover:text-primary transition-colors"
                    >
                      {link.icon}
                      <span>{link.label}</span>
                    </Link>
                  ))
                }
 {
                  user ? (
                    <>
                      <button onClick={() => go("post")} className="flex items-center space-x-3 rounded-md p-2 text-lg font-medium text-foreground hover:bg-muted hover:text-primary transition-colors">
                         <PlusCircleIcon className="h-4 w-4" />
                         <span>Post a Project</span>
                      </button>
                      <button onClick={() => go("find")} className="flex items-center space-x-3 rounded-md p-2 text-lg font-medium text-foreground hover:bg-muted hover:text-primary transition-colors">
                        <Search className="h-4 w-4" />
                        <span>Find Projects</span>
                      </button>
                      <button onClick={() => auth.signOut()} className="flex items-center space-x-3 rounded-md p-2 text-lg font-medium text-foreground hover:bg-muted hover:text-primary transition-colors">
                         <UserCircle className="h-4 w-4" />
                         <span>Sign Out</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/auth/signin" className="flex items-center space-x-3 rounded-md p-2 text-lg font-medium text-foreground hover:bg-muted hover:text-primary transition-colors">
                        <UserCircle className="h-4 w-4" />
                        <span>Login</span>
                      </Link>
                      <Link href="/auth/signup" className="flex items-center space-x-3 rounded-md p-2 text-lg font-medium text-foreground hover:bg-muted hover:text-primary transition-colors">
                         <UserCircle className="h-4 w-4" />
                         <span>Sign Up</span>
                      </Link>
                    </>
                  )
                }
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
