"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Send, CheckCircle, Cpu } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleResetRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);

    // Simulate link dispatching
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background relative flex flex-col justify-center items-center px-6 py-12 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      {/* Floating Home Link */}
      <Link 
        href="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to website
      </Link>

      <div className="w-full max-w-md space-y-8 glassmorphism p-8 rounded-2xl glow-primary">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-md shadow-primary/20">
            <Cpu className="w-6 h-6" />
          </div>
        </div>

        {/* Success State */}
        {success ? (
          <div className="space-y-6 text-center">
            <div className="flex justify-center text-primary">
              <CheckCircle className="w-16 h-16 animate-bounce" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-white">Check your email</h2>
              <p className="text-zinc-400 text-sm leading-relaxed">
                We've sent a password reset link to <strong className="text-zinc-200">{email}</strong>. Please follow the instructions in the email to restore access.
              </p>
            </div>
            <Link
              href="/login"
              className="inline-flex w-full items-center justify-center gap-2 py-2.5 px-4 bg-zinc-900 border border-border text-white hover:bg-zinc-800 font-semibold rounded-xl transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Sign In
            </Link>
          </div>
        ) : (
          /* Normal State */
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-extrabold tracking-tight text-white">
                Reset Password
              </h1>
              <p className="text-zinc-400 text-sm">
                Enter your email address and we'll send you a recovery link.
              </p>
            </div>

            <form onSubmit={handleResetRequest} className="space-y-5">
              {error && (
                <div className="p-3 text-sm rounded-lg border border-red-500/20 bg-red-500/5 text-red-400">
                  {error}
                </div>
              )}

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

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-zinc-950 transition-all disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? "Sending link..." : "Send Reset Link"}
                {!loading && <Send className="w-4 h-4" />}
              </button>
            </form>

            <div className="text-center text-sm">
              <Link
                href="/login"
                className="font-semibold text-primary hover:underline transition-all"
              >
                Return to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
