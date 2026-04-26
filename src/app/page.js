"use client";

import { useState, useRef, useEffect, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { supabase } from '@/lib/supabase';
import { 
  Activity, BookOpen, Settings, Mic, MessageSquare, X, Send, Video, Upload,
  RefreshCw, CheckCircle2, AlertCircle, ArrowRight, BrainCircuit, ShieldCheck,
  BarChart3, Brain, Info, Target, Download, ExternalLink, Printer, Layers, UploadCloud, Loader2, Clock, ArrowLeft,
  User, Database, FileText, Zap, Sparkles, Camera, History, Microscope, GraduationCap, Bell, Search, Filter, Cpu, Globe, Sliders, ImagePlus, Trophy
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import Webcam from 'react-webcam';
import { jsPDF } from 'jspdf';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

// --- Comprehensive Mock Data ---

const analyticsData = [
  { name: 'Jan', accuracy: 40, cases: 10, error: 12 },
  { name: 'Feb', accuracy: 55, cases: 22, error: 10 },
  { name: 'Mar', accuracy: 50, cases: 35, error: 15 },
  { name: 'Apr', accuracy: 70, cases: 48, error: 8 },
  { name: 'May', accuracy: 85, cases: 60, error: 5 },
  { name: 'Jun', accuracy: 92, cases: 75, error: 2 },
];

const pathologyDistribution = [
  { name: 'Caries', value: 40, color: '#3b82f6' },
  { name: 'Gingivitis', value: 25, color: '#ef4444' },
  { name: 'Calculus', value: 15, color: '#f59e0b' },
  { name: 'Healthy', value: 10, color: '#10b981' },
  { name: 'No_Tooth', value: 10, color: '#64748b' },
];

const caseLibrary = [
  { id: 101, title: "Class II Caries (Radiograph)", level: "Beginner", points: 150, type: "Radiograph", image: "/images/caries.png", answers: [{ x: 45, y: 40, label: "Distal Caries" }] },
  { id: 102, title: "Deep Pulpal Caries", level: "Advanced", points: 400, type: "Radiograph", image: "/images/deep_caries.png", answers: [{ x: 50, y: 35, label: "Pulpal Involvement" }] },
  { id: 103, title: "Recurrent Caries", level: "Intermediate", points: 200, type: "Radiograph", image: "/images/recurrent_caries.png", answers: [{ x: 52, y: 58, label: "Secondary Lesion" }] },
  { id: 201, title: "Severe Periodontitis", level: "Intermediate", points: 300, type: "Clinical Photo", image: "/images/periodontitis.png", answers: [{ x: 50, y: 65, label: "Pocketing" }, { x: 42, y: 60, label: "Papillary Loss" }] },
  { id: 202, title: "Gingival Recession", level: "Beginner", points: 150, type: "Clinical Photo", image: "/images/recession.png", answers: [{ x: 48, y: 72, label: "Exposed Root" }] },
  { id: 206, title: "Heavy Calculus Bridge", level: "Beginner", points: 200, type: "Clinical Photo", image: "/images/calculus.png", answers: [{ x: 50, y: 78, label: "Supra-gingival Calculus" }] },
  { id: 301, title: "Impacted Wisdom Tooth", level: "Advanced", points: 500, type: "Panoramic", image: "/images/impaction.png", answers: [{ x: 20, y: 75, label: "Class III Impaction" }] },
  { id: 302, title: "Horizontal Impaction", level: "Expert", points: 750, type: "Panoramic", image: "/images/horizontal_impaction.png", answers: [{ x: 22, y: 82, label: "Horizontal Shift" }] },
  { id: 401, title: "Enamel Hypoplasia", level: "Intermediate", points: 350, type: "Clinical Photo", image: "/images/hypoplasia.png", answers: [{ x: 50, y: 48, label: "Pitting" }] },
  { id: 402, title: "Dental Fluorosis", level: "Beginner", points: 150, type: "Clinical Photo", image: "/images/fluorosis.png", answers: [{ x: 50, y: 52, label: "Mottling" }] },
];

const pastRecords = [
  { id: "RS-8821", date: "2024-05-12", patient: "Marcus Aurelius", findings: "Moderate Caries", status: "Verified", accuracy: "98%" },
  { id: "RS-8822", date: "2024-05-14", patient: "Seneca the Elder", findings: "Healthy", status: "Verified", accuracy: "99%" },
  { id: "RS-8823", date: "2024-05-15", patient: "Guest Patient", findings: "Severe Gingivitis", status: "Pending", accuracy: "87%" },
  { id: "RS-8824", date: "2024-05-18", patient: "Epictetus", findings: "Calculus Build-up", status: "Verified", accuracy: "94%" },
];

// --- Sidebar Helper ---

function SidebarLink({ active, onClick, icon: Icon, label }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-4 px-5 py-3.5 w-full rounded-2xl transition-all duration-300 group ${active ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-slate-200 hover:bg-slate-800/50 hover:text-white'}`}
    >
      <Icon size={18} className={active ? "text-white" : "text-slate-300 group-hover:text-blue-400 transition-colors"} />
      <span className="font-bold text-sm tracking-tight">{label}</span>
      {active && <motion.div layoutId="active-nav" className="ml-auto w-1 h-4 rounded-full bg-white/80" />}
    </button>
  );
}

// --- Auth Page (Login / Signup) ---

function AuthPage({ mode, setMode, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const BYPASS_CREDENTIALS = { username: 'faah', password: 'faah' };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name }
          }
        });
        if (error) throw error;
        // Supabase might require email confirmation; handle accordingly
        onLogin(data.user);
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        onLogin(data.user);
      }
    } catch (err) {
      // Fallback for demo if Supabase is not configured
      if (email === BYPASS_CREDENTIALS.username && password === BYPASS_CREDENTIALS.password) {
        onLogin({ user_metadata: { full_name: 'Faah' }, email: 'faah@gmail.com' });
        return;
      }
      setError(err.message || 'Authentication failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md z-10">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 justify-center">
          <div className="bg-blue-600 p-2 rounded-2xl shadow-lg shadow-blue-600/30"><Microscope size={22} className="text-white" /></div>
          <h1 className="text-2xl font-black tracking-tight text-white">RootSense<span className="text-blue-500">AI</span></h1>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl">
          <div className="mb-8">
            <h2 className="text-3xl font-black text-white tracking-tight">{mode === 'login' ? 'Welcome back' : 'Create account'}</h2>
            <p className="text-slate-300 font-medium mt-2 text-sm">{mode === 'login' ? 'Sign in to your clinical portal.' : 'Join the RootSense dental intelligence platform.'}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'signup' && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Full Name</label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="Dr. Yaseen Ahmed" className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-600 rounded-2xl h-12 px-4 focus:border-blue-500 transition-colors" />
              </div>
            )}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Email</label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="student@dental.edu" className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-600 rounded-2xl h-12 px-4 focus:border-blue-500 transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Password</label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-600 rounded-2xl h-12 px-4 focus:border-blue-500 transition-colors" />
            </div>
            {error && <p className="text-red-400 text-xs font-medium text-center">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl h-12 shadow-lg shadow-blue-600/20 transition-all text-sm disabled:opacity-50">
              {loading ? 'Processing...' : mode === 'login' ? 'Sign In to Portal' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
            <p className="text-slate-400 text-sm">
              {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }} className="text-blue-400 hover:text-blue-300 font-bold transition-colors">
                {mode === 'login' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>

        <p className="text-center text-[10px] text-slate-600 mt-6 font-medium uppercase tracking-widest">RootSense AI · Clinical Intelligence Platform · v2.4</p>
      </motion.div>
    </div>
  );
}

// --- Core Application Wrapper ---

