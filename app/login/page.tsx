"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {
  KeyRound,
  Mail,
  ArrowRight,
  UserCheck,
  Cpu,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"customer" | "admin">("customer");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  setError("");
  setSuccess("");

  if (!email || !password) {
    setError("Please enter email and password.");
    return;
  }

  setLoading(true);

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", data.user.id)
      .single();

    setSuccess("Login Successful!");

    setTimeout(() => {
      if (profile?.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    }, 1000);
  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-background relative overflow-hidden">
      {/* Background glowing decorations */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[450px] h-[450px] rounded-full bg-emerald-600/5 blur-[150px] pointer-events-none" />

      {/* Left side: Premium Branding Column (Hidden on mobile) */}
      <div className="hidden lg:flex lg:col-span-5 bg-zinc-950 border-r border-border flex-col justify-between p-12 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/20 via-transparent to-transparent pointer-events-none" />
        
        {/* Top Header */}
        <Link href="/" className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-md shadow-primary/20">
            <Cpu className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            AgroFly <span className="text-primary">Systems</span>
          </span>
        </Link>

        {/* Center Testimonial/Hero Statement */}
        <div className="space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-xs text-primary font-medium">
            <UserCheck className="w-3.5 h-3.5" /> Autonomous Precision Farming
          </div>
          <h2 className="text-4xl font-extrabold text-white leading-tight">
            Managing your agricultural operations, simplified.
          </h2>
          <p className="text-zinc-400 text-base leading-relaxed">
            Purchase cutting-edge heavy-lift drones, request customized crop spraying operations, and monitor certifications in our unified portal.
          </p>
        </div>

        {/* Bottom footer credit */}
        <div className="text-xs text-zinc-500 relative z-10">
          &copy; {new Date().getFullYear()} AgroFly Systems Inc. All rights reserved.
        </div>
      </div>

      {/* Right side: Login Form Column */}
      <div className="lg:col-span-7 flex flex-col justify-center items-center px-6 py-12 sm:px-12 lg:px-20 relative">
        {/* Floating Home Link for mobile users */}
        <Link 
          href="/" 
          className="absolute top-8 right-8 text-sm text-zinc-400 hover:text-white transition-colors"
        >
          Back to website
        </Link>

        <div className="w-full max-w-md space-y-8 relative">
          {/* Header */}
          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Welcome back
            </h1>
            <p className="text-zinc-400">
              Sign in to manage your bookings, courses, or inventory.
            </p>
          </div>


          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-3 text-sm rounded-lg border border-red-500/20 bg-red-500/5 text-red-400">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 text-sm rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-primary">
                {success}
              </div>
            )}

            {/* Role Tab Buttons */}
            <div className="grid grid-cols-2 p-1 bg-zinc-900 border border-border rounded-xl">
              <button
                type="button"
                onClick={() => setRole("customer")}
                className={`py-2 rounded-lg text-sm font-semibold transition-all ${
                  role === "customer"
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Customer Portal
              </button>
              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`py-2 rounded-lg text-sm font-semibold transition-all ${
                  role === "admin"
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Admin Panel
              </button>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-zinc-300">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-border text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-sm font-medium text-zinc-300">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary hover:underline transition-all"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
                  <KeyRound className="w-4 h-4" />
                </span>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-border text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-zinc-950 transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? "Authenticating..." : `Sign In as ${role === "admin" ? "Admin" : "Customer"}`}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {/* Switch to Register */}
          <div className="text-center text-sm text-zinc-400">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-primary hover:underline transition-all"
            >
              Create free account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
