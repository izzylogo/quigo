import React, { useState, useEffect } from 'react';
import { FloatingCard } from '../../components/Layout';
import { ArrowLeft, ArrowRight, LineChart as LineChartIcon, Clock, Mail, Calendar, Hash, Award, Zap, Book, Activity } from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Student } from '../../types';
import { schoolService } from '../../services/api';

interface StudentDetailProps {
    student: Student;
    onBack: () => void;
}

const StudentDetail: React.FC<StudentDetailProps> = ({ student, onBack }) => {
    const [attempts, setAttempts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [studentProfile, setStudentProfile] = useState<any>(null);
    const [selectedAttempt, setSelectedAttempt] = useState<any>(null);
    const [attemptDetails, setAttemptDetails] = useState<any>(null);
    const [loadingAttempt, setLoadingAttempt] = useState(false);
    const [undoneQuizzes, setUndoneQuizzes] = useState<any[]>([]);
    const [showDoneTests, setShowDoneTests] = useState(true);
    const [activityPage, setActivityPage] = useState(1);
    const activityItemsPerPage = 3;

    useEffect(() => {
        const fetchStudentData = async () => {
            setLoading(true);
            try {
                const data = await schoolService.getStudentAttempts(student.id);
                setAttempts(data.attempts || []);
                setUndoneQuizzes(data.undone_quizzes || []);
                setStudentProfile(data.student || null);
            } catch (err) {
                console.error("Failed to fetch student data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStudentData();
    }, [student.id]);

    const handleSelectAttempt = async (attempt: any) => {
        setLoadingAttempt(true);
        setSelectedAttempt(attempt);
        try {
            const details = await schoolService.getAttemptDetails(attempt.id);
            setAttemptDetails(details);
        } catch (err) {
            console.error("Failed to fetch attempt details", err);
        } finally {
            setLoadingAttempt(false);
        }
    };

    if (selectedAttempt) {
        return (
            <div className="space-y-8 animate-in slide-in-from-right-10 duration-500">
                {/* Header */}
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => { setSelectedAttempt(null); setAttemptDetails(null); }}
                        className="p-3 bg-white border border-[#e2e8f0] rounded-2xl hover:bg-slate-50 transition-all group shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-slate-900" />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold font-display uppercase tracking-tight">{selectedAttempt.quiz_topic}</h2>
                        <p className="text-sm text-slate-400 font-medium mt-1 flex items-center gap-2">
                            <Clock className="w-3 h-3" /> {new Date(selectedAttempt.completed_at).toLocaleDateString()}
                            <span className="w-1 h-1 bg-slate-300 rounded-full" />
                            <Book className="w-3 h-3" /> {selectedAttempt.quiz_format || 'Objective'}
                            <span className="w-1 h-1 bg-slate-300 rounded-full" />
                            <Hash className="w-3 h-3" /> {selectedAttempt.num_questions || 'N/A'} Questions
                        </p>
                    </div>
                </div>

                {loadingAttempt ? (
                    <div className="p-20 text-center font-bold text-slate-400">Synchronizing neural metrics...</div>
                ) : attemptDetails ? (
                    <div className="space-y-8">
                        {/* Score Summary Card */}
                        <div className="bg-white rounded-[40px] border border-[#e2e8f0] shadow-sm overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                            <div className="p-10 flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
                                <div>
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Institutional Scorecard</p>
                                    <h3 className="text-4xl font-bold font-display mb-2 text-slate-900">
                                        {Math.round((parseInt(attemptDetails.score.split('/')[0]) / parseInt(attemptDetails.score.split('/')[1])) * 100) >= 80 ? 'Exceptional Cognitive Yield' : 'Standard Performance Vector'}
                                    </h3>
                                    <p className="text-slate-500 max-w-md">
                                        The student demonstration reflects the specific feedback metrics generated by Guardian AI.
                                    </p>
                                </div>

                                <div className="flex items-center gap-8">
                                    <div className="text-center">
                                        <div className={`w-32 h-32 rounded-full border-8 flex items-center justify-center text-3xl font-bold font-display
                                            ${Math.round((parseFloat(attemptDetails.score.split('/')[0]) / parseFloat(attemptDetails.score.split('/')[1])) * 100) >= 80 ? 'border-green-500 text-green-600 bg-green-50' :
                                                Math.round((parseFloat(attemptDetails.score.split('/')[0]) / parseFloat(attemptDetails.score.split('/')[1])) * 100) >= 60 ? 'border-blue-500 text-blue-600 bg-blue-50' :
                                                    'border-orange-500 text-orange-600 bg-orange-50'}`
                                        }>
                                            {Math.round((parseFloat(attemptDetails.score.split('/')[0]) / parseFloat(attemptDetails.score.split('/')[1])) * 100)}%
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Questions Breakdown */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold font-display px-2 lowercase tracking-tight">Detailed Analysis</h3>

                            <div className="grid gap-6">
                                {attemptDetails.questions?.map((question: any, index: number) => {
                                    const feedback = attemptDetails.feedback?.find((f: any) => f.id === question.id);
                                    const isCorrect = feedback?.correct;
                                    const studentAnswer = attemptDetails.answers?.[question.id];

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

                                                    <p className="text-lg font-bold text-slate-900 mb-6 leading-relaxed lowercase">{question.text}</p>

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
                                                                        className={`p-4 rounded-2xl border text-sm font-medium transition-all ${className} lowercase`}
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
                                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Student Response</p>
                                                            <p className="font-medium text-slate-900 lowercase">{studentAnswer || 'No response recorded'}</p>
                                                        </div>
                                                    )}

                                                    {feedback?.feedback && (
                                                        <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-3xl">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Guardian AI Analysis</p>
                                                            </div>
                                                            <p className="text-sm text-slate-700 leading-relaxed lowercase">{feedback.feedback}</p>
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
                ) : (
                    <div className="p-20 text-center text-rose-500 font-bold">Failed to load attempt metrics.</div>
                )}
            </div>
        );
    }

    const studentHistoryData = attempts.length > 0
        ? attempts.map(a => {
            const date = new Date(a.completed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            let score = 0;
            if (a.score && typeof a.score === 'string') {
                const parts = a.score.split('/');
                if (parts.length === 2) {
                    score = Math.round((parseFloat(parts[0]) / parseFloat(parts[1])) * 100);
                }
            }
            return {
                date,
                name: a.quiz_topic.substring(0, 15) + (a.quiz_topic.length > 15 ? '...' : ''),
                fullTopic: a.quiz_topic,
                score,
                rawScore: a.score
            };
        }).reverse()
        : [];

    const displayData = studentHistoryData;

    const calculateAvgScore = () => {
        if (attempts.length === 0) return 0;
        const total = attempts.reduce((acc, a) => {
            if (a.score && typeof a.score === 'string') {
                const parts = a.score.split('/');
                if (parts.length === 2) {
                    return acc + (parseFloat(parts[0]) / parseFloat(parts[1]));
                }
            }
            return acc;
        }, 0);
        return Math.round((total / attempts.length) * 100);
    };

    const avgScore = calculateAvgScore();

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-5 rounded-[2rem] shadow-2xl border border-slate-50 animate-in fade-in zoom-in-95 duration-200">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{payload[0].payload.date}</p>
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-blue-600 shadow-lg shadow-blue-500/50" />
                        <p className="text-2xl font-black text-slate-900">{payload[0].value}%</p>
                    </div>
                    {payload[0].payload.fullTopic && (
                        <div className="mt-2 pt-2 border-t border-slate-50 flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-slate-300" />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Topic: {payload[0].payload.fullTopic}</p>
                        </div>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-8 pb-16 font-outfit">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={onBack}
                        className="w-10 h-10 flex items-center justify-center text-slate-600 hover:text-blue-600 transition-all font-black"
                    >
                        <ArrowLeft size={20} strokeWidth={3} />
                    </button>
                    <h1 className="text-2xl font-black text-slate-800 lowercase">student Profile</h1>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowDoneTests(!showDoneTests)}
                        className={`px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${showDoneTests
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                            : 'bg-white text-slate-400 border border-slate-100 hover:border-blue-100 hover:text-blue-600'
                            }`}
                    >
                        {showDoneTests ? 'Hide Done Tests' : 'Show Done Tests'}
                    </button>
                </div>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center space-x-8 w-full md:w-auto">
                    <div className="w-28 h-28 bg-blue-100 text-blue-600 rounded-[2rem] flex items-center justify-center text-5xl font-black shadow-inner">
                        {student.name.charAt(0).toLowerCase()}
                    </div>
                    <div className="space-y-3">
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight lowercase">{student.name}</h2>
                        <div className="flex flex-wrap gap-2">
                            <div className="px-5 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center space-x-2.5">
                                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">ID:</span>
                                <span className="text-[13px] font-bold text-slate-600">{student.student_id || student.studentId}</span>
                            </div>
                            <div className="px-5 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center space-x-2.5">
                                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Email:</span>
                                <span className="text-[13px] font-bold text-slate-600">{student.email}</span>
                            </div>
                            <div className="px-5 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center space-x-2.5">
                                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Class:</span>
                                <span className="text-[13px] font-bold text-slate-600">{studentProfile?.classroom?.name || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6 w-full md:w-auto">
                    <div className="p-7 px-10 bg-blue-50/50 rounded-[2.5rem] border border-blue-100 text-center flex flex-col items-center">
                        <div className="text-4xl font-black text-blue-600">{attempts.length}</div>
                        <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest mt-1">Tests Taken</div>
                    </div>
                    <div className="p-7 px-10 bg-emerald-50/50 rounded-[2.5rem] border border-emerald-100 text-center flex flex-col items-center">
                        <div className="text-4xl font-black text-emerald-600">{avgScore}%</div>
                        <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mt-1">Avg. Score</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Performance History */}
                <div className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm min-h-[480px] max-h-[600px]">
                    <div className="flex items-center space-x-3 mb-12">
                        <LineChartIcon size={24} className="text-blue-500" />
                        <h3 className="text-2xl font-black text-slate-800 lowercase">Performance History</h3>
                    </div>
                    <div className="w-full h-[320px] max-h-[400px] overflow-x-auto custom-scrollbar pb-6">
                        {loading ? (
                            <div className="w-full h-full flex items-center justify-center">
                                <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full" />
                            </div>
                        ) : displayData.length > 0 ? (
                            <div style={{ minWidth: Math.max(displayData.length * 80, 400), height: '100%' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                        data={[
                                            { name: 'Start', score: 0 },
                                            ...displayData
                                        ]}
                                    >
                                        <defs>
                                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 800 }}
                                            dy={10}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 800 }}
                                            domain={[0, 100]}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area
                                            type="monotone"
                                            dataKey="score"
                                            stroke="#3b82f6"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorScore)"
                                            animationDuration={1500}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300 font-black italic">
                                No assessment history available yet.
                            </div>
                        )}
                    </div>
                </div>

                {/* Assessments Section */}
                <div className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm min-h-[480px] max-h-[600px]">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center space-x-3">
                            <Activity size={24} className="text-blue-500" />
                            <h3 className="text-2xl font-black text-slate-800 lowercase">Asessments</h3>
                        </div>

                        {/* Chip Navigation */}
                        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-full border border-slate-100">
                            <button
                                onClick={() => { setShowDoneTests(false); setActivityPage(1); }}
                                className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${!showDoneTests
                                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-200'
                                    : 'text-slate-400 hover:text-orange-500'
                                    }`}
                            >
                                Undone ({undoneQuizzes.length})
                            </button>
                            <button
                                onClick={() => { setShowDoneTests(true); setActivityPage(1); }}
                                className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${showDoneTests
                                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200'
                                    : 'text-slate-400 hover:text-emerald-500'
                                    }`}
                            >
                                Done ({attempts.length})
                            </button>
                        </div>
                    </div>

                    <div className="space-y-5">
                        {loading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-24 bg-slate-50 animate-pulse rounded-[32px]" />
                                ))}
                            </div>
                        ) : (
                            <>
                                {/* Undone Tests Content */}
                                {!showDoneTests && undoneQuizzes.length > 0 && (
                                    <div className="space-y-4">
                                        {undoneQuizzes.slice((activityPage - 1) * activityItemsPerPage, activityPage * activityItemsPerPage).map(quiz => (
                                            <div
                                                key={quiz.id}
                                                className="p-7 bg-orange-50/30 border border-orange-100/50 rounded-[32px] flex items-center justify-between group grayscale-[0.5] opacity-80 hover:grayscale-0 hover:opacity-100 transition-all"
                                            >
                                                <div className="flex items-center space-x-5">
                                                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-orange-400 shadow-sm border border-orange-100">
                                                        <Clock size={24} />
                                                    </div>
                                                    <div>
                                                        <div className="text-xl font-black text-slate-800 mb-0.5 lowercase tracking-tight">{quiz.topic}</div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[10px] font-black bg-white px-2 py-0.5 rounded border border-orange-100 text-orange-500 uppercase tracking-widest">{quiz.quiz_format}</span>
                                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{quiz.num_questions} Questions</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="px-5 py-2.5 bg-white rounded-2xl border border-orange-100 text-[10px] font-black text-orange-500 uppercase tracking-widest shadow-sm">
                                                    Pending
                                                </div>
                                            </div>
                                        ))}

                                        {/* Undone Tests Pagination */}
                                        {undoneQuizzes.length > activityItemsPerPage && (
                                            <div className="flex items-center justify-between pt-6 mt-4 border-t border-slate-50">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                    Page {activityPage} of {Math.ceil(undoneQuizzes.length / activityItemsPerPage)}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => setActivityPage(prev => Math.max(prev - 1, 1))}
                                                        disabled={activityPage === 1}
                                                        className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-orange-50 hover:text-orange-600 transition-all disabled:opacity-20 shadow-sm"
                                                    >
                                                        <ArrowLeft size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => setActivityPage(prev => Math.min(prev + 1, Math.ceil(undoneQuizzes.length / activityItemsPerPage)))}
                                                        disabled={activityPage === Math.ceil(undoneQuizzes.length / activityItemsPerPage)}
                                                        className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-orange-50 hover:text-orange-600 transition-all disabled:opacity-20 shadow-sm"
                                                    >
                                                        <ArrowRight size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Done Tests Content */}
                                {showDoneTests && attempts.length > 0 && (
                                    <div className="space-y-4">
                                        {attempts.slice((activityPage - 1) * activityItemsPerPage, activityPage * activityItemsPerPage).map(attempt => (
                                            <div
                                                key={attempt.id}
                                                onClick={() => handleSelectAttempt(attempt)}
                                                className="p-7 bg-white border border-slate-100 rounded-[32px] flex items-center justify-between group cursor-pointer hover:border-blue-100 transition-all shadow-sm"
                                            >
                                                <div className="flex items-center space-x-5">
                                                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                                        <Award size={24} />
                                                    </div>
                                                    <div>
                                                        <div className="text-xl font-black text-slate-800 group-hover:text-blue-600 transition-colors mb-0.5 lowercase tracking-tight">{attempt.quiz_topic}</div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[10px] font-black bg-slate-50 group-hover:bg-blue-50 px-2 py-0.5 rounded border border-slate-100 text-slate-400 group-hover:text-blue-600 uppercase tracking-widest">{attempt.quiz_format}</span>
                                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{attempt.num_questions} Questions</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="p-4 px-6 bg-slate-50 rounded-2xl border border-slate-100 text-xl font-black text-slate-900 shadow-sm group-hover:border-blue-100 group-hover:text-blue-600 transition-all">
                                                    {attempt.score}
                                                </div>
                                            </div>
                                        ))}

                                        {/* Done Tests Pagination */}
                                        {attempts.length > activityItemsPerPage && (
                                            <div className="flex items-center justify-between pt-6 mt-4 border-t border-slate-50">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                    Page {activityPage} of {Math.ceil(attempts.length / activityItemsPerPage)}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setActivityPage(prev => Math.max(prev - 1, 1)); }}
                                                        disabled={activityPage === 1}
                                                        className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-all disabled:opacity-20 shadow-sm"
                                                    >
                                                        <ArrowLeft size={16} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setActivityPage(prev => Math.min(prev + 1, Math.ceil(attempts.length / activityItemsPerPage))); }}
                                                        disabled={activityPage === Math.ceil(attempts.length / activityItemsPerPage)}
                                                        className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-all disabled:opacity-20 shadow-sm"
                                                    >
                                                        <ArrowRight size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Empty States */}
                                {!showDoneTests && undoneQuizzes.length === 0 && (
                                    <div className="py-20 text-center">
                                        <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                            <Clock size={32} className="text-orange-400" />
                                        </div>
                                        <p className="text-slate-300 font-black italic font-display">No pending assessments</p>
                                    </div>
                                )}

                                {showDoneTests && attempts.length === 0 && (
                                    <div className="py-20 text-center">
                                        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                            <Award size={32} className="text-emerald-400" />
                                        </div>
                                        <p className="text-slate-300 font-black italic font-display">No completed assessments</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDetail;

