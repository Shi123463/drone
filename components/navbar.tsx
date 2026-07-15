"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";
import { Menu, X, User, LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";


export default function Navbar() {
  const pathname = usePathname();
  const { currentUser, logout } = useStore();
  const { theme, setTheme } = useTheme();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Drones", href: "/drones" },
    { name: "Services", href: "/services" },
    { name: "Training", href: "/training" },
    { name: "Gallery", href: "/gallery" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="sticky top-0 z-50 glassmorphism border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img src="/logo.png" alt="AgroFly Systems" className="h-12 w-auto object-contain" />
          </Link>

          {/* Desktop Nav links */}
          <div className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.href)
                    ? "text-primary bg-primary/10"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop User Panel */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition-colors"
              aria-label="Toggle Theme"
            >
              <Sun className="h-4.5 w-4.5 hidden dark:block text-amber-400" />
              <Moon className="h-4.5 w-4.5 block dark:hidden text-zinc-800" />
            </button>

            {currentUser ? (
              <div className="flex items-center gap-2">
                <Link
                  href={currentUser.role === "admin" ? "/admin" : "/dashboard"}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold border border-primary/20 hover:border-primary/50 text-primary bg-primary/5 transition-all"
                >
                  <User className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-1.5 bg-primary text-primary-foreground font-semibold rounded-lg text-sm hover:bg-emerald-600 shadow-md shadow-primary/10 transition-all"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Buttons */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900"
            >
              <Sun className="h-4.5 w-4.5 hidden dark:block text-amber-400" />
              <Moon className="h-4.5 w-4.5 block dark:hidden text-zinc-700" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-zinc-950 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-base font-semibold ${
                isActive(link.href)
                  ? "text-primary bg-primary/10"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-border mt-4">
            {currentUser ? (
              <div className="space-y-2">
                <Link
                  href={currentUser.role === "admin" ? "/admin" : "/dashboard"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-primary/10 text-primary rounded-lg text-sm font-semibold border border-primary/20"
                >
                  <User className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-red-500/10 text-red-400 rounded-lg text-sm font-semibold border border-red-500/25"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center w-full px-4 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg text-sm"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
