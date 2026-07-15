"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { 
  ArrowLeft, 
  Star, 
  Phone, 
  Mail, 
  MessageSquare,
  BadgeAlert,
  ChevronRight,
  Send,
  Plus
} from "lucide-react";

export default function DroneDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { 
    drones, 
    droneImages, 
    reviews, 
    addReview, 
    submitEnquiry 
  } = useStore();

  // Find target drone
  const drone = useMemo(() => {
    return drones.find(d => d.id === id);
  }, [drones, id]);

  // Find drone images
  const images = useMemo(() => {
    return droneImages
      .filter(img => img.drone_id === id)
      .sort((a, b) => a.order_index - b.order_index)
      .map(img => img.image_url);
  }, [droneImages, id]);

  // Fallback if no images
  const activeImages = images.length > 0 ? images : ["https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&q=80&w=800"];

  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Filter reviews for this drone
  const droneReviews = useMemo(() => {
    return reviews.filter(r => r.drone_id === id && !r.hidden);
  }, [reviews, id]);

  const averageRating = useMemo(() => {
    if (droneReviews.length === 0) return 5;
    const total = droneReviews.reduce((sum, r) => sum + r.rating, 0);
    return Math.round((total / droneReviews.length) * 10) / 10;
  }, [droneReviews]);

  // Enquiry state
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [enqName, setEnqName] = useState("");
  const [enqEmail, setEnqEmail] = useState("");
  const [enqPhone, setEnqPhone] = useState("");
  const [enqMsg, setEnqMsg] = useState("");
  const [enqLoading, setEnqLoading] = useState(false);
  const [enqSuccess, setEnqSuccess] = useState(false);

  // Submit Review state
  const [revUser, setRevUser] = useState("");
  const [revRating, setRevRating] = useState(5);
  const [revComment, setRevComment] = useState("");
  const [revSuccess, setRevSuccess] = useState(false);

  if (!drone) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex flex-col justify-center items-center bg-zinc-950 text-white py-20 px-6">
          <BadgeAlert className="w-16 h-16 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold">Drone Not Found</h1>
          <p className="text-zinc-500 mt-2">The system could not locate the requested drone details.</p>
          <button 
            onClick={() => router.push("/drones")}
            className="mt-6 px-5 py-2.5 bg-zinc-900 border border-border hover:bg-zinc-800 rounded-xl text-sm font-semibold flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Catalog
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  // Handle Enquiry Submit
  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnqLoading(true);
    
    // Submit through centralized store
    submitEnquiry({
      user_name: enqName,
      email: enqEmail,
      phone: enqPhone,
      subject: `Inquiry for drone: ${drone.brand} ${drone.model}`,
      message: enqMsg,
      drone_id: drone.id,
    });

    setTimeout(() => {
      setEnqLoading(false);
      setEnqSuccess(true);
      setTimeout(() => {
        setShowEnquiryModal(false);
        setEnqSuccess(false);
        setEnqName("");
        setEnqEmail("");
        setEnqPhone("");
        setEnqMsg("");
      }, 2000);
    }, 1200);
  };

  // Handle Review Submit
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revUser || !revComment) return;

    addReview(revUser, drone.id, revRating, revComment);
    setRevSuccess(true);
    setRevUser("");
    setRevRating(5);
    setRevComment("");

    setTimeout(() => {
      setRevSuccess(false);
    }, 3000);
  };

  const stockStyles = {
    in_stock: { label: "In Stock", class: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25" },
    limited_stock: { label: "Limited Stock", class: "bg-amber-500/10 text-amber-400 border-amber-500/25" },
    out_of_stock: { label: "Out of Stock", class: "bg-red-500/10 text-red-400 border-red-500/25" }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 bg-zinc-950 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Back navigation */}
          <button 
            onClick={() => router.push("/drones")}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-semibold mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Back to Catalog
          </button>

          {/* Product Detail Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Gallery Column (Left - 6 columns) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="aspect-video w-full bg-zinc-900 border border-border rounded-2xl overflow-hidden relative">
                <img 
                  src={activeImages[activeImageIdx]} 
                  alt={`${drone.brand} ${drone.model}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnails */}
              {activeImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
                  {activeImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`w-20 sm:w-24 aspect-video rounded-lg border overflow-hidden flex-shrink-0 transition-all ${
                        activeImageIdx === idx 
                          ? "border-primary ring-2 ring-primary/20 scale-95" 
                          : "border-border hover:border-zinc-500"
                      }`}
                    >
                      <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Purchase & General info column (Right - 6 columns) */}
            <div className="lg:col-span-6 space-y-6">
              
              <div className="space-y-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-primary">
                  {drone.brand} Agriculture
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
                  {drone.model}
                </h1>
                <div className="flex items-center gap-3 py-1">
                  <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${stockStyles[drone.stock_status].class}`}>
                    {stockStyles[drone.stock_status].label}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                    <div className="flex text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(averageRating) ? "fill-current" : ""}`} />
                      ))}
                    </div>
                    <span>({droneReviews.length} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="text-3xl font-extrabold text-white">
                ${drone.price.toLocaleString()}
              </div>

              <p className="text-zinc-400 text-sm leading-relaxed border-t border-border pt-4">
                {drone.description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border/80">
                <button
                  onClick={() => setShowEnquiryModal(true)}
                  className="flex-1 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-emerald-600 shadow-md shadow-primary/10 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <MessageSquare className="w-4 h-4" /> Send Sales Enquiry
                </button>
                <Link
                  href="/contact"
                  className="px-6 py-3 bg-zinc-900 border border-border hover:bg-zinc-800 text-white font-bold rounded-xl flex items-center justify-center transition-all"
                >
                  Contact Support
                </Link>
              </div>

            </div>

          </div>

          {/* Specifications Dashboard & Reviews Tab Area */}
          <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-10 border-t border-border pt-12">
            
            {/* Specs Grid (Left - 7 columns) */}
            <div className="lg:col-span-7 space-y-6">
              <h2 className="text-2xl font-extrabold tracking-tight text-white">
                Technical Specifications
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: "Brand & Origin", value: drone.brand },
                  { name: "Model Series", value: drone.model },
                  { name: "Payload Tank Capacity", value: drone.tank_capacity || "N/A" },
                  { name: "Smart Battery Spec", value: drone.battery || "N/A" },
                  { name: "Estimated Flight Time", value: drone.flight_time || "N/A" },
                  { name: "Hourly Coverage Efficiency", value: drone.coverage_area || "N/A" },
                  { name: "Onboard Camera", value: drone.camera || "N/A" },
                  { name: "GPS Guidance Sensor", value: drone.gps || "N/A" },
                ].map((spec, i) => (
                  <div 
                    key={i} 
                    className="p-3 bg-zinc-900/40 border border-border rounded-xl flex flex-col justify-center"
                  >
                    <span className="text-xs text-zinc-500 font-semibold uppercase">{spec.name}</span>
                    <span className="text-zinc-200 text-sm font-bold mt-1">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews list & Write Review Column (Right - 5 columns) */}
            <div className="lg:col-span-5 space-y-8">
              <h2 className="text-2xl font-extrabold text-white">
                Customer Testimonials
              </h2>

              {/* Review Input Box */}
              <form onSubmit={handleReviewSubmit} className="p-5 rounded-2xl bg-zinc-900/50 border border-border space-y-4">
                <h3 className="text-white text-sm font-bold">Write a Product Review</h3>
                
                {revSuccess && (
                  <div className="p-3 text-xs rounded-lg border border-emerald-500/25 bg-emerald-500/5 text-primary">
                    Review submitted successfully! It will display instantly in Demo Mode.
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] text-zinc-400 font-medium">Your Name</label>
                    <input 
                      type="text" 
                      value={revUser} 
                      onChange={(e) => setRevUser(e.target.value)} 
                      placeholder="E.g., David K."
                      className="w-full px-3 py-1.5 bg-zinc-950 border border-border rounded-lg text-white text-xs focus:outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-zinc-400 font-medium">Rating Score</label>
                    <select
                      value={revRating}
                      onChange={(e) => setRevRating(Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-zinc-950 border border-border rounded-lg text-white text-xs focus:outline-none"
                    >
                      <option value="5">5 Stars (Excellent)</option>
                      <option value="4">4 Stars (Good)</option>
                      <option value="3">3 Stars (Average)</option>
                      <option value="2">2 Stars (Fair)</option>
                      <option value="1">1 Star (Poor)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-400 font-medium">Comment</label>
                  <textarea 
                    rows={3}
                    value={revComment} 
                    onChange={(e) => setRevComment(e.target.value)}
                    placeholder="Describe your flight operations experience..."
                    className="w-full px-3 py-1.5 bg-zinc-950 border border-border rounded-lg text-white text-xs focus:outline-none"
                    required
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-2 bg-primary text-primary-foreground font-bold rounded-lg text-xs hover:bg-emerald-600 transition-colors flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Submit Review
                </button>
              </form>

              {/* Reviews Display */}
              <div className="space-y-4">
                {droneReviews.length === 0 ? (
                  <p className="text-zinc-500 text-sm">No reviews have been written for this model yet.</p>
                ) : (
                  droneReviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-xl border border-border/80 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xs text-zinc-300">{rev.user_name}</span>
                        <div className="flex text-amber-400 gap-0.5">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-zinc-400 text-xs leading-relaxed">
                        {rev.comment}
                      </p>
                    </div>
                  ))
                )}
              </div>

            </div>

          </div>

        </div>
      </main>

      {/* Enquiry Modal Pop-up */}
      {showEnquiryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs px-4">
          <div className="w-full max-w-lg bg-zinc-950 border border-border rounded-2xl p-6 sm:p-8 space-y-6 relative glow-primary">
            
            <button 
              onClick={() => setShowEnquiryModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5 rotate-90" />
            </button>

            <div className="space-y-1">
              <h3 className="text-white text-xl font-bold">Request Sales Quotation</h3>
              <p className="text-zinc-400 text-xs">
                Fill in the form and an AgroFly representative will reach out with pricing, payload kit packages, and delivery availability.
              </p>
            </div>

            {enqSuccess ? (
              <div className="p-6 text-center space-y-4">
                <div className="flex justify-center text-primary">
                  <Star className="w-12 h-12 fill-current animate-spin" />
                </div>
                <h4 className="text-white font-bold text-lg">Enquiry Submitted!</h4>
                <p className="text-zinc-400 text-xs">
                  We have registered your inquiry. An sales executive will follow up at your email or phone shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className="space-y-4">
                
                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-300 font-medium">Full Name</label>
                  <input
                    type="text"
                    value={enqName}
                    onChange={(e) => setEnqName(e.target.value)}
                    placeholder="Enter name"
                    className="w-full px-3 py-2 bg-zinc-900 border border-border rounded-xl text-white text-xs focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] text-zinc-300 font-medium">Email Address</label>
                    <input
                      type="email"
                      value={enqEmail}
                      onChange={(e) => setEnqEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-3 py-2 bg-zinc-900 border border-border rounded-xl text-white text-xs focus:outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-zinc-300 font-medium">Phone Number</label>
                    <input
                      type="tel"
                      value={enqPhone}
                      onChange={(e) => setEnqPhone(e.target.value)}
                      placeholder="+1 (555) 019-9230"
                      className="w-full px-3 py-2 bg-zinc-900 border border-border rounded-xl text-white text-xs focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-300 font-medium">Message</label>
                  <textarea
                    rows={4}
                    value={enqMsg}
                    onChange={(e) => setEnqMsg(e.target.value)}
                    placeholder="E.g., I would like to purchase the Agras T40 with 3 batteries and 1 fast charger kit..."
                    className="w-full px-3 py-2 bg-zinc-900 border border-border rounded-xl text-white text-xs focus:outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={enqLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground font-bold rounded-xl text-sm hover:bg-emerald-600 transition-colors disabled:opacity-50"
                >
                  {enqLoading ? "Sending Enquiry..." : "Send Quotation Request"}
                  {!enqLoading && <Send className="w-4 h-4" />}
                </button>

              </form>
            )}

            <div className="flex justify-center items-center gap-6 text-[10px] text-zinc-500 pt-2 border-t border-border/40">
              <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> 1-800-555-0199</span>
              <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> sales@agrofly.com</span>
            </div>

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
