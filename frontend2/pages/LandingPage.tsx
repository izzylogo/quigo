
import React from 'react';
import { motion } from 'framer-motion';
import {
  Zap, ArrowRight, ShieldCheck, Activity, Award, Globe, Lock, BrainCircuit,
  CheckCircle2, LineChart, Quote, Twitter, Instagram, Youtube, Facebook,
  Sparkles, School, User, Rocket, Search, FileCheck, ArrowLeft, Mail, Github, Linkedin, UserCircle,
  Database, Cpu
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import FloatingCard from '../components/FloatingCard';
import { LOGOS } from '../constants';


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

  return (
    <div className="relative min-h-screen font-outfit text-slate-900 bg-white selection:bg-blue-100">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 lg:px-12 py-5 flex justify-between items-center bg-white/60 backdrop-blur-xl border-b border-slate-100">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 text-white"
          >
            <Zap size={22} fill="currentColor" />
          </motion.div>
          <span className="font-display font-bold text-2xl tracking-tight text-slate-900">QuiGo</span>
        </div>
        <div className="hidden md:flex gap-10 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <a href="#portals" className="hover:text-blue-600 transition-colors">Portals</a>
          <a href="#principles" className="hover:text-blue-600 transition-colors">Principles</a>
          <a href="#how" className="hover:text-blue-600 transition-colors">Process</a>
          <a href="#trust" className="hover:text-blue-600 transition-colors">Trust</a>
        </div>
        <div className="flex gap-4 items-center">
          <button onClick={() => navigate('/auth')} className="text-sm px-6 py-2.5 font-bold text-slate-600 hover:text-blue-600 transition-colors">Login</button>
          <button onClick={() => navigate('/auth')} className="bg-blue-600 hover:bg-blue-700 text-sm font-bold px-8 py-3 rounded-full text-white transition-all shadow-xl shadow-blue-500/20">
            Get Started
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative min-h-screen pt-44 pb-32 px-6 flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 grid-pattern z-0 opacity-80" />
        <div className="orb-blur-hero top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0" />

        {/* Faded Golden Yellow Blur behind Hero Text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-yellow-400/10 blur-[140px] rounded-full z-0 pointer-events-none" />

        <div className="max-w-5xl w-full text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-blue-600 text-xs font-bold mb-10"
          >
            <motion.div
              animate={{ opacity: [1, 0.4, 1], scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-blue-500"
            />
            QUIGO SYSTEM OPERATIONAL
          </motion.div>

          <motion.h1
            className="font-display text-6xl md:text-[5.5rem] font-bold mb-8 tracking-tight leading-[1] text-slate-900"
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
            className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto mb-14 leading-relaxed font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Empower education with high-fidelity quiz generation and cognitive mapping. Real-time AI analysis for schools, students, and professionals.
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-5 mb-24"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <button onClick={() => navigate('/auth')} className="px-10 py-5 bg-white text-black border border-slate-200 font-bold rounded-full flex items-center gap-3 hover:bg-slate-50 transition-all shadow-xl shadow-slate-200/20 text-lg group">
              Start Evaluation <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-10 py-5 bg-[#0f172a] text-white font-bold rounded-full hover:bg-black transition-all text-lg">
              Watch Technical Overview
            </button>
          </motion.div>

          {/* INFINITE SCROLL MARQUEE */}
          <div className="w-full overflow-hidden py-10 opacity-40">
            <div className="marquee flex items-center gap-20">
              {[...LOGOS, ...LOGOS, ...LOGOS].map((logo, i) => (
                <div key={i} className="flex items-center gap-4 grayscale hover:grayscale-0 transition-all cursor-default">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
                    {logo.icon}
                  </motion.div>
                  <span className="font-display font-bold text-xl uppercase tracking-tighter whitespace-nowrap">{logo.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hero Floating Widgets - More Cards added */}
        <div className="absolute inset-0 pointer-events-none z-20">
          <div className="max-w-7xl mx-auto h-full relative">
            {/* Original Card */}
            <div className="absolute top-[20%] left-[5%] pointer-events-auto hidden lg:block">
              <FloatingCard className="w-60 bg-white/90" delay={0.2} yRange={[-20, 20]}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <UserCircle className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">Alex Johnson</p>
                    <p className="text-[9px] text-slate-400 font-code">Active Session</p>
                  </div>
                </div>
              </FloatingCard>
            </div>

            {/* Performance Card */}
            <div className="absolute bottom-[25%] left-[8%] pointer-events-auto hidden lg:block">
              <FloatingCard className="w-52 bg-white/95" delay={0.4} yRange={[-15, 15]}>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <Activity className="w-4 h-4 text-green-500" />
                    <span className="text-[9px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">+14%</span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Logic Velocity</p>
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

            {/* Global Rank Card */}
            <div className="absolute top-[30%] right-[5%] pointer-events-auto hidden lg:block">
              <FloatingCard className="w-48 bg-white/90" delay={0.6} yRange={[-25, 25]}>
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotateY: [0, 180, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                    className="w-10 h-10 rounded-xl bg-yellow-500 flex items-center justify-center text-white shadow-lg"
                  >
                    <Award className="w-6 h-6" />
                  </motion.div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Rank</p>
                    <p className="text-xl font-bold text-slate-900">Top 5%</p>
                  </div>
                </div>
              </FloatingCard>
            </div>

            {/* Verification Status Card */}
            <div className="absolute bottom-[20%] right-[10%] pointer-events-auto hidden lg:block">
              <FloatingCard className="w-60 bg-[#0f172a] text-white border-white/5" delay={0.8} yRange={[-10, 10]} isDark>
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-11 h-11 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center"
                  >
                    <ShieldCheck className="w-6 h-6 text-blue-400" />
                  </motion.div>
                  <div>
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Identity Secure</p>
                    <p className="text-xs font-medium text-slate-300">Biometric Verified</p>
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
      <section id="portals" className="py-40 px-6 bg-white relative overflow-hidden border-t border-slate-50">
        <div className="max-w-7xl mx-auto text-center mb-24 relative z-10">
          <motion.h2 className="text-5xl font-display font-bold mb-6 text-slate-900" {...fadeInUp}>Precision Portals</motion.h2>
          <motion.p className="text-slate-400 text-xl font-medium" {...fadeInUp}>Select your entry point into the QuiGo cognitive ecosystem.</motion.p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
          {/* School Portal */}
          <motion.div
            onClick={() => navigate('/auth', { state: { portal: 'school' } })}
            whileHover={{ y: -10, scale: 1.02 }}
            className="relative overflow-hidden bg-slate-50 p-12 rounded-[40px] border border-slate-100 group transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 cursor-pointer"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 10, repeat: Infinity }}
              className="card-bg-icon text-blue-600 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-700"
            >
              <School size={160} />
            </motion.div>
            <div className="relative z-10">
              <motion.div
                variants={floatAnimation}
                animate="animate"
                className="w-16 h-16 bg-blue-100 rounded-3xl flex items-center justify-center mb-10 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500"
              >
                <School className="w-9 h-9" />
              </motion.div>
              <h3 className="text-3xl font-display font-bold mb-6 group-hover:text-blue-600 transition-colors duration-500">School Portal</h3>
              <p className="text-slate-500 text-lg mb-12 font-medium leading-relaxed">Comprehensive classroom management, bulk student imports, and multi-tier analytics.</p>
              <button className="flex items-center gap-3 text-blue-600 font-bold text-xl hover:gap-5 transition-all">
                Enter Institution <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </motion.div>

          {/* Student Portal */}
          <motion.div
            onClick={() => navigate('/auth', { state: { portal: 'student' } })}
            whileHover={{ y: -10, scale: 1.02 }}
            className="relative overflow-hidden bg-slate-50 p-12 rounded-[40px] border border-slate-100 group transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/10 cursor-pointer"
          >
            <motion.div
              animate={{ rotate: [0, -5, 5, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 12, repeat: Infinity }}
              className="card-bg-icon text-green-600 group-hover:scale-125 group-hover:-rotate-12 transition-transform duration-700"
            >
              <User size={160} />
            </motion.div>
            <div className="relative z-10">
              <motion.div
                variants={floatAnimation}
                animate="animate"
                className="w-16 h-16 bg-green-100 rounded-3xl flex items-center justify-center mb-10 group-hover:bg-green-600 group-hover:text-white transition-colors duration-500"
              >
                <User className="w-9 h-9" />
              </motion.div>
              <h3 className="text-3xl font-display font-bold mb-6 group-hover:text-green-600 transition-colors duration-500">Student Portal</h3>
              <p className="text-slate-500 text-lg mb-12 font-medium leading-relaxed">Access personalized assessments, track learning velocity, and receive instant AI feedback.</p>
              <button className="flex items-center gap-3 text-green-600 font-bold text-xl hover:gap-5 transition-all">
                Begin Session <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </motion.div>

          {/* Individual Portal */}
          <motion.div
            onClick={() => navigate('/auth', { state: { portal: 'individual' } })}
            whileHover={{ y: -10, scale: 1.02 }}
            className="relative overflow-hidden bg-slate-50 p-12 rounded-[40px] border border-slate-100 group transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 cursor-pointer"
          >
            <motion.div
              animate={{ y: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 8, repeat: Infinity }}
              className="card-bg-icon text-purple-600 group-hover:scale-125 group-hover:translate-x-4 transition-transform duration-700"
            >
              <Rocket size={160} />
            </motion.div>
            <div className="relative z-10">
              <motion.div
                variants={floatAnimation}
                animate="animate"
                className="w-16 h-16 bg-purple-100 rounded-3xl flex items-center justify-center mb-10 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-500"
              >
                <Rocket className="w-9 h-9" />
              </motion.div>
              <h3 className="text-3xl font-display font-bold mb-6 group-hover:text-purple-600 transition-colors duration-500">Individual Portal</h3>
              <p className="text-slate-500 text-lg mb-12 font-medium leading-relaxed">Self-paced learning, custom quiz workflows, and professional skill verification.</p>
              <button className="flex items-center gap-3 text-purple-600 font-bold text-xl hover:gap-5 transition-all">
                Launch Pilot <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PRINCIPLES SECTION - DARK MODE */}
      <section id="principles" className="py-40 px-6 bg-[#050505] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: `linear-gradient(to right, #ffffff11 1px, transparent 1px), linear-gradient(to bottom, #ffffff11 1px, transparent 1px)`, backgroundSize: '50px 50px' }} />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-32">
            <motion.h2 className="text-5xl md:text-[5rem] font-display font-bold mb-8 leading-tight" {...fadeInUp}>
              Built for Truth.<br />Not just test scores.
            </motion.h2>
            <motion.p className="text-slate-400 text-xl font-medium max-w-3xl mx-auto" {...fadeInUp}>
              Our pedagogical philosophy is centered on deep cognitive validation rather than simple pattern recognition.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { icon: <BrainCircuit className="text-blue-500 w-7 h-7" />, title: "Authenticity", desc: "We validate true comprehension via logic-aware questioning techniques.", glow: "group-hover:shadow-blue-500/20" },
              { icon: <ShieldCheck className="text-green-500 w-7 h-7" />, title: "Bias-Free", desc: "Algorithmic grading eliminates subconscious evaluator subjectivity.", glow: "group-hover:shadow-green-500/20" },
              { icon: <CheckCircle2 className="text-yellow-500 w-7 h-7" />, title: "Clarity Over Guessing", desc: "Adaptive questioning prevents scores based on simple probability.", glow: "group-hover:shadow-yellow-500/20" },
              { icon: <LineChart className="text-purple-500 w-7 h-7" />, title: "Progress Over Scores", desc: "Detailed analytics track growth velocity instead of static pass/fail data.", glow: "group-hover:shadow-purple-500/20" }
            ].map((p, i) => (
              <motion.div key={i} className="flex flex-col items-start group transition-all" {...fadeInUp} transition={{ delay: i * 0.1 }}>
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                  className={`w-14 h-14 bg-[#0a0a0a] border border-white/5 rounded-2xl flex items-center justify-center mb-10 transition-all duration-500 group-hover:border-white/20 group-hover:bg-white/5 group-hover:shadow-2xl ${p.glow}`}
                >
                  {p.icon}
                </motion.div>
                <h4 className="text-2xl font-display font-bold mb-6 group-hover:text-white transition-colors">{p.title}</h4>
                <p className="text-slate-400 font-medium leading-relaxed text-lg group-hover:text-slate-300 transition-colors">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how" className="py-40 px-6 bg-white relative">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20">
          <div className="lg:w-1/2">
            <div className="sticky top-40">
              <span className="text-blue-600 font-bold text-xs uppercase tracking-[0.3em] mb-4 block">THE PIPELINE</span>
              <h2 className="text-6xl font-display font-bold text-slate-900 leading-[1.1]">From Input to Verified Insight.</h2>
              <p className="text-slate-500 text-xl mt-8 font-medium leading-relaxed">
                QuiGo uses advanced Large Language Models fine-tuned for educational rigor to transform raw information into verified understanding.
              </p>
              <div className="mt-12 flex gap-4">
                <motion.div animate={{ width: [48, 80, 48] }} transition={{ duration: 3, repeat: Infinity }} className="h-1 bg-blue-600 rounded-full" />
                <div className="w-12 h-1 bg-slate-100 rounded-full" />
                <div className="w-12 h-1 bg-slate-100 rounded-full" />
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 space-y-12">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                className="bg-slate-50 p-12 rounded-[40px] border border-slate-100 hover:border-blue-500/20 transition-all group"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="flex items-center gap-6 mb-8">
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-sm text-blue-600"
                  >
                    {step.icon}
                  </motion.div>
                  <span className="text-6xl font-display font-bold text-slate-100 group-hover:text-blue-100 transition-colors">0{i + 1}</span>
                </div>
                <h3 className="text-3xl font-display font-bold text-slate-900 mb-4">{step.title}</h3>
                <p className="text-slate-500 text-lg font-medium leading-relaxed">{step.desc}</p>
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

      {/* TESTIMONIALS SECTION */}
      <section id="testimonials" className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-5xl font-display font-bold mb-6 text-slate-900">Trusted by Global Institutions</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">Proven results in high-stakes educational and professional environments.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { name: "Dr. Elena Rostova", title: "Dean, MIT", quote: "Finally, a tool that measures what my students actually know, rather than how well they can memorize a textbook." },
              { name: "James Chen", title: "CTO, TechFlow", quote: "We're finding talent we used to miss. QuiGo revealed engineering brilliance that GPA scores hid." },
              { name: "Sarah Jenkins", title: "Freelance Professional", quote: "The feedback I need to actually learn is built into the process. It's not just a score; it's a mentor." }
            ].map((t, i) => (
              <motion.div key={i} className="flex flex-col gap-8 bg-slate-50 p-12 rounded-[48px] border border-slate-100 group" {...fadeInUp} transition={{ delay: i * 0.1 }}>
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="w-max"
                >
                  <Quote className="w-12 h-12 text-blue-100 fill-blue-50 group-hover:fill-blue-100 transition-colors" />
                </motion.div>
                <p className="text-2xl text-slate-700 leading-relaxed font-medium italic">"{t.quote}"</p>
                <div className="mt-auto pt-8 border-t border-slate-200">
                  <p className="text-xl font-bold text-slate-900">{t.name}</p>
                  <p className="text-slate-500 font-medium">{t.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
            <div className="relative z-10 space-y-12">
              <h2 className="text-5xl md:text-7xl font-display font-bold mb-10 leading-[1.1]">Verify Understanding <br />at Scale Today.</h2>
              <div className="flex flex-wrap justify-center gap-6">
                <button onClick={() => navigate('/auth')} className="px-12 py-5 bg-white text-blue-600 font-bold rounded-full text-xl hover:bg-slate-50 transition-all flex items-center gap-3 group">
                  Deploy Free Assessment <Zap size={20} fill="currentColor" />
                </button>
                <button className="px-12 py-5 bg-transparent border-2 border-white/20 text-white font-bold rounded-full text-xl hover:bg-white/10 transition-all">
                  Book Institutional Demo
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="border-t border-slate-100 pt-20 pb-12 grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-8">
            <div className="space-y-10">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20"
                >
                  <Zap className="w-6 h-6 text-white fill-white" />
                </motion.div>
                <span className="font-display font-bold text-3xl tracking-tight text-slate-900">QuiGo</span>
              </div>
              <p className="text-slate-500 text-lg max-w-sm leading-relaxed font-medium">
                The global benchmark for cognitive verification. Verified understanding for a digital world.
              </p>
              <div className="flex gap-4">
                {[Twitter, Linkedin, Github, Mail].map((Icon, i) => (
                  <button key={i} className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">
                    <Icon size={20} />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-8">
              <h4 className="font-bold text-slate-900 uppercase tracking-widest text-sm">Product</h4>
              <ul className="space-y-4 text-slate-500 font-medium text-lg">
                <li><a href="#portals" className="hover:text-blue-600">Portals</a></li>
                <li><a href="#principles" className="hover:text-blue-600">Principles</a></li>
                <li><a href="#how" className="hover:text-blue-600">How It Works</a></li>
              </ul>
            </div>
            <div className="space-y-8">
              <h4 className="font-bold text-slate-900 uppercase tracking-widest text-sm">Legal</h4>
              <ul className="space-y-4 text-slate-500 font-medium text-lg">
                <li><a href="#" className="hover:text-blue-600">Terms Of Use</a></li>
                <li><a href="#" className="hover:text-blue-600">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-600">Ethics Charter</a></li>
              </ul>
            </div>
            <div className="space-y-8">
              <h4 className="font-bold text-slate-900 uppercase tracking-widest text-sm">Company</h4>
              <ul className="space-y-4 text-slate-500 font-medium text-lg">
                <li><a href="#" className="hover:text-blue-600">Research</a></li>
                <li><a href="#" className="hover:text-blue-600">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-slate-400 text-sm font-bold">
              © 2024 QuiGo Cognitive Systems. All protocols active.
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
