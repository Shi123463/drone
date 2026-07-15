"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

// =========================================================================
// DATA MODELS
// =========================================================================
export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: "customer" | "admin";
  created_at: string;
}

export interface Drone {
  id: string;
  brand: string;
  model: string;
  price: number;
  description: string;
  tank_capacity: string;
  battery: string;
  flight_time: string;
  coverage_area: string;
  camera: string;
  gps: string;
  featured: boolean;
  hidden: boolean;
  stock_status: "in_stock" | "limited_stock" | "out_of_stock";
  created_at: string;
}

export interface DroneImage {
  id: string;
  drone_id: string;
  image_url: string;
  order_index: number;
}

export interface AgricultureService {
  id: string;
  title: string;
  description: string;
  price: number;
  features: string[];
  image_url: string;
  created_at: string;
}

export interface TrainingCourse {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  syllabus: string[];
  image_url: string;
  created_at: string;
}

export interface TrainingRegistration {
  id: string;
  user_id: string;
  course_id: string;
  registration_date: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  created_at: string;
}

export interface Review {
  id: string;
  user_name: string;
  drone_id: string;
  rating: number;
  comment: string;
  hidden: boolean;
  created_at: string;
}

export interface ContactEnquiry {
  id: string;
  user_name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  drone_id?: string | null;
  status: "new" | "read" | "replied";
  created_at: string;
}

export interface Setting {
  key: string;
  value: string;
}

// =========================================================================
// DEFAULT SEED DATA (For Demo Mode Fallback)
// =========================================================================
const DEFAULT_DRONES: Drone[] = [
  {
    id: "drone-1",
    brand: "DJI",
    model: "Agras T40",
    price: 15499,
    description: "The DJI Agras T40 is equipped with the revolutionary Coaxial Twin Rotor design, enabling it to carry a spray load of 40 kg and a spread load of 50 kg (70 L). It features an active phased array radar, binocular vision, and dual atomized spraying systems for unmatched speed and safety.",
    tank_capacity: "40 Liters",
    battery: "30,000 mAh (DB1560)",
    flight_time: "18 minutes (fully loaded)",
    coverage_area: "21.3 hectares/hour",
    camera: "Ultra-HD FPV Gimbal Camera",
    gps: "Dual RTK Precision",
    featured: true,
    hidden: false,
    stock_status: "in_stock",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
  },
  {
    id: "drone-2",
    brand: "Hylio",
    model: "AG-230",
    price: 18999,
    description: "Built in the USA, the Hylio AG-230 is an eight-rotor UAS carrying up to a 30-liter chemical payload. Extremely robust construction combined with proprietary flight command software delivers precision application over complex terrain.",
    tank_capacity: "30 Liters",
    battery: "22,000 mAh dual packs",
    flight_time: "22 minutes (operational)",
    coverage_area: "15.5 hectares/hour",
    camera: "High Resolution Obstacle Detection Camera",
    gps: "Centimeter-level RTK GPS",
    featured: true,
    hidden: false,
    stock_status: "limited_stock",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
  },
  {
    id: "drone-3",
    brand: "DJI",
    model: "Agras T30",
    price: 11999,
    description: "A reliable and proven mid-size agricultural spraying drone featuring a 30-liter tank, spherical radar obstacle avoidance system, and IP67 weather rating. A great economic standard for multi-crop spraying.",
    tank_capacity: "30 Liters",
    battery: "29,000 mAh (BS60)",
    flight_time: "19 minutes (loaded)",
    coverage_area: "16.0 hectares/hour",
    camera: "Dual FPV Cameras (Front/Rear)",
    gps: "RTK Accuracy",
    featured: false,
    hidden: false,
    stock_status: "in_stock",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
  },
  {
    id: "drone-4",
    brand: "AgEagle",
    model: "eBee X",
    price: 8499,
    description: "The eBee X is a fixed-wing mapping drone designed to boost the quality and efficiency of agricultural mapping. Perfect for high-resolution orthomosaics and multispectral analysis across large wheat, corn, and soy fields.",
    tank_capacity: "N/A (Mapping Drone)",
    battery: "4,900 mAh Smart Battery",
    flight_time: "90 minutes",
    coverage_area: "500 hectares/flight",
    camera: "senseFly S.O.D.A. 3D & Sequoia+ Multispectral",
    gps: "RTK/PPK High Precision",
    featured: true,
    hidden: false,
    stock_status: "in_stock",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: "drone-5",
    brand: "XAG",
    model: "P100 Pro",
    price: 16999,
    description: "Features a split-platform structure that allows easy switching between spraying (50L capacity) and spreading (80L capacity). Powered by dual atomizing nozzles and high-efficiency smart batteries.",
    tank_capacity: "50 Liters",
    battery: "20,000 mAh smart powerpack",
    flight_time: "17 minutes",
    coverage_area: "25.0 hectares/hour",
    camera: "Real-time FPV Terrain Scanning Camera",
    gps: "RTK Positioning",
    featured: true,
    hidden: false,
    stock_status: "in_stock",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: "drone-6",
    brand: "Hylio",
    model: "AG-110",
    price: 9499,
    description: "A compact spraying drone featuring a 10-liter payload. Designed for small-scale farms, test plots, and localized orchard spot-spraying where navigation tightness is required.",
    tank_capacity: "10 Liters",
    battery: "16,000 mAh single pack",
    flight_time: "20 minutes (spot spraying)",
    coverage_area: "6.5 hectares/hour",
    camera: "FPV Navigation Camera",
    gps: "GPS / GLONASS / RTK Option",
    featured: false,
    hidden: false,
    stock_status: "in_stock",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
  },
  {
    id: "drone-7",
    brand: "DJI",
    model: "Phantom 4 RTK",
    price: 4999,
    description: "Compact quadcopter mapping drone capturing centimeter-accurate 2D and 3D terrain maps. Integrates seamlessly into GIS mapping software for crop density analysis.",
    tank_capacity: "N/A (Mapping Drone)",
    battery: "5,870 mAh LiPo 4S",
    flight_time: "30 minutes",
    coverage_area: "120 hectares/flight",
    camera: "20 MP 1-inch CMOS Sensor mechanical shutter",
    gps: "RTK Centimeter Accuracy",
    featured: false,
    hidden: false,
    stock_status: "out_of_stock",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
  },
  {
    id: "drone-8",
    brand: "Sentera",
    model: "PHX Fixed Wing",
    price: 13999,
    description: "An industrial-grade fixed-wing drone engineered for rapid coverage mapping. Features double-precision NDVI sensors for advanced plant-health insights.",
    tank_capacity: "N/A (Mapping Drone)",
    battery: "6,400 mAh LiPo pack",
    flight_time: "59 minutes",
    coverage_area: "350 hectares/flight",
    camera: "Double 4K Multispectral Crop Sensor",
    gps: "PPK Precision GPS",
    featured: false,
    hidden: false,
    stock_status: "limited_stock",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
  }
];