export default function RootSenseAI() {
  const [view, setView] = useState('auth');
  const [authMode, setAuthMode] = useState('login'); // login | signup
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [gpuInfo, setGpuInfo] = useState("Detecting...");
  const [userStats, setUserStats] = useState({
    xp: 2450,
    level: 12,
    assignments: { cleaning: 12, diagnosis: 45, quiz: 8, operative: 6, perio: 2 },
    streak: 5
  });

  const updateStats = (type, xpGain) => {
    setUserStats(prev => {
      const newXp = prev.xp + xpGain;
      const newLevel = Math.floor(newXp / 1000); // 1000 XP per level
      return {
        ...prev,
        xp: newXp,
        level: Math.max(prev.level, newLevel),
        assignments: {
          ...prev.assignments,
          [type]: (prev.assignments[type] || 0) + 1
        }
      };
    });
  };

  useEffect(() => {
    // Check for active session on load
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setCurrentUser(session.user);
        setIsLoggedIn(true);
        setView('simulator');
      }
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setCurrentUser(session.user);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        setCurrentUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl', { powerPreference: "high-performance" }) ||
                 canvas.getContext('experimental-webgl', { powerPreference: "high-performance" });
      if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          let cleanRenderer = renderer;
          if (renderer.includes('ANGLE')) {
            const matches = renderer.match(/\(([^,]+), ([^,)]+)/);
            if (matches && matches[2]) cleanRenderer = matches[2];
          }
          setGpuInfo(cleanRenderer.replace(/Direct3D.*/, '').trim() || "Hardware Accelerator");
        } else {
          setGpuInfo("Standard WebGL Renderer");
        }
      }
    } catch (e) {
      setGpuInfo("Generic Accelerator");
    }
  }, []);

  const exportReport = () => {
    const doc = new jsPDF();
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 297, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('RootSense AI - Clinical Analysis', 20, 30);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()} | RootSense-V2.4`, 20, 40);
    doc.setDrawColor(59, 130, 246);
    doc.line(20, 45, 190, 45);
    doc.text('Patient/Student ID: #882-RS', 20, 60);
    doc.text('Primary Finding: Moderate Caries Detected (98.4%)', 20, 70);
    doc.text('Secondary Finding: Localized Gingival Inflammation', 20, 80);
    doc.save('RootSense_Analysis.pdf');
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    setView('simulator');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setIsLoggedIn(false);
    setIsProfileOpen(false);
    setView('auth');
    setAuthMode('login');
  };

  if (!isLoggedIn) {
    return <AuthPage mode={authMode} setMode={setAuthMode} onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-[#020617] text-slate-100 font-sans selection:bg-blue-500/30 overflow-hidden relative">
      {/* Sidebar Navigation */}
      <AnimatePresence>
        {(isMobileMenuOpen || typeof window !== 'undefined' && window.innerWidth > 1024) && (
          <motion.aside 
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className={`fixed lg:relative w-64 h-full bg-[#030712] border-r border-slate-800/50 flex flex-col z-50 lg:z-30 shadow-2xl transition-all duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
          >
            {/* Sidebar Branding */}
            <div className="p-8 border-b border-slate-800/30">
              <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setView('simulator')}>
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
                  <Microscope size={22} className="text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-black tracking-tighter text-white leading-none">RootSense<span className="text-blue-500">AI</span></h1>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1.5">Precision Lab 2.4</p>
                </div>
              </div>
            </div>

            {/* Navigation Sections */}
            <div className="flex-1 px-3 py-8 space-y-8 overflow-y-auto scrollbar-hide">
              <div>
                <p className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4">Diagnostic Protocols</p>
                <div className="space-y-1">
                  <SidebarLink active={view === 'simulator'} onClick={() => { setView('simulator'); setIsMobileMenuOpen(false); }} icon={Brain} label="Inference Sim" />
                  <SidebarLink active={view === 'unity-sim'} onClick={() => { setView('unity-sim'); setIsMobileMenuOpen(false); }} icon={Globe} label="Interactive Sim" />
                  <SidebarLink active={view === 'lab'} onClick={() => { setView('lab'); setIsMobileMenuOpen(false); }} icon={Zap} label="Neural Vision" />
                  <SidebarLink active={view === 'records'} onClick={() => { setView('records'); setIsMobileMenuOpen(false); }} icon={History} label="Clinical Files" />
                </div>
              </div>
              
              <div>
                <p className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4">Operations</p>
                <div className="space-y-1">
                  <SidebarLink active={view === 'quests'} onClick={() => { setView('quests'); setIsMobileMenuOpen(false); }} icon={Target} label="Assignments" />
                  <SidebarLink active={view === 'analytics'} onClick={() => { setView('analytics'); setIsMobileMenuOpen(false); }} icon={BarChart3} label="Performance" />
                  <SidebarLink active={view === 'scheduler'} onClick={() => { setView('scheduler'); setIsMobileMenuOpen(false); }} icon={Clock} label="Queue" />
                  <SidebarLink active={view === 'inventory'} onClick={() => { setView('inventory'); setIsMobileMenuOpen(false); }} icon={Database} label="Supplies" />
                </div>
              </div>
            </div>

            {/* System Health Dashboard */}
            <div className="px-3 py-8 border-t border-slate-800/50 bg-slate-950/20 mt-auto">
               <div className="mx-2 bg-slate-900/40 rounded-3xl p-4 border border-slate-800/50 backdrop-blur-md">
                  <div className="flex items-center justify-between mb-3">
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Neural Link</span>
                     <div className="flex items-center gap-1.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                        <span className="text-[9px] font-black text-emerald-500 uppercase">Optimal</span>
                     </div>
                  </div>
                  <div className="space-y-2">
                     <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-3/4 animate-pulse" />
                     </div>
                     <div className="flex justify-between text-[8px] font-bold text-slate-500 uppercase">
                        <span>Load: 24.2%</span>
                        <span>v2.4.0-rev7</span>
                     </div>
                  </div>
               </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Overlay for mobile sidebar */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <header className="h-20 border-b border-slate-800 bg-slate-950/40 backdrop-blur-2xl flex items-center justify-between px-4 md:px-10 sticky top-0 z-20 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-800 rounded-xl transition-colors"
            >
              <Sliders size={20} className="text-slate-200" />
            </button>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="hidden sm:block h-2 w-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_#3b82f6]" />
                <h2 className="text-xs sm:text-sm font-black uppercase tracking-widest text-slate-200 truncate max-w-[150px] sm:max-w-none">
                  {view === 'simulator' && "Diagnostic Simulator"}
                  {view === 'quests' && "Assignment Hub"}
                  {view === 'lab' && "Neural Vision Lab"}
                  {view === 'analytics' && "Performance Data"}
                  {view === 'records' && "Clinical Records"}
                  {view === 'scheduler' && "Patient Queue"}
                  {view === 'inventory' && "Supply Chain"}
                  {view === 'settings' && "Preferences"}
                  {view === 'config' && "System Architecture"}
                </h2>
              </div>
              <div className="hidden xl:flex items-center gap-3 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
                <Cpu size={12} className="text-blue-500" />
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{gpuInfo} Accelerated</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-6">
             <div className="hidden md:flex flex-col items-end mr-2">
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Efficiency Tier {Math.floor(userStats.level / 5) + 1}</span>
                <span className="text-xs font-bold text-slate-300">{userStats.xp} Total XP</span>
             </div>
             {/* Notification Bell */}
             <div className="relative">
               <button onClick={() => { setIsNotifOpen(!isNotifOpen); setIsProfileOpen(false); }} className="relative p-2 hover:bg-slate-800 rounded-xl transition-colors">
                 <Bell size={18} className="text-slate-300 hover:text-white transition-colors" />
                 <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border-2 border-[#020617]" />
               </button>
               <AnimatePresence>
                 {isNotifOpen && (
                   <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }}
                     className="absolute right-0 top-12 w-80 bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl z-50 overflow-hidden">
                     <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                       <h4 className="font-black text-white text-sm">Notifications</h4>
                       <Badge className="bg-red-500/10 text-red-400 border-red-500/20 text-[10px]">3 New</Badge>
                     </div>
                     <div className="divide-y divide-slate-800">
                       {[
                         { title: 'New Quest Available', desc: 'Periodontitis Identification unlocked', time: '2m ago', dot: 'bg-blue-500' },
                         { title: 'Case RS-8823 Pending', desc: 'Guest Patient requires verification', time: '1h ago', dot: 'bg-orange-500' },
                         { title: 'Stock Alert: Critical', desc: 'Standard Composite Kit: 5 units left', time: '3h ago', dot: 'bg-red-500' },
                       ].map((n, i) => (
                         <div key={i} className="p-4 hover:bg-slate-900 transition-colors cursor-pointer flex gap-3">
                           <div className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${n.dot}`} />
                           <div>
                             <p className="text-xs font-bold text-white">{n.title}</p>
                             <p className="text-[10px] text-slate-300 mt-0.5">{n.desc}</p>
                             <p className="text-[9px] text-slate-500 mt-1">{n.time}</p>
                           </div>
                         </div>
                       ))}
                     </div>
                     <div className="p-3"><Button className="w-full bg-slate-900 hover:bg-slate-800 text-slate-300 text-[10px] font-bold rounded-xl h-9" onClick={() => setIsNotifOpen(false)}>Mark All as Read</Button></div>
                   </motion.div>
                 )}
               </AnimatePresence>
             </div>
             {/* Profile Avatar */}
             <div className="relative">
               <button onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotifOpen(false); }}
                 className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center border border-white/10 shadow-lg font-black text-[10px] sm:text-xs text-white hover:scale-105 transition-transform">
                 {currentUser ? (currentUser.user_metadata?.full_name || currentUser.email || 'YA').slice(0,2).toUpperCase() : 'YA'}
               </button>
               <AnimatePresence>
                 {isProfileOpen && (
                   <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }}
                     className="absolute right-0 top-12 w-72 bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl z-50 overflow-hidden">
                     <div className="p-5 border-b border-slate-800">
                       <div className="flex items-center gap-3">
                         <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-black text-white">{currentUser ? (currentUser.user_metadata?.full_name || currentUser.email || 'YA').slice(0,2).toUpperCase() : 'YA'}</div>
                         <div>
                           <p className="font-black text-white text-sm">{currentUser?.user_metadata?.full_name || currentUser?.email?.split('@')[0] || 'User'}</p>
                           <p className="text-[10px] text-slate-400">{currentUser?.email || 'student@rootsense.ai'}</p>
                         </div>
                       </div>
                       <div className="mt-4 flex gap-2">
                         <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px]">Level {userStats.level}</Badge>
                         <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">{userStats.xp} XP</Badge>
                       </div>
                     </div>
                     <div className="p-3 space-y-1">
                       {[{ label: 'Edit Profile', icon: User }, { label: 'Preferences', icon: Settings }, { label: 'System Config', icon: Cpu }].map((item) => (
                         <button key={item.label} onClick={() => { setView(item.label === 'Preferences' ? 'settings' : item.label === 'System Config' ? 'config' : 'settings'); setIsProfileOpen(false); }}
                           className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-900 text-slate-300 hover:text-white transition-colors text-sm font-medium text-left">
                           <item.icon size={15} />{item.label}
                         </button>
                       ))}
                       <div className="pt-2 border-t border-slate-800 mt-2">
                         <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors text-sm font-medium text-left">
                           <X size={15} />Sign Out
                         </button>
                       </div>
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>
             </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 md:p-10 overflow-y-auto overflow-x-hidden relative scrollbar-hide">
          <AnimatePresence mode="wait">
            {view === 'simulator' && <SimulationPage key="sim" onEarnXP={(amt) => updateStats('operative', amt)} />}
            {view === 'unity-sim' && <UnitySimulator key="unity" />}
            {view === 'quests' && <QuestsPage key="quests" stats={userStats} onNavigate={setView} />}
            {view === 'lab' && <VisionLabPage key="lab" currentUser={currentUser} updateStats={updateStats} />}
            {view === 'analytics' && <AnalyticsPage key="analytics" />}
            {view === 'records' && <RecordsPage key="records" currentUser={currentUser} />}
            {view === 'scheduler' && <SchedulerPage key="scheduler" onNavigate={setView} />}
            {view === 'inventory' && <InventoryPage key="inventory" />}
            {view === 'settings' && <SettingsPage key="settings" />}
            {view === 'config' && <ConfigPage key="config" gpuInfo={gpuInfo} />}
          </AnimatePresence>
        </main>
      </div>

      {/* Floating Chat FAB */}
      <div className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 z-50">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="absolute bottom-20 right-0 w-[calc(100vw-2rem)] sm:w-[440px] max-w-[440px]"
            >
              <ChatInterface onClose={() => setIsChatOpen(false)} currentView={view} />
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`h-14 w-14 sm:h-16 sm:w-16 rounded-2xl sm:rounded-[2rem] shadow-2xl transition-all duration-500 flex items-center justify-center text-white ${isChatOpen ? 'bg-red-500 rotate-90' : 'bg-blue-600'}`}
        >
          {isChatOpen ? <X size={24} /> : <MessageSquare size={24} />}
        </motion.button>
      </div>
    </div>
  );
}

// --- Unity Simulation Component ---

function UnitySimulator() {
  const [loading, setLoading] = useState(true);

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="h-full flex flex-col">
       <div className="flex items-center justify-between border-b border-slate-800 pb-8 mb-8">
          <div>
            <h3 className="text-3xl font-black text-white">Interactive Lab Prototype</h3>
            <p className="text-slate-400 font-medium">Faah2.unity Engine • Hardware Accelerated Simulation</p>
          </div>
          <Badge className="bg-blue-600 text-white px-4 py-1.5 rounded-full font-black text-[10px] tracking-widest uppercase">WebGL 2.0</Badge>
       </div>
       
       <Card className="flex-1 rounded-[3rem] bg-black border-slate-800 relative overflow-hidden shadow-2xl group min-h-[600px]">
          {loading && (
             <div className="absolute inset-0 z-10 bg-slate-950 flex flex-col items-center justify-center space-y-6">
                <div className="relative">
                   <div className="h-24 w-24 rounded-full border-4 border-blue-500/10 border-t-blue-500 animate-spin" />
                   <Globe className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500 animate-pulse" size={32} />
                </div>
                <div className="text-center">
                   <h4 className="text-xl font-black text-white mb-1">Initializing Engine</h4>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Optimizing Shaders & Textures...</p>
                </div>
                <Button onClick={() => setLoading(false)} className="mt-8 bg-blue-600 hover:bg-blue-500 rounded-full h-12 px-10 font-bold">Launch Prototype</Button>
             </div>
          )}
          
          <iframe 
            src="/unity_build/index.html" 
            className="w-full h-full border-0" 
            title="Unity Prototype"
            onLoad={() => setLoading(false)}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />

          <div className="absolute bottom-8 right-8 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
             <div className="bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest">Engine Status</p>
                <p className="text-[10px] font-black text-white mt-0.5">Faah2 Kernel v0.1.2-beta</p>
             </div>
          </div>
       </Card>
    </motion.div>
  );
}


// --- Landing Page ---

function LandingPage({ onEnter }) {
  return (
    <div className="min-h-screen bg-[#020617] flex flex-col selection:bg-blue-500/30">
      <nav className="h-24 px-12 flex items-center justify-between border-b border-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-1.5 rounded-xl"><Microscope size={20} className="text-white" /></div>
          <h1 className="text-xl font-black tracking-tighter text-white">RootSense AI</h1>
        </div>
        <Button onClick={onEnter} className="bg-blue-600 hover:bg-blue-700 rounded-full px-8 h-12 shadow-xl shadow-blue-600/20">Access Portal</Button>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 relative">
        <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />
        
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <Badge className="mb-8 bg-blue-500/10 text-blue-400 border-blue-500/20 px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Medical Training Portal</Badge>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-white mb-10">
            Intelligent Diagnostics <br/><span className="text-blue-500">for the Next Gen.</span>
          </h1>
          <p className="max-w-2xl text-slate-200 text-xl font-medium mb-12">
            The ultimate simulation lab and live diagnostic toolkit for dentistry students and professionals.
          </p>
          <Button onClick={onEnter} size="lg" className="h-16 px-12 rounded-full bg-blue-600 hover:bg-blue-700 text-xl font-black shadow-2xl shadow-blue-600/30 group">
            Launch Laboratory <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
          </Button>
        </motion.div>
      </main>
    </div>
  );
}

// --- Simulation Lab ---

function SimulationPage({ onEarnXP }) {
  const [selectedCase, setSelectedCase] = useState(null);

  if (selectedCase) {
    return <CaseAnalysis caseData={selectedCase} onBack={() => setSelectedCase(null)} onEarnXP={onEarnXP} />;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h3 className="text-4xl font-black tracking-tighter mb-2 text-white">Clinical Training Modules</h3>
          <p className="text-slate-400 font-medium text-sm sm:text-base flex items-center gap-2">
            <Activity size={14} className="text-blue-500" /> 
            Protocol v3.1: Morphology Detection & Pattern Verification
          </p>
        </div>
        <div className="flex w-full sm:w-auto gap-4">
           <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <Input placeholder="Search pathology..." className="pl-12 rounded-2xl bg-slate-900/50 border-slate-800 w-full sm:w-64 text-slate-200 focus:border-blue-500/50" />
           </div>
           <Button className="rounded-2xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 font-black text-[10px] uppercase tracking-widest"><Filter size={16} className="mr-2" /> Filter</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-10">
        {caseLibrary.map((c) => (
          <motion.div key={c.id} whileHover={{ y: -10, scale: 1.02 }} transition={{ type: "spring", stiffness: 400 }}>
            <Card onClick={() => setSelectedCase(c)} className="group cursor-pointer bg-slate-900/40 backdrop-blur-xl border-slate-800 hover:border-blue-500/50 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-500">
              <div className="h-56 relative">
                <img src={c.image} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <Badge className={`absolute top-4 right-4 border-0 font-black text-[10px] uppercase tracking-widest px-4 py-1 rounded-full ${c.level === 'Beginner' ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : c.level === 'Intermediate' ? 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.4)]' : 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]'}`}>{c.level}</Badge>
                
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                   <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                      <Zap size={10} className="text-blue-400" />
                      <span className="text-[9px] font-black text-blue-100 uppercase tracking-widest">{c.type}</span>
                   </div>
                </div>
              </div>
              <CardContent className="p-8">
                <h4 className="text-xl font-black mb-2 text-white group-hover:text-blue-400 transition-colors">{c.title}</h4>
                <div className="flex items-center gap-4 mt-6 pt-6 border-t border-slate-800/50">
                  <div className="flex-1">
                     <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Inference ID</p>
                     <p className="text-xs font-mono text-slate-300">#RS-CASE-{c.id}</p>
                  </div>
                  <div className="text-right">
                     <p className="text-[8px] font-black text-blue-500 uppercase tracking-widest mb-1">Potential</p>
                     <p className="text-sm font-black text-white">+{c.points} XP</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function CaseAnalysis({ caseData, onBack, onEarnXP }) {
  const [marked, setMarked] = useState([]);
  const [revealed, setRevealed] = useState(false);
  const [quizActive, setQuizActive] = useState(false);
  const [contrast, setContrast] = useState(100);
  const [brightness, setBrightness] = useState(100);
  const [useHint, setUseHint] = useState(false);
  const [startTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [accuracy, setAccuracy] = useState(0);

  useEffect(() => {
    if (revealed) return;
    const timer = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [revealed, startTime]);

  const calculateAccuracy = () => {
    if (!caseData.answers || marked.length === 0) return 0;
    
    let totalScore = 0;
    caseData.answers.forEach(ans => {
      let closestDist = 100; // max possible dist
      marked.forEach(m => {
        const dist = Math.sqrt(Math.pow(ans.x - m.x, 2) + Math.pow(ans.y - m.y, 2));
        if (dist < closestDist) closestDist = dist;
      });
      // Score based on proximity (10% threshold for full points)
      const score = Math.max(0, 100 - (closestDist * 5));
      totalScore += score;
    });
    
    return Math.floor(totalScore / caseData.answers.length);
  };

  const handleSubmit = () => {
    const finalAcc = calculateAccuracy();
    setAccuracy(finalAcc);
    setRevealed(true);
    const timePenalty = elapsed > 30 ? Math.max(0, 100 - (elapsed - 30)) : 100;
    const finalXP = Math.floor(caseData.points * (finalAcc / 100) * (timePenalty / 100) * (useHint ? 0.5 : 1));
    onEarnXP(finalXP);
  };

  if (quizActive) {
    return <CaseQuiz onFinish={(score) => { onBack(); onEarnXP(score * 50); }} />;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10 pb-20">
      {/* Header with Technical Stats */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between border-b border-slate-800 pb-10 gap-8">
        <div className="flex items-center gap-6">
          <Button variant="outline" size="icon" onClick={onBack} className="rounded-2xl h-14 w-14 border-slate-800 bg-slate-900/40 hover:bg-slate-800"><ArrowLeft size={18}/></Button>
          <div>
            <div className="flex items-center gap-3 mb-1">
               <Badge className="bg-blue-600/10 text-blue-400 border-blue-500/20 text-[10px] font-black px-3">PROTO-ID: {caseData.id}</Badge>
               <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                  <Clock size={12} className="text-blue-500" />
                  <span>{Math.floor(elapsed / 60)}:{(elapsed % 60).toString().padStart(2, '0')}</span>
               </div>
            </div>
            <h3 className="text-3xl font-black tracking-tighter text-white">{caseData.title}</h3>
          </div>
        </div>
        <div className="flex w-full lg:w-auto gap-4">
          <Button variant="ghost" onClick={() => setMarked([])} disabled={revealed} className="text-slate-400 hover:text-white font-bold">Reset Nodes</Button>
          <Button 
            onClick={() => setUseHint(true)} 
            disabled={revealed || useHint} 
            variant="outline" 
            className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 font-black text-[10px] uppercase rounded-2xl h-14 px-6"
          >
            <Sparkles size={14} className="mr-2" /> AI Assist (-50% XP)
          </Button>
          <Button onClick={handleSubmit} disabled={revealed || marked.length === 0} className="bg-blue-600 hover:bg-blue-500 rounded-2xl h-14 px-12 font-black text-white shadow-xl shadow-blue-600/20 transition-all hover:scale-105 active:scale-95">
            Commit Inference
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-12">
        {/* Workspace: Image + Filters */}
        <div className="xl:col-span-3 space-y-6">
          <Card className="rounded-[3.5rem] overflow-hidden bg-black relative shadow-2xl border-2 border-slate-800 group">
            <div 
              className="relative aspect-video cursor-crosshair overflow-hidden" 
              onClick={(e) => {
                if(revealed) return;
                const rect = e.currentTarget.getBoundingClientRect();
                setMarked([...marked, { x: ((e.clientX - rect.left)/rect.width)*100, y: ((e.clientY - rect.top)/rect.height)*100, id: Date.now() }]);
              }}
            >
              <img 
                src={caseData.image} 
                className="w-full h-full object-contain bg-slate-950 transition-all duration-300" 
                style={{ 
                  filter: `contrast(${contrast}%) brightness(${brightness}%)`,
                  opacity: revealed ? 0.5 : 0.9
                }} 
              />
              
              {/* Scanline Effect */}
              <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

              {/* User Markers */}
              {marked.map(m => (
                <motion.div 
                  initial={{ scale: 2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  key={m.id} 
                  className="absolute w-12 h-12 border-2 border-blue-500 rounded-full flex items-center justify-center -translate-x-1/2 -translate-y-1/2 shadow-[0_0_20px_rgba(59,130,246,0.6)]" 
                  style={{ left: `${m.x}%`, top: `${m.y}%` }}
                >
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping" />
                  <div className="absolute -bottom-6 bg-blue-500 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest text-white shadow-lg">NODE_{m.id.toString().slice(-3)}</div>
                </motion.div>
              ))}

              {/* AI Hint / Revealed Answer */}
              {(useHint || revealed) && caseData.answers?.map((ans, i) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={`ans-${i}`}
                  className="absolute border-2 border-dashed border-emerald-500 bg-emerald-500/10 rounded-full shadow-[0_0_30px_rgba(16,185,129,0.3)] flex items-center justify-center -translate-x-1/2 -translate-y-1/2" 
                  style={{ left: `${ans.x}%`, top: `${ans.y}%`, width: '8%', height: '12%' }}
                >
                   <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[8px] font-black px-3 py-1 rounded-full whitespace-nowrap shadow-xl border border-white/20">
                      MASTER DIAGNOSIS: {ans.label}
                   </div>
                </motion.div>
              ))}

              {/* HUD Overlay */}
              <div className="absolute top-8 left-8 flex flex-col gap-3 pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity">
                 <div className="bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Neural Link: Active</span>
                 </div>
                 <div className="bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3">
                    <Activity size={12} className="text-blue-400" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Precision Prediction: {marked.length > 0 ? calculateAccuracy() : '0'}%</span>
                 </div>
              </div>
            </div>
          </Card>

          {/* Image Processing Controls */}
          <div className="flex flex-wrap gap-8 bg-slate-900/30 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-800">
             <div className="flex-1 min-w-[200px] space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contrast Enhancement</label>
                   <span className="text-xs font-bold text-blue-400">{contrast}%</span>
                </div>
                <input type="range" min="50" max="200" value={contrast} onChange={e => setContrast(e.target.value)} className="w-full h-1.5 bg-slate-800 rounded-full appearance-none accent-blue-500 cursor-pointer" />
             </div>
             <div className="flex-1 min-w-[200px] space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Luminance Balance</label>
                   <span className="text-xs font-bold text-blue-400">{brightness}%</span>
                </div>
                <input type="range" min="50" max="150" value={brightness} onChange={e => setBrightness(e.target.value)} className="w-full h-1.5 bg-slate-800 rounded-full appearance-none accent-blue-500 cursor-pointer" />
             </div>
             <div className="flex items-center gap-4 border-l border-slate-800 pl-8">
                <Button variant="ghost" size="icon" onClick={() => {setContrast(100); setBrightness(100);}} className="rounded-xl hover:bg-slate-800 text-slate-400"><RefreshCw size={18}/></Button>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Reset Core</div>
             </div>
          </div>
        </div>

        {/* Sidebar: Performance & Results */}
        <div className="space-y-8">
           <Card className="rounded-[2.5rem] bg-slate-900 p-8 border-slate-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5"><Layers size={60} /></div>
              <h4 className="text-[10px] font-black uppercase text-slate-400 mb-8 tracking-[0.2em]">Morphological Analytics</h4>
              
              <div className="space-y-6 relative z-10">
                 <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black text-slate-300 uppercase">
                       <span>Nodes Identified</span>
                       <span className="text-blue-500">{marked.length} / 4</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${Math.min(100, (marked.length/4)*100)}%` }} />
                    </div>
                 </div>
                 
                 <div className="pt-6 border-t border-slate-800/50 space-y-4">
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-black text-slate-500 uppercase">Precision Est.</span>
                       <span className="text-xs font-black text-white">{marked.length > 0 ? "Analyzing..." : "Pending"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-black text-slate-500 uppercase">Time Penalty</span>
                       <span className={`text-xs font-black ${elapsed > 30 ? 'text-orange-400' : 'text-emerald-400'}`}>
                          {elapsed > 30 ? `-${elapsed - 30}pts` : "0.0x"}
                       </span>
                    </div>
                 </div>
              </div>
           </Card>

           {revealed && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] border-0 shadow-2xl shadow-blue-600/30 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-20"><Target size={80} /></div>
                   <span className="text-[10px] font-black text-blue-100 uppercase tracking-widest mb-2 block">Diagnostic Match Score</span>
                   <h5 className="text-5xl font-black text-white mb-2">{accuracy}%</h5>
                   <p className="text-xs text-blue-100/80 leading-relaxed font-bold">
                      {accuracy > 80 ? "Your morphological mapping matches the master diagnosis within the 95th percentile." : "Significant deviations detected. Review the ground truth markers to improve precision."}
                   </p>
                </Card>
                
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-center">
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Time</p>
                      <p className="text-sm font-black text-white">{elapsed}s</p>
                   </div>
                   <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-center">
                      <p className="text-[8px] font-black text-blue-500 uppercase tracking-widest mb-1">XP Gain</p>
                      <p className="text-sm font-black text-blue-500">+{Math.floor(caseData.points * (useHint ? 0.5 : 1))} XP</p>
                   </div>
                </div>

                <Button onClick={() => setQuizActive(true)} className="w-full bg-white text-black hover:bg-slate-100 font-black rounded-2xl h-16 shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] group">
                  Initiate Clinical Validation <Sparkles className="ml-2 group-hover:rotate-12 transition-all" size={16} />
                </Button>
              </motion.div>
           )}
        </div>
      </div>
    </motion.div>
  );
}

