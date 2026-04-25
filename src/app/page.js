"use client";

import { useState, useRef, useEffect, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  Activity, BookOpen, Settings, Mic, MessageSquare, X, Send, Video, Upload,
  RefreshCw, CheckCircle2, AlertCircle, ArrowRight, BrainCircuit, ShieldCheck,
  BarChart3, Brain, Info, Target, Download, ExternalLink, Printer, Layers, UploadCloud, Loader2, Clock, ArrowLeft,
  User, Database, FileText, Zap, Sparkles, Camera, History, Microscope, GraduationCap, Bell, Search, Filter, Cpu, Globe, Sliders, ImagePlus
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
  { name: 'Caries', value: 45, color: '#3b82f6' },
  { name: 'Gingivitis', value: 30, color: '#ef4444' },
  { name: 'Calculus', value: 15, color: '#f59e0b' },
  { name: 'Healthy', value: 10, color: '#10b981' },
];

const caseLibrary = [
  { id: 101, title: "Interproximal Caries", level: "Beginner", points: 150, image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80", type: "Radiograph" },
  { id: 102, title: "Advanced Periodontitis", level: "Intermediate", points: 300, image: "/images/periodontitis.png", type: "Clinical Photo" },
  { id: 103, title: "Third Molar Impaction", level: "Advanced", points: 500, image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80", type: "CBCT" },
  { id: 104, title: "Enamel Hypoplasia", level: "Intermediate", points: 250, image: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=800&q=80", type: "Clinical Photo" },
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
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const BYPASS_CREDENTIALS = { username: 'faah', password: 'faah' };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Hardcoded bypass login
    if (email === BYPASS_CREDENTIALS.username && password === BYPASS_CREDENTIALS.password) {
      onLogin({ name: 'Faah', email: 'faah@gmail.com' });
      return;
    }
    if (!email || !password) { setError('All fields are required.'); return; }
    if (mode === 'signup' && !name) { setError('Name is required.'); return; }
    setError('');
    onLogin({ name: name || email.split('@')[0], email });
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
            {error && <p className="text-red-400 text-xs font-medium">{error}</p>}
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl h-12 shadow-lg shadow-blue-600/20 transition-all text-sm">
              {mode === 'login' ? 'Sign In to Portal' : 'Create Account'}
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
    assignments: { cleaning: 12, diagnosis: 45, quiz: 8 },
    streak: 5
  });

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

  const handleLogout = () => {
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
                 {currentUser ? currentUser.name.slice(0,2).toUpperCase() : 'YA'}
               </button>
               <AnimatePresence>
                 {isProfileOpen && (
                   <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }}
                     className="absolute right-0 top-12 w-72 bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl z-50 overflow-hidden">
                     <div className="p-5 border-b border-slate-800">
                       <div className="flex items-center gap-3">
                         <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-black text-white">{currentUser ? currentUser.name.slice(0,2).toUpperCase() : 'YA'}</div>
                         <div>
                           <p className="font-black text-white text-sm">{currentUser?.name || 'Yaseen A.'}</p>
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
            {view === 'simulator' && <SimulationPage key="sim" onEarnXP={(amt) => setUserStats(s => ({ ...s, xp: s.xp + amt }))} />}
            {view === 'quests' && <QuestsPage key="quests" stats={userStats} />}
            {view === 'lab' && <VisionLabPage key="lab" />}
            {view === 'analytics' && <AnalyticsPage key="analytics" />}
            {view === 'records' && <RecordsPage key="records" />}
            {view === 'scheduler' && <SchedulerPage key="scheduler" />}
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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h3 className="text-3xl sm:text-4xl font-black tracking-tighter mb-2 text-white">Training Modules</h3>
          <p className="text-slate-200 font-medium text-sm sm:text-base">Select a case to begin diagnostic training.</p>
        </div>
        <div className="flex w-full sm:w-auto gap-4">
           <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <Input placeholder="Filter cases..." className="pl-12 rounded-2xl bg-slate-900 border-slate-800 w-full sm:w-64 text-slate-200" />
           </div>
           <Button className="rounded-2xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold"><Filter size={16} className="mr-2" /> Sort</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8">
        {caseLibrary.map((c) => (
          <motion.div key={c.id} whileHover={{ y: -8 }}>
            <Card onClick={() => setSelectedCase(c)} className="group cursor-pointer bg-slate-900/40 border-slate-800 hover:border-blue-500/50 rounded-[2rem] overflow-hidden shadow-2xl">
              <div className="h-48 relative">
                <img src={c.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-80" />
                <Badge className={`absolute bottom-4 left-4 border-0 font-black text-[10px] uppercase tracking-widest ${c.level === 'Beginner' ? 'bg-green-500' : c.level === 'Intermediate' ? 'bg-blue-500' : 'bg-red-500'}`}>{c.level}</Badge>
              </div>
              <CardContent className="p-6">
                <h4 className="text-xl font-bold mb-2 text-slate-100 group-hover:text-blue-400 transition-colors">{c.title}</h4>
                <p className="text-xs text-slate-300 font-bold uppercase tracking-widest mb-4">{c.type}</p>
                <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                  <span className="text-[10px] font-black text-slate-300">ID #{c.id}</span>
                  <div className="text-blue-500 font-black text-xs">+{c.points} XP</div>
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
  const [quizScore, setQuizScore] = useState(null);

  const handleSubmit = () => {
    setRevealed(true);
    onEarnXP(caseData.points);
  };

  if (quizActive) {
    return <CaseQuiz onFinish={(score) => { setQuizScore(score); setQuizActive(false); onEarnXP(score * 50); }} />;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-8 gap-6">
        <div className="flex items-center gap-4 sm:gap-6">
          <Button variant="outline" size="icon" onClick={onBack} className="rounded-2xl h-12 w-12 sm:h-14 sm:w-14 border-slate-800"><ArrowLeft size={18}/></Button>
          <h3 className="text-xl sm:text-3xl font-black tracking-tighter">{caseData.title}</h3>
        </div>
        <div className="flex w-full sm:w-auto gap-4">
          <Button variant="ghost" onClick={() => setMarked([])} className="flex-1 sm:flex-none text-slate-300 hover:text-white">Clear</Button>
          <Button onClick={handleSubmit} className="flex-[2] sm:flex-none bg-blue-600 hover:bg-blue-700 rounded-2xl h-12 sm:h-14 px-6 sm:px-10 font-black text-white">Submit Diagnosis</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-3">
          <Card className="rounded-[3rem] overflow-hidden bg-black relative shadow-2xl border-slate-800">
            <div className="relative aspect-video" onClick={(e) => {
              if(revealed) return;
              const rect = e.currentTarget.getBoundingClientRect();
              setMarked([...marked, { x: ((e.clientX - rect.left)/rect.width)*100, y: ((e.clientY - rect.top)/rect.height)*100, id: Date.now() }]);
            }}>
              <img src={caseData.image} className="w-full h-full object-cover opacity-80" />
              {marked.map(m => (
                <div key={m.id} className="absolute w-10 h-10 border-2 border-blue-500 rounded-full flex items-center justify-center -translate-x-1/2 -translate-y-1/2" style={{ left: `${m.x}%`, top: `${m.y}%` }}>
                  <div className="w-1 h-1 bg-blue-500 rounded-full" />
                </div>
              ))}
              {revealed && (
                <div className="absolute border-4 border-dashed border-green-500 bg-green-500/10 rounded-[3rem]" style={{ top: '35%', left: '45%', width: '15%', height: '25%' }}>
                   <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] font-black px-4 py-1 rounded-full whitespace-nowrap">MASTER DIAGNOSIS</div>
                </div>
              )}
            </div>
          </Card>
        </div>
        <div className="space-y-6">
           <Card className="rounded-[2rem] bg-slate-900 p-8 border-slate-800 shadow-2xl">
              <h4 className="text-xs font-black uppercase text-slate-300 mb-6">Simulation Hub</h4>
              <p className="text-sm font-medium mb-6 text-slate-200 leading-relaxed">Identify any anomalies in the enamel density. Mark suspicious regions to test accuracy.</p>
              <div className="space-y-2">
                 <div className="flex justify-between text-xs font-bold text-slate-300"><span>Progress</span><span>{marked.length}/4</span></div>
                 <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${(marked.length/4)*100}%` }} />
                 </div>
              </div>
           </Card>
           {revealed && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="bg-green-500/5 border border-green-500/20 p-6 rounded-[2rem]">
                  <span className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-2 block">Accuracy Result</span>
                  <h5 className="text-3xl font-black text-white mb-2">94%</h5>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">You identified the primary lesion with high precision.</p>
                </div>
                <Button onClick={() => setQuizActive(true)} className="w-full bg-blue-600/20 border border-blue-500/30 text-blue-400 font-bold rounded-2xl h-14 group">
                  Take Clinical Quiz <Sparkles className="ml-2 group-hover:rotate-12 transition-transform" size={16} />
                </Button>
                <Button className="w-full bg-white text-black font-black text-xs uppercase rounded-xl h-12" onClick={onBack}>Finish Case</Button>
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

function QuestsPage({ stats }) {
  const quests = [
    { title: "The Daily Quota", desc: "Perform 30 simulated cleanings for assignment completion.", progress: stats.assignments.cleaning, total: 30, xp: 500, icon: Sparkles },
    { title: "Diagnostic Master", desc: "Identify 50 pathologies with >90% accuracy.", progress: stats.assignments.diagnosis, total: 50, xp: 1200, icon: Target },
    { title: "Quiz Whiz", desc: "Complete 10 clinical quizzes with a perfect score.", progress: stats.assignments.quiz, total: 10, xp: 300, icon: BookOpen },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
       <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between border-b border-slate-800 pb-8 gap-6">
          <div>
            <h3 className="text-3xl sm:text-4xl font-black tracking-tighter mb-2 text-white">Quest Board</h3>
            <p className="text-slate-200 font-medium text-sm sm:text-base">Complete assignments to earn XP and unlock advanced modules.</p>
          </div>
          <div className="text-left sm:text-right w-full sm:w-auto">
             <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">Current Level</p>
             <span className="text-4xl sm:text-5xl font-black text-blue-500">{stats.level}</span>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {quests.map((q, i) => (
            <Card key={i} className="bg-slate-900 border-slate-800 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><q.icon size={80} /></div>
               <h4 className="text-2xl font-black mb-2 text-white">{q.title}</h4>
               <p className="text-sm text-slate-300 font-medium leading-relaxed mb-8">{q.desc}</p>
               <div className="space-y-4">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                     <span className="text-slate-300">Progress</span>
                     <span className="text-blue-500">{q.progress} / {q.total}</span>
                  </div>
                  <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                     <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${(q.progress/q.total)*100}%` }} />
                  </div>
                  <div className="pt-4 flex items-center justify-between">
                     <Badge className="bg-slate-800 text-slate-200 border-0">+{q.xp} XP</Badge>
                     {q.progress >= q.total && <Badge className="bg-green-500 text-white">CLAIMED</Badge>}
                  </div>
               </div>
            </Card>
          ))}
       </div>

       <Card className="rounded-[3rem] border-slate-800 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 p-12 text-center">
          <Sparkles className="text-blue-500 mx-auto mb-6" size={40} />
          <h4 className="text-3xl font-black mb-4 text-white">Dental Student Milestone</h4>
          <p className="max-w-xl mx-auto text-slate-200 font-medium leading-relaxed">
            Every simulation adds to your clinical quota. Reach level 15 to unlock the 
            <span className="text-white font-bold"> Advanced Pathology Segmentation</span> model.
          </p>
       </Card>
    </motion.div>
  );
}

