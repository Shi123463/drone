"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import { 
  Calculator, 
  Check, 
  HelpCircle, 
  MapPin, 
  Sparkles, 
  ArrowRight 
} from "lucide-react";

export default function ServicesPage() {
  const { services } = useStore();

  // Calculator State
  const [acres, setAcres] = useState(100);
  const [selectedServiceId, setSelectedServiceId] = useState("service-1");

  const selectedService = services.find(s => s.id === selectedServiceId) || services[0];
  const totalCostEstimate = selectedService ? selectedService.price * acres : 0;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 bg-zinc-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="border-b border-border pb-6 mb-12 text-center max-w-3xl mx-auto space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Precision Drone Services
            </h1>
            <p className="text-zinc-400 text-base">
              Maximize your crop yields, eliminate soil compaction, and reduce chemical drift with our autonomous spraying, spreading, and multispectral scouting operations.
            </p>
          </div>

          {/* Services Catalog */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {services.map((service) => (
              <div 
                key={service.id} 
                className="glassmorphism border border-border rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-primary/45 transition-all"
              >
                <div className="aspect-video relative overflow-hidden bg-zinc-950">
                  <img 
                    src={service.image_url} 
                    alt={service.title} 
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <h3 className="text-white text-xl font-bold">{service.title}</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">{service.description}</p>
                    
                    <ul className="space-y-2">
                      {service.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-zinc-300 text-xs">
                          <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between border-t border-border pt-4 mt-6">
                    <div>
                      <span className="text-zinc-500 text-[10px] uppercase font-bold block">Estimated Rate</span>
                      <span className="text-primary font-bold text-base">
                        ${service.price} / acre
                      </span>
                    </div>
                    <Link 
                      href={`/contact?service=${encodeURIComponent(service.title)}`}
                      className="px-4 py-2 bg-primary text-primary-foreground hover:bg-emerald-600 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                    >
                      Book Flight <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Estimator Calculator */}
          <div className="glassmorphism p-6 sm:p-8 rounded-3xl border border-border grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

            {/* Left Column Description */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs text-primary font-semibold">
                <Calculator className="w-3.5 h-3.5" /> Operations Estimator
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Estimate your operational spraying costs
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Adjust the acreage slider and select your desired drone service to get a quick approximation of costs. Custom quotes are available for farms exceeding 1,000 acres.
              </p>
              <div className="flex flex-wrap gap-4 text-xs text-zinc-500 pt-2">
                <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-primary" /> Free mapping setup</span>
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-primary" /> Multi-field discounts</span>
              </div>
            </div>

            {/* Right Column Controls */}
            <div className="lg:col-span-5 bg-zinc-900/60 border border-border p-6 rounded-2xl space-y-6">
              
              {/* Select Service */}
              <div className="space-y-2">
                <label className="text-xs text-zinc-400 font-bold uppercase block">1. Select Service Type</label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-border rounded-xl text-zinc-200 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {services.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.title} (${s.price}/acre)
                    </option>
                  ))}
                </select>
              </div>

              {/* Slider for Acres */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400 font-bold uppercase">2. Estimated Area Size</span>
                  <span className="text-primary font-bold text-sm">{acres} Acres</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="1000"
                  step="10"
                  value={acres}
                  onChange={(e) => setAcres(Number(e.target.value))}
                  className="w-full accent-primary bg-zinc-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-zinc-500">
                  <span>20 Acres</span>
                  <span>1,000 Acres</span>
                </div>
              </div>

              {/* Calculation Summary */}
              <div className="border-t border-border/80 pt-4 flex items-center justify-between">
                <div>
                  <span className="text-zinc-500 text-[10px] font-bold uppercase block">Total Cost Estimate</span>
                  <span className="text-white text-2xl font-extrabold">${totalCostEstimate.toLocaleString()}</span>
                </div>
                <Link 
                  href={`/contact?acres=${acres}&service=${encodeURIComponent(selectedService?.title || "")}`}
                  className="px-4 py-2.5 bg-primary text-primary-foreground hover:bg-emerald-600 font-bold text-xs rounded-xl transition-colors shadow-md shadow-primary/10 flex items-center gap-1.5"
                >
                  Submit Inquiry
                </Link>
              </div>

            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
