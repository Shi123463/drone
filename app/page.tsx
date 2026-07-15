"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { 
  ChevronDown, 
  Cpu, 
  Leaf, 
  Award, 
  ShieldCheck, 
  TrendingUp, 
  ArrowRight,
  Star,
  Users
} from "lucide-react";

export default function HomePage() {
  const { drones, droneImages, services, reviews } = useStore();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Get latest 8 featured and visible drones
  const featuredDrones = drones
    .filter(d => d.featured && !d.hidden)
    .slice(0, 8);

  const droneBrands = ["DJI Agriculture", "Hylio UAS", "AgEagle Fixed Wing", "XAG Robotics", "Sentera GIS", "Pix4D Mapping", "TeeJet Nozzles", "Harris Aerials"];

  const faqs = [
    {
      q: "What is the average flight time of an agricultural spray drone?",
      a: "Average flight times range from 15 to 25 minutes depending on the payload weight (fully loaded vs. empty). To maintain continuous operations, we recommend a pilot kit consisting of 1 charger and 3 to 4 smart batteries, which allows charging one battery while another is flying."
    },
    {
      q: "Do I need a pilot license to fly these drones commercially?",
      a: "Yes. In the United States, you must obtain an FAA Part 107 Commercial Drone Pilot License. For heavy-lift drones (over 55 lbs), you also require an FAA Part 137 agricultural aircraft operator certificate. We provide full prep courses under our Training Academy to guide you through these certifications."
    },
    {
      q: "How many acres can a drone spray in one hour?",
      a: "High-capacity drones like the DJI Agras T40 can spray between 15 to 25 hectares (approx. 35 to 60 acres) per hour depending on field dimensions, crop height, and application volume (gallons per acre)."
    },
    {
      q: "How does the localStorage Demo Mode work?",
      a: "If you don't connect a live Supabase database or Cloudinary keys, this application runs entirely in your browser using local storage. You can create/delete drones, register for courses, submit enquiries, and manage bookings, and all your modifications will persist in your browser!"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-zinc-950 py-24 md:py-36 overflow-hidden flex items-center">
        {/* Ambient background glows */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 rounded-full bg-emerald-600/5 blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero text */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs text-primary font-semibold">
              <Leaf className="w-3.5 h-3.5" /> Empowering Modern Farmers
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Next-Gen Autonomous <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">
                Agriculture Drones
              </span>
            </h1>
            <p className="text-zinc-400 text-lg sm:text-xl max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              We sell industry-leading heavy-lift UAVs, offer professional aerial spraying/seeding operations, and host a certified flight academy to build your autonomous pilot fleet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
              <Link 
                href="/drones" 
                className="px-6 py-3.5 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-emerald-600 shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                Browse Drones <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                href="/services" 
                className="px-6 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-xl border border-border flex items-center justify-center transition-all hover:scale-[1.02]"
              >
                Our Services
              </Link>
            </div>
          </div>

          {/* Hero Graphic (Visualizer style) */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-full border border-primary/10 flex items-center justify-center animate-float">
              {/* Inner concentric glowing ring */}
              <div className="absolute inset-4 rounded-full border border-primary/20 bg-gradient-to-tr from-primary/5 to-transparent blur-sm" />
              <div className="absolute inset-16 rounded-full border border-primary/30 flex items-center justify-center">
                <Cpu className="w-16 h-16 text-primary animate-pulse" />
              </div>
              
              {/* Orbital badges */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3.5 py-1.5 glassmorphism rounded-xl border border-primary/20 text-xs font-semibold text-white shadow flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5 text-primary" /> Spray Calibration
              </div>
              <div className="absolute bottom-4 left-4 px-3.5 py-1.5 glassmorphism rounded-xl border border-primary/20 text-xs font-semibold text-white shadow flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-primary" /> FAA Part 137
              </div>
              <div className="absolute right-4 top-1/4 px-3.5 py-1.5 glassmorphism rounded-xl border border-primary/20 text-xs font-semibold text-white shadow flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-primary" /> Maximize Yields
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Infinite Brand Slider */}
      <section className="bg-zinc-950 py-10 border-y border-border overflow-hidden">
        <div className="relative w-full flex items-center">
          <div className="flex gap-16 min-w-full shrink-0 animate-marquee text-lg font-bold text-zinc-500 tracking-wide select-none">
            {droneBrands.concat(droneBrands).map((brand, idx) => (
              <span key={idx} className="hover:text-primary transition-colors flex items-center gap-2">
                <Cpu className="w-4 h-4 text-primary/60" /> {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Drones Section */}
      <section className="bg-zinc-900 py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
                Featured Drone Systems
              </h2>
              <p className="text-zinc-400 mt-2 text-base">
                Discover the latest technology in heavy-payload spraying and multispectral mapping drones.
              </p>
            </div>
            <Link 
              href="/drones" 
              className="text-primary hover:text-emerald-400 font-semibold flex items-center gap-1.5 mt-4 md:mt-0 transition-colors"
            >
              View Full Catalog <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDrones.map((drone) => {
              // Find matching image
              const img = droneImages.find(i => i.drone_id === drone.id);
              const fallbackUrl = "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&q=80&w=800";
              const imageUrl = img ? img.image_url : fallbackUrl;

              // Color badge for stock status
              const stockBadgeColor = 
                drone.stock_status === "in_stock" 
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                  : drone.stock_status === "limited_stock"
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  : "bg-red-500/10 text-red-400 border-red-500/20";

              const stockLabels = {
                in_stock: "In Stock",
                limited_stock: "Limited Stock",
                out_of_stock: "Out of Stock"
              };

              return (
                <div 
                  key={drone.id} 
                  className="glassmorphism rounded-2xl overflow-hidden flex flex-col group hover:border-primary/45 transition-all glow-primary-hover"
                >
                  {/* Photo Container */}
                  <div className="relative aspect-video bg-zinc-950 overflow-hidden">
                    <img 
                      src={imageUrl} 
                      alt={`${drone.brand} ${drone.model}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${stockBadgeColor}`}>
                        {stockLabels[drone.stock_status]}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">
                        {drone.brand}
                      </div>
                      <h3 className="text-white text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                        {drone.model}
                      </h3>
                      <p className="text-zinc-400 text-xs line-clamp-2 mb-4 leading-relaxed">
                        {drone.description}
                      </p>

                      {/* Specs Mini Panel */}
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-500 border-t border-border pt-3 mb-4">
                        <div>
                          <span className="block text-zinc-400 font-semibold">Tank Capacity:</span>
                          {drone.tank_capacity || "N/A"}
                        </div>
                        <div>
                          <span className="block text-zinc-400 font-semibold">Flight Time:</span>
                          {drone.flight_time || "N/A"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-white font-extrabold text-lg">
                        ${drone.price.toLocaleString()}
                      </span>
                      <Link 
                        href={`/drones/${drone.id}`}
                        className="px-3 py-1.5 bg-zinc-900 border border-border hover:bg-primary hover:text-primary-foreground hover:border-transparent text-xs font-bold rounded-lg text-white transition-all"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-zinc-950 py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
              Why Agriculture Drone Tech?
            </h2>
            <p className="text-zinc-400 text-base leading-relaxed">
              Autonomous aerial spraying and scouting provide dramatic efficiency boosts compared to traditional farm machinery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="p-6 rounded-2xl glassmorphism space-y-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="text-white text-lg font-bold">Zero Soil Compaction</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Heavy machinery damages roots and crushes late-stage crops. Drones apply chemicals from above with zero contact.
              </p>
            </div>

            <div className="p-6 rounded-2xl glassmorphism space-y-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-white text-lg font-bold">Precision Target Spraying</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Utilize intelligent flow rate controls and specialized drift nozzles to only target designated field zones.
              </p>
            </div>

            <div className="p-6 rounded-2xl glassmorphism space-y-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-white text-lg font-bold">Risk Reduction</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Operators monitor the drone from safety, avoiding direct chemical exposure and navigating steep hillsides easily.
              </p>
            </div>

            <div className="p-6 rounded-2xl glassmorphism space-y-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-white text-lg font-bold">Boosted Yield ROI</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Drones can target patches immediately after rains, preventing crop fungal growth when tractors are stuck in mud.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-zinc-900 py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
              Our Agricultural Services
            </h2>
            <p className="text-zinc-400 text-base leading-relaxed">
              Don't want to buy hardware? Hire our certified flight operators to handle your farm's spraying, mapping, and sowing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.id} className="glassmorphism rounded-2xl overflow-hidden flex flex-col group border-border">
                <div className="aspect-video relative overflow-hidden bg-zinc-950">
                  <img 
                    src={service.image_url} 
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-white text-xl font-bold mb-3">{service.title}</h3>
                    <p className="text-zinc-400 text-sm mb-4 leading-relaxed">{service.description}</p>
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-zinc-300 text-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {feat}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center justify-between border-t border-border pt-4 mt-auto">
                    <span className="text-primary font-bold text-sm">
                      Starting at ${service.price}/acre
                    </span>
                    <Link 
                      href="/contact"
                      className="px-4 py-2 bg-primary hover:bg-emerald-600 text-primary-foreground font-bold text-xs rounded-lg transition-colors"
                    >
                      Book Service
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="bg-zinc-950 py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
              What Our Farmers Say
            </h2>
            <p className="text-zinc-400 text-base">
              Read how our agriculture drone technology changes the yield management game.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.filter(r => !r.hidden).map((rev) => (
              <div key={rev.id} className="p-6 rounded-2xl glassmorphism border border-border flex flex-col justify-between">
                <div className="space-y-4">
                  {/* Rating */}
                  <div className="flex text-amber-400 gap-1">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-4.5 h-4.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-zinc-300 text-sm leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                  <div className="w-9 h-9 rounded-full bg-zinc-900 border border-border flex items-center justify-center text-primary font-bold text-sm">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-bold">{rev.user_name}</h4>
                    <span className="text-zinc-500 text-xs">Verified Farmer</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-zinc-900 py-20 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="text-zinc-400 text-base">
              Find answers regarding spray drones calibration, flight approvals, and certifications.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div 
                  key={index} 
                  className="rounded-xl border border-border bg-zinc-950 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left text-white font-bold hover:text-primary transition-colors focus:outline-none"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-zinc-500 transition-transform ${isOpen ? "rotate-180 text-primary" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="p-5 pt-0 border-t border-border/40 text-zinc-400 text-sm leading-relaxed bg-zinc-950/60">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-zinc-950 py-20 relative border-t border-border">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-8 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
            Ready to upgrade your agricultural operations?
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Contact our advisors today to find the perfect drone fleet or schedule spray operations for the upcoming planting season.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              href="/contact" 
              className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-emerald-600 shadow-md shadow-primary/10 transition-all hover:scale-[1.02]"
            >
              Get Free Consultation
            </Link>
            <Link 
              href="/training" 
              className="px-6 py-3 bg-zinc-900 border border-border text-white hover:bg-zinc-800 font-bold rounded-xl transition-all hover:scale-[1.02]"
            >
              Join Our Academy
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
