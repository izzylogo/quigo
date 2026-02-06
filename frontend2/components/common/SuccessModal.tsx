import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Sparkles, X } from 'lucide-react';

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    actionLabel?: string;
    onAction?: () => void;
    theme?: 'blue' | 'green' | 'indigo';
    position?: 'center' | 'top';
}

const SuccessModal: React.FC<SuccessModalProps> = ({
    isOpen,
    onClose,
    title,
    message,
    actionLabel = "Continue",
    onAction,
    theme = 'blue',
    position = 'center'
}) => {
    const themeClasses = {
        blue: {
            bg: 'bg-blue-50',
            text: 'text-blue-600',
            button: 'bg-blue-600 hover:bg-blue-700 shadow-blue-200',
            icon: 'text-blue-600'
        },
        green: {
            bg: 'bg-emerald-50',
            text: 'text-emerald-600',
            button: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200',
            icon: 'text-emerald-600'
        },
        indigo: {
            bg: 'bg-indigo-50',
            text: 'text-indigo-600',
            button: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200',
            icon: 'text-indigo-600'
        }
    };

    const activeTheme = themeClasses[theme];

    // Scroll lock implementation
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className={`fixed inset-0 z-[600] flex p-6 bg-slate-900/60 backdrop-blur-sm transition-all ${position === 'top' ? 'items-start pt-4' : 'items-center justify-center'}`}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: position === 'top' ? -40 : 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: position === 'top' ? -40 : 20 }}
                        className={`bg-white rounded-[2.5rem] p-10 shadow-2xl max-w-md w-full relative overflow-hidden text-center ${position === 'top' ? 'mx-auto' : ''}`}
                    >
                        {/* Background Decoration */}
                        <div className={`absolute top-0 left-0 w-full h-2 ${activeTheme.bg}`} />

                        <div className={`w-20 h-20 ${activeTheme.bg} rounded-[2rem] flex items-center justify-center mb-8 mx-auto relative group`}>
                            <CheckCircle2 size={40} className={activeTheme.icon} />
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className={`absolute inset-0 ${activeTheme.bg} rounded-[2rem] -z-10`}
                            />
                        </div>

                        <h3 className="text-2xl font-black text-slate-900 mb-4 lowercase tracking-tight">
                            {title}
                        </h3>

                        <p className="text-slate-500 font-medium mb-10 leading-relaxed">
                            {message}
                        </p>

                        <div className="space-y-3">
                            <button
                                onClick={() => {
                                    if (onAction) onAction();
                                    onClose();
                                }}
                                className={`w-full py-4 ${activeTheme.button} text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98]`}
                            >
                                <span>{actionLabel}</span>
                                <Sparkles size={18} />
                            </button>

                            <button
                                onClick={onClose}
                                className="w-full py-4 bg-white text-slate-400 rounded-2xl font-bold text-sm hover:text-slate-600 transition-colors"
                            >
                                Dismiss
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default SuccessModal;
