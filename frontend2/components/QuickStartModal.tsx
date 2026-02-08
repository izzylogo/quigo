
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Sparkles,
    School,
    User,
    Rocket,
    ArrowRight,
    Zap,
    MousePointer2,
    Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuickStartModalProps {
    isOpen?: boolean;
    onClose: () => void;
}

const QuickStartModal: React.FC<QuickStartModalProps> = ({ isOpen: manualOpen, onClose }) => {
    const [internalOpen, setInternalOpen] = useState(false);
    const navigate = useNavigate();

    const isOpen = manualOpen !== undefined ? manualOpen : internalOpen;

    useEffect(() => {
        // Check if user has seen the quick start guide in this session
        const hasSeenGuide = sessionStorage.getItem('quigo_quickstart_seen');
        if (!hasSeenGuide && manualOpen === undefined) {
            const timer = setTimeout(() => {
                setInternalOpen(true);
            }, 1500); // Show after 1.5s
            return () => clearTimeout(timer);
        }
    }, [manualOpen]);

    const handleClose = () => {
        setInternalOpen(false);
        sessionStorage.setItem('quigo_quickstart_seen', 'true');
        onClose();
    };

    const navigateToPortal = (portal: string) => {
        setInternalOpen(false);
        sessionStorage.setItem('quigo_quickstart_seen', 'true');
        onClose();
        navigate('/auth', { state: { portal } });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 lg:p-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col lg:flex-row max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Left Side - Visual/Intro */}
                        <div className="lg:w-1/3 bg-[#0f172a] p-6 md:p-12 text-white relative overflow-hidden flex flex-col justify-between">
                            <div className="absolute inset-0 grid-pattern opacity-10" />
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-8 shadow-xl shadow-blue-500/30">
                                    <Zap size={24} fill="currentColor" />
                                </div>
                                <h2 className="text-3xl font-display font-bold leading-tight mb-4">Quick Start Guide</h2>
                                <p className="text-slate-400 font-medium">Get ready to experience the future of cognitive verification in seconds.</p>
                            </div>

                            <div className="relative z-10 pt-8 border-t border-white/10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                                        <Info size={16} className="text-blue-400" />
                                    </div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Demo Login Info</p>
                                </div>
                                <p className="text-sm text-slate-300 leading-relaxed font-medium">
                                    Each portal has a <span className="text-white font-bold">"Preregistered"</span> section for instant access without manual setup.
                                </p>
                            </div>

                            <button
                                onClick={handleClose}
                                className="absolute top-6 right-6 lg:hidden p-2 rounded-full hover:bg-white/10 transition-colors"
                            >
                                <X size={20} className="text-white" />
                            </button>
                        </div>

                        {/* Right Side - Steps/Portals */}
                        <div className="lg:w-2/3 p-8 lg:p-12 overflow-y-auto custom-scrollbar">
                            <div className="flex justify-between items-center mb-8 lg:mb-12">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">Choose your path</h3>
                                    <p className="text-sm text-slate-500 font-medium">Click a portal to go to the login page</p>
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="hidden lg:flex p-2 rounded-full hover:bg-slate-100 transition-colors"
                                >
                                    <X size={20} className="text-slate-400" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* School Path */}
                                <motion.div
                                    whileHover={{ x: 8 }}
                                    onClick={() => navigateToPortal('school')}
                                    className="p-6 rounded-[2rem] border-2 border-blue-500 bg-blue-50/50 hover:bg-white hover:border-blue-600 hover:shadow-2xl hover:shadow-blue-500/20 transition-all group cursor-pointer relative"
                                >
                                    <div className="absolute -top-3 right-8 px-3 py-1 bg-blue-600 text-white text-[10px] font-black rounded-full shadow-lg animate-bounce">
                                        DEMO READY
                                    </div>
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                                        <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-600 rounded-xl md:rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-all">
                                            <School size={24} className="md:w-7 md:h-7" />
                                        </div>
                                        <div className="flex-1 w-full">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-base md:text-lg font-bold text-slate-900">Teacher / School Portal</h4>
                                                <ArrowRight size={18} className="text-blue-600 group-hover:translate-x-1 transition-all" />
                                            </div>
                                            <p className="text-xs md:text-sm text-slate-600 font-bold mt-1">Manage classrooms and generate bulk student quizzes.</p>
                                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                                                <span className="text-[9px] md:text-[10px] font-black text-blue-700 uppercase tracking-widest text-nowrap">Instant Access:</span>
                                                <p className="text-[9px] md:text-[10px] text-blue-800 font-black uppercase tracking-widest leading-none">Use "Log into preregistered school"</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Student Path */}
                                <motion.div
                                    whileHover={{ x: 8 }}
                                    onClick={() => navigateToPortal('student')}
                                    className="p-6 rounded-[2rem] border-2 border-green-500 bg-green-50/50 hover:bg-white hover:border-green-600 hover:shadow-2xl hover:shadow-green-500/20 transition-all group cursor-pointer relative"
                                >
                                    <div className="absolute -top-3 right-8 px-3 py-1 bg-green-600 text-white text-[10px] font-black rounded-full shadow-lg animate-bounce">
                                        DEMO READY
                                    </div>
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                                        <div className="w-12 h-12 md:w-14 md:h-14 bg-green-600 rounded-xl md:rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-all">
                                            <User size={24} className="md:w-7 md:h-7" />
                                        </div>
                                        <div className="flex-1 w-full">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-base md:text-lg font-bold text-slate-900">Student Portal</h4>
                                                <ArrowRight size={18} className="text-green-600 group-hover:translate-x-1 transition-all" />
                                            </div>
                                            <p className="text-xs md:text-sm text-slate-600 font-bold mt-1">Access your assessments and track your learning progress.</p>
                                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
                                                <span className="text-[9px] md:text-[10px] font-black text-green-700 uppercase tracking-widest text-nowrap">Instant Access:</span>
                                                <p className="text-[9px] md:text-[10px] text-green-800 font-black uppercase tracking-widest leading-none">Use "View preregistered students"</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Individual Path */}
                                <motion.div
                                    whileHover={{ x: 8 }}
                                    onClick={() => navigateToPortal('individual')}
                                    className="p-6 rounded-[2rem] border border-slate-100 bg-slate-50 hover:bg-white hover:border-purple-200 hover:shadow-xl hover:shadow-purple-500/5 transition-all group cursor-pointer"
                                >
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                                        <div className="w-12 h-12 md:w-14 md:h-14 bg-purple-100 rounded-xl md:rounded-2xl flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all">
                                            <Rocket size={24} className="md:w-7 md:h-7" />
                                        </div>
                                        <div className="flex-1 w-full">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-base md:text-lg font-bold text-slate-900">Individual Portal</h4>
                                                <ArrowRight size={18} className="text-slate-300 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                                            </div>
                                            <p className="text-xs md:text-sm text-slate-500 font-medium mt-1">Create custom quizzes and verify professional skills.</p>
                                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                                <span className="text-[9px] md:text-[10px] font-black text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full uppercase tracking-widest text-nowrap">How to Enter:</span>
                                                <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Portal &gt; Sign in/up with email</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            <div className="mt-10 pt-8 border-t border-slate-50 text-center">
                                <button
                                    onClick={handleClose}
                                    className="px-8 py-3 bg-slate-900 text-white rounded-full font-bold text-sm hover:bg-black transition-all shadow-lg active:scale-95"
                                >
                                    I'm ready to start
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default QuickStartModal;
