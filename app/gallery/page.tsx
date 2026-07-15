"use client";
import React, { useState, useRef, useEffect } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Sparkles, Image, Compass, Maximize2, ShieldAlert, Cpu } from "lucide-react";

export default function GalleryPage() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchend", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, []);

  const galleryItems = [
    {
      title: "Orchard Spraying",
      category: "Operations",
      description: "Autonomous high-precision liquid chemical spraying on a steep citrus orchard slope.",
      image: "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Cover Crop Seeding",
      category: "Sowing",
      description: "Direct sowing of cover crop seeds using the AgroFly high-velocity spreading mechanism.",
      image: "https://images.unsplash.com/photo-1595841696660-ab61494e09e5?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Multispectral Scanning",
      category: "Scouting",
      description: "Fixed-wing eBee X mapping flight collecting real-time NDVI stand health data.",
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Cotton Field Defoliation",
      category: "Operations",
      description: "T40 heavy-payload flight applying defoliant uniformly ahead of mechanical harvest.",
      image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Thermal Irrigation Audit",
      category: "Analysis",
      description: "Canopy temperature analysis revealing minor irrigation blockages and wet spots.",
      image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Corn Spray Calibration",
      category: "Testing",
      description: "Fine-tuning drift reduction nozzles to prevent pesticide movement to adjacent zones.",
      image: "https://images.unsplash.com/photo-1527847263472-aa5338d178b8?auto=format&fit=crop&q=80&w=800",
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
              Operations & Mapping Gallery
            </h1>
            <p className="text-zinc-400 text-base">
              Explore actual field deployments, mapping outputs, and the power of autonomous agricultural flight.
            </p>
          </div>

          {/* Interactive Before/After Slider */}
          <div className="mb-20 max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs text-primary font-semibold">
                <Sparkles className="w-3.5 h-3.5" /> Interactive Viewer
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Crop Health Intelligence: Before vs After
              </h2>
              <p className="text-zinc-400 text-sm max-w-xl mx-auto">
                Drag the center slider to compare a visual-spectrum RGB satellite scan (Left) with an processed NDVI crop health orthomosaic analysis map (Right).
              </p>
            </div>

            {/* Slider Container */}
            <div 
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
              onMouseDown={() => setIsDragging(true)}
              onTouchStart={() => setIsDragging(true)}
              className="relative aspect-video w-full rounded-2xl overflow-hidden border border-border select-none cursor-ew-resize bg-zinc-900"
            >
              {/* After Image (Full Background) */}
              <img 
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200" 
                alt="After Crop Scouting Map"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none filter hue-rotate-90 saturate-200" // Styled to look like a high-contrast NDVI scale
              />
              <div className="absolute bottom-4 right-4 bg-zinc-950/80 border border-border px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 text-primary">
                <Cpu className="w-3.5 h-3.5" /> Processed NDVI Scan
              </div>

              {/* Before Image (Clipped Left Overlay) */}
              <div 
                className="absolute inset-y-0 left-0 overflow-hidden pointer-events-none"
                style={{ width: `${sliderPosition}%` }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200" 
                  alt="Before Field Scan"
                  className="absolute inset-y-0 left-0 w-full h-full object-cover max-w-none"
                  style={{ width: containerRef.current ? containerRef.current.getBoundingClientRect().width : "100%" }}
                />
                <div className="absolute bottom-4 left-4 bg-zinc-950/80 border border-border px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 text-white">
                  <Image className="w-3.5 h-3.5" /> Standard RGB Imagery
                </div>
              </div>

              {/* Divider Bar & Handle */}
              <div 
                className="absolute inset-y-0 w-1 bg-primary cursor-ew-resize pointer-events-none"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary text-primary-foreground border border-white/20 flex items-center justify-center shadow-lg pointer-events-none">
                  <Compass className="w-4 h-4 animate-pulse" />
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center text-xs text-zinc-500 max-w-md mx-auto pt-2">
              <span>← Slide Left for Crop Health analysis</span>
              <span>Slide Right for visual imagery →</span>
            </div>
          </div>

          {/* Grid of Deployment Operations */}
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold text-white text-center">
              Field Deployments in Action
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryItems.map((item, idx) => (
                <div 
                  key={idx}
                  className="glassmorphism rounded-2xl overflow-hidden border border-border group hover:border-primary/45 transition-all glow-primary-hover"
                >
                  <div className="aspect-video relative overflow-hidden bg-zinc-900">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-zinc-950/85 border border-border px-2 py-0.5 rounded-md text-[10px] uppercase font-bold text-zinc-400">
                      {item.category}
                    </span>
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="text-white text-lg font-bold group-hover:text-primary transition-colors flex items-center justify-between">
                      {item.title}
                      <Maximize2 className="w-4 h-4 text-zinc-600 group-hover:text-primary transition-colors" />
                    </h3>
                    <p className="text-zinc-400 text-xs leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-20 glassmorphism p-8 rounded-2xl border border-border text-center max-w-3xl mx-auto space-y-6">
            <ShieldAlert className="w-12 h-12 text-primary mx-auto" />
            <h3 className="text-white font-extrabold text-xl">Need customized stand counting or variable spraying?</h3>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-xl mx-auto">
              Our flight pilots operate in accordance with local aviation and agricultural application rules. Speak with a GIS mapping expert today to coordinate scheduling.
            </p>
            <div className="pt-2">
              <a 
                href="/contact" 
                className="inline-flex px-6 py-2.5 bg-primary text-primary-foreground font-bold text-sm rounded-xl hover:bg-emerald-600 transition-colors shadow-md shadow-primary/10"
              >
                Request Custom Scouting Map
              </a>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
