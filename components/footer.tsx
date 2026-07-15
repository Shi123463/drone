"use client";

import React from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function Footer() {
  const { settings } = useStore();

  const companyName = settings.company_name || "AgroFly Systems Inc.";
  const address = settings.address || "1402 Agri-Business Parkway, Suite B, Des Moines, IA 50309";
  const phone = settings.phone || "+1 (800) 555-0199";
  const email = settings.email || "contact@agrofly-systems.com";
  const hours = settings.business_hours || "Mon - Fri: 8:00 AM - 5:00 PM CST";

  return (
    <footer className="bg-zinc-950 border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Company Brief */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center">
              <img src="/logo.png" alt="AgroFly Systems" className="h-12 w-auto object-contain" />
            </Link>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Premium commercial agriculture drones, expert training certification, and precision aerial crop spraying operations designed for modern farms.
            </p>
          </div>

          {/* Directory Links */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-4 tracking-wider uppercase">Products</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/drones" className="text-zinc-400 hover:text-white text-sm transition-colors">
                  Drone Catalog
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-zinc-400 hover:text-white text-sm transition-colors">
                  Spraying Services
                </Link>
              </li>
              <li>
                <Link href="/training" className="text-zinc-400 hover:text-white text-sm transition-colors">
                  Pilot Academy
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Info */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-4 tracking-wider uppercase">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-zinc-400 hover:text-white text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-zinc-400 hover:text-white text-sm transition-colors">
                  Before/After Gallery
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-zinc-400 hover:text-white text-sm transition-colors">
                  Get In Touch
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h3 className="text-white text-sm font-semibold mb-4 tracking-wider uppercase">Contact Us</h3>
            <div className="space-y-2.5 text-zinc-400 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>{address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <span>{phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <span>{email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                <span>{hours}</span>
              </div>
            </div>
          </div>

        </div>

        <div className="border-t border-border/60 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-500 text-xs">
            &copy; {new Date().getFullYear()} {companyName}. All rights reserved.
          </p>
          <div className="flex gap-4 text-zinc-500 text-xs">
            <Link href="/privacy" className="hover:text-zinc-300">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-zinc-300">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
