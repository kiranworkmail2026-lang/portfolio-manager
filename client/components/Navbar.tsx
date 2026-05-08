"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <Link href="/" className="text-xl font-bold text-indigo-600">
        Portfolio Manager
      </Link>
      <div className="flex items-center gap-4 text-sm">
        <Link href="/blog" className="text-gray-700 hover:text-indigo-600">Blog</Link>
        {user ? (
          <>
            <Link href="/dashboard" className="text-gray-700 hover:text-indigo-600">Dashboard</Link>
            <Link href="/upload" className="text-gray-700 hover:text-indigo-600">Upload</Link>
            <Link href="/analyze" className="text-gray-700 hover:text-indigo-600">Analyse</Link>
            <span className="text-gray-500">{user.email}</span>
            <button onClick={handleLogout} className="text-red-600 hover:text-red-700">Logout</button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-gray-700 hover:text-indigo-600">Login</Link>
            <Link href="/register" className="text-gray-700 hover:text-indigo-600">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
