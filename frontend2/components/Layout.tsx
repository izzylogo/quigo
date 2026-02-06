
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, BarChart3, Settings, LogOut, Menu as MenuIcon, X, ChevronRight, Zap,
  ClipboardList, History, BrainCircuit, PlusCircle
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface SidebarProps {
  portal: 'school' | 'student' | 'individual';
}

export const Sidebar: React.FC<SidebarProps> = ({ portal }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = {
    school: [
      { name: 'Classes', icon: <LayoutDashboard size={20} />, path: '/school/classrooms' },
      { name: 'Students', icon: <Users size={20} />, path: '/school/students' },
      { name: 'Progress', icon: <BarChart3 size={20} />, path: '/school/analytics' },
      { name: 'Settings', icon: <Settings size={20} />, path: '/school/settings' },
    ],
    student: [
      { name: 'My Tests', icon: <ClipboardList size={20} />, path: '/student/assessments' },
      { name: 'Test History', icon: <History size={20} />, path: '/student/history' },
      { name: 'My Progress', icon: <BrainCircuit size={20} />, path: '/student/analysis' },
      { name: 'Settings', icon: <Settings size={20} />, path: '/student/settings' },
    ],
    individual: [
      { name: 'Home', icon: <LayoutDashboard size={20} />, path: '/individual/dashboard' },
      { name: 'Create Test', icon: <PlusCircle size={20} />, path: '/individual/generate' },
      { name: 'Results', icon: <History size={20} />, path: '/individual/history' },
      { name: 'Settings', icon: <Settings size={20} />, path: '/individual/settings' },
    ]
  };

  const activeItems = menuItems[portal];

  return (
    <>
      <div className="lg:hidden fixed top-4 left-4 z-[60]">
        <button onClick={() => setIsOpen(!isOpen)} className="p-3 bg-white border border-slate-100 rounded-xl shadow-lg text-slate-600">
          {isOpen ? <X size={20} /> : <MenuIcon size={20} />}
        </button>
      </div>

      <div className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 transform bg-white border-r border-slate-100 flex flex-col shadow-sm ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0 lg:w-64'}`}>
        <div className="p-8 flex items-center space-x-3">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Zap size={20} fill="currentColor" />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight text-slate-900">QuiGo</span>
          </Link>
        </div>

        <nav className="flex-1 mt-6 px-4 space-y-2">
          {activeItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-5 py-4 rounded-2xl transition-all duration-200 group ${isActive ? 'bg-blue-50 text-blue-600 shadow-sm border border-blue-100/50' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
              >
                <div className={`${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-900 transition-colors'}`}>{item.icon}</div>
                <span className="ml-4 font-outfit font-semibold text-sm tracking-wide">{item.name}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-50">
          <button onClick={() => navigate('/')} className="flex items-center w-full px-5 py-4 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all">
            <LogOut size={20} />
            <span className="ml-4 font-outfit font-semibold text-sm">Log Out</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden" />
        )}
      </AnimatePresence>
    </>
  );
};

interface FloatingCardProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  yRange?: [number, number];
  isDark?: boolean;
}

export const FloatingCard: React.FC<FloatingCardProps> = ({
  children,
  delay = 0,
  className = "",
  yRange = [-10, 10],
  isDark = false
}) => {
  return (
    <motion.div
      drag
      dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
      dragElastic={0.1}
      whileDrag={{ scale: 1.05, zIndex: 50 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: yRange[0],
      }}
      transition={{
        delay,
        duration: 0.8,
        ease: "easeOut"
      }}
      className="cursor-grab active:cursor-grabbing pointer-events-auto"
    >
      <motion.div
        animate={{
          y: yRange,
          rotate: [0, 0.5, -0.5, 0]
        }}
        transition={{
          y: {
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: delay * 1.5
          },
          rotate: {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        className={`${isDark ? 'bg-slate-900 border-white/10' : 'bg-white/90 border-slate-100'} rounded-[24px] p-5 shadow-2xl hover:shadow-blue-500/10 hover:border-blue-500/30 transition-all duration-300 ${className}`}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};