const DEFAULT_DRONE_IMAGES: DroneImage[] = [
  // DJI Agras T40
  { id: "img-1-1", drone_id: "drone-1", image_url: "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&q=80&w=800", order_index: 0 },
  { id: "img-1-2", drone_id: "drone-1", image_url: "https://images.unsplash.com/photo-1527847263472-aa5338d178b8?auto=format&fit=crop&q=80&w=800", order_index: 1 },
  // Hylio AG-230
  { id: "img-2-1", drone_id: "drone-2", image_url: "https://images.unsplash.com/photo-1595841696660-ab61494e09e5?auto=format&fit=crop&q=80&w=800", order_index: 0 },
  // DJI Agras T30
  { id: "img-3-1", drone_id: "drone-3", image_url: "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&q=80&w=800", order_index: 0 },
  // AgEagle eBee X
  { id: "img-4-1", drone_id: "drone-4", image_url: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800", order_index: 0 },
  // XAG P100 Pro
  { id: "img-5-1", drone_id: "drone-5", image_url: "https://images.unsplash.com/photo-1527847263472-aa5338d178b8?auto=format&fit=crop&q=80&w=800", order_index: 0 },
  // Hylio AG-110
  { id: "img-6-1", drone_id: "drone-6", image_url: "https://images.unsplash.com/photo-1595841696660-ab61494e09e5?auto=format&fit=crop&q=80&w=800", order_index: 0 },
  // DJI Phantom 4 RTK
  { id: "img-7-1", drone_id: "drone-7", image_url: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=800", order_index: 0 },
  // Sentera PHX Fixed Wing
  { id: "img-8-1", drone_id: "drone-8", image_url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800", order_index: 0 }
];

const DEFAULT_SERVICES: AgricultureService[] = [
  {
    id: "service-1",
    title: "Precision Aerial Spraying & Seeding",
    description: "Highly uniform liquid crop protection spraying and granular spreading (fertilizer, cover crops) using high-capacity multi-rotor drones. Eliminates crop soil compaction entirely.",
    price: 45, // per acre
    features: [
      "Ultra-low drift nozzles for safety",
      "Zero crop crush (unlike heavy tractors)",
      "Uniform coverage mapping and delivery report",
      "Fast response for sudden pest outbreaks"
    ],
    image_url: "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&q=80&w=800",
    created_at: new Date().toISOString(),
  },
  {
    id: "service-2",
    title: "NDVI Multispectral Crop Scouting",
    description: "High-resolution farm scans displaying crop vigor, water stress, weed density, and nutrient distribution. Translates raw data into actionable sprayer variable-rate prescriptions.",
    price: 15,
    features: [
      "High-res NDVI & NDRE Orthomosaic maps",
      "Individual crop stand count analytics",
      "Farming prescription shapefile exports",
      "Identifies early pest & fungus hotspots"
    ],
    image_url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800",
    created_at: new Date().toISOString(),
  },
  {
    id: "service-3",
    title: "High-Density Thermal Irrigation Audits",
    description: "Thermal sensor scans analyzing crop canopy heat profiles to diagnose clogged nozzles, soil leakages, and optimized irrigation schedules.",
    price: 25,
    features: [
      "Moisture variance tracking",
      "Drip-line blockage identification",
      "Thermal water runoff analytics",
      "Detailed elevation topography mapping"
    ],
    image_url: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=800",
    created_at: new Date().toISOString(),
  }
];

const DEFAULT_COURSES: TrainingCourse[] = [
  {
    id: "course-1",
    title: "FAA Part 107 Commercial Drone Pilot prep",
    description: "A comprehensive preparation course covering airspace classifications, aviation regulations, weather reports, and safety protocols necessary to pass the FAA Part 107 exam.",
    price: 499,
    duration: "3 Days",
    syllabus: [
      "FAA regulations & licensing laws",
      "National airspace system navigation",
      "Aviation weather maps decoding",
      "Radio communication procedures"
    ],
    image_url: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=800",
    created_at: new Date().toISOString(),
  },
  {
    id: "course-2",
    title: "Heavy-Lift Spray Drone Operations Masterclass",
    description: "Specialized flight school focusing on flying large payload drones (DJI Agras, Hylio AG-230). Covers spray calibration, battery cycling safety, and field boundary planning.",
    price: 1250,
    duration: "5 Days",
    syllabus: [
      "Heavy-lift drone flight mechanics",
      "Flow rate and pressure calibration",
      "Intelligent autonomous mapping setups",
      "Maintenance, troubleshooting, and repairs"
    ],
    image_url: "https://images.unsplash.com/photo-1595841696660-ab61494e09e5?auto=format&fit=crop&q=80&w=800",
    created_at: new Date().toISOString(),
  },
  {
    id: "course-3",
    title: "Multispectral Crop Intelligence mapping",
    description: "Master GIS, Pix4Dfields, and QGIS mapping software. Learn to compile drone imagery into orthomosaics and generate sprayer prescription maps.",
    price: 650,
    duration: "2 Days",
    syllabus: [
      "Photogrammetry stitching principles",
      "NDVI, NDRE indices analysis",
      "Shapefile prescription mapping",
      "Soil elevation modeling"
    ],
    image_url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800",
    created_at: new Date().toISOString(),
  }
];

const DEFAULT_REVIEWS: Review[] = [
  {
    id: "review-1",
    user_name: "James Wilson (Wilson Farms)",
    drone_id: "drone-1",
    rating: 5,
    comment: "The Agras T40 completely changed how we handle late-season canopy fertilization. Its spray distribution is extremely precise and saved us thousands.",
    hidden: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "review-2",
    user_name: "Sarah Jenkins (Agronomist)",
    drone_id: "drone-4",
    rating: 5,
    comment: "eBee X is incredibly durable. We map 1,000+ acres per week easily. Processing the imagery in Pix4D takes crop scouting to the next level.",
    hidden: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "review-3",
    user_name: "Robert Miller",
    drone_id: "drone-2",
    rating: 4,
    comment: "Excellent USA build quality. Software is very detailed. Heavy payload makes spraying wind-resistant crops extremely straightforward.",
    hidden: false,
    created_at: new Date().toISOString(),
  }
];

const DEFAULT_SETTINGS: Setting[] = [
  { key: "company_name", value: "AgroFly Systems Inc." },
  { key: "address", value: "1402 Agri-Business Parkway, Suite B, Des Moines, IA 50309" },
  { key: "phone", value: "+1 (800) 555-0199" },
  { key: "email", value: "contact@agrofly-systems.com" },
  { key: "business_hours", value: "Mon - Fri: 8:00 AM - 5:00 PM CST" },
  { key: "google_map_embed", value: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000.123!2d-93.609!3d41.586!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDM1JzEwLjEiTiA5M8KwMzYnMzIuNCJX!5e0!3m2!1sen!2sus!4v1626000000000" }
];

// =========================================================================
// CONTEXT STATE DEFINITIONS
// =========================================================================
interface StoreContextType {
  isDemoMode: boolean;
  currentUser: UserProfile | null;
  drones: Drone[];
  droneImages: DroneImage[];
  services: AgricultureService[];
  courses: TrainingCourse[];
  registrations: TrainingRegistration[];
  reviews: Review[];
  enquiries: ContactEnquiry[];
  settings: Record<string, string>;
  
  // Auth Operations
  login: (email: string, role: "customer" | "admin") => Promise<boolean>;
  registerUser: (email: string, fullName: string, role: "customer" | "admin") => Promise<boolean>;
  logout: () => void;

  // Drones CRUD
  addDrone: (drone: Omit<Drone, "id" | "created_at">, images: string[]) => void;
  updateDrone: (id: string, drone: Partial<Drone>, images?: string[]) => void;
  deleteDrone: (id: string) => void;

  // Services CRUD
  addService: (service: Omit<AgricultureService, "id" | "created_at">) => void;
  updateService: (id: string, service: Partial<AgricultureService>) => void;
  deleteService: (id: string) => void;

  // Training CRUD
  addCourse: (course: Omit<TrainingCourse, "id" | "created_at">) => void;
  updateCourse: (id: string, course: Partial<TrainingCourse>) => void;
  deleteCourse: (id: string) => void;
  enrollInCourse: (userId: string, courseId: string) => void;
  updateRegistrationStatus: (id: string, status: TrainingRegistration["status"]) => void;

  // Reviews operations
  addReview: (user_name: string, drone_id: string, rating: number, comment: string) => void;
  deleteReview: (id: string) => void;
  toggleReviewVisibility: (id: string) => void;

  // Enquiries operations
  submitEnquiry: (enquiry: Omit<ContactEnquiry, "id" | "created_at" | "status">) => void;
  updateEnquiryStatus: (id: string, status: ContactEnquiry["status"]) => void;

  // Settings
  updateSetting: (key: string, value: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  
  const [drones, setDrones] = useState<Drone[]>([]);
  const [droneImages, setDroneImages] = useState<DroneImage[]>([]);
  const [services, setServices] = useState<AgricultureService[]>([]);
  const [courses, setCourses] = useState<TrainingCourse[]>([]);
  const [registrations, setRegistrations] = useState<TrainingRegistration[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [enquiries, setEnquiries] = useState<ContactEnquiry[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});

  // Initialize Store
  useEffect(() => {
    // Check if Supabase keys exist
    const hasKeys = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    setIsDemoMode(!hasKeys);

    // Load initial states from LocalStorage or seed defaults
    const getLocal = <T,>(key: string, defaultValue: T): T => {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    };

    setDrones(getLocal("agrofly_drones", DEFAULT_DRONES));
    setDroneImages(getLocal("agrofly_drone_images", DEFAULT_DRONE_IMAGES));
    setServices(getLocal("agrofly_services", DEFAULT_SERVICES));
    setCourses(getLocal("agrofly_courses", DEFAULT_COURSES));
    setRegistrations(getLocal("agrofly_registrations", []));
    setReviews(getLocal("agrofly_reviews", DEFAULT_REVIEWS));
    setEnquiries(getLocal("agrofly_enquiries", []));
    
    const savedSettingsArr = getLocal<Setting[]>("agrofly_settings", DEFAULT_SETTINGS);
    const settingsMap: Record<string, string> = {};
    savedSettingsArr.forEach(s => settingsMap[s.key] = s.value);
    setSettings(settingsMap);

    const savedUser = localStorage.getItem("agrofly_current_user");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  // Synchronizer
  const saveToLocal = (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  // Auth Operations
  const login = async (email: string, role: "customer" | "admin"): Promise<boolean> => {
    const mockUser: UserProfile = {
      id: "usr-" + Math.random().toString(36).substr(2, 9),
      email,
      full_name: email.split("@")[0].toUpperCase(),
      role,
      created_at: new Date().toISOString(),
    };
    setCurrentUser(mockUser);
    saveToLocal("agrofly_current_user", mockUser);
    return true;
  };

  const registerUser = async (email: string, fullName: string, role: "customer" | "admin"): Promise<boolean> => {
    const mockUser: UserProfile = {
      id: "usr-" + Math.random().toString(36).substr(2, 9),
      email,
      full_name: fullName,
      role,
      created_at: new Date().toISOString(),
    };
    setCurrentUser(mockUser);
    saveToLocal("agrofly_current_user", mockUser);
    
    // Also save user to a mock list of users
    const userList = JSON.parse(localStorage.getItem("agrofly_users") || "[]");
    userList.push(mockUser);
    saveToLocal("agrofly_users", userList);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("agrofly_current_user");
  };

  // Drones CRUD
  const addDrone = (droneData: Omit<Drone, "id" | "created_at">, images: string[]) => {
    const newId = "drone-" + Math.random().toString(36).substr(2, 9);
    const newDrone: Drone = {
      ...droneData,
      id: newId,
      created_at: new Date().toISOString(),
    };

    const newDroneList = [...drones, newDrone];
    setDrones(newDroneList);
    saveToLocal("agrofly_drones", newDroneList);

    const newDroneImages = [...droneImages];
    images.forEach((url, index) => {
      newDroneImages.push({
        id: `img-${newId}-${index}`,
        drone_id: newId,
        image_url: url,
        order_index: index,
      });
    });
    setDroneImages(newDroneImages);
    saveToLocal("agrofly_drone_images", newDroneImages);
  };

  const updateDrone = (id: string, droneUpdates: Partial<Drone>, images?: string[]) => {
    const updatedDrones = drones.map(d => d.id === id ? { ...d, ...droneUpdates } : d);
    setDrones(updatedDrones);
    saveToLocal("agrofly_drones", updatedDrones);

    if (images) {
      // Replace existing images for this drone
      const filteredImages = droneImages.filter(img => img.drone_id !== id);
      images.forEach((url, index) => {
        filteredImages.push({
          id: `img-${id}-${index}-${Math.random().toString(36).substr(2, 4)}`,
          drone_id: id,
          image_url: url,
          order_index: index,
        });
      });
      setDroneImages(filteredImages);
      saveToLocal("agrofly_drone_images", filteredImages);
    }
  };

  const deleteDrone = (id: string) => {
    const updatedDrones = drones.filter(d => d.id !== id);
    setDrones(updatedDrones);
    saveToLocal("agrofly_drones", updatedDrones);

    const updatedImages = droneImages.filter(img => img.drone_id !== id);
    setDroneImages(updatedImages);
    saveToLocal("agrofly_drone_images", updatedImages);
  };

  // Services CRUD
  const addService = (serviceData: Omit<AgricultureService, "id" | "created_at">) => {
    const newService: AgricultureService = {
      ...serviceData,
      id: "service-" + Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
    };
    const newServiceList = [...services, newService];
    setServices(newServiceList);
    saveToLocal("agrofly_services", newServiceList);
  };

  const updateService = (id: string, serviceUpdates: Partial<AgricultureService>) => {
    const updated = services.map(s => s.id === id ? { ...s, ...serviceUpdates } : s);
    setServices(updated);
    saveToLocal("agrofly_services", updated);
  };

  const deleteService = (id: string) => {
    const updated = services.filter(s => s.id !== id);
    setServices(updated);
    saveToLocal("agrofly_services", updated);
  };

  // Training CRUD
  const addCourse = (courseData: Omit<TrainingCourse, "id" | "created_at">) => {
    const newCourse: TrainingCourse = {
      ...courseData,
      id: "course-" + Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
    };
    const newList = [...courses, newCourse];
    setCourses(newList);
    saveToLocal("agrofly_courses", newList);
  };

  const updateCourse = (id: string, courseUpdates: Partial<TrainingCourse>) => {
    const updated = courses.map(c => c.id === id ? { ...c, ...courseUpdates } : c);
    setCourses(updated);
    saveToLocal("agrofly_courses", updated);
  };

  const deleteCourse = (id: string) => {
    const updated = courses.filter(c => c.id !== id);
    setCourses(updated);
    saveToLocal("agrofly_courses", updated);
  };

  const enrollInCourse = (userId: string, courseId: string) => {
    const newReg: TrainingRegistration = {
      id: "reg-" + Math.random().toString(36).substr(2, 9),
      user_id: userId,
      course_id: courseId,
      registration_date: new Date().toISOString().split("T")[0],
      status: "pending",
      created_at: new Date().toISOString(),
    };
    const newList = [...registrations, newReg];
    setRegistrations(newList);
    saveToLocal("agrofly_registrations", newList);
  };

  const updateRegistrationStatus = (id: string, status: TrainingRegistration["status"]) => {
    const updated = registrations.map(r => r.id === id ? { ...r, status } : r);
    setRegistrations(updated);
    saveToLocal("agrofly_registrations", updated);
  };

  // Reviews CRUD
  const addReview = (user_name: string, drone_id: string, rating: number, comment: string) => {
    const newReview: Review = {
      id: "rev-" + Math.random().toString(36).substr(2, 9),
      user_name,
      drone_id,
      rating,
      comment,
      hidden: false,
      created_at: new Date().toISOString(),
    };
    const newList = [newReview, ...reviews];
    setReviews(newList);
    saveToLocal("agrofly_reviews", newList);
  };

  const deleteReview = (id: string) => {
    const updated = reviews.filter(r => r.id !== id);
    setReviews(updated);
    saveToLocal("agrofly_reviews", updated);
  };

  const toggleReviewVisibility = (id: string) => {
    const updated = reviews.map(r => r.id === id ? { ...r, hidden: !r.hidden } : r);
    setReviews(updated);
    saveToLocal("agrofly_reviews", updated);
  };

  // Enquiries CRUD
  const submitEnquiry = (enquiryData: Omit<ContactEnquiry, "id" | "created_at" | "status">) => {
    const newEnquiry: ContactEnquiry = {
      ...enquiryData,
      id: "enq-" + Math.random().toString(36).substr(2, 9),
      status: "new",
      created_at: new Date().toISOString(),
    };
    const newList = [newEnquiry, ...enquiries];
    setEnquiries(newList);
    saveToLocal("agrofly_enquiries", newList);
  };

  const updateEnquiryStatus = (id: string, status: ContactEnquiry["status"]) => {
    const updated = enquiries.map(e => e.id === id ? { ...e, status } : e);
    setEnquiries(updated);
    saveToLocal("agrofly_enquiries", updated);
  };

  // Settings
  const updateSetting = (key: string, value: string) => {
    const updatedMap = { ...settings, [key]: value };
    setSettings(updatedMap);
    
    // Map record map back to Setting[] to store in LocalStorage
    const arr: Setting[] = Object.keys(updatedMap).map(k => ({ key: k, value: updatedMap[k] }));
    saveToLocal("agrofly_settings", arr);
  };

  return (
    <StoreContext.Provider
      value={{
        isDemoMode,
        currentUser,
        drones,
        droneImages,
        services,
        courses,
        registrations,
        reviews,
        enquiries,
        settings,
        
        login,
        registerUser,
        logout,
        addDrone,
        updateDrone,
        deleteDrone,
        addService,
        updateService,
        deleteService,
        addCourse,
        updateCourse,
        deleteCourse,
        enrollInCourse,
        updateRegistrationStatus,
        addReview,
        deleteReview,
        toggleReviewVisibility,
        submitEnquiry,
        updateEnquiryStatus,
        updateSetting,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
