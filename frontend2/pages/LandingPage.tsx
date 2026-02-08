
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, ArrowRight, ShieldCheck, Activity, Award, Globe, Lock, BrainCircuit,
  CheckCircle2, LineChart, Quote, Twitter, Instagram, Youtube, Facebook,
  Sparkles, School, User, Rocket, Search, FileCheck, ArrowLeft, Mail, Github, Linkedin, UserCircle,
  Database, Cpu, Menu, X
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import FloatingCard from '../components/FloatingCard';
import QuickStartModal from '../components/QuickStartModal';
const PROJECT_KEYWORDS = [
  { name: 'Neural Parsing', icon: <Cpu className="w-5 h-5" /> },
  { name: 'Cognitive Velocity', icon: <Activity className="w-5 h-5" /> },
  { name: 'Zero-Guess Protocol', icon: <ShieldCheck className="w-5 h-5" /> },
  { name: 'AI Synthesis', icon: <BrainCircuit className="w-5 h-5" /> },
  { name: 'Global Rigor', icon: <Globe className="w-5 h-5" /> },
  { name: 'Deep Verification', icon: <Zap className="w-5 h-5" /> },
];


const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8 }
};

const floatAnimation = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const iconBounce = {
  animate: {
    scale: [1, 1.1, 1],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const steps = [
  { title: "Select Context", desc: "Upload docs or enter a syllabus to define the domain.", icon: <Search /> },
  { title: "Generate Probes", desc: "AI creates dynamic cognitive verification paths.", icon: <Sparkles /> },
  { title: "Verify Understanding", desc: "Real-time adaptive loops probe deep comprehension.", icon: <FileCheck /> },
  { title: "Map Mastery", desc: "Visualize cognitive growth through dynamic velocity graphs.", icon: <LineChart /> },
];

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [showGuide, setShowGuide] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen font-outfit text-slate-900 bg-white selection:bg-blue-100">
      <QuickStartModal isOpen={showGuide} onClose={() => setShowGuide(false)} />

      {/* Floating Quick Guide Button */}
      <motion.button
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowGuide(true)}
        className="fixed bottom-6 right-6 md:right-0 md:bottom-auto md:top-1/2 md:-translate-y-1/2 z-[60] flex flex-col items-center group"
      >
        {/* Pulse Effect for Mobile */}
        <div className="absolute inset-0 bg-blue-500 rounded-full md:hidden animate-ping opacity-20" />

        <div className="relative flex md:flex-col items-center gap-2 bg-[#0f172a] hover:bg-blue-600 text-white p-4 md:px-5 md:py-6 rounded-full md:rounded-l-[2rem] md:rounded-r-none shadow-2xl border border-white/10 transition-all duration-500">
          <div className="w-8 h-8 md:w-11 md:h-11 bg-blue-600 rounded-full md:rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:rotate-12 transition-transform duration-500">
            <Zap size={20} className="fill-white" />
          </div>
          <span className="hidden md:block [writing-mode:vertical-lr] font-black uppercase tracking-[0.2em] text-[10px] py-3 opacity-80 group-hover:opacity-100 transition-opacity">
            Quick Guide
          </span>
          {/* Mobile Tooltip */}
          <span className="md:hidden ml-2 font-black uppercase tracking-widest text-[10px] pr-2">Guide</span>
        </div>
      </motion.button>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-4 md:px-12 py-3 md:py-5 flex justify-between items-center bg-white/60 backdrop-blur-xl border-b border-slate-100">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 text-white"
          >
            <Zap size={18} className="md:w-[22px] md:h-[22px]" fill="currentColor" />
          </motion.div>
          <span className="font-display font-bold text-xl md:text-2xl tracking-tight text-slate-900">QuiGo</span>
        </div>

        <div className="hidden lg:flex gap-10 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <a href="#portals" className="hover:text-blue-600 transition-colors">Portals</a>
          <a href="#principles" className="hover:text-blue-600 transition-colors">Principles</a>
          <a href="#how" className="hover:text-blue-600 transition-colors">Process</a>
          <a href="#trust" className="hover:text-blue-600 transition-colors">Trust</a>
        </div>

        <div className="flex gap-2 md:gap-4 items-center">
          <button onClick={() => navigate('/auth')} className="hidden sm:block text-sm px-4 md:px-6 py-2.5 font-bold text-slate-600 hover:text-blue-600 transition-colors">Login</button>
          <button onClick={() => navigate('/auth')} className="bg-blue-600 hover:bg-blue-700 text-xs md:text-sm font-bold px-4 md:px-8 py-2 md:py-3 rounded-full text-white transition-all shadow-xl shadow-blue-500/20">
            Get Started
          </button>
          <button
            className="lg:hidden p-2 text-slate-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 w-full bg-white border-b border-slate-100 p-6 flex flex-col gap-6 lg:hidden"
            >
              {[
                { name: 'Portals', href: '#portals' },
                { name: 'Principles', href: '#principles' },
                { name: 'Process', href: '#how' },
                { name: 'Trust', href: '#trust' }
              ].map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm font-bold text-slate-600 uppercase tracking-widest hover:text-blue-600"
                >
                  {item.name}
                </a>
              ))}
              <div className="pt-4 border-t border-slate-50 flex gap-4">
                <button onClick={() => navigate('/auth')} className="flex-1 text-sm font-bold py-3 text-slate-600 bg-slate-50 rounded-xl">Login</button>
                <button onClick={() => navigate('/auth')} className="flex-1 text-sm font-bold py-3 bg-blue-600 text-white rounded-xl">Start Free</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] md:min-h-screen pt-32 md:pt-44 pb-20 md:pb-32 px-4 md:px-6 flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 grid-pattern z-0 opacity-80" />
        <div className="orb-blur-hero top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0" />

        {/* Faded Golden Yellow Blur behind Hero Text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-yellow-400/10 blur-[140px] rounded-full z-0 pointer-events-none" />

        <div className="max-w-5xl w-full text-center relative z-10 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-blue-600 text-[10px] md:text-xs font-bold mb-6 md:mb-10"
          >
            <motion.div
              animate={{ opacity: [1, 0.4, 1], scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-blue-500"
            />
            QUIGO SYSTEM OPERATIONAL
          </motion.div>

          <motion.h1
            className="font-display text-4xl sm:text-5xl md:text-[5.5rem] font-bold mb-6 md:mb-8 tracking-tight leading-[1.1] md:leading-[1] text-slate-900"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Verified Understanding.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
              Not Just Scores.
            </span>
          </motion.h1>

          <motion.p
            className="text-slate-500 text-base md:text-xl max-w-2xl mx-auto mb-8 md:mb-14 leading-relaxed font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Empower education with high-fidelity quiz generation and cognitive mapping. Real-time AI analysis for schools, students, and professionals.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4 md:gap-5 mb-16 md:mb-24 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <button onClick={() => navigate('/auth')} className="px-6 md:px-10 py-4 md:py-5 bg-white text-black border border-slate-200 font-bold rounded-full flex items-center justify-center gap-3 hover:bg-slate-50 transition-all shadow-xl shadow-slate-200/20 text-base md:text-lg group">
              Start Evaluation <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-6 md:px-10 py-4 md:py-5 bg-[#0f172a] text-white font-bold rounded-full hover:bg-black transition-all text-base md:text-lg">
              Watch Overview
            </button>
          </motion.div>

          {/* INFINITE SCROLL MARQUEE */}
          <div className="w-full overflow-hidden py-10 opacity-40">
            <div className="marquee flex items-center gap-20">
              {[...PROJECT_KEYWORDS, ...PROJECT_KEYWORDS, ...PROJECT_KEYWORDS].map((kw, i) => (
                <div key={i} className="flex items-center gap-4 grayscale hover:grayscale-0 transition-all cursor-default">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
                    {kw.icon}
                  </motion.div>
                  <span className="font-display font-bold text-xl uppercase tracking-tighter whitespace-nowrap">{kw.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hero Floating Widgets - More Cards added */}
        <div className="absolute inset-0 pointer-events-none z-20">
          <div className="max-w-7xl mx-auto h-full relative">
            {/* AI Generation Card */}
            <div className="absolute top-[20%] left-[5%] pointer-events-auto hidden lg:block">
              <FloatingCard className="w-60 bg-white/90" delay={0.2} yRange={[-20, 20]}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">AI Probe Generation</p>
                    <p className="text-[9px] text-slate-400 font-code">Syllabus to Quizzes: Active</p>
                  </div>
                </div>
              </FloatingCard>
            </div>

            {/* Cognitive Velocity Card */}
            <div className="absolute bottom-[25%] left-[8%] pointer-events-auto hidden lg:block">
              <FloatingCard className="w-52 bg-white/95" delay={0.4} yRange={[-15, 15]}>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <Activity className="w-4 h-4 text-green-500" />
                    <span className="text-[9px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">+14.2%</span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cognitive Velocity</p>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '82%' }}
                      transition={{ duration: 2, delay: 1 }}
                      className="h-full bg-blue-500"
                    />
                  </div>
                </div>
              </FloatingCard>
            </div>

            {/* Institutional Sync Card */}
            <div className="absolute top-[30%] right-[5%] pointer-events-auto hidden lg:block">
              <FloatingCard className="w-48 bg-white/90" delay={0.6} yRange={[-25, 25]}>
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotateY: [0, 180, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                    className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center text-white shadow-lg"
                  >
                    <School className="w-6 h-6" />
                  </motion.div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Institutional Sync</p>
                    <p className="text-xl font-bold text-slate-900">Active</p>
                  </div>
                </div>
              </FloatingCard>
            </div>

            {/* Neural Verification Card */}
            <div className="absolute bottom-[20%] right-[10%] pointer-events-auto hidden lg:block">
              <FloatingCard className="w-60 bg-[#0f172a] text-white border-white/5" delay={0.8} yRange={[-10, 10]} isDark>
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-11 h-11 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center"
                  >
                    <Lock className="w-6 h-6 text-blue-400" />
                  </motion.div>
                  <div>
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Neural Verification</p>
                    <p className="text-xs font-medium text-slate-300">Anti-Guess Loops Engaged</p>
                  </div>
                </div>
              </FloatingCard>
            </div>
          </div>
        </div>
      </section>

      {/* PORTALS SECTION */}
      {/* <section id="portals" className="py-40 px-6 bg-white relative">
        <div className="max-w-7xl mx-auto text-center mb-24 relative z-10">
          <h2 className="text-5xl lg:text-6xl font-display font-bold mb-6 text-slate-900 tracking-tight">Precision Portals</h2>
          <p className="text-slate-400 text-xl font-medium max-w-xl mx-auto">Select your specialized gateway into the QuiGo ecosystem.</p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { id: 'school', title: 'School Portal', desc: 'Enterprise classroom control, student verification, and cohort analytics.', icon: <School />, color: 'blue' },
            { id: 'student', title: 'Student Portal', desc: 'Immersive assessments, personalized metrics, and AI feedback loops.', icon: <User />, color: 'emerald' },
            { id: 'individual', title: 'Individual Portal', desc: 'Self-paced professional skill verification and custom quiz architects.', icon: <Rocket />, color: 'indigo' },
          ].map((portal, i) => (
            <motion.div
              key={portal.id}
              whileHover={{ y: -12 }}
              onClick={() => navigate('/auth', { state: { portal: portal.id } })}
              className="p-12 bg-slate-50 border border-slate-100 rounded-[3rem] group hover:bg-white hover:shadow-2xl hover:shadow-slate-200 transition-all cursor-pointer relative overflow-hidden"
            >
              <div className={`w-16 h-16 bg-${portal.color}-50 text-${portal.color}-600 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-${portal.color}-600 group-hover:text-white transition-all`}>
                {portal.icon}
              </div>
              <h3 className="text-3xl font-display font-bold text-slate-900 mb-6 group-hover:text-slate-900">{portal.title}</h3>
              <p className="text-slate-500 text-lg leading-relaxed mb-10">{portal.desc}</p>
              <div className="flex items-center text-slate-900 font-bold space-x-2 group-hover:text-blue-600">
                <span>Access Portal</span>
                <ArrowRight size={18} />
              </div>
            </motion.div>
          ))}
        </div>
      </section> */}

      {/* PRINCIPLES SECTION - DARK MODE */}
      {/* <section id="principles" className="py-40 px-6 bg-[#050505] text-white relative overflow-hidden">
        <div className="absolute inset-0 dark-grid-pattern opacity-10" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-32">
            <h2 className="text-6xl lg:text-[7rem] font-display font-bold mb-10 leading-[0.9] tracking-tighter">
              Built for Truth.<br />Not just test scores.
            </h2>
            <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto">Our methodology is centered on deep cognitive validation rather than simple pattern recognition.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { icon: <BrainCircuit className="text-blue-500" />, title: "Authenticity", desc: "Validate comprehension via logic-aware questioning." },
              { icon: <ShieldCheck className="text-emerald-500" />, title: "Bias-Free", desc: "Algorithmic grading eliminates evaluator subjectivity." },
              { icon: <CheckCircle2 className="text-amber-500" />, title: "Logic Over Luck", desc: "Adaptive loops prevent scores based on guessing." },
              { icon: <LineChart className="text-indigo-500" />, title: "Growth Velocity", desc: "Track longitudinal cognitive evolution, not static pass/fail." }
            ].map((p, i) => (
              <motion.div key={i} className="flex flex-col items-start group">
                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-white/10 transition-all">
                  {p.icon}
                </div>
                <h4 className="text-2xl font-display font-bold mb-4">{p.title}</h4>
                <p className="text-slate-500 leading-relaxed font-medium">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* HOW IT WORKS */}
      {/* <section id="how" className="py-40 px-6 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20">
          <div className="lg:w-1/2">
            <div className="lg:sticky lg:top-40">
              <span className="text-blue-600 font-black text-xs uppercase tracking-[0.3em] mb-4 block">Process Flow</span>
              <h2 className="text-6xl font-display font-bold text-slate-900 leading-[1.1]">The Verification Pipeline.</h2>
              <p className="text-slate-500 text-xl mt-8 font-medium leading-relaxed max-w-lg">Transforming raw syllabus or context into verified human insight through 4 levels of cognitive processing.</p>
              <div className="mt-12 h-1.5 w-48 bg-slate-100 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} whileInView={{ width: '100%' }} transition={{ duration: 2 }} className="h-full bg-blue-600" />
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 space-y-12">
            {steps.map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} className="p-12 bg-slate-50 rounded-[3rem] border border-transparent hover:border-slate-100 hover:bg-white hover:shadow-2xl transition-all group">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-blue-600 shadow-sm">{step.icon}</div>
                  <span className="text-6xl font-display font-bold text-slate-100 group-hover:text-blue-50 transition-colors">0{i + 1}</span>
                </div>
                <h3 className="text-3xl font-display font-bold text-slate-900 mb-4">{step.title}</h3>
                <p className="text-slate-500 text-lg leading-relaxed font-medium">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* PORTALS SECTION - Enhanced with animations */}
      <section id="portals" className="py-20 md:py-40 px-4 md:px-6 bg-white relative overflow-hidden border-t border-slate-50">
        <div className="max-w-7xl mx-auto text-center mb-16 md:mb-24 relative z-10 px-4">
          <motion.h2 className="text-3xl md:text-5xl font-display font-bold mb-4 md:mb-6 text-slate-900" {...fadeInUp}>Precision Portals</motion.h2>
          <motion.p className="text-slate-400 text-base md:text-xl font-medium" {...fadeInUp}>Select your specialized gateway into QuiGo.</motion.p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
          {/* School Portal */}
          <motion.div
            onClick={() => navigate('/auth', { state: { portal: 'school' } })}
            whileHover={{ y: -10, scale: 1.02 }}
            className="relative overflow-hidden bg-slate-50 p-8 md:p-12 rounded-[2.5rem] md:rounded-[40px] border border-slate-100 group transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 cursor-pointer"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 10, repeat: Infinity }}
              className="card-bg-icon text-blue-600 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-700 opacity-0 md:opacity-5"
            >
              <School size={160} />
            </motion.div>
            <div className="relative z-10">
              <motion.div
                variants={floatAnimation}
                animate="animate"
                className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-2xl md:rounded-3xl flex items-center justify-center mb-8 md:mb-10 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500"
              >
                <School className="w-7 h-7 md:w-9 md:h-9" />
              </motion.div>
              <h3 className="text-2xl md:text-3xl font-display font-bold mb-4 md:mb-6 group-hover:text-blue-600 transition-colors duration-500">School Portal</h3>
              <p className="text-slate-500 text-base md:text-lg mb-8 md:mb-12 font-medium leading-relaxed">Enterprise classroom management and bulk student analytics.</p>
              <button className="flex items-center gap-3 text-blue-600 font-bold text-lg md:text-xl hover:gap-5 transition-all">
                Enter Institution <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
          </motion.div>

          {/* Student Portal */}
          <motion.div
            onClick={() => navigate('/auth', { state: { portal: 'student' } })}
            whileHover={{ y: -10, scale: 1.02 }}
            className="relative overflow-hidden bg-slate-50 p-8 md:p-12 rounded-[2.5rem] md:rounded-[40px] border border-slate-100 group transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/10 cursor-pointer"
          >
            <motion.div
              animate={{ rotate: [0, -5, 5, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 12, repeat: Infinity }}
              className="card-bg-icon text-green-600 group-hover:scale-125 group-hover:-rotate-12 transition-transform duration-700 opacity-0 md:opacity-5"
            >
              <User size={160} />
            </motion.div>
            <div className="relative z-10">
              <motion.div
                variants={floatAnimation}
                animate="animate"
                className="w-12 h-12 md:w-16 md:h-16 bg-green-100 rounded-2xl md:rounded-3xl flex items-center justify-center mb-8 md:mb-10 group-hover:bg-green-600 group-hover:text-white transition-colors duration-500"
              >
                <User className="w-7 h-7 md:w-9 md:h-9" />
              </motion.div>
              <h3 className="text-2xl md:text-3xl font-display font-bold mb-4 md:mb-6 group-hover:text-green-600 transition-colors duration-500">Student Portal</h3>
              <p className="text-slate-500 text-base md:text-lg mb-8 md:mb-12 font-medium leading-relaxed">Access assessments and track learning velocity with AI feedback.</p>
              <button className="flex items-center gap-3 text-green-600 font-bold text-lg md:text-xl hover:gap-5 transition-all">
                Begin Session <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
          </motion.div>

          {/* Individual Portal */}
          <motion.div
            onClick={() => navigate('/auth', { state: { portal: 'individual' } })}
            whileHover={{ y: -10, scale: 1.02 }}
            className="relative overflow-hidden bg-slate-50 p-8 md:p-12 rounded-[2.5rem] md:rounded-[40px] border border-slate-100 group transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 cursor-pointer"
          >
            <motion.div
              animate={{ y: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 8, repeat: Infinity }}
              className="card-bg-icon text-purple-600 group-hover:scale-125 group-hover:translate-x-4 transition-transform duration-700 opacity-0 md:opacity-5"
            >
              <Rocket size={160} />
            </motion.div>
            <div className="relative z-10">
              <motion.div
                variants={floatAnimation}
                animate="animate"
                className="w-12 h-12 md:w-16 md:h-16 bg-purple-100 rounded-2xl md:rounded-3xl flex items-center justify-center mb-8 md:mb-10 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-500"
              >
                <Rocket className="w-7 h-7 md:w-9 md:h-9" />
              </motion.div>
              <h3 className="text-2xl md:text-3xl font-display font-bold mb-4 md:mb-6 group-hover:text-purple-600 transition-colors duration-500">Individual Portal</h3>
              <p className="text-slate-500 text-base md:text-lg mb-8 md:mb-12 font-medium leading-relaxed">Self-paced learning, custom quizzes, and professional skills.</p>
              <button className="flex items-center gap-3 text-purple-600 font-bold text-lg md:text-xl hover:gap-5 transition-all">
                Launch Pilot <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PRINCIPLES SECTION - DARK MODE */}
      <section id="principles" className="py-20 md:py-40 px-4 md:px-6 bg-[#050505] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: `linear-gradient(to right, #ffffff11 1px, transparent 1px), linear-gradient(to bottom, #ffffff11 1px, transparent 1px)`, backgroundSize: '50px 50px' }} />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 md:mb-32">
            <motion.h2 className="text-3xl md:text-[5rem] font-display font-bold mb-6 md:mb-8 leading-tight" {...fadeInUp}>
              Built for Truth.<br className="hidden md:block" />Not just test scores.
            </motion.h2>
            <motion.p className="text-slate-400 text-base md:text-xl font-medium max-w-3xl mx-auto" {...fadeInUp}>
              Pedagogical philosophy centered on deep cognitive validation.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {[
              { icon: <BrainCircuit className="text-blue-500 w-6 h-6 md:w-7 md:h-7" />, title: "Authenticity", desc: "Validate true comprehension via logic-aware questioning.", glow: "group-hover:shadow-blue-500/20" },
              { icon: <ShieldCheck className="text-green-500 w-6 h-6 md:w-7 md:h-7" />, title: "Bias-Free", desc: "Algorithmic grading eliminates evaluator subjectivity.", glow: "group-hover:shadow-green-500/20" },
              { icon: <CheckCircle2 className="text-yellow-500 w-6 h-6 md:w-7 md:h-7" />, title: "Clarity", desc: "Adaptive questioning prevents guessing scores.", glow: "group-hover:shadow-yellow-500/20" },
              { icon: <LineChart className="text-purple-500 w-6 h-6 md:w-7 md:h-7" />, title: "Progress", desc: "Track growth velocity instead of static data.", glow: "group-hover:shadow-purple-500/20" }
            ].map((p, i) => (
              <motion.div key={i} className="flex flex-col items-start group transition-all" {...fadeInUp} transition={{ delay: i * 0.1 }}>
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                  className={`w-12 h-12 md:w-14 md:h-14 bg-[#0a0a0a] border border-white/5 rounded-xl md:rounded-2xl flex items-center justify-center mb-6 md:mb-10 transition-all duration-500 group-hover:border-white/20 group-hover:bg-white/5 group-hover:shadow-2xl ${p.glow}`}
                >
                  {p.icon}
                </motion.div>
                <h4 className="text-xl md:text-2xl font-display font-bold mb-4 md:mb-6 group-hover:text-white transition-colors">{p.title}</h4>
                <p className="text-slate-400 font-medium leading-relaxed text-base md:text-lg group-hover:text-slate-300 transition-colors">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how" className="py-20 md:py-40 px-4 md:px-6 bg-white relative">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 md:gap-20">
          <div className="lg:w-1/2">
            <div className="lg:sticky lg:top-40">
              <span className="text-blue-600 font-bold text-[10px] md:text-xs uppercase tracking-[0.3em] mb-3 md:mb-4 block">THE PIPELINE</span>
              <h2 className="text-4xl md:text-6xl font-display font-bold text-slate-900 leading-[1.1]">From Input to Verified Insight.</h2>
              <p className="text-slate-500 text-base md:text-xl mt-4 md:mt-8 font-medium leading-relaxed">
                QuiGo uses advanced Large Language Models fine-tuned for educational rigor to transform raw information into verified understanding.
              </p>
              <div className="mt-8 md:mt-12 flex gap-4">
                <motion.div animate={{ width: [48, 80, 48] }} transition={{ duration: 3, repeat: Infinity }} className="h-1 bg-blue-600 rounded-full" />
                <div className="w-12 h-1 bg-slate-100 rounded-full" />
                <div className="w-12 h-1 bg-slate-100 rounded-full" />
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 space-y-8 md:space-y-12">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                className="bg-slate-50 p-8 md:p-12 rounded-[2.5rem] md:rounded-[40px] border border-slate-100 hover:border-blue-500/20 transition-all group"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="flex items-center gap-6 mb-6 md:mb-8">
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-2xl md:rounded-3xl flex items-center justify-center shadow-sm text-blue-600"
                  >
                    {step.icon}
                  </motion.div>
                  <span className="text-4xl md:text-6xl font-display font-bold text-slate-100 group-hover:text-blue-100 transition-colors">0{i + 1}</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-3 md:mb-4">{step.title}</h3>
                <p className="text-slate-500 text-base md:text-lg font-medium leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST SECTION */}
      <section id="trust" className="py-40 px-6 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.h2 className="text-5xl font-display font-bold mb-16" {...fadeInUp}>
            Fairness is not a feature.<br />It is the foundation.
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: <Globe className="w-8 h-8 text-blue-500" />, title: "Academic Integrity", desc: "Standards aligned with global benchmarks from IBO, Cambridge, and CCSS." },
              { icon: <Lock className="w-8 h-8 text-green-500" />, title: "Data Sovereignty", desc: "User data is never sold or used for model training without explicit institutional consent." },
              { icon: <CheckCircle2 className="w-8 h-8 text-purple-500" />, title: "Transparent Logic", desc: "Every AI-generated question and grade has a verifiable logic audit trail." }
            ].map((t, i) => (
              <motion.div key={i} className="bg-white p-12 rounded-[48px] shadow-sm border border-slate-100 group" {...fadeInUp} transition={{ delay: i * 0.1 }}>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-10 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors duration-500"
                >
                  {t.icon}
                </motion.div>
                <h4 className="text-2xl font-bold mb-4">{t.title}</h4>
                <p className="text-slate-500 font-medium leading-relaxed">{t.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION 
      <section id="trust" className="py-20 md:py-32 px-4 md:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 md:mb-24 px-4">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 md:mb-6 text-slate-900">Trusted Internationally</h2>
            <p className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto font-medium">Proven results in high-stakes environments.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { name: "Dr. Elena Rostova", title: "Dean, MIT", quote: "Finally, a tool that measures what my students actually know, rather than how well they can memorize a textbook." },
              { name: "James Chen", title: "CTO, TechFlow", quote: "We're finding talent we used to miss. QuiGo revealed engineering brilliance that GPA scores hid." },
              { name: "Sarah Jenkins", title: "Freelance Professional", quote: "The feedback I need to actually learn is built into the process. It's not just a score; it's a mentor." }
            ].map((t, i) => (
              <motion.div key={i} className="flex flex-col gap-6 md:gap-8 bg-slate-50 p-8 md:p-12 rounded-[2.5rem] md:rounded-[48px] border border-slate-100 group" {...fadeInUp} transition={{ delay: i * 0.1 }}>
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="w-max"
                >
                  <Quote className="w-8 h-8 md:w-12 md:h-12 text-blue-100 fill-blue-50 group-hover:fill-blue-100 transition-colors" />
                </motion.div>
                <p className="text-xl md:text-2xl text-slate-700 leading-relaxed font-medium italic">"{t.quote}"</p>
                <div className="mt-auto pt-6 md:pt-8 border-t border-slate-200">
                  <p className="text-lg md:text-xl font-bold text-slate-900">{t.name}</p>
                  <p className="text-sm md:text-base text-slate-500 font-medium">{t.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      */}

      {/* CTA SECTION - BLUE ACCENT CARD */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="bg-blue-600 p-12 md:p-24 rounded-[60px] text-white flex flex-col items-center text-center relative overflow-hidden shadow-2xl shadow-blue-500/20"
            {...fadeInUp}
          >
            <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] bg-white rounded-full blur-[160px] pointer-events-none"
            />
            <div className="relative z-10 space-y-8 md:space-y-12">
              <h2 className="text-3xl md:text-7xl font-display font-bold mb-6 md:mb-10 leading-[1.2] md:leading-[1.1]">Verify Understanding <br className="hidden md:block" />at Scale Today.</h2>
              <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6">
                <button onClick={() => navigate('/auth')} className="px-8 md:px-12 py-4 md:py-5 bg-white text-blue-600 font-bold rounded-full text-lg md:text-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-3 group">
                  Start Free <Zap size={20} fill="currentColor" />
                </button>
                <button className="px-8 md:px-12 py-4 md:py-5 bg-transparent border-2 border-white/20 text-white font-bold rounded-full text-lg md:text-xl hover:bg-white/10 transition-all">
                  Book Demo
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="border-t border-slate-100 pt-12 md:pt-20 pb-12 grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
            <div className="col-span-2 md:col-span-1 space-y-6 md:space-y-10">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20"
                >
                  <Zap size={18} className="text-white fill-white" />
                </motion.div>
                <span className="font-display font-bold text-2xl md:text-3xl tracking-tight text-slate-900">QuiGo</span>
              </div>
              <p className="text-slate-500 text-base md:text-lg max-w-sm leading-relaxed font-medium">
                The global benchmark for cognitive verification.
              </p>
              <div className="flex gap-3">
                {[Twitter, Linkedin, Github, Mail].map((Icon, i) => (
                  <button key={i} className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">
                    <Icon size={18} />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-6 md:space-y-8">
              <h4 className="font-bold text-slate-900 uppercase tracking-widest text-[10px] md:text-sm">Product</h4>
              <ul className="space-y-3 md:space-y-4 text-slate-500 font-medium text-base md:text-lg">
                <li><a href="#portals" className="hover:text-blue-600">Portals</a></li>
                <li><a href="#principles" className="hover:text-blue-600">Principles</a></li>
              </ul>
            </div>
            <div className="space-y-6 md:space-y-8">
              <h4 className="font-bold text-slate-900 uppercase tracking-widest text-[10px] md:text-sm">Legal</h4>
              <ul className="space-y-3 md:space-y-4 text-slate-500 font-medium text-base md:text-lg">
                <li><a href="#" className="hover:text-blue-600">Privacy</a></li>
                <li><a href="#" className="hover:text-blue-600">Ethics</a></li>
              </ul>
            </div>
            <div className="space-y-6 md:space-y-8">
              <h4 className="font-bold text-slate-900 uppercase tracking-widest text-[10px] md:text-sm">Company</h4>
              <ul className="space-y-3 md:space-y-4 text-slate-500 font-medium text-base md:text-lg">
                <li><a href="#" className="hover:text-blue-600">Research</a></li>
                <li><a href="#" className="hover:text-blue-600">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-slate-400 text-sm font-bold">
              © {new Date().getFullYear()} QuiGo Cognitive Systems. All protocols active.
            </p>
            <div className="flex items-center space-x-3 px-5 py-2 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
              <div className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">System Online: Flash v2.5</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
