"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Cpu,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"customer" | "admin">("customer");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!fullName) return setError("Full name is required.");
    if (!email) return setError("Email is required.");
    if (!password) return setError("Password is required.");
    if (password !== confirmPassword) return setError("Passwords do not match.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      full_name: fullName,
      role,
    },
  },
});

if (error) throw error;

if (!data.user) {
  throw new Error("User registration failed.");
}

const { error: profileError } = await supabase
  .from("users")
  .insert({
    id: data.user.id,
    name: fullName,
    email,
    role,
  });

if (profileError) throw profileError;

setSuccess("Account created successfully! Redirecting...");

setTimeout(() => {
  router.push(role === "admin" ? "/admin" : "/dashboard");
}, 1500);
    } catch (err: any) {
      setError(err.message || "An error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-background relative overflow-hidden">
      {/* Decors */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[450px] h-[450px] rounded-full bg-emerald-600/5 blur-[150px] pointer-events-none" />

      {/* Left side branding */}
      <div className="hidden lg:flex lg:col-span-5 bg-zinc-950 border-r border-border flex-col justify-between p-12 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/20 via-transparent to-transparent pointer-events-none" />
        
        <Link href="/" className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-md shadow-primary/20">
            <Cpu className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            AgroFly <span className="text-primary">Systems</span>
          </span>
        </Link>

        <div className="space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-xs text-primary font-medium">
            <ShieldCheck className="w-3.5 h-3.5" /> Fast Account Setup
          </div>
          <h2 className="text-4xl font-extrabold text-white leading-tight">
            Join the future of agricultural management.
          </h2>
          <p className="text-zinc-400 text-base leading-relaxed">
            Create an account to book spraying operations, enroll in certification courses, or manage hardware purchases.
          </p>
        </div>

        <div className="text-xs text-zinc-500 relative z-10">
          &copy; {new Date().getFullYear()} AgroFly Systems Inc. All rights reserved.
        </div>
      </div>

      {/* Right side form */}
      <div className="lg:col-span-7 flex flex-col justify-center items-center px-6 py-12 sm:px-12 lg:px-20 relative">
        <Link 
          href="/" 
          className="absolute top-8 right-8 text-sm text-zinc-400 hover:text-white transition-colors"
        >
          Back to website
        </Link>

        <div className="w-full max-w-md space-y-8 relative">
          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Create an account
            </h1>
            <p className="text-zinc-400">
              Get started with AgroFly Systems today.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
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

            {/* Role Select */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Register as:</label>
              <div className="grid grid-cols-2 p-1 bg-zinc-900 border border-border rounded-xl">
                <button
                  type="button"
                  onClick={() => setRole("customer")}
                  className={`py-2 rounded-lg text-sm font-semibold transition-all ${
                    role === "customer"
                      ? "bg-primary text-primary-foreground"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Customer / Farmer
                </button>
                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`py-2 rounded-lg text-sm font-semibold transition-all ${
                    role === "admin"
                      ? "bg-primary text-primary-foreground"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Administrator
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm font-medium text-zinc-300">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
                  <User className="w-4 h-4" />
                </span>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Wilson"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-border text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Email */}
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
                  placeholder="john@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-border text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-zinc-300">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="•••••••• (Min. 6 chars)"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-border text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-zinc-300">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-border text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-zinc-950 transition-all disabled:opacity-50 disabled:pointer-events-none mt-2"
            >
              {loading ? "Creating Account..." : "Create Account"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="text-center text-sm text-zinc-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary hover:underline transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
