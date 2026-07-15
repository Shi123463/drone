"use client";
import React from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Award, Compass, ShieldCheck, HeartHandshake, Eye, Users } from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-primary" />,
      title: "Uncompromising Safety",
      description: "We adhere strictly to FAA regulations, weather thresholds, and local chemical application laws to maintain a 100% accident-free record."
    },
    {
      icon: <Award className="w-6 h-6 text-primary" />,
      title: "Precision Execution",
      description: "Every flight path is programmed and calibrated. We control spray drift to protect buffer zones and target only standard fields."
    },
    {
      icon: <Compass className="w-6 h-6 text-primary" />,
      title: "Farmer Centricity",
      description: "We are farmers and agronomists at heart. We optimize drone payload flight metrics to maximize net crop yield ROI and profit."
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-primary" />,
      title: "USA Compliance",
      description: "All operations are backed by active FAA Part 137 agricultural licenses, Part 107 certifications, and chemical handling permits."
    }
  ];

  const team = [
    {
      name: "Marcus Sterling",
      role: "Founder & Chief Agronomist",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300",
      bio: "20+ years of row crop experience combined with commercial aviation guidance."
    },
    {
      name: "Elara Vance",
      role: "Director of UAV Operations",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
      bio: "Lead drone flight calibration expert and Part 107 master trainer."
    },
    {
      name: "Douglas Pine",
      role: "Lead GIS Analyst",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300",
      bio: "Compiles orthomosaic imagery into variable-rate shapefiles and crop maps."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 bg-zinc-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="border-b border-border pb-6 mb-12 text-center max-w-3xl mx-auto space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              About AgroFly Systems
            </h1>
            <p className="text-zinc-400 text-base">
              Leading the autonomous agricultural aviation movement to build resilient, high-yield smart farms.
            </p>
          </div>

          {/* Company Story & Mission */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs text-primary font-semibold">
                <Eye className="w-3.5 h-3.5" /> Our Vision
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Bridge the Gap Between Technology and Traditional Soil Management
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed">
                AgroFly Systems was founded in Des Moines, Iowa, with a clear objective: to bring military-grade autonomous UAV flight control to commercial family farms. Heavy tractors compress soil, damage root growth, and struggle to maneuver over steep or muddy terrain. 
              </p>
              <p className="text-zinc-400 text-sm leading-relaxed">
                By taking spraying, sowing, and multispectral crop scouting to the skies, we help farmers achieve zero compaction, decrease pesticide costs by up to 30%, and target outbreaks immediately after rains. We are not just a hardware seller; we are an operations partner and a flight training institute dedicated to building the future of farming.
              </p>
            </div>
            
            <div className="lg:col-span-5 relative">
              <div className="aspect-video w-full rounded-2xl overflow-hidden border border-border bg-zinc-900 shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1527847263472-aa5338d178b8?auto=format&fit=crop&q=80&w=800" 
                  alt="Drone over field"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Core Values */}
          <div className="space-y-8 mb-20">
            <h2 className="text-2xl font-extrabold text-white text-center">
              Our Core Operational Pillars
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((val, idx) => (
                <div 
                  key={idx}
                  className="p-6 rounded-2xl bg-zinc-900/40 border border-border space-y-4 hover:border-primary/45 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    {val.icon}
                  </div>
                  <h3 className="text-white text-lg font-bold">{val.title}</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed">{val.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Team Members */}
          <div className="space-y-8">
            <h2 className="text-2xl font-extrabold text-white text-center">
              Meet Our Flight Advisors
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {team.map((member, idx) => (
                <div 
                  key={idx}
                  className="glassmorphism rounded-2xl border border-border overflow-hidden text-center flex flex-col items-center p-6 space-y-4"
                >
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary/30 shadow-md">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-white text-base font-bold">{member.name}</h3>
                    <span className="text-primary text-xs font-semibold">{member.role}</span>
                  </div>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