// --- Vision Lab ---

function VisionLabPage() {
  const [mode, setMode] = useState('choice'); // choice, live, upload, result
  const [prediction, setPrediction] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
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
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/predict', { method: 'POST', body: formData });
      const result = await response.json();
      setPrediction(result);
    } catch (error) {
      setPrediction({ error: "Analysis Pipeline Interrupted" });
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
    return <AnalysisReportView prediction={prediction} isAnalyzing={isAnalyzing} image={previewUrl} onBack={() => setMode('choice')} />;
  }
}



function AnalysisReportView({ prediction, isAnalyzing, image, onBack }) {
  const [xai, setXai] = useState(false);

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
  // Re-balanced Validation Tier:
  // We lower the threshold slightly to allow for real-world variation in 'proper' teeth images,
  // while still maintaining a high bar for 'Healthy' (95%) and Pathologies (70%).
  const threshold = isHealthy ? 0.95 : 0.70;
  
  const sortedProbs = prediction?.all_probs ? Object.values(prediction.all_probs).sort((a,b) => b - a) : [];
  const confidenceGap = sortedProbs.length >= 2 ? (sortedProbs[0] - sortedProbs[1]) : 1;
  
  // Adaptive Entropy Check:
  // We allow more noise for pathologies but stay strict for 'Healthy' diagnoses.
  const noiseFloor = sortedProbs.slice(1).reduce((a, b) => a + b, 0);
  const isAmbiguous = isHealthy && noiseFloor > 0.08; // Max 8% noise for 'Healthy'
  
  const isValidDental = prediction?.confidence > threshold && confidenceGap > 0.15 && !isAmbiguous;

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
            <Card className="rounded-[3rem] overflow-hidden bg-black relative shadow-2xl border-slate-800 border-2 group">
              <img src={image} className={`w-full h-full object-contain aspect-video transition-all duration-700 ${xai ? 'opacity-40 grayscale blur-[2px]' : 'opacity-100'}`} />
              <AnimatePresence>
                {xai && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay" />
                    <div className="absolute top-1/3 left-1/2 w-32 h-32 bg-red-500/40 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-blue-500/40 rounded-full blur-3xl" />
                    <svg className="absolute inset-0 w-full h-full opacity-30">
                       <path d="M100 100 L300 200 L500 150" stroke="#3b82f6" strokeWidth="1" fill="none" />
                       <path d="M50 400 L250 350 L450 450" stroke="#3b82f6" strokeWidth="1" fill="none" />
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>
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

function RecordsPage() {
  const [selectedRecord, setSelectedRecord] = useState(null);

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

      <Card className="rounded-[3rem] bg-slate-900/40 backdrop-blur-2xl border-slate-800 overflow-hidden shadow-2xl">
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
            {pastRecords.map((r) => (
              <tr key={r.id} onClick={() => setSelectedRecord(r)} className="hover:bg-blue-600/5 transition-all cursor-pointer group">
                <td className="px-8 py-7 font-mono text-xs text-blue-400">{r.id}</td>
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
            ))}
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
                     <div key={t} className={`w-8 h-10 sm:w-10 sm:h-14 rounded-lg sm:rounded-xl border flex flex-col items-center justify-center gap-1 transition-all hover:scale-110 cursor-help ${t === 3 ? 'bg-red-500/20 border-red-500/40' : 'bg-slate-800 border-slate-700'}`}>
                        <span className="text-[7px] sm:text-[8px] font-black text-slate-300">{t}</span>
                        <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${t === 3 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-slate-600'}`} />
                     </div>
                   ))}
                </div>
                
                <div className="h-px bg-slate-800 w-full relative">
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#020617] px-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">Occlusal Plane</div>
                </div>

                {/* Lower Arch */}
                <div className="flex justify-start sm:justify-center gap-1 sm:gap-2 min-w-max px-4">
                   {lowerTeeth.map(t => (
                     <div key={t} className="w-8 h-10 sm:w-10 sm:h-14 rounded-lg sm:rounded-xl border bg-slate-800 border-slate-700 flex flex-col items-center justify-center gap-1 transition-all hover:scale-110 cursor-help">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-slate-600" />
                        <span className="text-[7px] sm:text-[8px] font-black text-slate-300">{t}</span>
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

function SchedulerPage() {
  const appointments = [
    { time: "09:00 AM", patient: "Marcus Aurelius", procedure: "Caries Removal", status: "In-Progress" },
    { time: "11:30 AM", patient: "Seneca", procedure: "Routine Cleaning", status: "Confirmed" },
    { time: "02:00 PM", patient: "Epictetus", procedure: "Endodontic Evaluation", status: "Pending" },
    { time: "04:30 PM", patient: "Hadrian", procedure: "Radiographic Scan", status: "Confirmed" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 sm:space-y-12">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-3xl sm:text-4xl font-black text-white">Daily Schedule</h3>
          <Button className="bg-blue-600 rounded-2xl h-14 px-8 font-bold w-full sm:w-auto">+ New Appointment</Button>
       </div>
       <div className="grid grid-cols-1 gap-6">
          {appointments.map((a, i) => (
            <Card key={i} className="bg-slate-900/50 border-slate-800 p-8 rounded-[2.5rem] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 group hover:border-blue-500/30 transition-all">
               <div className="flex items-center gap-8">
                  <div className="text-2xl font-black text-blue-500">{a.time}</div>
                  <div>
                     <h4 className="text-xl font-bold text-white mb-1">{a.patient}</h4>
                     <p className="text-xs text-slate-300 font-medium uppercase tracking-widest">{a.procedure}</p>
                  </div>
               </div>
               <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                  <Badge variant="outline" className={a.status === 'In-Progress' ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-800 text-slate-300'}>{a.status}</Badge>
                  <Button variant="ghost" className="text-slate-300 hover:text-white"><ExternalLink size={20} /></Button>
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
