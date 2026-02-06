import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Clock, Book, Activity, Zap } from 'lucide-react';
import { studentService } from '../../services/api';

interface HistoryDetailsViewProps {
    attemptId: string;
    onBack: () => void;
}

const HistoryDetailsView: React.FC<HistoryDetailsViewProps> = ({ attemptId, onBack }) => {
    const [attempt, setAttempt] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAttemptDetails = async () => {
            try {
                const data = await studentService.getAttemptDetails(attemptId);
                setAttempt(data);
            } catch (err) {
                console.error("Failed to fetch attempt details", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAttemptDetails();
    }, [attemptId]);

    if (loading) {
        return <div className="p-20 text-center font-bold text-slate-400">Synchronizing neural metrics...</div>;
    }

    if (!attempt) {
        return (
            <div className="p-10 text-center space-y-6">
                <p className="text-rose-500 font-bold">Failed to retrieve attempt data.</p>
                <button onClick={onBack} className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold">Return to History</button>
            </div>
        );
    }

    const scoreParts = attempt.score?.split('/') || ['0', '1'];
    const percentage = Math.round((parseFloat(scoreParts[0]) / parseFloat(scoreParts[1])) * 100);

    return (
        <div className="space-y-8 animate-in slide-in-from-right-10 duration-500">
            {/* Header */}
            <div className="flex items-center gap-6">
                <button
                    onClick={onBack}
                    className="p-3 bg-white border border-[#e2e8f0] rounded-2xl hover:bg-slate-50 transition-all group shadow-sm"
                >
                    <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-slate-900" />
                </button>
                <div>
                    <h2 className="text-2xl font-bold font-display">{attempt.quiz_topic}</h2>
                    <p className="text-sm text-slate-400 font-medium mt-1 flex items-center gap-2">
                        <Clock className="w-3 h-3" /> {new Date(attempt.completed_at).toLocaleDateString()}
                        <span className="w-1 h-1 bg-slate-300 rounded-full" />
                        <Book className="w-3 h-3" /> {attempt.quiz_format || 'Objective'}
                    </p>
                </div>
            </div>

            {/* Score Summary Card */}
            <div className="bg-white rounded-[40px] border border-[#e2e8f0] shadow-sm overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <div className="p-10 flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
                    <div>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Performance Summary</p>
                        <h3 className="text-4xl font-bold font-display mb-2 text-slate-900">
                            {percentage >= 80 ? 'Outstanding!' : percentage >= 60 ? 'Good Job!' : 'Keep Practicing'}
                        </h3>
                        <p className="text-slate-500 max-w-md">
                            You scored <span className="font-bold text-slate-900">{attempt.score}</span> on this assessment.
                            Review the feedback below to understand your mistakes and improve.
                        </p>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="text-center">
                            <div className={`w-32 h-32 rounded-full border-8 flex items-center justify-center text-3xl font-bold font-display
                                ${percentage >= 80 ? 'border-green-500 text-green-600 bg-green-50' :
                                    percentage >= 60 ? 'border-blue-500 text-blue-600 bg-blue-50' :
                                        'border-orange-500 text-orange-600 bg-orange-50'}`
                            }>
                                {percentage}%
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Questions Breakdown */}
            <div className="space-y-6">
                <h3 className="text-xl font-bold font-display px-2">Detailed Analysis</h3>

                <div className="grid gap-6">
                    {attempt.questions?.map((question: any, index: number) => {
                        const feedback = attempt.feedback?.find((f: any) => f.id === question.id);
                        const isCorrect = feedback?.correct;
                        const studentAnswer = attempt.answers?.[question.id];

                        return (
                            <div
                                key={question.id}
                                className="bg-white p-8 rounded-[32px] border border-[#e2e8f0] shadow-sm"
                            >
                                <div className="flex items-start gap-6">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-white font-bold text-lg
                                        ${feedback?.score >= 1 ? 'bg-green-500 shadow-lg shadow-green-500/20' :
                                            feedback?.score > 0 ? 'bg-orange-500 shadow-lg shadow-orange-500/20' :
                                                'bg-red-500 shadow-lg shadow-red-500/20'}`
                                    }>
                                        {index + 1}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest
                                                ${feedback?.score >= 1 ? 'bg-green-50 text-green-600' :
                                                    feedback?.score > 0 ? 'bg-orange-50 text-orange-600' :
                                                        'bg-red-50 text-red-600'}`
                                            }>
                                                {feedback?.score >= 1 ? 'Correct' : feedback?.score > 0 ? 'Partial' : 'Incorrect'}
                                            </span>
                                            {feedback?.score !== undefined && (
                                                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-widest">
                                                    Score: {feedback.score}/1
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-lg font-bold text-slate-900 mb-6 leading-relaxed">{question.text}</p>

                                        {question.options && Array.isArray(question.options) ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                                                {question.options.map((option: string, i: number) => {
                                                    const isSelected = option === studentAnswer;
                                                    let className = "bg-slate-50 border-slate-100 text-slate-600";
                                                    if (isSelected) {
                                                        className = isCorrect
                                                            ? "bg-green-50 border-green-200 text-green-700 ring-1 ring-green-200"
                                                            : "bg-red-50 border-red-200 text-red-700 ring-1 ring-red-200";
                                                    }

                                                    return (
                                                        <div
                                                            key={i}
                                                            className={`p-4 rounded-2xl border text-sm font-medium transition-all ${className}`}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px]
                                                                    ${isSelected ? 'border-current' : 'border-slate-300'}`}>
                                                                    {String.fromCharCode(65 + i)}
                                                                </div>
                                                                {option}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Your Answer</p>
                                                <p className="font-medium text-slate-900">{studentAnswer || 'No answer provided'}</p>
                                            </div>
                                        )}

                                        {feedback?.feedback && (
                                            <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-3xl">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                    <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">AI Analysis</p>
                                                </div>
                                                <p className="text-sm text-slate-700 leading-relaxed">{feedback.feedback}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default HistoryDetailsView;
