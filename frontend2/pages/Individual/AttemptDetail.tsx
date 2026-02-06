import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Book, Activity, CheckCircle, XCircle } from 'lucide-react';
import { individualService } from '../../services/api';

interface AttemptDetailProps {
    attemptId: number;
    onBack: () => void;
}

const AttemptDetail: React.FC<AttemptDetailProps> = ({ attemptId, onBack }) => {
    const [attempt, setAttempt] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const data = await individualService.getAttemptDetails(attemptId);
                setAttempt(data);
            } catch (err) {
                console.error("Failed to fetch details", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [attemptId]);

    if (loading) return <div className="p-20 text-center font-bold text-slate-400">Loading details...</div>;
    if (!attempt) return <div className="p-10 text-center">Failed to load attempt.</div>;

    const scoreStr = attempt.score || "0%";
    const percentage = scoreStr.includes('%')
        ? parseFloat(scoreStr)
        : (() => {
            const parts = scoreStr.split('/');
            return parts.length === 2 ? Math.round((parseFloat(parts[0]) / parseFloat(parts[1])) * 100) : 0;
        })();

    const mark = attempt.mark || (scoreStr.includes('/') ? scoreStr : null);

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
                        <Clock className="w-3 h-3" /> {attempt.timestamp}
                        <span className="w-1 h-1 bg-slate-300 rounded-full" />
                        <Book className="w-3 h-3" /> {attempt.quiz_format}
                    </p>
                </div>
            </div>

            {/* Score Card */}
            <div className="bg-white rounded-[40px] border border-[#e2e8f0] shadow-sm p-10 flex items-center justify-between">
                <div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Performance Summary</p>
                    <h3 className="text-4xl font-bold font-display mb-2 text-slate-900">
                        {percentage >= 80 ? 'Outstanding!' : percentage >= 60 ? 'Good Job!' : 'Keep Practicing'}
                    </h3>
                    <p className="text-slate-500">You scored <span className="font-bold text-slate-900">{scoreStr}</span> {mark ? <>(Mark: <span className="font-bold text-blue-600">{mark}</span>)</> : ""}</p>
                </div>
                <div className={`w-32 h-32 rounded-full border-8 flex items-center justify-center text-3xl font-bold
                    ${percentage >= 80 ? 'border-green-500 text-green-600' : 'border-blue-500 text-blue-600'}`}>
                    {percentage}%
                </div>
            </div>

            {/* Detailed Analysis */}
            <div className="space-y-6">
                <h3 className="text-xl font-bold font-display px-2">Detailed Analysis</h3>
                <div className="grid gap-6">
                    {attempt.questions?.map((question: any, index: number) => {
                        const feedbackItem = attempt.feedback?.find((f: any) => f.id === question.id);
                        const isCorrect = feedbackItem?.correct;
                        const studentAnswer = feedbackItem?.user_answer;

                        return (
                            <div key={question.id} className="bg-white p-8 rounded-[32px] border border-[#e2e8f0] shadow-sm">
                                <div className="flex items-start gap-6">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-white font-bold text-lg
                                        ${feedbackItem?.score >= 1 ? 'bg-green-500' :
                                            feedbackItem?.score > 0 ? 'bg-orange-500' :
                                                'bg-red-500'}`}>
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest
                                                ${feedbackItem?.score >= 1 ? 'bg-green-50 text-green-600' :
                                                    feedbackItem?.score > 0 ? 'bg-orange-50 text-orange-600' :
                                                        'bg-red-50 text-red-600'}`
                                            }>
                                                {feedbackItem?.score >= 1 ? 'Correct' : feedbackItem?.score > 0 ? 'Partial' : 'Incorrect'}
                                            </span>
                                            {feedbackItem?.score !== undefined && (
                                                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-widest">
                                                    Score: {feedbackItem.score}/1
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-lg font-bold text-slate-900 mb-6">{question.text}</p>

                                        {/* Options Rendering */}
                                        {question.options && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                                                {Array.isArray(question.options) ? (
                                                    question.options.map((opt: string, i: number) => (
                                                        <div key={i} className={`p-4 rounded-2xl border ${opt === studentAnswer ? (isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200') : 'bg-slate-50'}`}>
                                                            {opt}
                                                        </div>
                                                    ))
                                                ) : (
                                                    Object.entries(question.options).map(([key, val]: any) => (
                                                        <div key={key} className={`p-4 rounded-2xl border ${key === studentAnswer ? (isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200') : 'bg-slate-50'}`}>
                                                            <span className="font-bold mr-2">{key}.</span> {val}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        )}

                                        {/* Fallback layout for text answers */}
                                        {!question.options && (
                                            <div className="mb-6 p-4 bg-slate-50 rounded-2xl">
                                                <p className="text-xs font-bold text-slate-400 mb-2">YOUR ANSWER</p>
                                                <p>{studentAnswer || 'N/A'}</p>
                                            </div>
                                        )}

                                        <div className="mb-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                                            <p className="text-xs font-bold text-emerald-600 uppercase mb-2">CORRECT ANSWER</p>
                                            <p className="text-slate-700 font-medium">{question.correct_answer || feedbackItem?.correct_answer || "See feedback"}</p>
                                        </div>

                                        {/* AI Feedback */}
                                        <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-3xl">
                                            <p className="text-xs font-bold text-blue-600 uppercase mb-2">AI Analysis</p>
                                            <p className="text-sm text-slate-700">{feedbackItem?.feedback || "No feedback available."}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

export default AttemptDetail;
