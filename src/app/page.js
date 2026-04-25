"use client";

import { useState, useRef, useEffect } from 'react';
import { 
  Activity, BookOpen, Settings, Mic, MessageSquare, X, Send, Video, Upload,
  RefreshCw, CheckCircle2, AlertCircle, ArrowRight, BrainCircuit, ShieldCheck,
  BarChart3, Brain, Info, Target, Download, ExternalLink, Printer, Layers, UploadCloud, Loader2, Clock, ArrowLeft,
  User, Database, FileText, Zap, Sparkles, Camera, History, Microscope, GraduationCap, Bell, Search, Filter, Cpu, Globe, Sliders
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
  { id: 102, title: "Advanced Periodontitis", level: "Intermediate", points: 300, image: "https://images.unsplash.com/photo-1593054941142-5507cca46654?auto=format&fit=crop&w=800&q=80", type: "Clinical Photo" },
  { id: 103, title: "Third Molar Impaction", level: "Advanced", points: 500, image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80", type: "CBCT" },
  { id: 104, title: "Enamel Hypoplasia", level: "Intermediate", points: 250, image: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=800&q=80", type: "Clinical Photo" },
];

const pastRecords = [
  { id: "RS-8821", date: "2024-05-12", patient: "Marcus Aurelius", findings: "Moderate Caries", status: "Verified", accuracy: "98%" },
  { id: "RS-8822", date: "2024-05-14", patient: "Seneca the Elder", findings: "Healthy", status: "Verified", accuracy: "99%" },
  { id: "RS-8823", date: "2024-05-15", patient: "Guest Patient", findings: "Severe Gingivitis", status: "Pending", accuracy: "87%" },
  { id: "RS-8824", date: "2024-05-18", patient: "Epictetus", findings: "Calculus Build-up", status: "Verified", accuracy: "94%" },
];

// --- Core Application Wrapper ---

export default function RootSenseAI() {
  const [view, setView] = useState('landing'); // landing, simulator, lab, quests, analytics, records, scheduler, inventory, settings, config
  const [isChatOpen, setIsChatOpen] = useState(false);
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
          // Improved parsing for discrete GPUs
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

  if (view === 'landing') {
    return <LandingPage onEnter={() => setView('simulator')} />;
  }

  return (
    <div className="flex h-screen bg-[#020617] text-slate-100 font-sans selection:bg-blue-500/30 overflow-hidden">
      {/* Sidebar Navigation */}
      <motion.aside 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-72 bg-slate-900/40 border-r border-slate-800 p-8 flex flex-col z-30"
      >
        <div className="flex items-center gap-3 mb-12">
          <div className="bg-blue-600 p-2 rounded-2xl shadow-2xl shadow-blue-600/20">
            <Microscope size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter">RootSense<span className="text-blue-500">AI</span></h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Medical Lab v2.4</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1.5 flex-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-4 opacity-70">Education</p>
          <SidebarLink active={view === 'simulator'} onClick={() => setView('simulator')} icon={GraduationCap} label="Simulation Lab" />
          <SidebarLink active={view === 'quests'} onClick={() => setView('quests')} icon={Target} label="Quest Board" />
          <SidebarLink active={view === 'analytics'} onClick={() => setView('analytics')} icon={BarChart3} label="My Progress" />
          
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-8 mb-2 px-4 opacity-70">Diagnostics</p>
          <SidebarLink active={view === 'lab'} onClick={() => setView('lab')} icon={Zap} label="Live Learning" />
          <SidebarLink active={view === 'records'} onClick={() => setView('records')} icon={History} label="Case Records" />
          
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-8 mb-2 px-4 opacity-70">Clinic Management</p>
          <SidebarLink active={view === 'scheduler'} onClick={() => setView('scheduler')} icon={Clock} label="Scheduler" />
          <SidebarLink active={view === 'inventory'} onClick={() => setView('inventory')} icon={Database} label="Inventory" />
          
          <div className="mt-auto pt-8 border-t border-slate-800 space-y-1">
            <SidebarLink active={view === 'settings'} onClick={() => setView('settings')} icon={Settings} label="Preferences" />
            <SidebarLink active={view === 'config'} onClick={() => setView('config')} icon={Cpu} label="System Config" />
          </div>
        </nav>
      </motion.aside>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 border-b border-slate-800 bg-slate-950/50 backdrop-blur-xl flex items-center justify-between px-10 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-300">
              {view === 'simulator' && "Simulator / Clinical Training"}
              {view === 'quests' && "Assignments / Quest Board"}
              {view === 'lab' && "Live Lab / Real-time Detection"}
              {view === 'analytics' && "Student Metrics / Growth"}
              {view === 'records' && "Archive / Patient Records"}
              {view === 'scheduler' && "Appointment / Schedule Management"}
              {view === 'inventory' && "Supplies / Stock Control"}
              {view === 'settings' && "Account / UI Settings"}
              {view === 'config' && "Model / Hardware Config"}
            </h2>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex flex-col items-end mr-4">
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Level {userStats.level}</span>
                <span className="text-xs font-bold text-slate-400">{userStats.xp} XP</span>
             </div>
             <div className="relative group">
                <Bell size={18} className="text-slate-400 group-hover:text-white transition-colors cursor-pointer" />
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full border-2 border-[#020617]" />
             </div>
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center border border-white/10 shadow-lg font-black text-xs cursor-pointer">YA</div>
          </div>
        </header>

        <main className="flex-1 p-10 overflow-y-auto overflow-x-hidden relative">
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
      <div className="fixed bottom-10 right-10 z-50">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}>
              <ChatInterface onClose={() => setIsChatOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`h-16 w-16 rounded-[2rem] shadow-2xl transition-all duration-500 flex items-center justify-center ${isChatOpen ? 'bg-red-500 rotate-90' : 'bg-blue-600'}`}
        >
          {isChatOpen ? <X size={28} /> : <MessageSquare size={28} />}
        </motion.button>
      </div>
    </div>
  );
}

// --- Sidebar Helper ---

function SidebarLink({ active, onClick, icon: Icon, label }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${active ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'}`}
    >
      <Icon size={18} className={active ? "text-white" : "text-slate-400 group-hover:text-blue-400 transition-colors"} />
      <span className="font-bold text-sm tracking-tight">{label}</span>
      {active && <motion.div layoutId="active-nav" className="ml-auto w-1 h-4 rounded-full bg-white/80" />}
    </button>
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
          <p className="max-w-2xl text-slate-300 text-xl font-medium mb-12">
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
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-4xl font-black tracking-tighter mb-2">Training Modules</h3>
          <p className="text-slate-300 font-medium">Select a case to begin diagnostic training.</p>
        </div>
        <div className="flex gap-4">
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <Input placeholder="Filter cases..." className="pl-12 rounded-2xl bg-slate-900 border-slate-800 w-64 text-slate-200 placeholder:text-slate-500" />
           </div>
           <Button variant="outline" className="rounded-2xl border-slate-800 text-slate-300 hover:text-white"><Filter size={16} className="mr-2" /> Sort</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-4">{c.type}</p>
                <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                  <span className="text-[10px] font-black text-slate-400">ID #{c.id}</span>
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
      <div className="flex items-center justify-between border-b border-slate-800 pb-8">
        <div className="flex items-center gap-6">
          <Button variant="outline" size="icon" onClick={onBack} className="rounded-2xl h-14 w-14 border-slate-800"><ArrowLeft size={20}/></Button>
          <h3 className="text-3xl font-black tracking-tighter">{caseData.title}</h3>
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" onClick={() => setMarked([])} className="text-slate-400 hover:text-white">Clear</Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 rounded-2xl h-14 px-10 font-black">Submit Diagnosis</Button>
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
              <h4 className="text-xs font-black uppercase text-slate-400 mb-6">Simulation Hub</h4>
              <p className="text-sm font-medium mb-6">Identify any anomalies in the enamel density. Mark suspicious regions to test accuracy.</p>
              <div className="space-y-2">
                 <div className="flex justify-between text-xs font-bold text-slate-400"><span>Progress</span><span>{marked.length}/4</span></div>
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
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">You identified the primary lesion with high precision.</p>
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
  const questions = [
    { q: "What is the primary indicator of demineralization in this radiograph?", a: ["Radiolucency", "Radiopacity", "Trabecular thickening"], correct: 0 },
    { q: "Which classification best fits this lesion?", a: ["Class I", "Class II", "Class III"], correct: 1 }
  ];
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);

  const answer = (i) => {
    const newScore = i === questions[idx].correct ? score + 1 : score;
    if (idx < questions.length - 1) {
      setScore(newScore);
      setIdx(idx + 1);
    } else {
      onFinish(newScore);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-20 text-center space-y-12">
      <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">Clinical Challenge</Badge>
      <h3 className="text-4xl font-black">{questions[idx].q}</h3>
      <div className="grid grid-cols-1 gap-4">
        {questions[idx].a.map((opt, i) => (
          <Button key={i} onClick={() => answer(i)} variant="outline" className="h-20 rounded-3xl border-slate-800 text-lg font-bold hover:bg-blue-600 hover:border-blue-600 transition-all">{opt}</Button>
        ))}
      </div>
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
       <div className="flex items-end justify-between border-b border-slate-800 pb-8">
          <div>
            <h3 className="text-4xl font-black tracking-tighter mb-2 text-white">Quest Board</h3>
            <p className="text-slate-300 font-medium">Complete assignments to earn XP and unlock advanced modules.</p>
          </div>
          <div className="text-right">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Current Level</p>
             <span className="text-5xl font-black text-blue-500">{stats.level}</span>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {quests.map((q, i) => (
            <Card key={i} className="bg-slate-900 border-slate-800 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><q.icon size={80} /></div>
               <h4 className="text-2xl font-black mb-2 text-white">{q.title}</h4>
               <p className="text-sm text-slate-400 font-medium leading-relaxed mb-8">{q.desc}</p>
               <div className="space-y-4">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                     <span className="text-slate-400">Progress</span>
                     <span className="text-blue-500">{q.progress} / {q.total}</span>
                  </div>
                  <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                     <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${(q.progress/q.total)*100}%` }} />
                  </div>
                  <div className="pt-4 flex items-center justify-between">
                     <Badge className="bg-slate-800 text-slate-300 border-0">+{q.xp} XP</Badge>
                     {q.progress >= q.total && <Badge className="bg-green-500 text-white">CLAIMED</Badge>}
                  </div>
               </div>
            </Card>
          ))}
       </div>

       <Card className="rounded-[3rem] border-slate-800 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 p-12 text-center">
          <Sparkles className="text-blue-500 mx-auto mb-6" size={40} />
          <h4 className="text-3xl font-black mb-4 text-white">Dental Student Milestone</h4>
          <p className="max-w-xl mx-auto text-slate-300 font-medium leading-relaxed">
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
  const [useWebcam, setUseWebcam] = useState(false);

  if (mode === 'choice') {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="h-full flex flex-col justify-center">
        <div className="text-center mb-16">
          <h3 className="text-5xl font-black tracking-tighter mb-4 text-white">Laboratory Entry</h3>
          <p className="text-slate-400 text-xl font-medium">Select a capture method for neural analysis.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto w-full">
          <div onClick={() => setMode('live')} className="cursor-pointer p-10 bg-slate-900 border border-slate-800 rounded-[3rem] hover:border-blue-500/30 transition-all shadow-2xl relative overflow-hidden group">
            <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-xl"><Camera className="text-white" /></div>
            <h4 className="text-3xl font-black mb-4 text-white">Live Mouth Scanning</h4>
            <p className="text-slate-300 font-medium leading-relaxed mb-8">Real-time dental tracking for clinical instruction or live subject analysis.</p>
            <div className="text-blue-500 font-black text-xs uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">Start Camera <ArrowRight size={16} /></div>
          </div>
          <div onClick={() => setMode('upload')} className="cursor-pointer p-10 bg-slate-900 border border-slate-800 rounded-[3rem] hover:border-blue-500/30 transition-all shadow-2xl relative overflow-hidden group">
            <div className="bg-slate-700 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-xl"><UploadCloud className="text-white" /></div>
            <h4 className="text-3xl font-black mb-4 text-white">Radiograph Intake</h4>
            <p className="text-slate-300 font-medium leading-relaxed mb-8">Upload DICOM/PNG/JPG files for deep learning segmentation and report generation.</p>
            <div className="text-slate-400 font-black text-xs uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">Upload File <ArrowRight size={16} /></div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (mode === 'live') {
    return (
      <div className="h-full space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center justify-between border-b border-slate-800 pb-8">
          <div className="flex items-center gap-6">
            <Button variant="outline" size="icon" onClick={() => setMode('choice')} className="rounded-2xl h-14 w-14 border-slate-800"><ArrowLeft size={20}/></Button>
            <h3 className="text-3xl font-black tracking-tighter">Live Learning</h3>
          </div>
          <Button onClick={() => setMode('result')} className="bg-blue-600 hover:bg-blue-700 rounded-2xl h-14 px-10 font-black shadow-xl">Capture & Analyze</Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3">
             <Card className="rounded-[3rem] overflow-hidden bg-black aspect-video relative shadow-2xl border-slate-800">
                <Webcam audio={false} className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 border-[30px] border-black/10 flex flex-col justify-between p-8 pointer-events-none">
                  <div className="flex justify-between">
                    <div className="h-16 w-16 border-t-4 border-l-4 border-blue-500/40 rounded-tl-3xl" />
                    <div className="h-16 w-16 border-t-4 border-r-4 border-blue-500/40 rounded-tr-3xl" />
                  </div>
                  <div className="flex justify-between">
                    <div className="h-16 w-16 border-b-4 border-l-4 border-blue-500/40 rounded-bl-3xl" />
                    <div className="h-16 w-16 border-b-4 border-r-4 border-blue-500/40 rounded-br-3xl" />
                  </div>
                </div>
             </Card>
          </div>
          <div className="space-y-6">
            <Card className="rounded-[2rem] bg-slate-900/50 p-8 border-slate-800 shadow-2xl">
              <h4 className="text-[10px] font-black uppercase text-slate-500 mb-6 tracking-widest">Sensor Logs</h4>
              <div className="space-y-4">
                 <div className="flex justify-between items-center text-xs"><span className="text-slate-400">Latent Clock</span><span className="text-blue-500 font-bold">84ms</span></div>
                 <div className="flex justify-between items-center text-xs"><span className="text-slate-400">FPS</span><span className="text-blue-500 font-bold">60.2</span></div>
                 <div className="flex justify-between items-center text-xs"><span className="text-slate-400">Model Load</span><span className="text-green-500 font-bold">Stable</span></div>
              </div>
            </Card>
            <div className="bg-blue-600 p-8 rounded-[2rem] shadow-2xl shadow-blue-600/20">
               <Sparkles className="text-white mb-4" />
               <p className="text-sm font-bold leading-relaxed text-white">AI Suggestion: Focusing on molar occlusion reveals early plaque accumulation.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'upload') {
    return (
      <div className="h-full flex flex-col justify-center max-w-4xl mx-auto w-full animate-in fade-in duration-500">
        <div className="flex items-center justify-between mb-12">
           <h3 className="text-4xl font-black text-white">Intake Hub</h3>
           <Button variant="outline" size="icon" onClick={() => setMode('choice')} className="rounded-2xl h-14 w-14 border-slate-800"><X size={20}/></Button>
        </div>
        <Card className="bg-slate-900 border-slate-800 rounded-[3rem] p-20 text-center cursor-pointer hover:bg-slate-800 transition-all group" onClick={() => setMode('result')}>
           <UploadCloud size={60} className="text-blue-500 mx-auto mb-8 group-hover:scale-110 transition-transform" />
           <h4 className="text-2xl font-black mb-2">Click to select dental scan</h4>
           <p className="text-slate-400 font-medium">DICOM, PNG, or JPG (max 25MB)</p>
        </Card>
      </div>
    );
  }

  if (mode === 'result') {
    return <AnalysisReportView onBack={() => setMode('choice')} />;
  }
}

function AnalysisReportView({ onBack }) {
  const [xai, setXai] = useState(false);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
      <div className="flex items-center justify-between border-b border-slate-800 pb-10">
         <div className="flex items-center gap-6">
           <Button variant="outline" size="icon" onClick={onBack} className="rounded-2xl h-14 w-14 border-slate-800"><ArrowLeft size={20}/></Button>
           <h3 className="text-3xl font-black">Diagnosis Verified</h3>
         </div>
         <Badge className="bg-green-500/10 text-green-500 border-green-500/20 px-6 py-3 rounded-2xl font-black">98.4% Precision</Badge>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
           <Card className="rounded-[3rem] overflow-hidden bg-black relative shadow-2xl border-slate-800 aspect-video">
              <img src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1200&q=80" className={`w-full h-full object-cover transition-all duration-1000 ${xai ? 'opacity-40 grayscale' : 'opacity-80'}`} />
              {xai && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-[35%] left-[45%] w-[20%] h-[30%] bg-red-600/60 blur-[50px] rounded-full mix-blend-screen" />
                </div>
              )}
              <div className="absolute bottom-8 left-8 flex gap-4 bg-slate-900/80 backdrop-blur-xl p-4 rounded-2xl border border-white/5">
                 <Button variant={!xai ? "secondary" : "ghost"} size="sm" className="rounded-xl px-6 font-black text-[10px]" onClick={() => setXai(false)}>MARKERS</Button>
                 <Button variant={xai ? "secondary" : "ghost"} size="sm" className="rounded-xl px-6 font-black text-[10px]" onClick={() => setXai(true)}>XAI HEATMAP</Button>
              </div>
           </Card>
        </div>
        <div className="space-y-6">
           <Card className="rounded-[2rem] bg-slate-900 p-10 border-slate-800">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Findings Log</h4>
              <div className="space-y-6">
                 <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl">
                    <h5 className="font-black text-red-500 text-xs uppercase mb-1">Caries Found</h5>
                    <p className="text-[10px] text-slate-300 font-medium">Distal surface of tooth #3. Demineralization index: 0.84.</p>
                 </div>
                 <div className="p-5 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
                    <h5 className="font-black text-blue-500 text-xs uppercase mb-1">Gingival State</h5>
                    <p className="text-[10px] text-slate-300 font-medium">Marginal tissue healthy. No signs of pocketing.</p>
                 </div>
              </div>
           </Card>
           <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-3xl h-16 font-black shadow-xl" onClick={onBack}>New Case Intake</Button>
        </div>
      </div>
    </motion.div>
  );
}

// --- Growth Records Page ---

function RecordsPage() {
  const [selectedRecord, setSelectedRecord] = useState(null);

  if (selectedRecord) {
    return <PatientRecordDetails record={selectedRecord} onBack={() => setSelectedRecord(null)} />;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-4xl font-black tracking-tighter text-white">Archive Vault</h3>
        <div className="flex gap-4">
           <Input placeholder="Search records..." className="rounded-2xl bg-slate-900 border-slate-800 w-64" />
           <Button variant="outline" className="rounded-2xl border-slate-800 text-slate-300 hover:text-white"><Search size={16}/></Button>
        </div>
      </div>
      <Card className="rounded-[2.5rem] bg-slate-900/40 border-slate-800 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-950/50 border-b border-slate-800">
            <tr>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Record ID</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Subject</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Finding</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Precision</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {pastRecords.map((r) => (
              <tr key={r.id} onClick={() => setSelectedRecord(r)} className="hover:bg-slate-800/30 transition-colors cursor-pointer group">
                <td className="px-8 py-6 font-mono text-xs text-blue-400">{r.id}</td>
                <td className="px-8 py-6 text-sm font-medium text-slate-300">{r.date}</td>
                <td className="px-8 py-6 text-sm font-bold text-slate-200">{r.patient}</td>
                <td className="px-8 py-6">
                   <Badge variant="outline" className={r.findings === 'Healthy' ? 'text-green-500 border-green-500/20 bg-green-500/5' : 'text-red-500 border-red-500/20 bg-red-500/5'}>
                    {r.findings}
                   </Badge>
                </td>
                <td className="px-8 py-6 text-sm font-black text-slate-200">{r.accuracy}</td>
                <td className="px-8 py-6 text-right"><Button variant="ghost" size="sm" className="text-slate-400 group-hover:text-blue-500 group-hover:scale-110 transition-all"><ExternalLink size={16}/></Button></td>
              </tr>
            ))}
          </tbody>
        </table>
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
            <p className="text-slate-400 font-medium">Record ID: {record.id} • Last Visit: {record.date}</p>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <Card className="lg:col-span-2 bg-slate-900/50 border-slate-800 p-12 rounded-[3rem] shadow-2xl">
             <h4 className="text-xs font-black uppercase text-slate-500 mb-12 tracking-widest text-center">Interactive Dental Chart</h4>
             
             <div className="space-y-16">
                {/* Upper Arch */}
                <div className="flex justify-center gap-2">
                   {upperTeeth.map(t => (
                     <div key={t} className={`w-10 h-14 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all hover:scale-110 cursor-help ${t === 3 ? 'bg-red-500/20 border-red-500/40' : 'bg-slate-800 border-slate-700'}`}>
                        <span className="text-[8px] font-black text-slate-500">{t}</span>
                        <div className={`w-3 h-3 rounded-full ${t === 3 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-slate-600'}`} />
                     </div>
                   ))}
                </div>
                
                <div className="h-px bg-slate-800 w-full relative">
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#020617] px-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">Occlusal Plane</div>
                </div>

                {/* Lower Arch */}
                <div className="flex justify-center gap-2">
                   {lowerTeeth.map(t => (
                     <div key={t} className="w-10 h-14 rounded-xl border bg-slate-800 border-slate-700 flex flex-col items-center justify-center gap-1 transition-all hover:scale-110 cursor-help">
                        <div className="w-3 h-3 rounded-full bg-slate-600" />
                        <span className="text-[8px] font-black text-slate-500">{t}</span>
                     </div>
                   ))}
                </div>
             </div>

             <div className="mt-12 flex justify-center gap-6">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500" /> <span className="text-[10px] font-bold text-slate-400">CARIES</span></div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500" /> <span className="text-[10px] font-bold text-slate-400">RESTORATION</span></div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-600" /> <span className="text-[10px] font-bold text-slate-400">HEALTHY</span></div>
             </div>
          </Card>

          <div className="space-y-6">
             <Card className="bg-slate-900 p-8 rounded-[2rem] border-slate-800">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Clinical History</h4>
                <div className="space-y-4">
                   <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
                      <p className="text-xs font-bold text-white mb-1">Tooth #3: MOD Restoration</p>
                      <p className="text-[10px] text-slate-400">Composite resin filling applied. Margins intact.</p>
                   </div>
                   <div className="p-4 bg-red-500/5 rounded-2xl border border-red-500/10">
                      <p className="text-xs font-bold text-red-400 mb-1">Tooth #18: Distal Caries</p>
                      <p className="text-[10px] text-slate-400">Requires Class II preparation and restoration.</p>
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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
       <div className="flex justify-between items-center">
          <h3 className="text-4xl font-black text-white">Daily Schedule</h3>
          <Button className="bg-blue-600 rounded-2xl h-14 px-8 font-bold">+ New Appointment</Button>
       </div>
       <div className="grid grid-cols-1 gap-6">
          {appointments.map((a, i) => (
            <Card key={i} className="bg-slate-900/50 border-slate-800 p-8 rounded-[2.5rem] flex items-center justify-between group hover:border-blue-500/30 transition-all">
               <div className="flex items-center gap-8">
                  <div className="text-2xl font-black text-blue-500">{a.time}</div>
                  <div>
                     <h4 className="text-xl font-bold text-white mb-1">{a.patient}</h4>
                     <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">{a.procedure}</p>
                  </div>
               </div>
               <div className="flex items-center gap-6">
                  <Badge variant="outline" className={a.status === 'In-Progress' ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-800 text-slate-400'}>{a.status}</Badge>
                  <Button variant="ghost" className="text-slate-500 hover:text-white"><ExternalLink size={20} /></Button>
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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
       <div className="flex justify-between items-center">
          <h3 className="text-4xl font-black text-white">Supplies & Inventory</h3>
          <Button variant="outline" className="border-slate-800 rounded-2xl h-14 px-8 font-bold">Order Supplies</Button>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stock.map((item, i) => (
            <Card key={i} className="bg-slate-900 border-slate-800 p-8 rounded-[3rem] shadow-2xl">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Stock Unit</p>
               <h4 className="text-xl font-black mb-6 text-white leading-tight">{item.name}</h4>
               <div className="flex items-end justify-between">
                  <span className={`text-3xl font-black ${item.status === 'Critical' ? 'text-red-500' : item.status === 'Low Stock' ? 'text-orange-500' : 'text-blue-500'}`}>{item.stock}</span>
                  <Badge variant="outline" className="border-slate-800 text-slate-400">{item.status}</Badge>
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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[
          { label: "Total Diagnoses", value: "142", trend: "+12", icon: Activity, color: "text-white" },
          { label: "Precision Rate", value: "92.4%", trend: "+2.1", icon: ShieldCheck, color: "text-blue-500" },
          { label: "Avg Session", value: "14m", trend: "-2m", icon: Clock, color: "text-green-500" },
          { label: "Global Rank", value: "#42", trend: "+10", icon: Globe, color: "text-orange-500" },
        ].map((s, i) => (
          <Card key={i} className="bg-slate-900/40 border-slate-800 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-125 transition-transform duration-700">
               <s.icon size={100} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{s.label}</p>
            <div className="flex items-end justify-between relative z-10">
              <span className={`text-4xl font-black tracking-tighter ${s.color}`}>{s.value}</span>
              <span className="text-[10px] font-bold text-slate-300 bg-slate-800 px-3 py-1 rounded-full">{s.trend}</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <Card className="lg:col-span-2 rounded-[3rem] border-slate-800 bg-slate-900/40 p-12 shadow-2xl h-[450px]">
          <h4 className="text-xs font-black uppercase text-slate-500 mb-10 tracking-[0.2em]">Diagnostic Proficiency / 6 Months</h4>
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
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '1rem' }} />
                <Area type="monotone" dataKey="accuracy" stroke="#3b82f6" strokeWidth={4} fill="url(#areaG)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="rounded-[3rem] border-slate-800 bg-slate-900/40 p-12 shadow-2xl flex flex-col items-center justify-center">
           <h4 className="text-xs font-black uppercase text-slate-500 mb-8 tracking-[0.2em] w-full text-left">Pathology Dist.</h4>
           <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pathologyDistribution} innerRadius={60} outerRadius={80} paddingAngle={10} dataKey="value">
                    {pathologyDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '1rem' }} />
                </PieChart>
              </ResponsiveContainer>
           </div>
           <div className="grid grid-cols-2 gap-4 w-full mt-6">
              {pathologyDistribution.map((p) => (
                <div key={p.name} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{p.name}</span>
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
          <p className="text-slate-300 font-medium">Customize your RootSense portal experience.</p>
       </div>
       <div className="space-y-10">
          <section className="space-y-6">
             <h4 className="text-xs font-black uppercase text-blue-500 tracking-widest">Interface Settings</h4>
             <div className="space-y-4">
                <div className="flex items-center justify-between p-6 bg-slate-900/50 rounded-3xl border border-slate-800">
                   <div>
                      <p className="font-bold mb-1 text-white">Ultra-High Precision Mode</p>
                      <p className="text-xs text-slate-400">Enable deep-gradient pixel analysis for radiographs.</p>
                   </div>
                   <div className="w-12 h-6 bg-blue-600 rounded-full flex items-center px-1 shadow-inner"><div className="w-4 h-4 bg-white rounded-full translate-x-6" /></div>
                </div>
                <div className="flex items-center justify-between p-6 bg-slate-900/50 rounded-3xl border border-slate-800">
                   <div>
                      <p className="font-bold mb-1 text-white">Dynamic Hud Overlays</p>
                      <p className="text-xs text-slate-400">Show floating AI markers in live camera mode.</p>
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
                      <p className="text-xs text-slate-400">Enable real-time data sync with secondary dental displays.</p>
                   </div>
                </div>
                <Button variant="outline" className="rounded-xl border-slate-700">Configure Sync</Button>
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
            <p className="text-slate-300 font-medium">Manage backend AI weights and hardware acceleration.</p>
          </div>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-slate-900/50 border-slate-800 p-8 rounded-[2.5rem]">
             <h4 className="text-xs font-black uppercase text-slate-400 mb-8 tracking-widest">Active Model Weights</h4>
             <div className="space-y-6">
                <div className="flex justify-between items-center py-3 border-b border-slate-800"><span className="text-sm font-medium text-slate-300">Segmentation Model</span><span className="text-blue-500 font-bold">U-Net-V4-Stable</span></div>
                <div className="flex justify-between items-center py-3 border-b border-slate-800"><span className="text-sm font-medium text-slate-300">Classification Weights</span><span className="text-blue-500 font-bold">ResNet50-Dent-X</span></div>
                <div className="flex justify-between items-center py-3 border-b border-slate-800"><span className="text-sm font-medium text-slate-300">XAI Gradient Map</span><span className="text-blue-500 font-bold">GradCAM++</span></div>
                <Button className="w-full mt-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl h-12 font-bold">Update Weights</Button>
             </div>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800 p-8 rounded-[2.5rem]">
             <h4 className="text-xs font-black uppercase text-slate-400 mb-8 tracking-widest">Hardware Metrics</h4>
             <div className="space-y-8">
                <div className="space-y-3">
                   <div className="flex justify-between text-xs font-bold text-slate-300"><span>GPU Utilization (Inference)</span><span>24%</span></div>
                   <div className="h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-blue-500 w-[24%]" /></div>
                </div>
                <div className="space-y-3">
                   <div className="flex justify-between text-xs font-bold text-slate-300"><span>Neural Cache</span><span>1.2 GB</span></div>
                   <div className="h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-green-500 w-[60%]" /></div>
                </div>
                <div className="p-4 bg-blue-600/5 border border-blue-500/20 rounded-2xl">
                   <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">Compute Status</p>
                   <p className="text-xs text-slate-300 font-medium">Accelerator detected: {gpuInfo}</p>
                </div>
             </div>
          </Card>
       </div>
    </motion.div>
  );
}

// --- Chat Interface ---

function ChatInterface({ onClose }) {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Diagnostic Assistant initialized. How can I assist you with this clinical session?' }
  ]);
  const [input, setInput] = useState('');

  const send = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', text: input }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', text: 'The structural loss visible in the cervical region indicates potential abrasion. Clinical correlation is advised.' }]);
    }, 1000);
  };

  return (
    <Card className="absolute bottom-24 right-0 w-[420px] shadow-[0_50px_100px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden rounded-[3rem] border-slate-800 bg-slate-950/90 backdrop-blur-3xl">
      <div className="p-8 bg-blue-600 text-white flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <span className="font-black text-sm uppercase tracking-widest">Neural Assistant</span>
            <div className="flex items-center gap-1.5 mt-0.5 opacity-70">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] font-bold">Engine V2.4 Active</span>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="hover:bg-white/10 p-2.5 rounded-2xl transition-all"><X size={24} /></button>
      </div>
      <div className="h-[450px] overflow-y-auto p-8 flex flex-col gap-6 scrollbar-hide">
        {messages.map((m, i) => (
          <div key={i} className={`max-w-[85%] px-6 py-4 rounded-[2rem] text-sm leading-relaxed shadow-xl ${m.role === 'ai' ? 'bg-slate-900 border border-slate-800 self-start rounded-tl-none text-slate-300 font-medium' : 'bg-blue-600 text-white self-end rounded-tr-none font-bold'}`}>
            {m.text}
          </div>
        ))}
      </div>
      <div className="p-8 bg-slate-900/50 border-t border-slate-800 flex gap-4 items-center">
        <Button variant="ghost" size="icon" className="rounded-2xl h-14 w-14 bg-slate-900 border border-slate-800 text-slate-300"><Mic size={20}/></Button>
        <Input 
          placeholder="Query neural reasoning..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          className="rounded-[1.5rem] h-14 px-6 border-slate-800 bg-slate-950 outline-none text-sm font-bold text-slate-200 placeholder:text-slate-500"
        />
        <Button onClick={send} size="icon" className="rounded-2xl h-14 w-14 bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/20 shrink-0"><Send size={20}/></Button>
      </div>
    </Card>
  );
}
