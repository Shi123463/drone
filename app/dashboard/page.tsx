"use client";
import React, { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useRouter } from "next/navigation";
import { 
  User, 
  BookOpen, 
  MessageSquare, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Mail, 
  Phone,
  ShieldAlert
} from "lucide-react";

export default function CustomerDashboardPage() {
  const router = useRouter();
  const { currentUser, registrations, courses, enquiries, drones } = useStore();
  const [activeTab, setActiveTab] = useState<"profile" | "courses" | "enquiries">("courses");

  // Redirect to login if user not authenticated
  useEffect(() => {
    // We let the store initialize. If it completes and currentUser is null, we redirect.
    const timeout = setTimeout(() => {
      if (!localStorage.getItem("agrofly_current_user")) {
        router.push("/login?redirect=/dashboard&notice=Please+sign+in+to+view+your+dashboard.");
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [currentUser, router]);

  if (!currentUser) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex flex-col justify-center items-center bg-zinc-950 text-white py-20 px-6">
          <ShieldAlert className="w-12 h-12 text-primary animate-pulse mb-4" />
          <h1 className="text-xl font-bold">Checking Authentication...</h1>
          <p className="text-zinc-500 mt-2 text-sm">Please wait while we verify your session credentials.</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Filter registrations for active user
  const userRegistrations = registrations.filter(r => r.user_id === currentUser.id);

  // Filter enquiries for active user (either by email or user_name match if email is not saved)
  const userEnquiries = enquiries.filter(e => 
    e.email.toLowerCase() === currentUser.email.toLowerCase()
  );

  const statusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-zinc-900 border border-zinc-700 text-zinc-400">Pending</span>;
      case "confirmed":
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 border border-emerald-500/25 text-primary">Confirmed</span>;
      case "completed":
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400">Completed</span>;
      case "cancelled":
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-500/10 border border-red-500/25 text-red-400">Cancelled</span>;
      case "new":
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 border border-emerald-500/25 text-primary">New</span>;
      case "read":
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400">Read</span>;
      case "replied":
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300">Replied</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-zinc-900 border border-zinc-800 text-zinc-500">{status}</span>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 bg-zinc-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Welcome Banner */}
          <div className="glassmorphism p-6 sm:p-8 rounded-3xl border border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-60 h-60 rounded-full bg-primary/5 blur-[80px] pointer-events-none" />
            <div>
              <div className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Customer Portal</div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">{currentUser.full_name}</span>
              </h1>
              <p className="text-zinc-400 text-xs mt-1">
                Manage your pilot academy enrollments and review sales quotes.
              </p>
            </div>
            
            <div className="flex items-center gap-3 bg-zinc-900/60 border border-border px-4 py-2 rounded-xl text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
              <span>Demo LocalStorage Mode</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Sidebar Navigation Tabs (Left - 3 cols) */}
            <div className="lg:col-span-3 space-y-4">
              <div className="flex flex-col gap-1 bg-zinc-900/40 border border-border p-2 rounded-2xl">
                <button
                  onClick={() => setActiveTab("courses")}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${
                    activeTab === "courses" 
                      ? "bg-primary text-primary-foreground" 
                      : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                  }`}
                >
                  <BookOpen className="w-4 h-4" /> My Training Courses
                </button>

                <button
                  onClick={() => setActiveTab("enquiries")}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${
                    activeTab === "enquiries" 
                      ? "bg-primary text-primary-foreground" 
                      : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                  }`}
                >
                  <MessageSquare className="w-4 h-4" /> Submitted Enquiries
                </button>

                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${
                    activeTab === "profile" 
                      ? "bg-primary text-primary-foreground" 
                      : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                  }`}
                >
                  <User className="w-4 h-4" /> My Profile
                </button>
              </div>

              {/* Promo Banner */}
              <div className="p-5 rounded-2xl border border-border bg-zinc-900/20 text-center space-y-3">
                <h4 className="text-white text-xs font-bold">FAA Exams Prep</h4>
                <p className="text-[10px] text-zinc-500 leading-relaxed">
                  Register for our Part 107 Commercial prep package to schedule examinations.
                </p>
                <button 
                  onClick={() => router.push("/training")}
                  className="px-4 py-1.5 bg-primary/10 hover:bg-primary/25 border border-primary/20 text-primary text-[10px] font-bold rounded-lg transition-all"
                >
                  View Academy Courses
                </button>
              </div>
            </div>

            {/* Dashboard Content Panel (Right - 9 cols) */}
            <div className="lg:col-span-9">
              
              {/* Courses Enrollments Grid */}
              {activeTab === "courses" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-3 border-b border-border">
                    <h2 className="text-lg font-bold text-white">Academy Course Registrations</h2>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase">{userRegistrations.length} Enrolled</span>
                  </div>

                  {userRegistrations.length === 0 ? (
                    <div className="text-center py-16 bg-zinc-900/20 border border-dashed border-border rounded-2xl space-y-4">
                      <p className="text-zinc-500 text-xs">You have not registered for any flight academy courses yet.</p>
                      <button 
                        onClick={() => router.push("/training")}
                        className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-lg hover:bg-emerald-600 transition-colors"
                      >
                        Browse Courses
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userRegistrations.map((reg) => {
                        const course = courses.find(c => c.id === reg.course_id);
                        if (!course) return null;

                        return (
                          <div 
                            key={reg.id} 
                            className="glassmorphism p-5 rounded-2xl border border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-primary/20 transition-all"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 bg-zinc-900 border border-border rounded-xl overflow-hidden flex-shrink-0">
                                <img src={course.image_url} alt={course.title} className="w-full h-full object-cover" />
                              </div>
                              <div className="space-y-1">
                                <h3 className="text-white text-sm font-bold leading-snug">{course.title}</h3>
                                <div className="flex items-center gap-3 text-[10px] text-zinc-500">
                                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Registered: {reg.registration_date}</span>
                                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Duration: {course.duration}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 self-end sm:self-auto border-t border-border/40 sm:border-0 pt-3 sm:pt-0 w-full sm:w-auto justify-between sm:justify-start">
                              <span className="text-xs text-zinc-400 font-extrabold">${course.price}</span>
                              {statusBadge(reg.status)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Enquiry Logs list */}
              {activeTab === "enquiries" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-3 border-b border-border">
                    <h2 className="text-lg font-bold text-white">Contact & Quotation Enquiries</h2>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase">{userEnquiries.length} Submitted</span>
                  </div>

                  {userEnquiries.length === 0 ? (
                    <div className="text-center py-16 bg-zinc-900/20 border border-dashed border-border rounded-2xl space-y-4">
                      <p className="text-zinc-500 text-xs">No support or quote enquiries have been sent from this email.</p>
                      <button 
                        onClick={() => router.push("/contact")}
                        className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-lg hover:bg-emerald-600 transition-colors"
                      >
                        Submit Contact Ticket
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userEnquiries.map((enq) => {
                        const drone = enq.drone_id ? drones.find(d => d.id === enq.drone_id) : null;
                        
                        return (
                          <div 
                            key={enq.id}
                            className="p-5 rounded-2xl bg-zinc-900/30 border border-border space-y-4 hover:border-zinc-800 transition-colors"
                          >
                            <div className="flex justify-between items-start gap-4">
                              <div className="space-y-1">
                                <h3 className="text-white text-xs font-bold uppercase tracking-wider text-primary">{enq.subject}</h3>
                                <span className="text-[9px] text-zinc-500 flex items-center gap-1"><Calendar className="w-3 h-3" /> Submitted: {new Date(enq.created_at).toLocaleDateString()}</span>
                              </div>
                              {statusBadge(enq.status)}
                            </div>

                            <p className="text-zinc-400 text-xs leading-relaxed bg-zinc-950/40 p-3 rounded-xl border border-border/80">
                              {enq.message}
                            </p>

                            {drone && (
                              <div className="flex items-center gap-2 text-[10px] text-zinc-500 border-t border-border/40 pt-2">
                                <span className="font-semibold">Inquired Model:</span>
                                <a href={`/drones/${drone.id}`} className="text-primary hover:underline">{drone.brand} {drone.model}</a>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Profile Details page */}
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <div className="pb-3 border-b border-border">
                    <h2 className="text-lg font-bold text-white">Account Information</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
                    <div className="p-5 rounded-2xl bg-zinc-900/30 border border-border space-y-1 flex flex-col justify-center">
                      <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider">Account Full Name</span>
                      <span className="text-white text-sm font-bold mt-1">{currentUser.full_name}</span>
                    </div>

                    <div className="p-5 rounded-2xl bg-zinc-900/30 border border-border space-y-1 flex flex-col justify-center">
                      <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider">Email Address</span>
                      <span className="text-white text-sm font-bold mt-1">{currentUser.email}</span>
                    </div>

                    <div className="p-5 rounded-2xl bg-zinc-900/30 border border-border space-y-1 flex flex-col justify-center">
                      <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider">Assigned Role</span>
                      <span className="text-primary text-sm font-bold uppercase tracking-wider mt-1">{currentUser.role}</span>
                    </div>

                    <div className="p-5 rounded-2xl bg-zinc-900/30 border border-border space-y-1 flex flex-col justify-center">
                      <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider">Registration Date</span>
                      <span className="text-white text-sm font-bold mt-1">
                        {new Date(currentUser.created_at).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