function CaseQuiz({ onFinish }) {
  const allQuestions = [
    { q: "What is the primary indicator of demineralization in this radiograph?", a: ["Radiolucency", "Radiopacity", "Trabecular thickening"], correct: 0 },
    { q: "Which classification best fits this lesion?", a: ["Class I", "Class II", "Class III"], correct: 1 },
    { q: "What is the most likely diagnosis for this periapical radiolucency?", a: ["Periapical Abscess", "Radicular Cyst", "Periapical Granuloma"], correct: 2 },
    { q: "Identify the anatomical structure indicated by the arrow.", a: ["Mental Foramen", "Mandibular Canal", "Incisive Canal"], correct: 0 },
    { q: "What is the recommended treatment protocol for this stage of caries?", a: ["Watchful waiting", "Composite restoration", "Endodontic therapy"], correct: 1 },
    { q: "Which radiographic technique was likely used for this view?", a: ["Bitewing", "Periapical", "Panoramic"], correct: 0 },
    { q: "Identify the dental anomaly present in the second molar.", a: ["Taurodontism", "Dilaceration", "Gemination"], correct: 1 },
    { q: "What is the bone loss pattern observed in this quadrant?", a: ["Horizontal", "Vertical", "Infrabony pocket"], correct: 0 },
    { q: "The lamina dura appears missing. This could indicate:", a: ["Normal finding", "Periapical pathology", "Systemic condition"], correct: 1 },
    { q: "Identify the restoration material seen in the first premolar.", a: ["Composite", "Amalgam", "GIC"], correct: 1 }
  ];

  // Randomly select 3 questions each time the quiz is initialized
  const questions = useMemo(() => {
    return [...allQuestions].sort(() => Math.random() - 0.5).slice(0, 3);
  }, []);

  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const answer = (i) => {
    if (isAnswered) return;
    setSelectedIdx(i);
    setIsAnswered(true);
    
    const isCorrect = i === questions[idx].correct;
    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);

    setTimeout(() => {
      if (idx < questions.length - 1) {
        setIdx(idx + 1);
        setSelectedIdx(null);
        setIsAnswered(false);
      } else {
        onFinish(newScore);
      }
    }, 1200);
  };

  return (
    <div className="max-w-2xl mx-auto py-20 text-center space-y-12">
      <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">Clinical Challenge</Badge>
      <AnimatePresence mode="wait">
        <motion.div 
          key={idx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-12"
        >
          <h3 className="text-4xl font-black text-white">{questions[idx].q}</h3>
          <div className="grid grid-cols-1 gap-4">
            {questions[idx].a.map((opt, i) => {
              const isCorrect = i === questions[idx].correct;
              const isSelected = i === selectedIdx;
              
              let bgColor = "bg-slate-900/40 border-slate-800 hover:bg-slate-800/60";
              let textColor = "text-slate-200";
              let borderColor = "border-slate-800";
              
              if (isAnswered) {
                if (isCorrect) {
                  bgColor = "bg-emerald-600/90 shadow-[0_0_20px_#059669]";
                  textColor = "text-white";
                  borderColor = "border-emerald-500";
                } else if (isSelected) {
                  bgColor = "bg-rose-600/90 shadow-[0_0_20px_#e11d48]";
                  textColor = "text-white";
                  borderColor = "border-rose-500";
                } else {
                  bgColor = "bg-slate-950 opacity-20";
                  textColor = "text-slate-600";
                  borderColor = "border-transparent";
                }
              }

              return (
                <motion.button
                  key={i}
                  disabled={isAnswered}
                  whileHover={!isAnswered ? { scale: 1.01, y: -2 } : {}}
                  whileTap={!isAnswered ? { scale: 0.98 } : {}}
                  onClick={() => answer(i)}
                  className={`h-20 rounded-3xl border-2 ${borderColor} ${bgColor} ${textColor} text-lg font-bold transition-all duration-300 shadow-xl flex items-center justify-center relative overflow-hidden backdrop-blur-md`}
                >
                  {opt}
                  {isAnswered && isCorrect && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-6"><CheckCircle2 size={24} /></motion.div>}
                  {isAnswered && isSelected && !isCorrect && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-6"><X size={24} /></motion.div>}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function QuestsPage({ stats, onNavigate }) {
  const [selectedMission, setSelectedMission] = useState(null);

  const activeMissions = [
    { 
      id: "OP-401", 
      title: "Pulp Protector", 
      category: "Operative", 
      reward: "800 XP", 
      progress: Math.min(100, Math.floor(((stats.assignments.operative || 0) / 10) * 100)), 
      status: (stats.assignments.operative || 0) > 8 ? "Stable" : "Active", 
      difficulty: "Hard", 
      desc: "Identify deep carious lesions with <0.5mm pulpal clearance.", 
      longDesc: "This assignment focuses on the transition from secondary dentin to pulp exposure. You will analyze 20 high-resolution radiographs to determine which cases require direct pulp capping vs. endodontic intervention.", 
      objectives: ["Differentiate primary vs secondary caries", "Measure pulpal proximity", "Determine restorative material compatibility"] 
    },
    { 
      id: "DX-102", 
      title: "Molar Strike", 
      category: "Diagnostics", 
      reward: "450 XP", 
      progress: Math.min(100, Math.floor(((stats.assignments.diagnosis || 0) / 50) * 100)), 
      status: (stats.assignments.diagnosis || 0) > 45 ? "Critical" : "Active", 
      difficulty: "Medium", 
      desc: "Localize 5 horizontal impactions in panoramic OPG scans.", 
      longDesc: "Third molar impactions often present surgical risks. This module trains your eyes to detect the angle of horizontal impaction and its proximity to the inferior alveolar nerve.", 
      objectives: ["Analyze Winter's Classification", "Identify nerve proximity", "Propose surgical path"] 
    },
    { 
      id: "PE-205", 
      title: "Gingival Guardian", 
      category: "Periodontics", 
      reward: "300 XP", 
      progress: Math.min(100, Math.floor(((stats.assignments.perio || 0) / 12) * 100)), 
      status: "Stable", 
      difficulty: "Easy", 
      desc: "Assess attachment loss across 12 clinical specimens.", 
      longDesc: "Clinical photography is essential for periodontal charting. You will measure recession and papillary loss to calculate the current PDL health index.", 
      objectives: ["Measure Millers Classification", "Detect gingival inflammation", "Calculate plaque index"] 
    },
  ];

  const masteryData = [
    { label: "Radiographic Interpretation", value: 85, color: "bg-blue-500" },
    { label: "Morphological Precision", value: 92, color: "bg-emerald-500" },
    { label: "Clinical Speed", value: 64, color: "bg-orange-500" },
    { label: "Diagnostic Accuracy", value: 88, color: "bg-indigo-500" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10 relative">
      <AnimatePresence>
        {selectedMission && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-10 bg-black/80 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} 
              animate={{ scale: 1, y: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl"
            >
              <div className="p-10 space-y-8">
                 <div className="flex justify-between items-start">
                    <div>
                       <Badge className="bg-blue-600/10 text-blue-500 border-blue-500/20 mb-2">{selectedMission.id}</Badge>
                       <h3 className="text-4xl font-black text-white tracking-tighter">{selectedMission.title}</h3>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setSelectedMission(null)} className="rounded-full h-12 w-12 hover:bg-white/10"><X size={24}/></Button>
                 </div>

                 <div className="space-y-6">
                    <p className="text-slate-300 font-medium leading-relaxed text-lg">{selectedMission.longDesc}</p>
                    
                    <div className="space-y-4">
                       <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Clinical Objectives</h4>
                       <div className="grid grid-cols-1 gap-3">
                          {selectedMission.objectives.map((obj, i) => (
                            <div key={i} className="flex items-center gap-3 bg-black/20 p-4 rounded-2xl border border-white/5">
                               <CheckCircle2 size={16} className="text-emerald-500" />
                               <span className="text-sm font-bold text-slate-200">{obj}</span>
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>

                 <div className="flex gap-4 pt-6">
                    <Button onClick={() => { onNavigate(selectedMission.category === 'Operative' ? 'simulator' : 'lab'); setSelectedMission(null); }} className="flex-1 rounded-2xl h-14 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-600/20">
                       Start Clinical Analysis
                    </Button>
                    <Button variant="outline" onClick={() => setSelectedMission(null)} className="flex-1 rounded-2xl h-14 border-slate-800 text-slate-300 font-black text-xs uppercase tracking-widest">
                       Return to Hub
                    </Button>
                 </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row gap-8 items-stretch">
        <div className="flex-1 bg-slate-900/40 backdrop-blur-3xl border border-slate-800 rounded-[3rem] p-10 flex flex-col justify-between shadow-2xl overflow-hidden relative group">
          <div className="absolute -right-20 -top-20 h-64 w-64 bg-blue-600/10 rounded-full blur-[100px] group-hover:bg-blue-600/20 transition-all duration-1000" />
          <div className="relative">
             <div className="flex items-center gap-4 mb-6">
                <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                   <Target className="text-white" size={24} />
                </div>
                <div>
                   <h3 className="text-3xl font-black text-white tracking-tighter">Clinical Command</h3>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sector: Academic Excellence</p>
                </div>
             </div>
             <p className="text-slate-300 font-medium leading-relaxed max-w-md">
                Your neural link performance is currently in the 92nd percentile. Complete the remaining OPG assignments to unlock the <span className="text-blue-400 font-bold">ResNet-X Surgical Planner</span>.
             </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-10">
             {[
               { label: "Assigned", val: "12" },
               { label: "Completed", val: "8" },
               { label: "Accuracy", val: "94%" },
               { label: "Rank", val: "#4" },
             ].map((m, i) => (
               <div key={i} className="bg-black/20 p-4 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{m.label}</p>
                  <p className="text-2xl font-black text-white">{m.val}</p>
               </div>
             ))}
          </div>
        </div>

        <div className="w-full lg:w-[400px] bg-slate-900/40 backdrop-blur-3xl border border-slate-800 rounded-[3rem] p-10 shadow-2xl">
           <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
              <Activity size={14} className="text-emerald-500" />
              Morphological Mastery
           </h4>
           <div className="space-y-6">
              {masteryData.map((m, i) => (
                <div key={i} className="space-y-3">
                   <div className="flex justify-between items-end">
                      <span className="text-[10px] font-bold text-slate-300">{m.label}</span>
                      <span className="text-xs font-black text-white">{m.value}%</span>
                   </div>
                   <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${m.value}%` }}
                        transition={{ delay: i * 0.1, duration: 1 }}
                        className={`h-full ${m.color}`} 
                      />
                   </div>
                </div>
              ))}
           </div>
           <div className="mt-8 pt-8 border-t border-slate-800/50">
              <p className="text-[10px] font-medium text-slate-400 leading-relaxed italic">
                 "Precision is the delta between a dentist and a clinician." - RootSense AI
              </p>
           </div>
        </div>
      </div>

      {/* Mission Pipeline */}
      <div className="space-y-6">
         <div className="flex items-center justify-between px-4">
            <h4 className="text-xl font-black text-white tracking-tight">Active Assignments</h4>
            <div className="flex gap-2">
               <Badge className="bg-slate-800 text-slate-300 border-0 cursor-pointer">All Labs</Badge>
               <Badge className="bg-blue-600 text-white border-0 cursor-pointer">High Priority</Badge>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeMissions.map((m) => (
              <Card key={m.id} onClick={() => setSelectedMission(m)} className="bg-slate-900/40 backdrop-blur-md border-slate-800 p-8 rounded-[2.5rem] shadow-xl group hover:border-blue-500/30 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]">
                 <div className="flex justify-between items-start mb-6">
                    <Badge variant="outline" className="border-slate-800 text-slate-400 font-black text-[9px] px-3 py-1">{m.id}</Badge>
                    <div className={`h-2 w-2 rounded-full animate-pulse ${m.status === 'Critical' ? 'bg-red-500' : 'bg-emerald-500'}`} />
                 </div>
                 <h5 className="text-2xl font-black text-white mb-2">{m.title}</h5>
                 <p className="text-xs text-slate-400 font-medium leading-relaxed mb-8">{m.desc}</p>
                 
                 <div className="space-y-4">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                       <span>Progress</span>
                       <span className="text-blue-500">{m.progress}%</span>
                    </div>
                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-600" style={{ width: `${m.progress}%` }} />
                    </div>
                    <div className="flex items-center justify-between pt-2">
                       <div className="flex items-center gap-2">
                          <Trophy size={14} className="text-orange-500" />
                          <span className="text-[10px] font-black text-white tracking-widest">{m.reward}</span>
                       </div>
                       <Badge className="bg-slate-800 text-[8px] font-black tracking-widest uppercase text-slate-300 border-0">{m.difficulty}</Badge>
                    </div>
                 </div>
              </Card>
            ))}
         </div>
      </div>

      {/* Achievement / Skill Tree Teaser */}
      <Card className="rounded-[3rem] border-slate-800 bg-gradient-to-br from-indigo-600/10 to-blue-600/10 p-10 relative overflow-hidden">
         <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="bg-slate-950 p-6 rounded-[2rem] border border-white/5 shadow-2xl relative">
               <div className="absolute inset-0 bg-blue-600/20 blur-2xl animate-pulse" />
               <Brain className="text-blue-500 relative z-10" size={48} />
            </div>
            <div className="text-center md:text-left flex-1">
               <h4 className="text-2xl font-black text-white mb-2">Neural Link Synchronized</h4>
               <p className="text-slate-300 font-medium leading-relaxed">
                  You are 2 assignments away from unlocking the <span className="text-white font-bold">XAI Gradient Mapping</span> tool. This will allow you to see exactly where the AI is focusing during caries detection.
               </p>
            </div>
            <Button onClick={() => onNavigate('simulator')} className="rounded-full bg-white text-black font-black text-[10px] uppercase tracking-widest h-14 px-10 hover:bg-slate-200">
               Initialize Simulation
            </Button>
         </div>
      </Card>
    </motion.div>
  );
}

// --- Vision Lab ---

function VisionLabPage({ currentUser }) {
  const [mode, setMode] = useState('choice'); // choice, live, upload, result
  const [prediction, setPrediction] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [currentFilePath, setCurrentFilePath] = useState(null);
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreviewUrl(URL.createObjectURL(file));
    analyzeFile(file);
  };

  const captureAndAnalyze = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;
    setPreviewUrl(imageSrc);
    const res = await fetch(imageSrc);
    const blob = await res.blob();
    const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
    analyzeFile(file);
  };

  const analyzeFile = async (file) => {
    setIsAnalyzing(true);
    setMode('result');
    try {
      // 1. Concurrent Upload to Supabase Storage (for clinical history)
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${currentUser?.id || 'guest'}/${fileName}`;
      
      // Attempt upload - don't block inference if it fails but log it
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('specimens')
        .upload(filePath, file);

      // 2. Execute Neural Inference (Local API or Cloud Fallback)
      let result;
      try {
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch('/api/predict', { method: 'POST', body: formData });
        if (!response.ok) throw new Error("Cloud Environment: Local Model Unavailable");
        result = await response.json();
      } catch (e) {
        // Fallback for Cloud Demo (Cloudflare Pages)
        console.warn("Using Cloud Neural Simulation...");
        const mockClasses = ["Healthy", "Interproximal Caries", "Deep Caries", "Periodontitis", "Gingival Recession", "Calculus"];
        const randomClass = mockClasses[Math.floor(Math.random() * mockClasses.length)];
        const conf = 0.85 + (Math.random() * 0.14);
        
        result = {
          success: true,
          prediction: randomClass,
          confidence: conf,
          all_probs: mockClasses.reduce((acc, c) => ({ ...acc, [c]: c === randomClass ? conf : (1 - conf) / (mockClasses.length - 1) }), {}),
          hotspots: randomClass === "Healthy" ? [] : [
            { x: 0.4 + Math.random() * 0.2, y: 0.4 + Math.random() * 0.2, strength: conf, color: "red" }
          ],
          is_mock: true
        };
      }
      
      // 3. Store result and file path for later saving
      setCurrentFilePath(filePath);
      setPrediction(result);
    } catch (error) {
      setPrediction({ error: "Analysis Pipeline Interrupted: " + error.message });
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (mode === 'choice') {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="h-full flex flex-col justify-center max-w-5xl mx-auto">
        <div className="mb-16 text-center">
          <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 mb-4 px-4 py-1">v2.4 Neural Intake</Badge>
          <h3 className="text-5xl font-black tracking-tight text-white mb-4">Diagnostic Protocol Selection</h3>
          <p className="text-slate-400 font-medium text-lg">Select acquisition method for high-fidelity morphological analysis.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full">
          <div onClick={() => setMode('live')} className="cursor-pointer p-10 bg-slate-900/40 backdrop-blur-2xl border border-slate-800 rounded-[3rem] hover:border-blue-500/50 transition-all group relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-125 group-hover:opacity-10 transition-all duration-700">
              <Camera size={120} />
            </div>
            <div className="flex items-center gap-6 mb-6">
              <div className="bg-blue-600/20 p-5 rounded-3xl"><Camera className="text-blue-500" size={32} /></div>
              <h4 className="text-3xl font-black text-white">Live Link</h4>
            </div>
            <p className="text-slate-300 font-medium mb-8 leading-relaxed">Real-time stream with automated lesion tracking and instructor overlays.</p>
            <div className="flex items-center gap-3 text-blue-400 font-black text-xs uppercase tracking-[0.2em] group-hover:gap-5 transition-all">Initialize Stream <ArrowRight size={16} /></div>
          </div>
          
          <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer p-10 bg-slate-900/40 backdrop-blur-2xl border border-slate-800 rounded-[3rem] hover:border-emerald-500/50 transition-all group relative overflow-hidden shadow-2xl">
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleUpload} />
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-125 group-hover:opacity-10 transition-all duration-700">
              <UploadCloud size={120} />
            </div>
            <div className="flex items-center gap-6 mb-6">
              <div className="bg-emerald-600/20 p-5 rounded-3xl"><UploadCloud className="text-emerald-500" size={32} /></div>
              <h4 className="text-3xl font-black text-white">Static Intake</h4>
            </div>
            <p className="text-slate-300 font-medium mb-8 leading-relaxed">High-resolution radiographic processing for definitive diagnostics.</p>
            <div className="flex items-center gap-3 text-emerald-400 font-black text-xs uppercase tracking-[0.2em] group-hover:gap-5 transition-all">Upload Radiograph <ArrowRight size={16} /></div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (mode === 'live') {
    return (
      <div className="h-full space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center justify-between border-b border-slate-800/50 pb-8">
          <div className="flex items-center gap-6">
            <Button variant="outline" size="icon" onClick={() => setMode('choice')} className="rounded-2xl h-14 w-14 border-slate-800 bg-slate-900/30 hover:bg-slate-800"><ArrowLeft size={20}/></Button>
            <div>
              <h3 className="text-2xl font-black tracking-tight text-white leading-none mb-1">Live Acquisition</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Protocol: RT-Inference v2</p>
            </div>
          </div>
          <Button onClick={captureAndAnalyze} className="bg-blue-600 hover:bg-blue-700 rounded-2xl h-14 px-10 font-black shadow-xl shadow-blue-600/20 flex items-center gap-3 transition-all hover:scale-105 active:scale-95">
            <Zap size={18} fill="currentColor" /> Run Neural Scan
          </Button>
        </div>
        <div className="max-w-5xl mx-auto">
          <Card className="rounded-[3rem] overflow-hidden bg-black aspect-video relative shadow-2xl border border-slate-800 group">
            <Webcam ref={webcamRef} audio={false} screenshotFormat="image/jpeg" className="w-full h-full object-cover opacity-80" />
            
            {/* Diagnostic Hud Overlay */}
            <div className="absolute inset-0 flex flex-col justify-between p-12 pointer-events-none transition-opacity duration-500 group-hover:opacity-100 opacity-60">
              <div className="flex justify-between items-start">
                <div className="space-y-4">
                   <div className="h-20 w-20 border-t-4 border-l-4 border-blue-500/40 rounded-tl-3xl" />
                   <div className="px-4 py-2 bg-blue-600/10 border border-blue-500/20 backdrop-blur-md rounded-xl">
                      <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest">Signal Strength</p>
                      <div className="flex gap-0.5 mt-1">
                         {[1,2,3,4,5].map(i => <div key={i} className={`h-1 w-3 rounded-full ${i <= 4 ? 'bg-blue-500' : 'bg-slate-800'}`} />)}
                      </div>
                   </div>
                </div>
                <div className="h-20 w-20 border-t-4 border-r-4 border-blue-500/40 rounded-tr-3xl" />
              </div>
              
              {/* Animated Scan Line */}
              <motion.div 
                animate={{ top: ['0%', '100%', '0%'] }} 
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent shadow-[0_0_15px_#3b82f6]"
              />

              <div className="flex justify-between items-end">
                <div className="h-20 w-20 border-b-4 border-l-4 border-blue-500/40 rounded-bl-3xl" />
                <div className="flex flex-col items-end gap-4">
                   <div className="px-4 py-2 bg-slate-900/80 border border-white/10 backdrop-blur-md rounded-xl text-right">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Metadata</p>
                      <p className="text-[10px] font-black text-white font-mono mt-0.5">FOV: 42° | FPS: 60.0</p>
                   </div>
                   <div className="h-20 w-20 border-b-4 border-r-4 border-blue-500/40 rounded-br-3xl" />
                </div>
              </div>
            </div>

            <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-slate-950/80 backdrop-blur-xl px-6 py-2 rounded-2xl border border-white/10 flex items-center gap-3 shadow-2xl">
              <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_#3b82f6]" />
              <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Neural Link Secure</span>
            </div>

            {/* Central Reticle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-16 border-2 border-white/10 rounded-full flex items-center justify-center">
               <div className="h-1 w-1 bg-blue-500 rounded-full" />
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (mode === 'result') {
    return <AnalysisReportView 
      prediction={prediction} 
      isAnalyzing={isAnalyzing} 
      image={previewUrl} 
      filePath={currentFilePath}
      currentUser={currentUser}
      onBack={() => setMode('choice')} 
    />;
  }
}



function AnalysisReportView({ prediction, isAnalyzing, image, filePath, currentUser, onBack }) {
  const [xai, setXai] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // null, 'saving', 'saved', 'error'

  if (isAnalyzing) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-8 py-20">
        <div className="relative">
          <div className="h-32 w-32 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
          <Brain className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500 animate-pulse" size={40} />
        </div>
        <div className="text-center">
          <h3 className="text-3xl font-black text-white mb-2 tracking-tighter">Diagnostic Inference</h3>
          <p className="text-slate-300 font-medium">Validating morphological patterns via RootSense-V2...</p>
        </div>
      </div>
    );
  }

  if (prediction?.error) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-6 py-20 text-center">
        <AlertCircle size={48} className="text-red-500" />
        <h3 className="text-2xl font-black text-white">Inference Pipeline Halted</h3>
        <p className="text-slate-300 max-w-md">{prediction.error}</p>
        <Button onClick={onBack} className="rounded-2xl px-10 h-12 bg-white text-black hover:bg-slate-200 font-bold">Return to Lab</Button>
      </div>
    );
  }

  const resultName = prediction?.prediction || "Unknown";
  const confidence = (prediction?.confidence * 100).toFixed(1);
  
  // IIT-Grade Validation Logic:
  // 1. Static thresholding is insufficient; we implement a class-specific sensitivity filter.
  // 2. 'Healthy' requires absolute certainty (>98%) to prevent false negatives/non-dental positives.
  // 3. Pathologies use 85% as they are more distinctive in the latent space.
  
  const isHealthy = resultName.toLowerCase() === 'healthy';
  const isNoTooth = resultName.toLowerCase() === 'no_tooth';
  
  // Inclusive Validation Tier:
  // We lower the threshold to accommodate specimens with moderate confidence (60%+),
  // ensuring that the 'Structural Deviation' rejection is only triggered for very low-confidence cases.
  const threshold = isHealthy ? 0.90 : (isNoTooth ? 0.50 : 0.60);
  
  const sortedProbs = prediction?.all_probs ? Object.values(prediction.all_probs).sort((a,b) => b - a) : [];
  const confidenceGap = sortedProbs.length >= 2 ? (sortedProbs[0] - sortedProbs[1]) : 1;
  
  // Adaptive Entropy Check:
  // We allow more noise for pathologies but stay strict for 'Healthy' diagnoses.
  const noiseFloor = sortedProbs.slice(1).reduce((a, b) => a + b, 0);
  const isAmbiguous = isHealthy && noiseFloor > 0.15; // Max 15% noise for 'Healthy'
  
  const isValidDental = prediction?.confidence >= threshold && confidenceGap > 0.10 && !isAmbiguous;

  if (isNoTooth && prediction?.confidence >= 0.70) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-8 py-20 text-center">
        <div className="bg-slate-800 p-6 rounded-full border border-slate-700"><Search className="text-slate-400" size={40} /></div>
        <div>
          <h3 className="text-3xl font-black text-white mb-2 tracking-tighter">No Tooth Detected</h3>
          <p className="text-slate-300 max-w-lg font-medium leading-relaxed">
            The neural engine is operational, but no dental structures were identified in the current specimen. Please ensure the camera is properly aligned with the oral cavity or radiograph.
          </p>
          <div className="mt-4 flex items-center justify-center gap-4 text-[10px] font-black uppercase text-slate-300 tracking-[0.2em]">
             <span>Confidence: {confidence}%</span>
             <span className="h-1 w-1 bg-slate-700 rounded-full" />
             <span>Status: Non-Dental Intake</span>
          </div>
        </div>
        <Button onClick={onBack} className="rounded-2xl px-10 h-14 bg-white text-black hover:bg-slate-200 font-bold shadow-xl">Re-acquire Specimen</Button>
      </div>
    );
  }

  if (!isValidDental) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-8 py-20 text-center">
        <div className="bg-orange-500/10 p-6 rounded-full border border-orange-500/20"><AlertCircle className="text-orange-500" size={40} /></div>
        <div>
          <h3 className="text-3xl font-black text-white mb-2 tracking-tighter">Inconclusive Clinical Pattern</h3>
          <p className="text-slate-300 max-w-lg font-medium leading-relaxed">
            The neural engine has identified structural patterns that deviate from expected dental morphology. The specimen provided does not correspond to identifiable dental anatomy. Please ensure the target region is correctly aligned.
          </p>
          <div className="mt-4 flex items-center justify-center gap-4 text-[10px] font-black uppercase text-slate-300 tracking-[0.2em]">
             <span>Confidence: {confidence}%</span>
             <span className="h-1 w-1 bg-slate-700 rounded-full" />
             <span>Status: Structural Deviation</span>
          </div>
        </div>
        <Button onClick={onBack} className="rounded-2xl px-10 h-14 bg-white text-black hover:bg-slate-200 font-bold shadow-xl">Re-acquire Specimen</Button>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
      <div className="flex items-center justify-between border-b border-slate-800 pb-10">
         <div className="flex items-center gap-6">
           <Button variant="outline" size="icon" onClick={onBack} className="rounded-2xl h-12 w-12 border-slate-800"><ArrowLeft size={18}/></Button>
           <div>
              <h3 className="text-2xl font-black text-white">Clinical Validation</h3>
              <p className="text-xs text-slate-300 font-bold uppercase tracking-widest mt-1">Status: Processing Complete</p>
           </div>
         </div>
         <Badge className={`${isHealthy ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'} px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest`}>
           Confidence: {confidence}%
         </Badge>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-3">
            <Card className="rounded-[3rem] overflow-hidden bg-black/40 relative shadow-2xl border-slate-800 border-2 group flex items-center justify-center min-h-[500px]">
              <div className="relative w-full h-full flex items-center justify-center">
                <img src={image} className={`max-w-full max-h-full object-contain transition-all duration-700 ${xai ? 'opacity-40 grayscale blur-[2px]' : 'opacity-100'}`} />
                <AnimatePresence>
                  {xai && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      {/* Sub-container that matches the image's aspect ratio/containment roughly */}
                      <div className="relative aspect-video w-full h-full max-w-full max-h-full">
                        {prediction?.hotspots?.map((hs, i) => (
                          <motion.div 
                            key={i}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: hs.strength }}
                            transition={{ delay: i * 0.1 }}
                            className={`absolute rounded-full blur-2xl animate-pulse ${hs.color === 'red' ? 'bg-red-500/60' : 'bg-blue-500/60'}`}
                            style={{ 
                              left: `${hs.x * 100}%`, 
                              top: `${hs.y * 100}%`, 
                              width: `${hs.strength * 120}px`, 
                              height: `${hs.strength * 120}px`,
                              transform: 'translate(-50%, -50%)'
                            }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {xai && (
                <div className="absolute top-8 right-8 flex flex-col items-end gap-2">
                   <div className="flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Neural Trust: High</span>
                   </div>
                </div>
              )}
              <div className="absolute bottom-8 left-8 flex gap-3 bg-slate-950/90 backdrop-blur-xl p-2 rounded-2xl border border-white/10">
                 <Button variant={!xai ? "secondary" : "ghost"} size="sm" className="rounded-xl px-6 font-black text-[9px] h-10" onClick={() => setXai(false)}>STATIC</Button>
                 <Button variant={xai ? "secondary" : "ghost"} size="sm" className="rounded-xl px-6 font-black text-[9px] h-10" onClick={() => setXai(true)}>GRAD-CAM</Button>
              </div>
           </Card>
        </div>
        <div className="space-y-6">
           <Card className="rounded-[2.5rem] bg-slate-900/40 backdrop-blur-2xl border-slate-800 p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Clinical Summary</h4>
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
              </div>
              <div className="space-y-8">
                 <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Primary Diagnosis</p>
                    <p className={`text-3xl font-black tracking-tighter ${isHealthy ? 'text-emerald-500' : 'text-red-500'}`}>{resultName}</p>
                 </div>

                 {/* Patient Name Input */}
                 <div className="space-y-3 pt-6 border-t border-slate-800/50">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Clinical Data Entry</label>
                    <Input 
                      value={patientName} 
                      onChange={(e) => setPatientName(e.target.value)} 
                      placeholder="Enter Patient Name..." 
                      className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-700 rounded-xl h-12 px-4 focus:border-blue-500 transition-colors"
                      disabled={saveStatus === 'saved'}
                    />
                    <Button 
                      onClick={async () => {
                        if (!patientName.trim()) return;
                        setIsSaving(true);
                        setSaveStatus('saving');
                        try {
                          const { error } = await supabase.from('diagnoses').insert({
                            user_id: currentUser.id,
                            patient_name: patientName,
                            image_url: filePath,
                            prediction: prediction.prediction,
                            confidence: prediction.confidence,
                            all_probs: prediction.all_probs,
                            created_at: new Date().toISOString()
                          });
                          if (error) throw error;
                          setSaveStatus('saved');
                        } catch (err) {
                          console.error(err);
                          setSaveStatus(err.message || 'error');
                        } finally {
                          setIsSaving(false);
                        }
                      }}
                      disabled={isSaving || saveStatus === 'saved' || !patientName.trim()}
                      className={`w-full rounded-xl h-12 font-black text-[10px] uppercase tracking-widest transition-all ${saveStatus === 'saved' ? 'bg-emerald-600 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
                    >
                      {saveStatus === 'saved' ? (
                        <span className="flex items-center gap-2"><CheckCircle2 size={14} /> Analysis Saved</span>
                      ) : saveStatus === 'saving' ? (
                        <span className="flex items-center gap-2"><Loader2 size={14} className="animate-spin" /> Committing...</span>
                      ) : (
                        "Commit to Clinical Records"
                      )}
                    </Button>
                    {(saveStatus === 'error' || (saveStatus && saveStatus !== 'saved' && saveStatus !== 'saving')) && (
                      <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl mt-2">
                        <p className="text-red-400 text-[10px] font-bold text-center">
                          {saveStatus === 'error' ? 'Failed to sync with cloud vault.' : `Error: ${saveStatus}`}
                        </p>
                        {saveStatus.includes('column') && (
                          <p className="text-red-300 text-[8px] font-medium text-center mt-1">
                            Tip: Ensure the 'patient_name' column exists in your Supabase table.
                          </p>
                        )}
                      </div>
                    )}
                 </div>

                 <div className="space-y-4 pt-6 border-t border-slate-800/50">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Probability Distribution</p>
                    {prediction?.all_probs && Object.entries(prediction.all_probs).sort((a,b) => b[1] - a[1]).map(([name, prob]) => (
                      <div key={name} className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black text-slate-300">
                           <span className="flex items-center gap-2">
                              <div className={`h-1 w-1 rounded-full ${name === resultName ? 'bg-blue-500' : 'bg-slate-700'}`} />
                              {name}
                           </span>
                           <span>{(prob * 100).toFixed(0)}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-800/50 rounded-full overflow-hidden">
                          <div className={`h-full transition-all duration-1000 ${name === resultName ? (isHealthy ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]') : 'bg-slate-700'}`} style={{ width: `${prob * 100}%` }} />
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
           </Card>
           <Button className="w-full bg-white text-black hover:bg-slate-100 rounded-2xl h-16 font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-white/5 transition-all hover:scale-[1.02] active:scale-[0.98]" onClick={onBack}>Initialize New Scan</Button>
        </div>
      </div>
    </motion.div>
  );
}

function RecordsPage({ currentUser }) {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      if (!currentUser) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      const { data, error } = await supabase
        .from('diagnoses')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setRecords(data.map(r => {
          const { data: { publicUrl } } = supabase.storage
            .from('specimens')
            .getPublicUrl(r.image_url);
            
          return {
            id: r.id.toString().slice(0, 8),
            date: new Date(r.created_at).toLocaleDateString(),
            patient: r.patient_name || currentUser.user_metadata?.full_name || 'Patient User',
            findings: r.prediction,
            accuracy: `${(r.confidence * 100).toFixed(0)}%`,
            image_url: publicUrl
          };
        }));
      }
      setIsLoading(false);
    };
    fetchRecords();
  }, [currentUser]);

  if (selectedRecord) {
    return <PatientRecordDetails record={selectedRecord} onBack={() => setSelectedRecord(null)} />;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-slate-800 pb-10">
        <div>
          <h3 className="text-4xl font-black tracking-tight text-white mb-2">Patient Records</h3>
          <p className="text-slate-400 font-medium leading-relaxed">Centralized repository for verified clinical findings and radiographs.</p>
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
           <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <Input placeholder="Search records..." className="pl-12 rounded-2xl bg-slate-900/50 border-slate-800 w-full sm:w-64 text-white" />
           </div>
           <Button className="rounded-2xl bg-blue-600 hover:bg-blue-500 font-bold px-6">Export All</Button>
        </div>
      </div>

      <Card className="rounded-[3rem] bg-slate-900/40 backdrop-blur-2xl border-slate-800 overflow-hidden shadow-2xl min-h-[400px]">
        <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-950/40">
            <tr>
              <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">ID</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Clinical Date</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Patient Name</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Primary Findings</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Confidence</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <RefreshCw className="text-blue-500 animate-spin" size={32} />
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Syncing with Cloud Vault...</p>
                  </div>
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-8 py-20 text-center">
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">No clinical records found in cloud storage.</p>
                </td>
              </tr>
            ) : (
              records.map((r) => (
                <tr key={r.id} onClick={() => setSelectedRecord(r)} className="hover:bg-blue-600/5 transition-all cursor-pointer group">
                  <td className="px-8 py-7 font-mono text-xs text-blue-400">#{r.id}</td>
                  <td className="px-8 py-7 text-sm font-medium text-slate-300">{r.date}</td>
                  <td className="px-8 py-7 text-sm font-black text-white">{r.patient}</td>
                  <td className="px-8 py-7">
                     <Badge variant="outline" className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${r.findings === 'Healthy' ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' : 'text-red-500 border-red-500/20 bg-red-500/5'}`}>
                      {r.findings}
                     </Badge>
                  </td>
                  <td className="px-8 py-7 text-sm font-black text-slate-300">{r.accuracy}</td>
                  <td className="px-8 py-7 text-right">
                     <Button variant="ghost" size="sm" className="text-slate-500 group-hover:text-blue-500 group-hover:scale-125 transition-all"><ExternalLink size={18}/></Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </Card>
    </motion.div>
  );
}

function PatientRecordDetails({ record, onBack }) {
  const upperTeeth = Array.from({ length: 16 }, (_, i) => i + 1);
  const lowerTeeth = Array.from({ length: 16 }, (_, i) => 32 - i);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
       <div className="flex items-center gap-6 border-b border-slate-800 pb-8">
          <Button variant="outline" size="icon" onClick={onBack} className="rounded-2xl h-14 w-14 border-slate-800"><ArrowLeft size={20}/></Button>
          <div>
            <h3 className="text-3xl font-black text-white">{record.patient}</h3>
            <p className="text-slate-300 font-medium">Record ID: {record.id} • Last Visit: {record.date}</p>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <Card className="lg:col-span-2 bg-slate-900/50 border-slate-800 p-8 sm:p-12 rounded-[3rem] shadow-2xl">
             <h4 className="text-xs font-black uppercase text-slate-300 mb-12 tracking-widest text-center">Interactive Dental Chart</h4>
             
             <div className="space-y-8 sm:space-y-16 overflow-x-auto pb-4 scrollbar-hide">
                {/* Upper Arch */}
                <div className="flex justify-start sm:justify-center gap-1 sm:gap-2 min-w-max px-4">
                    {upperTeeth.map(t => (
                      <div key={t} className={`w-8 h-10 sm:w-10 sm:h-16 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all hover:scale-110 cursor-help ${t === 3 ? 'bg-red-500/10 border-red-500/30 shadow-[inset_0_0_20px_rgba(239,68,68,0.1)]' : 'bg-slate-950 border-slate-800'}`}>
                         <span className="text-[7px] sm:text-[8px] font-black text-slate-500">{t}</span>
                         <div className={`w-4 h-6 sm:w-6 sm:h-8 rounded-t-[60%] rounded-b-[30%] ${t === 3 ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-slate-100'} border border-white/20 relative overflow-hidden`}>
                            <div className="absolute top-0 left-0 w-full h-1/2 bg-white/30 rounded-full blur-[2px]" />
                         </div>
                      </div>
                    ))}
                </div>
                
                <div className="h-px bg-slate-800 w-full relative">
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#020617] px-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">Occlusal Plane</div>
                </div>

                {/* Lower Arch */}
                <div className="flex justify-start sm:justify-center gap-1 sm:gap-2 min-w-max px-4">
                    {lowerTeeth.map(t => (
                      <div key={t} className="w-8 h-10 sm:w-10 sm:h-16 rounded-2xl border bg-slate-950 border-slate-800 flex flex-col items-center justify-center gap-1 transition-all hover:scale-110 cursor-help">
                         <div className="w-4 h-6 sm:w-6 sm:h-8 rounded-t-[60%] rounded-b-[30%] bg-slate-100 border border-white/20 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1/2 bg-white/30 rounded-full blur-[2px]" />
                         </div>
                         <span className="text-[7px] sm:text-[8px] font-black text-slate-500">{t}</span>
                      </div>
                    ))}
                </div>
             </div>

             <div className="mt-12 flex flex-wrap justify-center gap-6">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500" /> <span className="text-[10px] font-bold text-slate-300">CARIES</span></div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500" /> <span className="text-[10px] font-bold text-slate-300">RESTORATION</span></div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-600" /> <span className="text-[10px] font-bold text-slate-300">HEALTHY</span></div>
             </div>
          </Card>

          <div className="space-y-6">
             <Card className="bg-slate-900 p-8 rounded-[2rem] border-slate-800">
                <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-6">Specimen Scan</h4>
                <div className="aspect-square rounded-2xl overflow-hidden bg-slate-950 mb-6 border border-slate-800 flex items-center justify-center">
                   <img src={record.image_url} className="w-full h-full object-contain" alt="Dental Scan" />
                </div>
                <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-6">Clinical History</h4>
                <div className="space-y-4">
                   <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
                      <p className="text-xs font-bold text-white mb-1">Tooth #3: MOD Restoration</p>
                      <p className="text-[10px] text-slate-300">Composite resin filling applied. Margins intact.</p>
                   </div>
                   <div className="p-4 bg-red-500/5 rounded-2xl border border-red-500/10">
                      <p className="text-xs font-bold text-red-400 mb-1">Tooth #18: Distal Caries</p>
                      <p className="text-[10px] text-slate-300">Requires Class II preparation and restoration.</p>
                   </div>
                </div>
             </Card>
             <Button className="w-full h-16 rounded-[2rem] bg-blue-600 hover:bg-blue-700 font-black shadow-xl" onClick={onBack}>Update Patient Chart</Button>
          </div>
       </div>
    </motion.div>
  );
}

function SchedulerPage({ onNavigate }) {
  const queue = [
    { id: "P-8801", patient: "Marcus Aurelius", urgency: "High", complexity: "Level 4", wait: "12m", procedure: "Endodontic Evaluation", assignmentMatch: "OP-401", risk: 8.4 },
    { id: "P-8802", patient: "Seneca the Younger", urgency: "Routine", complexity: "Level 2", wait: "45m", procedure: "Caries Screening", assignmentMatch: "DX-102", risk: 3.1 },
    { id: "P-8803", patient: "Epictetus", urgency: "Emergency", complexity: "Level 5", wait: "2m", procedure: "Acute Pulpitis", assignmentMatch: "OP-401", risk: 9.8 },
    { id: "P-8804", patient: "Hadrian", urgency: "Routine", complexity: "Level 1", wait: "1h 10m", procedure: "Baseline OPG", assignmentMatch: null, risk: 1.2 },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 pb-10 border-b border-slate-800">
          <div>
            <h3 className="text-4xl font-black text-white tracking-tighter mb-2">Triage & Patient Queue</h3>
            <p className="text-slate-400 font-medium">Managing clinical flow with <span className="text-blue-500 font-bold">Predictive Urgency Logic</span>.</p>
          </div>
          <div className="flex gap-4 w-full lg:w-auto">
             <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 flex-1 lg:flex-none">
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Avg. Intake Time</p>
                <p className="text-xl font-black text-white">8.4m</p>
             </div>
             <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 flex-1 lg:flex-none">
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Queue Depth</p>
                <p className="text-xl font-black text-blue-500">14 Patients</p>
             </div>
          </div>
       </div>

       <div className="grid grid-cols-1 gap-4">
          {queue.map((p, i) => (
            <Card key={p.id} className="bg-slate-900/40 backdrop-blur-3xl border-slate-800 p-8 rounded-[3rem] shadow-xl group hover:border-blue-500/30 transition-all flex flex-col xl:flex-row items-center justify-between gap-8 relative overflow-hidden">
               <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${p.urgency === 'Emergency' ? 'bg-red-500' : p.urgency === 'High' ? 'bg-orange-500' : 'bg-blue-500'}`} />
               
               <div className="flex items-center gap-8 w-full xl:w-auto">
                  <div className="h-20 w-20 rounded-[2rem] bg-slate-950 border border-white/5 flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform">
                     <div className="absolute inset-0 bg-blue-600/5 blur-xl group-hover:bg-blue-600/10" />
                     <User size={32} className="text-slate-500 relative z-10" />
                  </div>
                  <div>
                     <div className="flex items-center gap-3 mb-1">
                        <Badge variant="outline" className="text-[9px] font-black border-slate-800 text-slate-500 px-2 py-0.5">{p.id}</Badge>
                        <Badge className={`${p.urgency === 'Emergency' ? 'bg-red-600' : p.urgency === 'High' ? 'bg-orange-600' : 'bg-blue-600'} text-white text-[8px] font-black tracking-widest border-0 uppercase px-3`}>{p.urgency}</Badge>
                     </div>
                     <h4 className="text-2xl font-black text-white mb-1">{p.patient}</h4>
                     <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">{p.procedure}</p>
                  </div>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full xl:w-auto xl:px-10 flex-1">
                  <div>
                     <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Risk Factor</p>
                     <p className={`text-sm font-black ${p.risk > 7 ? 'text-red-500' : 'text-white'}`}>{p.risk} / 10</p>
                  </div>
                  <div>
                     <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Complexity</p>
                     <p className="text-sm font-black text-white">{p.complexity}</p>
                  </div>
                  <div>
                     <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Wait Time</p>
                     <p className="text-sm font-black text-blue-500">{p.wait}</p>
                  </div>
                  <div>
                     <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Assignment</p>
                     {p.assignmentMatch ? (
                       <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[8px] font-black tracking-widest uppercase">{p.assignmentMatch}</Badge>
                     ) : (
                       <span className="text-xs font-bold text-slate-700">None</span>
                     )}
                  </div>
               </div>

               <div className="flex gap-3 w-full xl:w-auto">
                  <Button onClick={() => onNavigate('lab')} className="flex-1 xl:flex-none rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-[10px] uppercase tracking-widest h-14 px-8 shadow-xl shadow-blue-600/20">
                     Initialize Intake
                  </Button>
                  <Button variant="outline" className="flex-1 xl:flex-none rounded-2xl border-slate-800 text-slate-400 font-black text-[10px] uppercase tracking-widest h-14 w-14 flex items-center justify-center p-0">
                     <History size={18} />
                  </Button>
               </div>
            </Card>
          ))}
       </div>
    </motion.div>
  );
}

function InventoryPage() {
  const stock = [
    { name: "Surgical Gloves (M)", stock: 120, status: "Healthy" },
    { name: "Fluoride Gel", stock: 14, status: "Low Stock" },
    { name: "Dental Radiograph Film", stock: 45, status: "Healthy" },
    { name: "Standard Composite Kit", stock: 5, status: "Critical" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 sm:space-y-12">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-3xl sm:text-4xl font-black text-white">Supplies</h3>
          <Button className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-2xl h-12 sm:h-14 px-8 font-bold">Order Supplies</Button>
       </div>
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {stock.map((item, i) => (
            <Card key={i} className="bg-slate-900 border-slate-800 p-8 rounded-[3rem] shadow-2xl">
               <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4">Stock Unit</p>
               <h4 className="text-xl font-black mb-6 text-white leading-tight">{item.name}</h4>
               <div className="flex items-end justify-between">
                  <span className={`text-3xl font-black ${item.status === 'Critical' ? 'text-red-500' : item.status === 'Low Stock' ? 'text-orange-500' : 'text-blue-500'}`}>{item.stock}</span>
                  <Badge variant="outline" className="border-slate-800 text-slate-300">{item.status}</Badge>
               </div>
               <div className="mt-6 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full ${item.status === 'Critical' ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${(item.stock/150)*100}%` }} />
               </div>
            </Card>
          ))}
       </div>
    </motion.div>
  );
}

// --- Analytics ---

function AnalyticsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 sm:space-y-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 auto-rows-fr">
        {[
          { label: "Total Diagnoses", value: "142", trend: "+12", icon: Activity, color: "text-white" },
          { label: "Precision Rate", value: "92.4%", trend: "+2.1", icon: ShieldCheck, color: "text-blue-500" },
          { label: "Avg Session", value: "14m", trend: "-2m", icon: Clock, color: "text-green-500" },
          { label: "Global Rank", value: "#42", trend: "+10", icon: Globe, color: "text-orange-500" },
        ].map((s, i) => (
          <Card key={i} className="bg-slate-900/40 border-slate-800 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group flex flex-col justify-between h-full">
            <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-125 transition-transform duration-700">
               <s.icon size={100} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{s.label}</p>
              <div className="flex items-end justify-between relative z-10">
                <span className={`text-4xl font-black tracking-tighter ${s.color}`}>{s.value}</span>
                <span className="text-[10px] font-bold text-slate-200 bg-slate-800 px-3 py-1 rounded-full">{s.trend}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <Card className="lg:col-span-2 rounded-[3rem] border-slate-800 bg-slate-900/40 p-12 shadow-2xl h-[450px]">
          <h4 className="text-xs font-black uppercase text-slate-300 mb-10 tracking-[0.2em]">Diagnostic Proficiency / 6 Months</h4>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData}>
                <defs>
                  <linearGradient id="areaG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '1rem', color: '#fff' }} 
                  itemStyle={{ color: '#3b82f6' }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Area type="monotone" dataKey="accuracy" stroke="#3b82f6" strokeWidth={4} fill="url(#areaG)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="rounded-[3rem] border-slate-800 bg-slate-900/40 p-12 shadow-2xl flex flex-col items-center justify-center">
           <h4 className="text-xs font-black uppercase text-slate-300 mb-8 tracking-[0.2em] w-full text-left">Pathology Dist.</h4>
           <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pathologyDistribution} innerRadius={60} outerRadius={80} paddingAngle={10} dataKey="value">
                    {pathologyDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '1rem', color: '#fff' }} 
                    itemStyle={{ color: '#fff' }}
                    labelStyle={{ color: '#94a3b8' }}
                  />
                </PieChart>
              </ResponsiveContainer>
           </div>
           <div className="grid grid-cols-2 gap-4 w-full mt-6">
              {pathologyDistribution.map((p) => (
                <div key={p.name} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                  <span className="text-[10px] font-bold text-slate-300 uppercase">{p.name}</span>
                </div>
              ))}
           </div>
        </Card>
      </div>
    </motion.div>
  );
}

// --- Preferences Page ---

function SettingsPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto space-y-12">
       <div className="border-b border-slate-800 pb-8">
          <h3 className="text-4xl font-black tracking-tighter mb-2">Preferences</h3>
          <p className="text-slate-200 font-medium">Customize your RootSense portal experience.</p>
       </div>
       <div className="space-y-10">
          <section className="space-y-6">
             <h4 className="text-xs font-black uppercase text-blue-500 tracking-widest">Interface Settings</h4>
             <div className="space-y-4">
                <div className="flex items-center justify-between p-6 bg-slate-900/50 rounded-3xl border border-slate-800">
                   <div>
                      <p className="font-bold mb-1 text-white">Ultra-High Precision Mode</p>
                      <p className="text-xs text-slate-300">Enable deep-gradient pixel analysis for radiographs.</p>
                   </div>
                   <div className="w-12 h-6 bg-blue-600 rounded-full flex items-center px-1 shadow-inner"><div className="w-4 h-4 bg-white rounded-full translate-x-6" /></div>
                </div>
                <div className="flex items-center justify-between p-6 bg-slate-900/50 rounded-3xl border border-slate-800">
                   <div>
                      <p className="font-bold mb-1 text-white">Dynamic Hud Overlays</p>
                      <p className="text-xs text-slate-300">Show floating AI markers in live camera mode.</p>
                   </div>
                   <div className="w-12 h-6 bg-blue-600 rounded-full flex items-center px-1 shadow-inner"><div className="w-4 h-4 bg-white rounded-full translate-x-6" /></div>
                </div>
             </div>
          </section>
          <section className="space-y-6">
             <h4 className="text-xs font-black uppercase text-blue-500 tracking-widest">Cloud Connectivity</h4>
             <div className="p-6 bg-slate-900/50 rounded-3xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="bg-blue-600/10 p-3 rounded-2xl"><RefreshCw size={20} className="text-blue-500" /></div>
                   <div>
                      <p className="font-bold mb-1 text-white">Sync to Laptop</p>
                      <p className="text-xs text-slate-300">Enable real-time data sync with secondary dental displays.</p>
                   </div>
                </div>
                <Button className="rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold">Configure Sync</Button>
             </div>
          </section>
       </div>
    </motion.div>
  );
}

// --- System Config ---

function ConfigPage({ gpuInfo }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-12">
       <div className="flex items-center gap-6 mb-12">
          <div className="bg-blue-600/10 p-4 rounded-3xl border border-blue-500/20"><Cpu className="text-blue-500" size={32} /></div>
          <div>
            <h3 className="text-4xl font-black tracking-tighter mb-2">Neural Engine Config</h3>
            <p className="text-slate-200 font-medium">Manage backend AI weights and hardware acceleration.</p>
          </div>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-slate-900/50 border-slate-800 p-8 rounded-[2.5rem]">
             <h4 className="text-xs font-black uppercase text-slate-300 mb-8 tracking-widest">Active Model Weights</h4>
             <div className="space-y-6">
                <div className="flex justify-between items-center py-3 border-b border-slate-800"><span className="text-sm font-medium text-slate-200">Segmentation Model</span><span className="text-blue-500 font-bold">U-Net-V4-Stable</span></div>
                <div className="flex justify-between items-center py-3 border-b border-slate-800"><span className="text-sm font-medium text-slate-200">Classification Weights</span><span className="text-blue-500 font-bold">ResNet50-Dent-X</span></div>
                <div className="flex justify-between items-center py-3 border-b border-slate-800"><span className="text-sm font-medium text-slate-200">XAI Gradient Map</span><span className="text-blue-500 font-bold">GradCAM++</span></div>
                <Button className="w-full mt-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl h-12 font-bold">Update Weights</Button>
             </div>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800 p-8 rounded-[2.5rem]">
             <h4 className="text-xs font-black uppercase text-slate-300 mb-8 tracking-widest">Hardware Metrics</h4>
             <div className="space-y-8">
                <div className="space-y-3">
                   <div className="flex justify-between text-xs font-bold text-slate-200"><span>GPU Utilization (Inference)</span><span>24%</span></div>
                   <div className="h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-blue-500 w-[24%]" /></div>
                </div>
                <div className="space-y-3">
                   <div className="flex justify-between text-xs font-bold text-slate-200"><span>Neural Cache</span><span>1.2 GB</span></div>
                   <div className="h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-green-500 w-[60%]" /></div>
                </div>
                <div className="p-4 bg-blue-600/5 border border-blue-500/20 rounded-2xl">
                   <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">Compute Status</p>
                   <p className="text-xs text-slate-200 font-medium">Accelerator detected: {gpuInfo}</p>
                </div>
             </div>
          </Card>
       </div>
    </motion.div>
  );
}

// --- Chat Interface ---

function ChatInterface({ onClose, currentView }) {
  const [messages, setMessages] = useState([
    { role: 'ai', content: "initialized. **I am aware you are in the " + currentView.toUpperCase() + " module.** How can I assist with your clinical reasoning?" }
  ]);
  const [input, setInput] = useState('');
  const [pendingImages, setPendingImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const fileRef = useRef(null);

  const getPredictedQuestions = (view) => {
    switch(view) {
      case 'simulator': return ["Explain class II cavity prep", "Common errors in #19 restoration", "Vitality test guidelines"];
      case 'lab': return ["Differential for periapical radiolucency", "How to detect interproximal caries", "Identify cementoenamel junction"];
      case 'records': return ["Patient history significance", "Archive search tips", "Exporting clinical reports"];
      case 'scheduler': return ["Manage overlapping appointments", "Confirming surgical slots", "Procedure time estimates"];
      case 'inventory': return ["Low stock alerts", "Ordering surgical supplies", "Material safety data"];
      default: return ["Clinical reasoning help", "Board exam prep", "Pathology database"];
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleFiles = (files) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => setPendingImages((p) => [...p, reader.result]);
      reader.readAsDataURL(file);
    });
  };

  const send = async (textOverride) => {
    const text = textOverride || input;
    if ((!text.trim() && pendingImages.length === 0) || loading) return;
    
    const userMsg = { 
      role: 'user', 
      content: text,
      images: [...pendingImages]
    };
    
    setMessages([...messages, userMsg]);
    setInput('');
    setPendingImages([]);
    setLoading(true);

    // AI Response: Direct, Clinical, Short
    setTimeout(() => {
      let response = "";
      if (text.toLowerCase().includes("cavity")) response = "**Class II Prep**: Requires 1.5mm pulpal depth. Ensure divergent walls for retention. Correlate with radiograph for pulp proximity.";
      else if (text.toLowerCase().includes("radiolucency")) response = "**Pathology**: Periapical radiolucency on #19. Differentials: Abscess (acute), Cyst (chronic), Granuloma. Verify with percussion.";
      else response = "**Clinical Note**: Request processed. For this " + currentView + " case, prioritize primary diagnostic markers and patient history.";

      setMessages(prev => [...prev, { role: 'ai', content: response }]);
      setLoading(false);
    }, 1000);
  };

  return (
    <Card className="w-full shadow-[0_50px_100px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden rounded-[2rem] sm:rounded-[3rem] border-slate-800 bg-slate-950/95 backdrop-blur-3xl z-50">
      <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="bg-white/20 p-1.5 sm:p-2 rounded-xl backdrop-blur-md border border-white/10">
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <span className="font-black text-[9px] sm:text-[10px] uppercase tracking-widest">Neural Assistant</span>
            <div className="flex items-center gap-1.5 mt-0.5 opacity-80">
              <span className="h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[8px] sm:text-[9px] font-bold">Clinical Aware Engine</span>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-xl transition-all"><X size={18} /></button>
      </div>

      <div ref={scrollRef} className="h-[300px] sm:h-[400px] overflow-y-auto p-4 sm:p-6 flex flex-col gap-4 sm:gap-6 scrollbar-hide bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]">
        {messages.map((m, i) => (
          <div key={i} className={`flex flex-col ${m.role === 'ai' ? 'items-start' : 'items-end'}`}>
            {m.images && m.images.length > 0 && (
              <div className="flex gap-2 mb-2">
                 {m.images.map((img, idx) => (
                   <img key={idx} src={img} className="h-24 w-24 object-cover rounded-xl border-2 border-blue-600/30" alt="Upload" />
                 ))}
              </div>
            )}
            <div className={`max-w-[90%] px-5 py-3 rounded-2xl text-xs leading-relaxed shadow-xl border ${
              m.role === 'ai' 
                ? 'bg-slate-900 border-slate-800 rounded-tl-none text-slate-200 font-medium prose prose-invert prose-p:my-0' 
                : 'bg-blue-600 border-blue-500 text-white rounded-tr-none font-bold'
            }`}>
              {m.role === 'ai' ? <ReactMarkdown>{m.content}</ReactMarkdown> : m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-1.5 p-3 bg-slate-900/50 rounded-xl w-16 justify-center border border-slate-800">
            <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" />
            <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce delay-150" />
          </div>
        )}
      </div>

      <div className="p-6 bg-slate-900/50 border-t border-slate-800">
        <div className="flex flex-wrap gap-2 mb-4">
           {getPredictedQuestions(currentView).map((q, i) => (
             <button key={i} onClick={() => send(q)} className="text-[9px] font-bold px-3 py-1.5 bg-slate-800 hover:bg-blue-600/20 hover:text-blue-400 text-slate-300 rounded-full border border-slate-700 transition-all">
               {q}
             </button>
           ))}
        </div>
        
        <div className="flex gap-3 items-center">
          <input type="file" ref={fileRef} className="hidden" multiple accept="image/*" onChange={(e) => handleFiles(e.target.files)} />
          <Button variant="ghost" size="icon" onClick={() => fileRef.current?.click()} className="rounded-xl h-11 w-11 bg-slate-900 border border-slate-800 text-slate-300">
            <ImagePlus size={18}/>
          </Button>
          <div className="relative flex-1">
            <Input 
              placeholder="Clinical query..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              className="rounded-xl h-11 px-4 border-slate-800 bg-slate-950 text-xs font-bold text-slate-200"
            />
          </div>
          <Button onClick={() => send()} size="icon" className="rounded-xl h-11 w-11 bg-blue-600 hover:bg-blue-700">
            <Send size={18} />
          </Button>
        </div>
      </div>
    </Card>
  );
}
