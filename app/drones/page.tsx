"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Search, SlidersHorizontal, ArrowUpDown, X } from "lucide-react";

export default function DronesCatalogPage() {
  const { drones, droneImages } = useStore();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedStock, setSelectedStock] = useState("all");
  const [maxPrice, setMaxPrice] = useState(25000);
  const [sortBy, setSortBy] = useState("latest");
  
  // Mobile filter drawer status
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Available brands for filter lists
  const brands = useMemo(() => {
    const b = new Set(drones.map(d => d.brand));
    return ["all", ...Array.from(b)];
  }, [drones]);

  // Handle queries
  const filteredAndSortedDrones = useMemo(() => {
    let result = [...drones].filter(d => !d.hidden);

    // Search query match (broad match)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(d => 
        d.brand.toLowerCase().includes(q) ||
        d.model.toLowerCase().includes(q) ||
        (d.battery && d.battery.toLowerCase().includes(q)) ||
        (d.tank_capacity && d.tank_capacity.toLowerCase().includes(q)) ||
        (d.flight_time && d.flight_time.toLowerCase().includes(q))
      );
    }

    // Brand filter
    if (selectedBrand !== "all") {
      result = result.filter(d => d.brand === selectedBrand);
    }

    // Stock status filter
    if (selectedStock !== "all") {
      result = result.filter(d => d.stock_status === selectedStock);
    }

    // Price range filter
    result = result.filter(d => d.price <= maxPrice);

    // Sort order
    if (sortBy === "latest") {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortBy === "price_asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [drones, searchQuery, selectedBrand, selectedStock, maxPrice, sortBy]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedBrand("all");
    setSelectedStock("all");
    setMaxPrice(25000);
    setSortBy("latest");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 bg-zinc-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="border-b border-border pb-6 mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Heavy-Lift Agricultural Drones
            </h1>
            <p className="text-zinc-400 mt-2 text-base">
              Search and filter our current inventory of spraying, spreading, and multispectral scouting UAVs.
            </p>
          </div>

          {/* Catalog layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Desktop Sidebar Filters */}
            <div className="hidden lg:block space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-white font-bold text-lg flex items-center gap-2">
                  <SlidersHorizontal className="w-4.5 h-4.5 text-primary" /> Filters
                </h2>
                <button 
                  onClick={resetFilters} 
                  className="text-xs text-zinc-500 hover:text-primary transition-colors font-medium"
                >
                  Reset All
                </button>
              </div>

              {/* Brand Filter */}
              <div className="border-t border-border pt-4">
                <label className="text-white text-sm font-bold block mb-3">Drone Brand</label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-border rounded-xl text-zinc-300 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {brands.map(b => (
                    <option key={b} value={b}>
                      {b === "all" ? "All Brands" : b}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stock Filter */}
              <div className="border-t border-border pt-4">
                <label className="text-white text-sm font-bold block mb-3">Availability</label>
                <select
                  value={selectedStock}
                  onChange={(e) => setSelectedStock(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-border rounded-xl text-zinc-300 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="all">All Statuses</option>
                  <option value="in_stock">In Stock</option>
                  <option value="limited_stock">Limited Stock</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
              </div>

              {/* Price Filter */}
              <div className="border-t border-border pt-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-white text-sm font-bold">Max Price</label>
                  <span className="text-primary font-bold text-sm">${maxPrice.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="3000"
                  max="25000"
                  step="500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-primary bg-zinc-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-zinc-500 mt-1">
                  <span>$3,000</span>
                  <span>$25,000</span>
                </div>
              </div>
            </div>

            {/* Catalog Main Panel */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Search and Sort controls */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                
                {/* Search Bar */}
                <div className="relative w-full sm:max-w-md">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search by brand, specs, capacity..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-border rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-primary text-sm transition-all"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery("")}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Sort dropdown & Mobile filter button */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => setShowFiltersMobile(true)}
                    className="flex lg:hidden items-center justify-center gap-1.5 w-1/2 sm:w-auto px-4 py-2 border border-border bg-zinc-900 rounded-xl text-zinc-400 hover:text-white text-sm"
                  >
                    <SlidersHorizontal className="w-4 h-4" /> Filters
                  </button>
                  
                  <div className="flex items-center gap-2 w-1/2 sm:w-auto relative pl-2 border-l border-border/40 sm:border-l-0">
                    <ArrowUpDown className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-900 border border-border rounded-xl text-zinc-300 text-xs sm:text-sm focus:outline-none"
                    >
                      <option value="latest">Sort: Latest</option>
                      <option value="price_asc">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                    </select>
                  </div>
                </div>

              </div>

              {/* Active filters indicators summary */}
              {(selectedBrand !== "all" || selectedStock !== "all" || maxPrice < 25000 || searchQuery) && (
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-zinc-500 text-xs">Active filters:</span>
                  {selectedBrand !== "all" && (
                    <span className="px-2.5 py-0.5 rounded-full bg-zinc-900 border border-border text-xs text-zinc-300 flex items-center gap-1.5">
                      Brand: {selectedBrand}
                      <button onClick={() => setSelectedBrand("all")} className="text-zinc-500 hover:text-white font-bold">×</button>
                    </span>
                  )}
                  {selectedStock !== "all" && (
                    <span className="px-2.5 py-0.5 rounded-full bg-zinc-900 border border-border text-xs text-zinc-300 flex items-center gap-1.5">
                      Stock: {selectedStock.replace("_", " ")}
                      <button onClick={() => setSelectedStock("all")} className="text-zinc-500 hover:text-white font-bold">×</button>
                    </span>
                  )}
                  {maxPrice < 25000 && (
                    <span className="px-2.5 py-0.5 rounded-full bg-zinc-900 border border-border text-xs text-zinc-300 flex items-center gap-1.5">
                      Max Price: ${maxPrice.toLocaleString()}
                      <button onClick={() => setMaxPrice(25000)} className="text-zinc-500 hover:text-white font-bold">×</button>
                    </span>
                  )}
                  {searchQuery && (
                    <span className="px-2.5 py-0.5 rounded-full bg-zinc-900 border border-border text-xs text-zinc-300 flex items-center gap-1.5">
                      Query: "{searchQuery}"
                      <button onClick={() => setSearchQuery("")} className="text-zinc-500 hover:text-white font-bold">×</button>
                    </span>
                  )}
                </div>
              )}

              {/* Product Grid */}
              {filteredAndSortedDrones.length === 0 ? (
                <div className="text-center py-20 bg-zinc-900/40 border border-dashed border-border rounded-2xl">
                  <p className="text-zinc-500 text-base">No drones match your search criteria.</p>
                  <button 
                    onClick={resetFilters}
                    className="mt-4 px-4 py-2 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/25 rounded-lg text-sm font-semibold transition-all"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAndSortedDrones.map((drone) => {
                    const img = droneImages.find(i => i.drone_id === drone.id);
                    const fallbackUrl = "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&q=80&w=800";
                    const imageUrl = img ? img.image_url : fallbackUrl;

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
                        <div className="relative aspect-video bg-zinc-950 overflow-hidden">
                          <img 
                            src={imageUrl} 
                            alt={`${drone.brand} ${drone.model}`}
                            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                          />
                          <div className="absolute top-3 right-3">
                            <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${stockBadgeColor}`}>
                              {stockLabels[drone.stock_status]}
                            </span>
                          </div>
                        </div>

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

                            <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-500 border-t border-border/80 pt-3 mb-4">
                              <div>
                                <span className="block text-zinc-400 font-semibold">Tank Capacity:</span>
                                {drone.tank_capacity || "N/A"}
                              </div>
                              <div>
                                <span className="block text-zinc-400 font-semibold">Flight Time:</span>
                                {drone.flight_time || "N/A"}
                              </div>
                              <div className="col-span-2">
                                <span className="text-zinc-400 font-semibold">Battery:</span> {drone.battery || "N/A"}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between border-t border-border/40 pt-4 mt-auto">
                            <span className="text-white font-extrabold text-lg">
                              ${drone.price.toLocaleString()}
                            </span>
                            <Link 
                              href={`/drones/${drone.id}`}
                              className="px-3.5 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-lg hover:bg-emerald-600 shadow-md shadow-primary/5 transition-all"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>

          </div>

        </div>
      </main>

      {/* Mobile Filter Drawer */}
      {showFiltersMobile && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden flex justify-end">
          <div className="w-80 bg-zinc-950 border-l border-border h-full p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <h2 className="text-white font-bold text-lg flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-primary" /> Mobile Filters
                </h2>
                <button 
                  onClick={() => setShowFiltersMobile(false)}
                  className="p-1 rounded bg-zinc-900 border border-border text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Brand */}
              <div className="py-5 border-b border-border">
                <label className="text-white text-sm font-bold block mb-3">Drone Brand</label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-border rounded-xl text-zinc-300 text-sm focus:outline-none"
                >
                  {brands.map(b => (
                    <option key={b} value={b}>
                      {b === "all" ? "All Brands" : b}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stock */}
              <div className="py-5 border-b border-border">
                <label className="text-white text-sm font-bold block mb-3">Availability</label>
                <select
                  value={selectedStock}
                  onChange={(e) => setSelectedStock(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-border rounded-xl text-zinc-300 text-sm focus:outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="in_stock">In Stock</option>
                  <option value="limited_stock">Limited Stock</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
              </div>

              {/* Price */}
              <div className="py-5">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-white text-sm font-bold">Max Price</label>
                  <span className="text-primary font-bold text-sm">${maxPrice.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="3000"
                  max="25000"
                  step="500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-primary bg-zinc-800 h-1.5 rounded-lg appearance-none"
                />
                <div className="flex justify-between text-[11px] text-zinc-500 mt-1">
                  <span>$3,000</span>
                  <span>$25,000</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-border">
              <button
                onClick={resetFilters}
                className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-border text-sm font-bold rounded-lg transition-colors"
              >
                Reset All Filters
              </button>
              <button
                onClick={() => setShowFiltersMobile(false)}
                className="w-full py-2 bg-primary hover:bg-emerald-600 text-primary-foreground text-sm font-bold rounded-lg transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
