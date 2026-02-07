import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldAlert, AlertCircle, Camera, Monitor, Check, Loader2, X, Zap,
    ArrowLeft, CheckCircle2, ChevronRight, Clock
} from 'lucide-react';
import { GoogleGenAI, Modality } from '@google/genai';
import { studentService } from '../../services/api';
import SuccessModal from '../../components/common/SuccessModal';

interface QuizInterfaceProps {
    quiz: any;
    onClose: () => void;
    onSuccess: () => void;
}

const FALLBACK_QUESTIONS = [
    {
        id: 'q1',
        type: 'multiple-choice',
        text: "Question not loaded properly. Please try again.",
        options: ["Option A", "Option B", "Option C", "Option D"]
    }
];

const QuizInterface: React.FC<QuizInterfaceProps> = ({ quiz, onClose, onSuccess }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});

    // Proctoring States
    // Proctoring States - Disabled by default as requested
    const [proctoringStep, setProctoringStep] = useState<'setup' | 'initializing' | 'active'>('active');
    const [permissions, setPermissions] = useState({ camera: false, screen: false });
    const [permError, setPermError] = useState<string | null>(null);
    const [guardianAlert, setGuardianAlert] = useState<string | null>(null);
    const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
    const [loadingQuestions, setLoadingQuestions] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);

    // Scroll lock for success modal
    useEffect(() => {
        if (showSuccess) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showSuccess]);

    const videoRef = useRef<HTMLVideoElement>(null);
    const screenRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sessionRef = useRef<any>(null);

    const hasGeneratedRef = useRef(false);

    // Initialize Quiz Data (Questions)
    useEffect(() => {
        const loadQuestions = async () => {
            if (hasGeneratedRef.current) return;
            hasGeneratedRef.current = true;

            setLoadingQuestions(true);
            try {
                const profile = await studentService.getProfile();
                const apiKey = profile.google_api_key || prompt("Enter your Google API Key for Gemini quiz generation:");

                if (!apiKey) {
                    alert("API Key required.");
                    hasGeneratedRef.current = false; // Reset if failed
                    onClose();
                    return;
                }

                const qData = await studentService.generateQuizQuestions(quiz.id, { api_key: apiKey });
                setQuizQuestions(qData.questions);
                if (quiz.time_limit) {
                    setTimeLeft(quiz.time_limit * 60);
                }
            } catch (err) {
                console.error("Failed to load questions", err);
                alert("Error loading quiz questions.");
                hasGeneratedRef.current = false; // Reset if failed
                onClose();
            } finally {
                setLoadingQuestions(false);
            }
        };
        loadQuestions();
    }, [quiz.id]);

    useEffect(() => {
        if (timeLeft === null || proctoringStep !== 'active' || showSuccess) return;

        if (timeLeft <= 0) {
            handleSubmitQuiz(true);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => (prev !== null ? prev - 1 : null));
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, proctoringStep, showSuccess]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const requestPermissions = async () => {
        setPermError(null);
        try {
            // Request Camera
            const camStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if (videoRef.current) videoRef.current.srcObject = camStream;
            setPermissions(prev => ({ ...prev, camera: true }));

            // Request Screen Share
            const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            if (screenRef.current) screenRef.current.srcObject = screenStream;
            setPermissions(prev => ({ ...prev, screen: true }));
        } catch (err: any) {
            console.error("Permission denied", err);
            setPermError(err.message || "Failed to access camera or screen. Ensure permissions are granted.");
        }
    };

    const initializeGuardianAI = async () => {
        setProctoringStep('initializing');
        setTimeout(() => {
            setProctoringStep('active');
        }, 2000);
    };

    // AI Streaming logic disabled as requested

    /* 
    const startStreamingToGemini = () => {
        // ... streaming logic disabled ...
    };
    */

    const handleAnswerChange = (value: any) => {
        const currentQ = quizQuestions[currentQuestionIndex] || FALLBACK_QUESTIONS[0];
        setAnswers(prev => ({ ...prev, [currentQ.id]: value }));
    };

    const currentQuestion = quizQuestions[currentQuestionIndex] || FALLBACK_QUESTIONS[0];
    const currentAnswer = answers[currentQuestion.id];
    const isFinalQuestion = quizQuestions.length > 0 && currentQuestionIndex === quizQuestions.length - 1;
    const isSubmittingRef = useRef(false);

    const handleSubmitQuiz = async (isAuto = false) => {
        if (!isAuto && Object.keys(answers).length < quizQuestions.length) {
            if (!window.confirm('You haven\'t answered all questions. Submit anyway?')) return;
        }
        if (isSubmittingRef.current) return;
        isSubmittingRef.current = true;
        setSubmitting(true);
        try {
            const profile = await studentService.getProfile();
            const apiKey = profile.google_api_key || prompt("Enter Google API Key to submit for Gemini analysis:");
            if (!apiKey) {
                isSubmittingRef.current = false;
                setSubmitting(false);
                return;
            }
            await studentService.submitQuiz(quiz.id, { answers, api_key: apiKey });
            setShowSuccess(true);
        } catch (err) {
            console.error("Submit failed", err);
            alert("Submission failed. Check your API key.");
            isSubmittingRef.current = false;
        } finally {
            setSubmitting(false);
        }
    };

    // Render Setup/Init/Active
    return (
        <div className="fixed inset-0 z-[200] bg-white font-outfit">
            {/* Helper Canvas for AI */}
            <canvas ref={canvasRef} width={640} height={240} className="hidden" />

            {/* Generating Quiz Loader */}
            <AnimatePresence>
                {loadingQuestions && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[400] bg-slate-900 flex flex-col items-center justify-center p-8 text-center"
                    >
                        <div className="w-32 h-32 rounded-full border-4 border-blue-500/30 flex items-center justify-center relative mb-8">
                            <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            <Zap size={48} className="text-blue-400 group-hover:scale-110 transition-transform" />
                        </div>
                        <h2 className="text-4xl font-display font-bold text-white mb-4">Generating Your Test</h2>
                        <p className="text-slate-400 font-medium text-lg max-w-md">Our AI is meticulously crafting your assessment based on the provided materials. This will only take a moment.</p>

                        <div className="mt-12 flex space-x-2">
                            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-3 h-3 bg-blue-500 rounded-full" />
                            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-3 h-3 bg-blue-400 rounded-full" />
                            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-3 h-3 bg-blue-300 rounded-full" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Setup Phase */}
            {/* Proctoring Setup Phase Disabled */}

            {/* Active Quiz Interface */}
            {proctoringStep === 'active' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full bg-white">
                    <header className="h-20 bg-white border-b border-slate-100 px-8 flex items-center justify-between shrink-0">
                        <div className="flex items-center space-x-6">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                                <Zap size={20} fill="currentColor" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-lg">{quiz.title}</h4>
                                <div className="flex items-center space-x-2">
                                    <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-100">{quiz.quiz_format || 'Objective'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 max-w-md mx-20">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Question {currentQuestionIndex + 1} of {quizQuestions.length}</span>
                                <span className="text-sm font-black text-slate-900">{quizQuestions.length > 0 ? Math.round(((currentQuestionIndex + 1) / quizQuestions.length) * 100) : 0}%</span>
                            </div>
                            <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${quizQuestions.length > 0 ? ((currentQuestionIndex + 1) / quizQuestions.length) * 100 : 0}%` }} className="h-full bg-blue-600" />
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            {timeLeft !== null && (
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold border transition-all ${timeLeft < 60 ? 'bg-red-50 text-red-600 border-red-200 animate-pulse ring-4 ring-red-500/10' : 'bg-slate-50 text-slate-600 border-slate-100'}`}>
                                    <Clock size={16} />
                                    <span>{formatTime(timeLeft)}</span>
                                </div>
                            )}
                            <button onClick={onClose} className="p-3 text-slate-300 hover:text-red-500 transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                    </header>

                    <main className="flex-1 overflow-y-auto bg-slate-50/30 p-8">
                        <div className="max-w-4xl mx-auto space-y-8">
                            <div className="space-y-4">
                                <h2 className="text-2xl font-display font-bold text-slate-900 leading-tight">
                                    {currentQuestion.text}
                                </h2>
                            </div>

                            {/* Question Content Area */}
                            <div className="min-h-[300px]">
                                {(currentQuestion.type === 'objective' || currentQuestion.type === 'true_false' || currentQuestion.type === 'multiple-choice') && (
                                    <div className="grid grid-cols-1 gap-3">
                                        {currentQuestion.options?.map((option: any, idx: number) => (
                                            <motion.button
                                                key={idx}
                                                whileHover={{ y: -1 }}
                                                whileTap={{ scale: 0.99 }}
                                                onClick={() => handleAnswerChange(option)}
                                                className={`p-6 rounded-2xl border-2 text-left transition-all flex items-center justify-between group ${currentAnswer === option
                                                    ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-500/10'
                                                    : 'bg-white border-slate-100 text-slate-700 hover:border-blue-300'
                                                    }`}
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold border text-sm ${currentAnswer === option ? 'bg-white/20 border-white/20' : 'bg-slate-50 border-slate-100'}`}>
                                                        {String.fromCharCode(65 + idx)}
                                                    </span>
                                                    <span className="text-lg font-bold">{option}</span>
                                                </div>
                                                {currentAnswer === option && <CheckCircle2 size={20} />}
                                            </motion.button>
                                        ))}
                                    </div>
                                )}

                                {(currentQuestion.type === 'theory' || currentQuestion.type === 'subjective') && (
                                    <div className="space-y-4">
                                        <textarea
                                            value={currentAnswer || ''}
                                            onChange={(e) => handleAnswerChange(e.target.value)}
                                            placeholder="Type your detailed answer here..."
                                            className="w-full min-h-[200px] bg-white border-2 border-slate-100 rounded-3xl p-6 text-lg font-medium outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all shadow-sm"
                                        />
                                    </div>
                                )}

                                {(currentQuestion.type === 'short-answer' || currentQuestion.type === 'fill_in_the_blank') && (
                                    <div className="max-w-xl">
                                        <input
                                            type="text"
                                            value={currentAnswer || ''}
                                            onChange={(e) => handleAnswerChange(e.target.value)}
                                            placeholder="Type your answer..."
                                            className="w-full bg-white border-2 border-slate-100 rounded-2xl p-5 text-xl font-bold outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all shadow-sm"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Footer Navigation */}
                            <div className="flex items-center justify-between pt-12 border-t border-slate-100">
                                <button
                                    disabled={currentQuestionIndex === 0}
                                    onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                                    className="px-8 py-4 text-slate-400 font-bold hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed flex items-center space-x-2"
                                >
                                    <ArrowLeft size={20} />
                                    <span>Previous Question</span>
                                </button>

                                <button
                                    disabled={!currentAnswer || submitting}
                                    onClick={() => {
                                        if (isFinalQuestion) {
                                            handleSubmitQuiz();
                                        } else {
                                            setCurrentQuestionIndex(prev => prev + 1);
                                        }
                                    }}
                                    className={`px-10 py-4 rounded-2xl font-display font-bold text-lg shadow-xl transition-all flex items-center space-x-3 ${!currentAnswer || submitting ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
                                        }`}
                                >
                                    {submitting ? <Loader2 className="animate-spin" /> : (
                                        <>
                                            <span>{isFinalQuestion ? 'Submit Quiz' : 'Next Question'}</span>
                                            {isFinalQuestion ? <Zap size={20} fill="currentColor" /> : <ChevronRight size={20} />}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </main>

                </motion.div>
            )}

            <SuccessModal
                isOpen={showSuccess}
                onClose={() => {
                    setShowSuccess(false);
                    onSuccess();
                }}
                title="Quiz Submitted!"
                message="Your answers have been sent for AI analysis. You can check your results in the history tab shortly."
                actionLabel="Awesome"
                theme="green"
            />
        </div>
    );
};

export default QuizInterface;
