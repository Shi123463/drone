"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useStore } from "@/lib/store";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useSearchParams } from "next/navigation";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  ShieldCheck, 
  Sparkles 
} from "lucide-react";

function ContactFormInner() {
  const searchParams = useSearchParams();
  const { settings, submitEnquiry } = useStore();

  // Inquiry fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Autofill fields from query parameters if booked from catalog or services
  useEffect(() => {
    const serviceName = searchParams.get("service");
    const acresParam = searchParams.get("acres");
    
    if (serviceName) {
      setSubject(`Booking Request for Service: ${serviceName}`);
      if (acresParam) {
        setMessage(`Hello, I would like to book a flight operation for ${serviceName} on approximately ${acresParam} acres of farmland. Please send me a custom quote.`);
      } else {
        setMessage(`Hello, I am interested in learning more about your ${serviceName} operations.`);
      }
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    submitEnquiry({
      user_name: name,
      email,
      phone,
      subject,
      message,
    });

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
      setTimeout(() => setSuccess(false), 5000);
    }, 1200);
  };

  // Get dynamic values from settings store (fallback to defaults if undefined)
  const companyName = settings["company_name"] || "AgroFly Systems Inc.";
  const address = settings["address"] || "1402 Agri-Business Parkway, Suite B, Des Moines, IA 50309";
  const phoneNo = settings["phone"] || "+1 (800) 555-0199";
  const emailAddr = settings["email"] || "contact@agrofly-systems.com";
  const bizHours = settings["business_hours"] || "Mon - Fri: 8:00 AM - 5:00 PM CST";
  const mapEmbed = settings["google_map_embed"] || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000.123!2d-93.609!3d41.586!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDM1JzEwLjEiTiA5M8KwMzYnMzIuNCJX!5e0!3m2!1sen!2sus!4v1626000000000";

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 bg-zinc-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="border-b border-border pb-6 mb-12 text-center max-w-3xl mx-auto space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Connect with Flight Operations
            </h1>
            <p className="text-zinc-400 text-base">
              Submit your acreage specs, request drone calibrations, or speak with an FAA certified pilot supervisor.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Contact Details & Info (Left - 5 cols) */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-extrabold text-white">
                  {companyName}
                </h2>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  We maintain a team of operators stationed across the Midwest. Send us an inquiry for localized spraying campaigns, crop density reports, or support tickets.
                </p>
              </div>

              {/* Info Cards */}
              <div className="space-y-4">
                <div className="p-4 bg-zinc-900/40 border border-border rounded-xl flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase">Main Headquarters</span>
                    <p className="text-zinc-200 text-xs font-semibold mt-0.5">{address}</p>
                  </div>
                </div>

                <div className="p-4 bg-zinc-900/40 border border-border rounded-xl flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase">Direct Phone Hotline</span>
                    <p className="text-zinc-200 text-xs font-semibold mt-0.5">{phoneNo}</p>
                  </div>
                </div>

                <div className="p-4 bg-zinc-900/40 border border-border rounded-xl flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase">Business Inquiries</span>
                    <p className="text-zinc-200 text-xs font-semibold mt-0.5">{emailAddr}</p>
                  </div>
                </div>

                <div className="p-4 bg-zinc-900/40 border border-border rounded-xl flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase">Operations Hours</span>
                    <p className="text-zinc-200 text-xs font-semibold mt-0.5">{bizHours}</p>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="rounded-2xl border border-border overflow-hidden aspect-video bg-zinc-900 shadow">
                <iframe
                  title="HQ Location Map"
                  src={mapEmbed}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                />
              </div>
            </div>

            {/* Inquiries Ticket Form (Right - 7 cols) */}
            <div className="lg:col-span-7 bg-zinc-900/40 border border-border rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

              <div className="space-y-1">
                <h3 className="text-white text-xl font-bold">Submit Flight Operations Enquiry</h3>
                <p className="text-zinc-400 text-xs">
                  Fill in your details and farm specifications. A localized service advisor will follow up with pricing.
                </p>
              </div>

              {success && (
                <div className="p-4 rounded-xl border border-emerald-500/25 bg-emerald-500/5 text-primary text-xs flex items-center gap-3 animate-pulse">
                  <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                  <span>Your enquiry has been successfully registered! An advisor will reach out shortly.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] text-zinc-400 font-medium">Your Full Name</label>
                    <input 
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="E.g., John Miller"
                      className="w-full px-3.5 py-2.5 bg-zinc-950 border border-border rounded-xl text-white text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-zinc-400 font-medium">Phone Number</label>
                    <input 
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 019-9230"
                      className="w-full px-3.5 py-2.5 bg-zinc-950 border border-border rounded-xl text-white text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-400 font-medium">Email Address</label>
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-border rounded-xl text-white text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-400 font-medium">Inquiry Subject</label>
                  <input 
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="E.g., Aerial chemical spraying request"
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-border rounded-xl text-white text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-400 font-medium">Message Details (Acreage size, crop type, location)</label>
                  <textarea 
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your fields or request spec requirements..."
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-border rounded-xl text-white text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl text-xs hover:bg-emerald-600 transition-colors shadow-md shadow-primary/10 flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {loading ? "Sending enquiry..." : "Submit Enquiry Form"}
                  {!loading && <Send className="w-3.5 h-3.5" />}
                </button>
              </form>

              <div className="flex items-center gap-2 text-[10px] text-zinc-500 justify-center">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>Submitted enquiries instantly sync with the Admin Ticket management dashboard.</span>
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col min-h-screen bg-zinc-950 text-white">
        <Navbar />
        <div className="flex-1 flex flex-col justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    }>
      <ContactFormInner />
    </Suspense>
  );
}
