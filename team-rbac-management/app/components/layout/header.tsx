"use client";
import { User } from "@/app/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface HeaderProps {
  user: User | null;
}
const Header = ({ user }: HeaderProps) => {
  const pathname = usePathname();
  const user1 = false;
  const navigation = [
    { name: "Home", href: "/", show: true },
    { name: "Dashboard", href: "/dashboard", show: true },
  ].filter((item) => item.show);

  const getNavItemClass = (href: string) => {
    let isActive = false;
    if (href === "/") {
      isActive = pathname === "/";
    } else if (href === "/dashboard") {
      isActive = pathname.startsWith(href);
    }
    return `px-3 py-2 rounded text-sm font-medium transition-colors ${isActive ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`;
  };
  return (
    <header className="bg-slate-900 border-b border-slate-700">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="font-bold text-xl text-white">
            TeamAccess
          </Link>

          <nav className="flex items-center">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={getNavItemClass(item.href)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          {/* User info*/}
          <div className="flex items-center space-x-4">
            {user1 ? (
              <>
                <span className="text-sm text-slate-300">Test User</span>
                <button className="px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-700 transition-colors">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-3 py-2 text-slate-300 text-sm hover:bg-slate-600 transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-3 py-2 border bg-blue-600 text-sm rounded hover:bg-red-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
