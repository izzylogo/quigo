import React, { useState, useEffect } from 'react';
import { SignUp, useUser } from '@clerk/clerk-react';
import { X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AuthPopupProps {
    onClose: () => void;
}

const AuthPopup: React.FC<AuthPopupProps> = ({ onClose }) => {
    const [showSignUp, setShowSignUp] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full overflow-hidden relative"
                onClick={(e) => e.stopPropagation()}
            >
                {!showSignUp ? (
                    <div className="p-10">
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 transition-colors"
                        >
                            <X className="w-5 h-5 text-slate-400" />
                        </button>

                        <div className="text-center mb-10">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/30">
                                <Sparkles className="w-10 h-10 text-white" />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Welcome to QuiGo</h2>
                            <p className="text-slate-500 font-medium">Unlock full potential with AI-powered verification.</p>
                        </div>

                        <button
                            onClick={() => setShowSignUp(true)}
                            className="w-full bg-[#0f172a] hover:bg-slate-800 text-white font-bold py-5 px-6 rounded-2xl transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3 active:scale-[0.98]"
                        >
                            <Sparkles className="w-5 h-5 text-blue-400" />
                            Get Started with Clerk
                        </button>

                        <p className="text-center text-[11px] font-black text-slate-400 uppercase tracking-widest mt-8">
                            Experience as guest?{' '}
                            <button onClick={onClose} className="text-blue-600 hover:text-blue-700 transition-colors">
                                Skip for now
                            </button>
                        </p>
                    </div>
                ) : (
                    <div className="p-6">
                        <button
                            onClick={() => setShowSignUp(false)}
                            className="mb-4 text-[11px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 flex items-center gap-1"
                        >
                            ← Go Back
                        </button>
                        <div className="max-h-[80vh] overflow-y-auto custom-scrollbar pr-1">
                            <SignUp
                                routing="hash"
                                appearance={{
                                    elements: {
                                        rootBox: "w-full",
                                        card: "shadow-none border-0 p-0",
                                        formButtonPrimary: "bg-[#0f172a] hover:bg-slate-800 rounded-xl py-3 text-sm",
                                        headerTitle: "text-2xl font-black text-slate-900",
                                        headerSubtitle: "text-slate-500 font-medium",
                                        socialButtonsBlockButton: "rounded-xl border-slate-100 hover:bg-slate-50",
                                        formFieldInput: "rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all",
                                        footerActionText: "text-[11px] font-black text-slate-400 uppercase tracking-widest",
                                        footerActionLink: "text-blue-600 hover:text-blue-700",
                                        identityPreviewText: "text-slate-900 font-medium",
                                        identityPreviewEditButtonIcon: "text-blue-600"
                                    }
                                }}
                            />
                        </div>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};

export const useAuthPopup = () => {
    const [showPopup, setShowPopup] = useState(false);
    const { isSignedIn, isLoaded } = useUser();

    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            const hasSeenPopup = sessionStorage.getItem('quigo_auth_popup_seen');
            if (!hasSeenPopup) {
                const timer = setTimeout(() => {
                    setShowPopup(true);
                }, 1000);
                return () => clearTimeout(timer);
            }
        }
    }, [isLoaded, isSignedIn]);

    const closePopup = () => {
        setShowPopup(false);
        sessionStorage.setItem('quigo_auth_popup_seen', 'true');
    };

    const AuthPopupComponent = () => (
        <AnimatePresence>
            {showPopup && <AuthPopup onClose={closePopup} />}
        </AnimatePresence>
    );

    return { AuthPopupComponent, showPopup, closePopup };
};

export default AuthPopup;
