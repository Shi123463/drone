"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useStore, Drone, AgricultureService, TrainingCourse, ContactEnquiry, TrainingRegistration } from "@/lib/store";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useRouter } from "next/navigation";
import { 
  ShieldAlert, 
  LayoutDashboard, 
  Cpu, 
  Wrench, 
  GraduationCap, 
  MessageSquare, 
  Star, 
  Users, 
  Settings as SettingsIcon, 
  Plus, 
  Trash2, 
  Edit, 
  Check, 
  X, 
  TrendingUp, 
  Package, 
  DollarSign, 
  Map, 
  Eye, 
  EyeOff 
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { 
    currentUser, 
    drones, 
    droneImages,
    services, 
    courses, 
    registrations, 
    reviews, 
    enquiries, 
    settings,
    
    addDrone,
    updateDrone,
    deleteDrone,
    addService,
    updateService,
    deleteService,
    addCourse,
    updateCourse,
    deleteCourse,
    updateRegistrationStatus,
    deleteReview,
    toggleReviewVisibility,
    updateEnquiryStatus,
    updateSetting,
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    "overview" | "drones" | "services" | "courses" | "registrations" | "reviews" | "enquiries" | "users" | "settings"
  >("overview");

  // Redirect to login if user not authenticated or not admin
  useEffect(() => {
    const timeout = setTimeout(() => {
      const savedUser = localStorage.getItem("agrofly_current_user");
      if (!savedUser) {
        router.push("/login?redirect=/admin&notice=Please+sign+in+as+admin.");
        return;
      }
      const userObj = JSON.parse(savedUser);
      if (userObj.role !== "admin") {
        router.push("/login?redirect=/admin&notice=Access+denied.+Administrator+clearance+required.");
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [currentUser, router]);

  // Premium Preset Image URLs
  const IMAGE_PRESETS = [
    { name: "Spraying Drone", url: "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&q=80&w=800" },
    { name: "Seeding Spreader", url: "https://images.unsplash.com/photo-1595841696660-ab61494e09e5?auto=format&fit=crop&q=80&w=800" },
    { name: "Fixed Wing Mapping", url: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800" },
    { name: "Multispectral Quadcopter", url: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=800" },
    { name: "Calibration Testing", url: "https://images.unsplash.com/photo-1527847263472-aa5338d178b8?auto=format&fit=crop&q=80&w=800" },
  ];

  // Forms States
  // 1. Drone Form
  const [showDroneModal, setShowDroneModal] = useState(false);
  const [editingDroneId, setEditingDroneId] = useState<string | null>(null);
  const [droneBrand, setDroneBrand] = useState("");
  const [droneModel, setDroneModel] = useState("");
  const [dronePrice, setDronePrice] = useState(10000);
  const [droneDesc, setDroneDesc] = useState("");
  const [droneTank, setDroneTank] = useState("");
  const [droneBattery, setDroneBattery] = useState("");
  const [droneFlightTime, setDroneFlightTime] = useState("");
  const [droneCoverage, setDroneCoverage] = useState("");
  const [droneCamera, setDroneCamera] = useState("");
  const [droneGps, setDroneGps] = useState("");
  const [droneFeatured, setDroneFeatured] = useState(false);
  const [droneHidden, setDroneHidden] = useState(false);
  const [droneStock, setDroneStock] = useState<"in_stock" | "limited_stock" | "out_of_stock">("in_stock");
  const [droneImageUrls, setDroneImageUrls] = useState<string[]>([""]);

  // 2. Service Form
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceTitle, setServiceTitle] = useState("");
  const [serviceDesc, setServiceDesc] = useState("");
  const [servicePrice, setServicePrice] = useState(10);
  const [serviceFeatures, setServiceFeatures] = useState<string>("");
  const [serviceImg, setServiceImg] = useState("");

  // 3. Course Form
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDesc, setCourseDesc] = useState("");
  const [coursePrice, setCoursePrice] = useState(100);
  const [courseDuration, setCourseDuration] = useState("");
  const [courseSyllabus, setCourseSyllabus] = useState<string>("");
  const [courseImg, setCourseImg] = useState("");

  // Users log (from localstorage list)
  const [usersList, setUsersList] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const list = JSON.parse(localStorage.getItem("agrofly_users") || "[]");
      // Add admin if empty
      if (list.length === 0 && currentUser) {
        list.push(currentUser);
        localStorage.setItem("agrofly_users", JSON.stringify(list));
      }
      setUsersList(list);
    }
  }, [currentUser]);

  // Auth Protection Fallback
  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex flex-col justify-center items-center bg-zinc-950 text-white py-20 px-6">
          <ShieldAlert className="w-12 h-12 text-primary animate-pulse mb-4" />
          <h1 className="text-xl font-bold">Verifying Administrator Access...</h1>
          <p className="text-zinc-500 mt-2 text-sm">Please sign in as admin. Checking local credentials.</p>
        </div>
        <Footer />
      </div>
    );
  }

  // =========================================================================
  // ACTIONS SUBMIT HANDLERS
  // =========================================================================

  // Drone Submit
  const handleDroneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanImages = droneImageUrls.filter(url => url.trim() !== "");
    const finalImages = cleanImages.length > 0 ? cleanImages : [IMAGE_PRESETS[0].url];

    const droneData = {
      brand: droneBrand,
      model: droneModel,
      price: Number(dronePrice),
      description: droneDesc,
      tank_capacity: droneTank,
      battery: droneBattery,
      flight_time: droneFlightTime,
      coverage_area: droneCoverage,
      camera: droneCamera,
      gps: droneGps,
      featured: droneFeatured,
      hidden: droneHidden,
      stock_status: droneStock,
    };

    if (editingDroneId) {
      updateDrone(editingDroneId, droneData, finalImages);
    } else {
      addDrone(droneData, finalImages);
    }

    // Reset and close
    setShowDroneModal(false);
    resetDroneForm();
  };

  const resetDroneForm = () => {
    setEditingDroneId(null);
    setDroneBrand("");
    setDroneModel("");
    setDronePrice(10000);
    setDroneDesc("");
    setDroneTank("");
    setDroneBattery("");
    setDroneFlightTime("");
    setDroneCoverage("");
    setDroneCamera("");
    setDroneGps("");
    setDroneFeatured(false);
    setDroneHidden(false);
    setDroneStock("in_stock");
    setDroneImageUrls([""]);
  };

  const handleEditDrone = (drone: Drone) => {
    setEditingDroneId(drone.id);
    setDroneBrand(drone.brand);
    setDroneModel(drone.model);
    setDronePrice(drone.price);
    setDroneDesc(drone.description);
    setDroneTank(drone.tank_capacity || "");
    setDroneBattery(drone.battery || "");
    setDroneFlightTime(drone.flight_time || "");
    setDroneCoverage(drone.coverage_area || "");
    setDroneCamera(drone.camera || "");
    setDroneGps(drone.gps || "");
    setDroneFeatured(drone.featured);
    setDroneHidden(drone.hidden);
    setDroneStock(drone.stock_status);
    
    const imgs = droneImages.filter(img => img.drone_id === drone.id).sort((a,b)=>a.order_index - b.order_index).map(img => img.image_url);
    setDroneImageUrls(imgs.length > 0 ? imgs : [""]);
    setShowDroneModal(true);
  };

  // Service Submit
  const handleServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalFeatures = typeof serviceFeatures === "string" 
      ? (serviceFeatures as string).split("\n").filter((f: string) => f.trim() !== "") 
      : serviceFeatures;

    const data = {
      title: serviceTitle,
      description: serviceDesc,
      price: Number(servicePrice),
      features: finalFeatures,
      image_url: serviceImg || IMAGE_PRESETS[0].url,
    };

    if (editingServiceId) {
      updateService(editingServiceId, data);
    } else {
      addService(data);
    }
    setShowServiceModal(false);
    resetServiceForm();
  };

  const resetServiceForm = () => {
    setEditingServiceId(null);
    setServiceTitle("");
    setServiceDesc("");
    setServicePrice(10);
    setServiceFeatures("");
    setServiceImg("");
  };

  const handleEditService = (service: AgricultureService) => {
    setEditingServiceId(service.id);
    setServiceTitle(service.title);
    setServiceDesc(service.description);
    setServicePrice(service.price);
    setServiceFeatures(service.features.join("\n"));
    setServiceImg(service.image_url);
    setShowServiceModal(true);
  };

  // Course Submit
  const handleCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalSyllabus = typeof courseSyllabus === "string" 
      ? (courseSyllabus as string).split("\n").filter((f: string) => f.trim() !== "") 
      : courseSyllabus;

    const data = {
      title: courseTitle,
      description: courseDesc,
      price: Number(coursePrice),
      duration: courseDuration,
      syllabus: finalSyllabus,
      image_url: courseImg || IMAGE_PRESETS[2].url,
    };

    if (editingCourseId) {
      updateCourse(editingCourseId, data);
    } else {
      addCourse(data);
    }
    setShowCourseModal(false);
    resetCourseForm();
  };

  const resetCourseForm = () => {
    setEditingCourseId(null);
    setCourseTitle("");
    setCourseDesc("");
    setCoursePrice(100);
    setCourseDuration("");
    setCourseSyllabus("");
    setCourseImg("");
  };

  const handleEditCourse = (course: TrainingCourse) => {
    setEditingCourseId(course.id);
    setCourseTitle(course.title);
    setCourseDesc(course.description);
    setCoursePrice(course.price);
    setCourseDuration(course.duration);
    setCourseSyllabus(course.syllabus.join("\n"));
    setCourseImg(course.image_url);
    setShowCourseModal(true);
  };

  // User promotion/demotion role
  const handleToggleUserRole = (userId: string, currentRole: "admin" | "customer") => {
    const list = [...usersList];
    const userIndex = list.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      const nextRole = currentRole === "admin" ? "customer" : "admin";
      list[userIndex].role = nextRole;
      setUsersList(list);
      localStorage.setItem("agrofly_users", JSON.stringify(list));
      
      // Update session if editing self
      if (currentUser.id === userId) {
        localStorage.setItem("agrofly_current_user", JSON.stringify(list[userIndex]));
        window.location.reload();
      }
    }
  };

  // =========================================================================
  // ANALYTICS COMPUTATIONS (For Overview Panel)
  // =========================================================================
  const statsMetrics = useMemo(() => {
    const totalDronesVal = drones.filter(d => !d.hidden).length;
    const pendingRegCount = registrations.filter(r => r.status === "pending").length;
    const incomingEnqCount = enquiries.filter(e => e.status === "new").length;
    
    // Calculate total mock revenue from confirmed/completed registrations & drone price weights
    const registrationsRevenue = registrations
      .filter(r => r.status === "confirmed" || r.status === "completed")
      .reduce((sum, r) => {
        const c = courses.find(course => course.id === r.course_id);
        return sum + (c ? c.price : 0);
      }, 0);

    const enquiriesRevenue = enquiries
      .filter(e => e.status === "replied")
      .reduce((sum, e) => {
        const d = e.drone_id ? drones.find(drone => drone.id === e.drone_id) : null;
        return sum + (d ? d.price * 0.15 : 120); // 15% booking deposit mock weight
      }, 0);

    const totalRevenue = 42500 + registrationsRevenue + enquiriesRevenue; // Base seed + operations

    return {
      totalDronesVal,
      pendingRegCount,
      incomingEnqCount,
      totalRevenue
    };
  }, [drones, registrations, enquiries, courses]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 bg-zinc-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Banner */}
          <div className="border-b border-border pb-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                <LayoutDashboard className="w-8 h-8 text-primary" /> AgroFly Admin Control
              </h1>
              <p className="text-zinc-400 mt-2 text-xs">
                Manage catalogs, student pilot rolls, customer review moderations, and settings logs.
              </p>
            </div>
            
            <div className="flex items-center gap-3 bg-primary/10 border border-primary/20 text-primary px-3.5 py-1.5 rounded-xl text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>Full Clearance Mode</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Sidebar Controller (Left - 3 cols) */}
            <div className="lg:col-span-3 space-y-4">
              <div className="flex flex-col gap-1 bg-zinc-900/40 border border-border p-2 rounded-2xl">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${
                    activeTab === "overview" ? "bg-primary text-primary-foreground" : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                  }`}
                >
                  <TrendingUp className="w-4 h-4" /> Overview Dashboard
                </button>

                <button
                  onClick={() => setActiveTab("drones")}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${
                    activeTab === "drones" ? "bg-primary text-primary-foreground" : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                  }`}
                >
                  <Cpu className="w-4 h-4" /> Drones Inventory
                </button>

                <button
                  onClick={() => setActiveTab("services")}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${
                    activeTab === "services" ? "bg-primary text-primary-foreground" : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                  }`}
                >
                  <Wrench className="w-4 h-4" /> Operation Services
                </button>

                <button
                  onClick={() => setActiveTab("courses")}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${
                    activeTab === "courses" ? "bg-primary text-primary-foreground" : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                  }`}
                >
                  <GraduationCap className="w-4 h-4" /> Academy Courses
                </button>

                <button
                  onClick={() => setActiveTab("registrations")}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                    activeTab === "registrations" ? "bg-primary text-primary-foreground" : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                  }`}
                >
                  <span className="flex items-center gap-2.5"><Users className="w-4 h-4" /> Pilot Registrations</span>
                  {statsMetrics.pendingRegCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded bg-amber-500 text-zinc-950 text-[9px] font-black">{statsMetrics.pendingRegCount}</span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${
                    activeTab === "reviews" ? "bg-primary text-primary-foreground" : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                  }`}
                >
                  <Star className="w-4 h-4" /> Review Moderation
                </button>

                <button
                  onClick={() => setActiveTab("enquiries")}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                    activeTab === "enquiries" ? "bg-primary text-primary-foreground" : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                  }`}
                >
                  <span className="flex items-center gap-2.5"><MessageSquare className="w-4 h-4" /> Enquiries Ticketing</span>
                  {statsMetrics.incomingEnqCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded bg-primary text-zinc-950 text-[9px] font-black">{statsMetrics.incomingEnqCount}</span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab("users")}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${
                    activeTab === "users" ? "bg-primary text-primary-foreground" : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                  }`}
                >
                  <Users className="w-4 h-4" /> User Management
                </button>

                <button
                  onClick={() => setActiveTab("settings")}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${
                    activeTab === "settings" ? "bg-primary text-primary-foreground" : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                  }`}
                >
                  <SettingsIcon className="w-4 h-4" /> Global Settings
                </button>
              </div>
            </div>

            {/* Dashboard Action Content Area (Right - 9 cols) */}
            <div className="lg:col-span-9 bg-zinc-900/20 border border-border p-6 rounded-2xl min-h-[500px]">
              
              {/* =======================================================
                  1. OVERVIEW PANEL
                 ======================================================= */}
              {activeTab === "overview" && (
                <div className="space-y-8">
                  <div className="pb-3 border-b border-border">
                    <h2 className="text-lg font-bold text-white">Overview Dashboard</h2>
                  </div>

                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-zinc-900/60 border border-border flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-primary flex items-center justify-center flex-shrink-0">
                        <DollarSign className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-500 font-bold uppercase">Mock Revenue</span>
                        <p className="text-white text-base font-extrabold mt-0.5">${statsMetrics.totalRevenue.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-zinc-900/60 border border-border flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                        <Cpu className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-500 font-bold uppercase">Active Drones</span>
                        <p className="text-white text-base font-extrabold mt-0.5">{statsMetrics.totalDronesVal}</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-zinc-900/60 border border-border flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-500 font-bold uppercase">Open Enrollments</span>
                        <p className="text-white text-base font-extrabold mt-0.5">{statsMetrics.pendingRegCount}</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-zinc-900/60 border border-border flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-500 font-bold uppercase">New Enquiries</span>
                        <p className="text-white text-base font-extrabold mt-0.5">{statsMetrics.incomingEnqCount}</p>
                      </div>
                    </div>
                  </div>

                  {/* SVG Mock Graphs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    {/* Sales trend SVG */}
                    <div className="p-5 rounded-2xl bg-zinc-900/40 border border-border space-y-4">
                      <div className="space-y-1">
                        <h4 className="text-white text-xs font-bold uppercase tracking-wider">Operations & Sales Growth</h4>
                        <p className="text-[10px] text-zinc-500">6-Month mock sales trends (in thousands)</p>
                      </div>
                      
                      <div className="h-48 w-full flex items-end">
                        <svg className="w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="gradient-glow" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          {/* Grid lines */}
                          <line x1="0" y1="10" x2="100" y2="10" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                          <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                          <line x1="0" y1="40" x2="100" y2="40" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                          
                          {/* Filled Area */}
                          <path d="M 0 50 L 0 35 L 20 28 L 40 40 L 60 22 L 80 15 L 100 8 L 100 50 Z" fill="url(#gradient-glow)" />
                          {/* Trend line */}
                          <path d="M 0 35 L 20 28 L 40 40 L 60 22 L 80 15 L 100 8" fill="none" stroke="#10b981" strokeWidth="1.5" />
                        </svg>
                      </div>
                      
                      <div className="flex justify-between text-[9px] text-zinc-500 px-1">
                        <span>Jan</span>
                        <span>Feb</span>
                        <span>Mar</span>
                        <span>Apr</span>
                        <span>May</span>
                        <span>Jun</span>
                      </div>
                    </div>

                    {/* Course enrollments SVG bar */}
                    <div className="p-5 rounded-2xl bg-zinc-900/40 border border-border space-y-4">
                      <div className="space-y-1">
                        <h4 className="text-white text-xs font-bold uppercase tracking-wider">Academy Registration Distribution</h4>
                        <p className="text-[10px] text-zinc-500">Student enrollment counts per course syllabus type</p>
                      </div>
                      
                      <div className="h-48 w-full flex items-end justify-around gap-4 pb-2 border-b border-border/40">
                        {/* Bar 1 */}
                        <div className="flex flex-col items-center gap-2 w-12">
                          <span className="text-[9px] font-bold text-zinc-400">12</span>
                          <div className="w-full bg-emerald-500 rounded-t-md" style={{ height: '70px' }} />
                          <span className="text-[9px] text-zinc-500 truncate text-center w-full">Part 107</span>
                        </div>
                        {/* Bar 2 */}
                        <div className="flex flex-col items-center gap-2 w-12">
                          <span className="text-[9px] font-bold text-zinc-400">18</span>
                          <div className="w-full bg-primary rounded-t-md" style={{ height: '110px' }} />
                          <span className="text-[9px] text-zinc-500 truncate text-center w-full">Heavy Spray</span>
                        </div>
                        {/* Bar 3 */}
                        <div className="flex flex-col items-center gap-2 w-12">
                          <span className="text-[9px] font-bold text-zinc-400">8</span>
                          <div className="w-full bg-emerald-700 rounded-t-md" style={{ height: '48px' }} />
                          <span className="text-[9px] text-zinc-500 truncate text-center w-full">GIS Maps</span>
                        </div>
                      </div>
                      
                      <div className="text-[8px] text-zinc-600 text-center uppercase tracking-wider">
                        Enrollments live counts tracker
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* =======================================================
                  2. DRONES INVENTORY (CRUD)
                 ======================================================= */}
              {activeTab === "drones" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-3 border-b border-border">
                    <h2 className="text-lg font-bold text-white">Drones Inventory</h2>
                    <button 
                      onClick={() => { resetDroneForm(); setShowDroneModal(true); }}
                      className="px-3.5 py-1.5 bg-primary text-primary-foreground font-bold text-xs rounded-lg hover:bg-emerald-600 flex items-center gap-1.5 transition-all"
                    >
                      <Plus className="w-4 h-4" /> Add Drone System
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-border text-zinc-400">
                          <th className="py-3 px-2">Brand</th>
                          <th className="py-3 px-2">Model</th>
                          <th className="py-3 px-2">Tank Capacity</th>
                          <th className="py-3 px-2">Price</th>
                          <th className="py-3 px-2">Stock Status</th>
                          <th className="py-3 px-2 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {drones.map((drone) => (
                          <tr key={drone.id} className="border-b border-border/60 hover:bg-zinc-900/30 transition-colors">
                            <td className="py-3.5 px-2 font-semibold text-zinc-400">{drone.brand}</td>
                            <td className="py-3.5 px-2 font-bold text-white">{drone.model}</td>
                            <td className="py-3.5 px-2 text-zinc-300">{drone.tank_capacity || "N/A"}</td>
                            <td className="py-3.5 px-2 text-white font-bold">${drone.price.toLocaleString()}</td>
                            <td className="py-3.5 px-2 uppercase text-[10px]">
                              {drone.stock_status.replace("_", " ")}
                            </td>
                            <td className="py-3.5 px-2 text-center flex justify-center gap-2">
                              <button 
                                onClick={() => handleEditDrone(drone)}
                                className="p-1 rounded bg-zinc-900 border border-border text-zinc-400 hover:text-white"
                                title="Edit Drone details"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => deleteDrone(drone.id)}
                                className="p-1 rounded bg-zinc-900 border border-border text-zinc-400 hover:text-red-400 hover:border-red-500/20"
                                title="Remove Drone from catalog"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* =======================================================
                  3. SERVICES INVENTORY (CRUD)
                 ======================================================= */}
              {activeTab === "services" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-3 border-b border-border">
                    <h2 className="text-lg font-bold text-white">Agriculture Services</h2>
                    <button 
                      onClick={() => { resetServiceForm(); setShowServiceModal(true); }}
                      className="px-3.5 py-1.5 bg-primary text-primary-foreground font-bold text-xs rounded-lg hover:bg-emerald-600 flex items-center gap-1.5 transition-all"
                    >
                      <Plus className="w-4 h-4" /> Add Operations Service
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((service) => (
                      <div key={service.id} className="p-4 rounded-xl bg-zinc-900/30 border border-border flex justify-between gap-4">
                        <div className="space-y-2">
                          <h3 className="text-white text-sm font-bold">{service.title}</h3>
                          <p className="text-zinc-400 text-[11px] line-clamp-2 leading-relaxed">{service.description}</p>
                          <span className="text-primary font-bold text-xs block">${service.price}/acre estimation</span>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button 
                            onClick={() => handleEditService(service)}
                            className="p-2 rounded bg-zinc-950 border border-border text-zinc-400 hover:text-white flex items-center justify-center"
                            title="Edit Service"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deleteService(service.id)}
                            className="p-2 rounded bg-zinc-950 border border-border text-zinc-400 hover:text-red-400 flex items-center justify-center"
                            title="Delete Service"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* =======================================================
                  4. ACADEMY COURSES (CRUD)
                 ======================================================= */}
              {activeTab === "courses" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-3 border-b border-border">
                    <h2 className="text-lg font-bold text-white">Academy Pilot Courses</h2>
                    <button 
                      onClick={() => { resetCourseForm(); setShowCourseModal(true); }}
                      className="px-3.5 py-1.5 bg-primary text-primary-foreground font-bold text-xs rounded-lg hover:bg-emerald-600 flex items-center gap-1.5 transition-all"
                    >
                      <Plus className="w-4 h-4" /> Create Course
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {courses.map((course) => (
                      <div key={course.id} className="p-4 rounded-xl bg-zinc-900/30 border border-border flex justify-between gap-4">
                        <div className="space-y-2">
                          <span className="text-[10px] text-zinc-500 font-bold uppercase">{course.duration} duration</span>
                          <h3 className="text-white text-sm font-bold leading-tight">{course.title}</h3>
                          <span className="text-primary font-bold text-xs block">${course.price} registration fee</span>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button 
                            onClick={() => handleEditCourse(course)}
                            className="p-2 rounded bg-zinc-950 border border-border text-zinc-400 hover:text-white flex items-center justify-center"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deleteCourse(course.id)}
                            className="p-2 rounded bg-zinc-950 border border-border text-zinc-400 hover:text-red-400 flex items-center justify-center"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* =======================================================
                  5. STUDENT REGISTRATIONS
                 ======================================================= */}
              {activeTab === "registrations" && (
                <div className="space-y-6">
                  <div className="pb-3 border-b border-border">
                    <h2 className="text-lg font-bold text-white">Student Course Registrations</h2>
                  </div>

                  {registrations.length === 0 ? (
                    <p className="text-zinc-500 text-xs text-center py-10">No students have enrolled in the academy yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-border text-zinc-400">
                            <th className="py-3 px-2">Student ID</th>
                            <th className="py-3 px-2">Course Name</th>
                            <th className="py-3 px-2">Date</th>
                            <th className="py-3 px-2">Status</th>
                            <th className="py-3 px-2 text-center">Update Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {registrations.map((reg) => {
                            const course = courses.find(c => c.id === reg.course_id);
                            return (
                              <tr key={reg.id} className="border-b border-border/60 hover:bg-zinc-900/30 transition-colors">
                                <td className="py-3.5 px-2 font-mono text-zinc-500 text-[10px]">{reg.user_id}</td>
                                <td className="py-3.5 px-2 font-bold text-white">{course?.title || "Unknown Course"}</td>
                                <td className="py-3.5 px-2 text-zinc-400">{reg.registration_date}</td>
                                <td className="py-3.5 px-2">
                                  <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-extrabold ${
                                    reg.status === "confirmed" ? "bg-emerald-500/10 text-primary border border-emerald-500/25" :
                                    reg.status === "completed" ? "bg-blue-500/10 text-blue-400 border border-blue-500/25" :
                                    reg.status === "cancelled" ? "bg-red-500/10 text-red-400 border border-red-500/25" :
                                    "bg-zinc-900 text-zinc-400 border border-zinc-700"
                                  }`}>
                                    {reg.status}
                                  </span>
                                </td>
                                <td className="py-3.5 px-2 text-center flex justify-center gap-1">
                                  <select
                                    value={reg.status}
                                    onChange={(e) => updateRegistrationStatus(reg.id, e.target.value as any)}
                                    className="px-2 py-1 bg-zinc-950 border border-border rounded text-[10px] text-zinc-300 focus:outline-none"
                                  >
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirm</option>
                                    <option value="completed">Complete</option>
                                    <option value="cancelled">Cancel</option>
                                  </select>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* =======================================================
                  6. REVIEW MODERATION
                 ======================================================= */}
              {activeTab === "reviews" && (
                <div className="space-y-6">
                  <div className="pb-3 border-b border-border">
                    <h2 className="text-lg font-bold text-white">Review Moderation Panel</h2>
                  </div>

                  {reviews.length === 0 ? (
                    <p className="text-zinc-500 text-xs text-center py-10">No product reviews have been submitted.</p>
                  ) : (
                    <div className="space-y-4">
                      {reviews.map((rev) => {
                        const droneObj = drones.find(d => d.id === rev.drone_id);
                        return (
                          <div 
                            key={rev.id} 
                            className="p-4 rounded-xl border border-border bg-zinc-900/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-zinc-800 transition-colors"
                          >
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <span className="font-bold text-white text-xs">{rev.user_name}</span>
                                <span className="text-[10px] text-zinc-500">Drone ID: {droneObj ? `${droneObj.brand} ${droneObj.model}` : "Unknown"}</span>
                              </div>
                              <p className="text-zinc-400 text-xs italic">"{rev.comment}"</p>
                              <div className="text-amber-400 text-[10px] font-bold">Rating: {rev.rating} ★</div>
                            </div>

                            <div className="flex gap-2 self-end sm:self-auto">
                              <button
                                onClick={() => toggleReviewVisibility(rev.id)}
                                className={`p-1.5 rounded border flex items-center justify-center text-xs gap-1.5 ${
                                  rev.hidden 
                                    ? "bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/25" 
                                    : "bg-zinc-900 border-border text-zinc-400 hover:text-white"
                                }`}
                                title={rev.hidden ? "Make review visible" : "Hide review from catalog"}
                              >
                                {rev.hidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                <span className="text-[9px] font-bold">{rev.hidden ? "Hidden" : "Visible"}</span>
                              </button>

                              <button
                                onClick={() => deleteReview(rev.id)}
                                className="p-1.5 rounded bg-zinc-900 border border-border text-zinc-400 hover:text-red-400 hover:border-red-500/20 flex items-center justify-center"
                                title="Delete Review"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* =======================================================
                  7. ENQUIRIES TICKETS PANEL
                 ======================================================= */}
              {activeTab === "enquiries" && (
                <div className="space-y-6">
                  <div className="pb-3 border-b border-border">
                    <h2 className="text-lg font-bold text-white">Contact & Quotation Enquiries</h2>
                  </div>

                  {enquiries.length === 0 ? (
                    <p className="text-zinc-500 text-xs text-center py-10">No support tickets or sales enquiries have been filed.</p>
                  ) : (
                    <div className="space-y-4">
                      {enquiries.map((enq) => {
                        const droneObj = enq.drone_id ? drones.find(d => d.id === enq.drone_id) : null;
                        
                        return (
                          <div 
                            key={enq.id}
                            className={`p-5 rounded-2xl border bg-zinc-900/30 space-y-3 transition-all ${
                              enq.status === "new" ? "border-primary/45 shadow shadow-primary/5" : "border-border"
                            }`}
                          >
                            <div className="flex justify-between items-start gap-4">
                              <div className="space-y-1">
                                <span className="text-[9px] font-bold uppercase tracking-wider text-primary">{enq.subject}</span>
                                <h3 className="text-white text-xs font-bold">{enq.user_name} ({enq.email})</h3>
                                <p className="text-[9px] text-zinc-500">Phone: {enq.phone || "N/A"}</p>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <select
                                  value={enq.status}
                                  onChange={(e) => updateEnquiryStatus(enq.id, e.target.value as any)}
                                  className="px-2 py-1 bg-zinc-950 border border-border rounded text-[10px] text-zinc-300 focus:outline-none"
                                >
                                  <option value="new">New</option>
                                  <option value="read">Read</option>
                                  <option value="replied">Replied</option>
                                </select>
                              </div>
                            </div>

                            <p className="text-zinc-300 text-xs leading-relaxed bg-zinc-950/50 p-3.5 rounded-xl border border-border/60">
                              {enq.message}
                            </p>

                            {droneObj && (
                              <div className="text-[9px] text-zinc-500 flex items-center gap-1.5">
                                <span className="font-semibold">Associated Model:</span>
                                <a href={`/drones/${droneObj.id}`} className="text-primary hover:underline font-bold">{droneObj.brand} {droneObj.model}</a>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* =======================================================
                  8. USER MANAGEMENT
                 ======================================================= */}
              {activeTab === "users" && (
                <div className="space-y-6">
                  <div className="pb-3 border-b border-border">
                    <h2 className="text-lg font-bold text-white">Registered Users Profile</h2>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-border text-zinc-400">
                          <th className="py-3 px-2">Account Name</th>
                          <th className="py-3 px-2">Email Address</th>
                          <th className="py-3 px-2">Assigned Role</th>
                          <th className="py-3 px-2 text-center">Toggle Privilege</th>
                        </tr>
                      </thead>
                      <tbody>
                        {usersList.map((usr) => (
                          <tr key={usr.id} className="border-b border-border/60 hover:bg-zinc-900/30 transition-colors">
                            <td className="py-3.5 px-2 font-bold text-white">{usr.full_name}</td>
                            <td className="py-3.5 px-2 text-zinc-400">{usr.email}</td>
                            <td className="py-3.5 px-2 uppercase font-extrabold tracking-wider text-[10px] text-primary">{usr.role}</td>
                            <td className="py-3.5 px-2 text-center flex justify-center">
                              <button
                                onClick={() => handleToggleUserRole(usr.id, usr.role)}
                                className={`px-3 py-1 rounded text-[10px] font-bold border transition-colors ${
                                  usr.role === "admin" 
                                    ? "bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/25" 
                                    : "bg-primary/10 border-primary/20 text-primary hover:bg-primary/25"
                                }`}
                              >
                                {usr.role === "admin" ? "Demote to Customer" : "Promote to Admin"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* =======================================================
                  9. GLOBAL SETTINGS
                 ======================================================= */}
              {activeTab === "settings" && (
                <div className="space-y-6">
                  <div className="pb-3 border-b border-border">
                    <h2 className="text-lg font-bold text-white">Global Business Settings</h2>
                  </div>

                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      alert("Global business settings saved! All public cards updated.");
                    }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl"
                  >
                    <div className="space-y-1">
                      <label className="text-[11px] text-zinc-400 font-medium">Company Name</label>
                      <input 
                        type="text" 
                        value={settings["company_name"] || ""} 
                        onChange={(e) => updateSetting("company_name", e.target.value)}
                        className="w-full px-3.5 py-2 bg-zinc-950 border border-border rounded-xl text-white text-xs focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-zinc-400 font-medium">Hotline Support Phone</label>
                      <input 
                        type="text" 
                        value={settings["phone"] || ""} 
                        onChange={(e) => updateSetting("phone", e.target.value)}
                        className="w-full px-3.5 py-2 bg-zinc-950 border border-border rounded-xl text-white text-xs focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-zinc-400 font-medium">Business Contact Email</label>
                      <input 
                        type="email" 
                        value={settings["email"] || ""} 
                        onChange={(e) => updateSetting("email", e.target.value)}
                        className="w-full px-3.5 py-2 bg-zinc-950 border border-border rounded-xl text-white text-xs focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-zinc-400 font-medium">Business Operating Hours</label>
                      <input 
                        type="text" 
                        value={settings["business_hours"] || ""} 
                        onChange={(e) => updateSetting("business_hours", e.target.value)}
                        className="w-full px-3.5 py-2 bg-zinc-950 border border-border rounded-xl text-white text-xs focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[11px] text-zinc-400 font-medium">Headquarters Address</label>
                      <input 
                        type="text" 
                        value={settings["address"] || ""} 
                        onChange={(e) => updateSetting("address", e.target.value)}
                        className="w-full px-3.5 py-2 bg-zinc-950 border border-border rounded-xl text-white text-xs focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[11px] text-zinc-400 font-medium">Google Map Embed Source (Iframe Link)</label>
                      <input 
                        type="text" 
                        value={settings["google_map_embed"] || ""} 
                        onChange={(e) => updateSetting("google_map_embed", e.target.value)}
                        className="w-full px-3.5 py-2 bg-zinc-950 border border-border rounded-xl text-white text-xs focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2 border-t border-border pt-4">
                      <button 
                        type="submit"
                        className="px-6 py-2.5 bg-primary text-primary-foreground font-bold text-xs rounded-xl hover:bg-emerald-600 transition-colors"
                      >
                        Apply Global Updates
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>

          </div>

        </div>
      </main>

      {/* =======================================================================
          MODAL MODULATOR WINDOWS
         ======================================================================= */}

      {/* 1. Drone Creator Modal */}
      {showDroneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 px-4 overflow-y-auto py-10">
          <div className="w-full max-w-2xl bg-zinc-950 border border-border rounded-2xl p-6 sm:p-8 space-y-6 relative overflow-y-auto max-h-[90vh]">
            <button 
              onClick={() => { setShowDroneModal(false); resetDroneForm(); }} 
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-white text-xl font-bold">{editingDroneId ? "Modify Drone Details" : "Register Drone System"}</h3>

            <form onSubmit={handleDroneSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-400 font-medium">Brand (E.g., DJI, Hylio)</label>
                  <input type="text" value={droneBrand} onChange={e=>setDroneBrand(e.target.value)} className="w-full px-3 py-2 bg-zinc-900 border border-border rounded-xl text-white text-xs focus:outline-none" required />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-400 font-medium">Model Name (E.g., Agras T40)</label>
                  <input type="text" value={droneModel} onChange={e=>setDroneModel(e.target.value)} className="w-full px-3 py-2 bg-zinc-900 border border-border rounded-xl text-white text-xs focus:outline-none" required />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-400 font-medium">Price (USD)</label>
                  <input type="number" value={dronePrice} onChange={e=>setDronePrice(Number(e.target.value))} className="w-full px-3 py-2 bg-zinc-900 border border-border rounded-xl text-white text-xs focus:outline-none" required />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-400 font-medium">Tank Capacity</label>
                  <input type="text" value={droneTank} onChange={e=>setDroneTank(e.target.value)} placeholder="E.g., 40 Liters" className="w-full px-3 py-2 bg-zinc-900 border border-border rounded-xl text-white text-xs focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-400 font-medium">Stock Status</label>
                  <select value={droneStock} onChange={e=>setDroneStock(e.target.value as any)} className="w-full px-3 py-2 bg-zinc-900 border border-border rounded-xl text-white text-xs focus:outline-none">
                    <option value="in_stock">In Stock</option>
                    <option value="limited_stock">Limited Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-400 font-medium">Smart Battery Model</label>
                  <input type="text" value={droneBattery} onChange={e=>setDroneBattery(e.target.value)} placeholder="E.g., 30,000 mAh" className="w-full px-3 py-2 bg-zinc-900 border border-border rounded-xl text-white text-xs focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-400 font-medium">Estimated Flight Time</label>
                  <input type="text" value={droneFlightTime} onChange={e=>setDroneFlightTime(e.target.value)} placeholder="E.g., 20 minutes" className="w-full px-3 py-2 bg-zinc-900 border border-border rounded-xl text-white text-xs focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-400 font-medium">Coverage Area Efficiency</label>
                  <input type="text" value={droneCoverage} onChange={e=>setDroneCoverage(e.target.value)} placeholder="E.g., 20 hectares/hr" className="w-full px-3 py-2 bg-zinc-900 border border-border rounded-xl text-white text-xs focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-400 font-medium">Onboard Camera Specs</label>
                  <input type="text" value={droneCamera} onChange={e=>setDroneCamera(e.target.value)} placeholder="E.g., HD FPV Gimbal" className="w-full px-3 py-2 bg-zinc-900 border border-border rounded-xl text-white text-xs focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-400 font-medium">GPS Guidance System</label>
                  <input type="text" value={droneGps} onChange={e=>setDroneGps(e.target.value)} placeholder="E.g., RTK accuracy" className="w-full px-3 py-2 bg-zinc-900 border border-border rounded-xl text-white text-xs focus:outline-none" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400 font-medium">Product Description</label>
                <textarea rows={3} value={droneDesc} onChange={e=>setDroneDesc(e.target.value)} className="w-full px-3 py-2 bg-zinc-900 border border-border rounded-xl text-white text-xs focus:outline-none" required />
              </div>

              {/* Image Input Presets & Link */}
              <div className="space-y-3 border-t border-border/60 pt-4">
                <label className="text-xs font-bold text-white block">Product Images URLs</label>
                
                {droneImageUrls.map((url, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input 
                      type="text" 
                      value={url} 
                      onChange={(e) => {
                        const copy = [...droneImageUrls];
                        copy[idx] = e.target.value;
                        setDroneImageUrls(copy);
                      }} 
                      placeholder="Paste Unsplash or direct image URL..."
                      className="flex-1 px-3 py-1.5 bg-zinc-900 border border-border rounded-lg text-white text-xs focus:outline-none"
                    />
                    {droneImageUrls.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => setDroneImageUrls(droneImageUrls.filter((_, i)=> i !== idx))}
                        className="p-1.5 text-zinc-500 hover:text-red-400 bg-zinc-900 border border-border rounded-lg"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}

                {droneImageUrls.length < 5 && (
                  <button 
                    type="button" 
                    onClick={() => setDroneImageUrls([...droneImageUrls, ""])}
                    className="text-[10px] text-primary hover:underline font-bold"
                  >
                    + Add Additional image URL (Max 5)
                  </button>
                )}

                {/* Quick Presets Gallery */}
                <div className="space-y-1.5">
                  <span className="text-[9px] text-zinc-500 uppercase font-bold block">Quick Presets Gallery Selection:</span>
                  <div className="flex flex-wrap gap-2">
                    {IMAGE_PRESETS.map((preset, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          const copy = [...droneImageUrls];
                          // Fill the first empty or active index
                          const emptyIdx = copy.findIndex(url => url.trim() === "");
                          if (emptyIdx !== -1) {
                            copy[emptyIdx] = preset.url;
                          } else if (copy.length < 5) {
                            copy.push(preset.url);
                          } else {
                            copy[0] = preset.url;
                          }
                          setDroneImageUrls(copy);
                        }}
                        className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-border text-[9px] text-zinc-400 font-semibold"
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex gap-6 border-t border-border/60 pt-4">
                <label className="flex items-center gap-2 text-xs text-zinc-300">
                  <input type="checkbox" checked={droneFeatured} onChange={e=>setDroneFeatured(e.target.checked)} className="accent-primary w-4 h-4 rounded" />
                  <span>Featured Product (Display on Home page)</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-zinc-300">
                  <input type="checkbox" checked={droneHidden} onChange={e=>setDroneHidden(e.target.checked)} className="accent-primary w-4 h-4 rounded" />
                  <span>Hidden Product (Hide from catalog)</span>
                </label>
              </div>

              <div className="border-t border-border/60 pt-4 flex gap-4">
                <button type="submit" className="flex-1 py-2.5 bg-primary text-primary-foreground font-bold text-xs rounded-xl hover:bg-emerald-600">
                  {editingDroneId ? "Apply Changes" : "Create Drone System"}
                </button>
                <button type="button" onClick={() => { setShowDroneModal(false); resetDroneForm(); }} className="px-5 py-2.5 bg-zinc-900 border border-border text-xs rounded-xl hover:bg-zinc-800">
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 2. Service Creator Modal */}
      {showServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 px-4">
          <div className="w-full max-w-lg bg-zinc-950 border border-border rounded-2xl p-6 sm:p-8 space-y-6 relative">
            <button onClick={() => { setShowServiceModal(false); resetServiceForm(); }} className="absolute top-4 right-4 text-zinc-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-white text-xl font-bold">{editingServiceId ? "Modify Operation Service" : "Create Service Option"}</h3>

            <form onSubmit={handleServiceSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400 font-medium">Service Title</label>
                <input type="text" value={serviceTitle} onChange={e=>setServiceTitle(e.target.value)} className="w-full px-3 py-2 bg-zinc-900 border border-border rounded-xl text-white text-xs focus:outline-none" required />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-400 font-medium">Pricing Rate (USD/Acre)</label>
                  <input type="number" value={servicePrice} onChange={e=>setServicePrice(Number(e.target.value))} className="w-full px-3 py-2 bg-zinc-900 border border-border rounded-xl text-white text-xs focus:outline-none" required />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-400 font-medium">Banner Image URL</label>
                  <input type="text" value={serviceImg} onChange={e=>setServiceImg(e.target.value)} placeholder="Unsplash URL" className="w-full px-3 py-2 bg-zinc-900 border border-border rounded-xl text-white text-xs focus:outline-none" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400 font-medium">Description</label>
                <textarea rows={3} value={serviceDesc} onChange={e=>setServiceDesc(e.target.value)} className="w-full px-3 py-2 bg-zinc-900 border border-border rounded-xl text-white text-xs focus:outline-none" required />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400 font-medium">Bullet Highlights (One per line)</label>
                <textarea rows={4} value={serviceFeatures} onChange={e=>setServiceFeatures(e.target.value)} placeholder="E.g., Uniform drift protection nozzle&#10;Crop density report analysis" className="w-full px-3 py-2 bg-zinc-900 border border-border rounded-xl text-white text-xs focus:outline-none" required />
              </div>

              <div className="border-t border-border/60 pt-4 flex gap-4">
                <button type="submit" className="flex-1 py-2.5 bg-primary text-primary-foreground font-bold text-xs rounded-xl hover:bg-emerald-600">
                  {editingServiceId ? "Apply Changes" : "Create Service"}
                </button>
                <button type="button" onClick={() => { setShowServiceModal(false); resetServiceForm(); }} className="px-5 py-2.5 bg-zinc-900 border border-border text-xs rounded-xl hover:bg-zinc-800">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Course Creator Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 px-4">
          <div className="w-full max-w-lg bg-zinc-950 border border-border rounded-2xl p-6 sm:p-8 space-y-6 relative">
            <button onClick={() => { setShowCourseModal(false); resetCourseForm(); }} className="absolute top-4 right-4 text-zinc-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-white text-xl font-bold">{editingCourseId ? "Modify Course Specifications" : "Publish Flight Academy Course"}</h3>

            <form onSubmit={handleCourseSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400 font-medium">Course Title</label>
                <input type="text" value={courseTitle} onChange={e=>setCourseTitle(e.target.value)} className="w-full px-3 py-2 bg-zinc-900 border border-border rounded-xl text-white text-xs focus:outline-none" required />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-400 font-medium">Price (USD)</label>
                  <input type="number" value={coursePrice} onChange={e=>setCoursePrice(Number(e.target.value))} className="w-full px-3 py-2 bg-zinc-900 border border-border rounded-xl text-white text-xs focus:outline-none" required />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-400 font-medium">Duration (E.g., 3 Days)</label>
                  <input type="text" value={courseDuration} onChange={e=>setCourseDuration(e.target.value)} placeholder="3 Days" className="w-full px-3 py-2 bg-zinc-900 border border-border rounded-xl text-white text-xs focus:outline-none" required />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-400 font-medium">Course Image URL</label>
                  <input type="text" value={courseImg} onChange={e=>setCourseImg(e.target.value)} placeholder="Unsplash URL" className="w-full px-3 py-2 bg-zinc-900 border border-border rounded-xl text-white text-xs focus:outline-none" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400 font-medium">Course Summary</label>
                <textarea rows={3} value={courseDesc} onChange={e=>setCourseDesc(e.target.value)} className="w-full px-3 py-2 bg-zinc-900 border border-border rounded-xl text-white text-xs focus:outline-none" required />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400 font-medium">Syllabus Curriculum (One item per line)</label>
                <textarea rows={4} value={courseSyllabus} onChange={e=>setCourseSyllabus(e.target.value)} placeholder="E.g., FAA regulatory codes&#10;Calibration of telemetry systems" className="w-full px-3 py-2 bg-zinc-900 border border-border rounded-xl text-white text-xs focus:outline-none" required />
              </div>

              <div className="border-t border-border/60 pt-4 flex gap-4">
                <button type="submit" className="flex-1 py-2.5 bg-primary text-primary-foreground font-bold text-xs rounded-xl hover:bg-emerald-600">
                  {editingCourseId ? "Apply Changes" : "Publish Course"}
                </button>
                <button type="button" onClick={() => { setShowCourseModal(false); resetCourseForm(); }} className="px-5 py-2.5 bg-zinc-900 border border-border text-xs rounded-xl hover:bg-zinc-800">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
