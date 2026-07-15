"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useRouter } from "next/navigation";
import { Clock, BookOpen, UserCheck, ShieldAlert, Check } from "lucide-react";

export default function TrainingPage() {
  const router = useRouter();
  const { courses, currentUser, enrollInCourse, registrations } = useStore();

  const [loadingCourseId, setLoadingCourseId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");

  const handleEnrollment = (courseId: string, courseTitle: string) => {
    if (!currentUser) {
      // Redirect to login
      router.push(`/login?redirect=/training&notice=Please+sign+in+to+enroll+in+academy+courses.`);
      return;
    }

    setLoadingCourseId(courseId);
    
    // Enroll the logged in user
    enrollInCourse(currentUser.id, courseId);

    setTimeout(() => {
      setLoadingCourseId(null);
      setSuccessMsg(`Congratulations! You have successfully registered for: ${courseTitle}. You can track your registration in your User Dashboard.`);
      setTimeout(() => {
        setSuccessMsg("");
      }, 5000);
    }, 1200);
  };

  // Helper to check if already registered
  const isRegistered = (courseId: string) => {
    if (!currentUser) return false;
    return registrations.some(r => r.user_id === currentUser.id && r.course_id === courseId);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 bg-zinc-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="border-b border-border pb-6 mb-12 text-center max-w-3xl mx-auto space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              AgroFly Flight Academy
            </h1>
            <p className="text-zinc-400 text-base">
              Get certified, learn chemical safety, master autonomous mapping configurations, and build your flight operations team under the guidance of FAA-approved flight instructors.
            </p>
          </div>

          {/* Success Banner */}
          {successMsg && (
            <div className="mb-8 p-4 rounded-xl border border-emerald-500/25 bg-emerald-500/5 text-primary text-sm flex items-center gap-3 max-w-3xl mx-auto animate-pulse">
              <UserCheck className="w-5 h-5 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Courses List */}
          <div className="space-y-12 max-w-5xl mx-auto">
            {courses.map((course) => {
              const enrolled = isRegistered(course.id);
              
              return (
                <div 
                  key={course.id} 
                  className="glassmorphism border border-border rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8 hover:border-primary/30 transition-all glow-primary-hover"
                >
                  {/* Photo Column */}
                  <div className="md:col-span-4 aspect-video md:aspect-square bg-zinc-900 border border-border/80 rounded-2xl overflow-hidden">
                    <img 
                      src={course.image_url} 
                      alt={course.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Body & Specs Column */}
                  <div className="md:col-span-8 flex flex-col justify-between space-y-6">
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-3 text-xs text-zinc-400 items-center">
                        <span className="flex items-center gap-1 bg-zinc-900 border border-border px-2.5 py-1 rounded-full">
                          <Clock className="w-3.5 h-3.5 text-primary" /> {course.duration}
                        </span>
                        <span className="flex items-center gap-1 bg-zinc-900 border border-border px-2.5 py-1 rounded-full">
                          <BookOpen className="w-3.5 h-3.5 text-primary" /> 4 Core Modules
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                        {course.title}
                      </h2>
                      <p className="text-zinc-400 text-sm leading-relaxed">
                        {course.description}
                      </p>

                      {/* Syllabus list */}
                      <div className="pt-2">
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-2">Syllabus Overview</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {course.syllabus.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-zinc-300 text-xs">
                              <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-border/50 pt-4 mt-auto">
                      <span className="text-2xl font-extrabold text-white">
                        ${course.price.toLocaleString()}
                      </span>

                      {enrolled ? (
                        <span className="px-5 py-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-primary text-xs font-bold flex items-center gap-1.5 cursor-default">
                          ✓ Enrolled & Registered
                        </span>
                      ) : (
                        <button
                          onClick={() => handleEnrollment(course.id, course.title)}
                          disabled={loadingCourseId === course.id}
                          className="w-full sm:w-auto px-6 py-2.5 bg-primary hover:bg-emerald-600 text-primary-foreground font-bold rounded-xl text-xs transition-all hover:scale-[1.02] disabled:opacity-50"
                        >
                          {loadingCourseId === course.id ? "Registering..." : "Enroll Now"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Academy Quality Seals */}
          <div className="mt-20 border-t border-border/60 pt-12 text-center space-y-6 max-w-4xl mx-auto">
            <h3 className="text-white font-bold text-lg">Industry Certification Partners & Compliance</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-4 rounded-xl bg-zinc-900/40 border border-border flex items-center gap-3">
                <ShieldAlert className="w-8 h-8 text-primary flex-shrink-0" />
                <div className="text-left">
                  <h4 className="text-white text-xs font-bold uppercase">FAA Part 107 compliant</h4>
                  <p className="text-zinc-500 text-[11px] mt-0.5">Complies with federal airspace laws.</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-zinc-900/40 border border-border flex items-center gap-3">
                <Clock className="w-8 h-8 text-primary flex-shrink-0" />
                <div className="text-left">
                  <h4 className="text-white text-xs font-bold uppercase">FAA Part 137 Training</h4>
                  <p className="text-zinc-500 text-[11px] mt-0.5">Focuses on safe heavy-payload flight operations.</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-zinc-900/40 border border-border flex items-center gap-3">
                <UserCheck className="w-8 h-8 text-primary flex-shrink-0" />
                <div className="text-left">
                  <h4 className="text-white text-xs font-bold uppercase">100% Success Guarantee</h4>
                  <p className="text-zinc-500 text-[11px] mt-0.5">Uncapped retakes on FAA regulations training.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
