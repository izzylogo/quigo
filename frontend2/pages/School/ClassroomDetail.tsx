import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, ClipboardList, CheckCircle2, TrendingUp, AlertCircle,
    ChevronRight, Plus, BarChart3, X, Trash2, ShieldAlert, Loader2,
    Trophy, Medal, Crown
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, AreaChart, Area, LineChart, Line
} from 'recharts';
import { FloatingCard } from '../../components/Layout';
import { Classroom, Student } from '../../types';
import { schoolService } from '../../services/api';
import PrepareTest from './PrepareTest';
import AddStudentModal from '../../components/school/AddStudentModal';

interface ClassroomDetailProps {
    classroom: Classroom;
    onBack: () => void;
    onSelectStudent: (student: Student) => void;
}

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const ClassroomDetail: React.FC<ClassroomDetailProps> = ({ classroom, onBack, onSelectStudent }) => {
    const [mode, setMode] = useState<'analytics' | 'prepare'>('analytics');
    const [loading, setLoading] = useState(true);
    const [details, setDetails] = useState<any>(null);
    const [showAddStudent, setShowAddStudent] = useState(false);
    const [selectedQuiz, setSelectedQuiz] = useState<any>(null);
    const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
    const [deleteStep, setDeleteStep] = useState(1);
    const [deleting, setDeleting] = useState(false);

    const fetchDetails = async () => {
        try {
            const data = await schoolService.getClassroomDetails(classroom.id);
            setDetails(data);
        } catch (error) {
            console.error("Failed to fetch classroom details", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchDetails();
    }, [classroom.id]);

    // Scroll lock for modals
    useEffect(() => {
        if (selectedQuiz || showAddStudent) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedQuiz, showAddStudent]);

    if (loading) {
        return <div className="p-20 text-center font-bold text-slate-400">Loading classroom details...</div>;
    }

    const students = details?.students || [];
    const quizzes = details?.quizzes || [];

    if (mode === 'prepare') {
        return <PrepareTest classroom={classroom} onBack={() => setMode('analytics')} students={students} quizzes={quizzes} onRefresh={fetchDetails} />;
    }

    // Sort students by average score to get top performers
    const sortedStudents = [...students].sort((a, b) => (b.average_score || 0) - (a.average_score || 0));
    const topPerformers = sortedStudents.slice(0, 3);

    const onSelectQuiz = (quiz: any) => {
        const scores = students
            .map((s: any) => ({ name: s.name.split(' ')[0], score: s.quiz_scores?.[quiz.id] }))
            .filter(s => s.score !== undefined);
        setSelectedQuiz({ ...quiz, allScores: scores });
    };

    const handleDeleteClick = (e: React.MouseEvent, student: Student) => {
        e.stopPropagation();
        setStudentToDelete(student);
        setDeleteStep(1);
    };

    const confirmDelete = async () => {
        if (!studentToDelete) return;
        if (deleteStep === 1) {
            setDeleteStep(2);
            return;
        }

        setDeleting(true);
        try {
            await schoolService.deleteStudent(studentToDelete.id);
            await fetchDetails();
            setStudentToDelete(null);
        } catch (err) {
            console.error("Failed to delete student", err);
            alert("Failed to delete student.");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <>
            <div className="space-y-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center space-x-6">
                        <button onClick={onBack} className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm">
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">{classroom.name.toLowerCase()}</h1>
                            <p className="text-slate-400 font-bold uppercase text-[11px] tracking-widest mt-1">
                                {classroom.grade_level || 'SS 3'} • CLASS MANAGER
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setMode('prepare')}
                        className="flex items-center space-x-3 px-8 py-4 bg-[#0f172a] text-white rounded-[2rem] font-bold text-sm shadow-xl hover:bg-slate-800 transition-all"
                    >
                        <ClipboardList size={20} />
                        <span>Create Test</span>
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm flex items-center space-x-5">
                        <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
                            <ClipboardList size={28} />
                        </div>
                        <div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Total Tests</span>
                            <div className="text-2xl font-black text-slate-900 mt-1">{details?.total_tests_count || 0}</div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm flex items-center space-x-5">
                        <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center">
                            <TrendingUp size={28} />
                        </div>
                        <div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Class Score</span>
                            <div className="text-2xl font-black text-slate-900 mt-1">{details?.average_score || 0}%</div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm flex items-center space-x-5">
                        <div className="w-14 h-14 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center">
                            <CheckCircle2 size={28} />
                        </div>
                        <div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Completion</span>
                            <div className="text-2xl font-black text-slate-900 mt-1">{details?.completion_percentage || 0}%</div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm flex items-center space-x-5">
                        <div className="w-14 h-14 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center">
                            <AlertCircle size={28} />
                        </div>
                        <div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Submissions</span>
                            <div className="text-2xl font-black text-slate-900 mt-1">{details?.submission_ratio || '0/0'}</div>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-7 bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm min-h-[500px]">
                        <div className="flex items-center space-x-3 mb-10">
                            <TrendingUp size={22} className="text-blue-500" />
                            <h3 className="text-xl font-bold text-slate-800">Score Progress</h3>
                        </div>
                        <div className="w-full h-[350px] overflow-x-auto custom-scrollbar pb-6 relative">
                            {students.length > 0 ? (
                                <div style={{ minWidth: Math.max(students.length * 100, 500), height: '100%' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={students
                                                .map((s: any) => ({
                                                    name: s.name.split(' ')[0].toLowerCase(),
                                                    fullName: s.name.toLowerCase(),
                                                    score: s.average_score || 0
                                                }))
                                            }
                                            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                                        >
                                            <defs>
                                                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                                                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis
                                                dataKey="name"
                                                fontSize={12}
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#94a3b8', fontWeight: 800 }}
                                                dy={10}
                                            />
                                            <YAxis
                                                fontSize={12}
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#94a3b8', fontWeight: 800 }}
                                                domain={[0, 100]}
                                            />
                                            <Tooltip
                                                cursor={{ fill: '#f8fafc', radius: 15 }}
                                                content={({ active, payload }) => {
                                                    if (active && payload && payload.length) {
                                                        const data = payload[0].payload;
                                                        return (
                                                            <div className="bg-white p-5 rounded-[2rem] shadow-2xl border border-slate-50 animate-in fade-in zoom-in-95 duration-200">
                                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{data.fullName}</p>
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-3 h-3 rounded-full bg-blue-600 shadow-lg shadow-blue-500/50" />
                                                                    <p className="text-2xl font-black text-slate-900">{payload[0].value}%</p>
                                                                </div>
                                                                <div className="mt-2 pt-2 border-t border-slate-50 flex items-center gap-2">
                                                                    <div className="w-1 h-1 rounded-full bg-slate-300" />
                                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Average Performance</p>
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                }}
                                            />
                                            <Bar
                                                dataKey="score"
                                                fill="url(#barGradient)"
                                                radius={[12, 12, 0, 0]}
                                                barSize={60}
                                                animationDuration={1500}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 font-black italic space-y-4">
                                    <div className="p-5 bg-slate-50 rounded-full">
                                        <BarChart3 size={32} />
                                    </div>
                                    <span>No student data available yet</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-5 bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm min-h-[500px]">
                        <div className="flex items-center space-x-3 mb-10">
                            <BarChart3 size={22} className="text-blue-500" />
                            <h3 className="text-xl font-bold text-slate-800">Participation</h3>
                        </div>
                        <div className="w-full h-[350px] relative">
                            {students.some((s: any) => s.attempts_count > 0) ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={[
                                                {
                                                    name: '90-100',
                                                    value: students.filter((s: any) => (s.average_score || 0) >= 90).length,
                                                    students: students.filter((s: any) => (s.average_score || 0) >= 90)
                                                },
                                                {
                                                    name: '80-89',
                                                    value: students.filter((s: any) => (s.average_score || 0) >= 80 && (s.average_score || 0) < 90).length,
                                                    students: students.filter((s: any) => (s.average_score || 0) >= 80 && (s.average_score || 0) < 90)
                                                },
                                                {
                                                    name: '70-79',
                                                    value: students.filter((s: any) => (s.average_score || 0) >= 70 && (s.average_score || 0) < 80).length,
                                                    students: students.filter((s: any) => (s.average_score || 0) >= 70 && (s.average_score || 0) < 80)
                                                },
                                                {
                                                    name: '60-69',
                                                    value: students.filter((s: any) => (s.average_score || 0) >= 60 && (s.average_score || 0) < 70).length,
                                                    students: students.filter((s: any) => (s.average_score || 0) >= 60 && (s.average_score || 0) < 70)
                                                },
                                                {
                                                    name: '50-59',
                                                    value: students.filter((s: any) => (s.average_score || 0) >= 50 && (s.average_score || 0) < 60).length,
                                                    students: students.filter((s: any) => (s.average_score || 0) >= 50 && (s.average_score || 0) < 60)
                                                },
                                                {
                                                    name: '<50',
                                                    value: students.filter((s: any) => (s.average_score || 0) < 50).length,
                                                    students: students.filter((s: any) => (s.average_score || 0) < 50)
                                                },
                                            ]}
                                            innerRadius={70}
                                            outerRadius={100}
                                            paddingAngle={0}
                                            dataKey="value"
                                        >
                                            {['#6366f1', '#10b981', '#14b8a6', '#f59e0b', '#f97316', '#ef4444'].map((color, index) => (
                                                <Cell key={`cell-${index}`} fill={color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    const data = payload[0].payload;
                                                    const studentInitials = data.students
                                                        .map((s: any) => s.name.split(' ').map((n: string) => n[0]).join('').toUpperCase())
                                                        .join(', ');

                                                    return (
                                                        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xl">
                                                            <div className="flex items-center space-x-2 mb-2">
                                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: payload[0].payload.fill }} />
                                                                <span className="text-xs font-black text-slate-800 uppercase tracking-tighter">Score: {data.name}</span>
                                                            </div>
                                                            <div className="text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-widest">{data.value} {data.value === 1 ? 'Student' : 'Students'}</div>
                                                            {studentInitials && (
                                                                <div className="max-w-[150px] flex flex-wrap gap-1">
                                                                    <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md truncate w-full">
                                                                        {studentInitials}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                        <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 font-black italic space-y-4">
                                    <div className="p-5 bg-slate-50 rounded-full">
                                        <BarChart3 size={32} />
                                    </div>
                                    <span>No participation data available</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Recent Tests Section */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold text-slate-800">Recent Tests</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {quizzes.map((q: any, idx: number) => {
                            const quizScores = students
                                .map((s: any) => {
                                    const scoreStr = s.quiz_scores?.[q.id.toString()];
                                    if (!scoreStr) return null;
                                    const parts = scoreStr.split('/');
                                    return { name: s.name.split(' ')[0].toLowerCase(), score: (parseFloat(parts[0]) / parseFloat(parts[1])) * 100 };
                                })
                                .filter((s: any) => s !== null) as { name: string, score: number }[];

                            const top3 = [...quizScores].sort((a, b) => b.score - a.score).slice(0, 3);
                            const chartType = idx % 3;

                            return (
                                <motion.div
                                    key={q.id}
                                    whileHover={{ y: -5 }}
                                    onClick={() => setSelectedQuiz({ ...q, allScores: quizScores })}
                                    className="bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-sm cursor-pointer group hover:border-blue-200 transition-all flex flex-col"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight text-sm truncate max-w-[150px]">{q.topic.toLowerCase()}</h4>
                                            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-0.5">{q.quiz_format || 'objective'}</p>
                                        </div>
                                        <div className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-lg text-[8px] font-black uppercase tracking-widest">
                                            {q.num_questions} QS
                                        </div>
                                    </div>

                                    <div className="flex-1 h-32 mb-6">
                                        {top3.length > 0 ? (
                                            <ResponsiveContainer width="100%" height="100%">
                                                {chartType === 0 ? (
                                                    <AreaChart data={top3}>
                                                        <defs>
                                                            <linearGradient id={`grad-${q.id}`} x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
                                                                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                                                            </linearGradient>
                                                        </defs>
                                                        <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} fill={`url(#grad-${q.id})`} />
                                                    </AreaChart>
                                                ) : chartType === 1 ? (
                                                    <BarChart data={top3}>
                                                        <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                                    </BarChart>
                                                ) : (
                                                    <LineChart data={top3}>
                                                        <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} />
                                                    </LineChart>
                                                )}
                                            </ResponsiveContainer>
                                        ) : (
                                            <div className="h-full flex items-center justify-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-100 italic text-[10px] text-slate-300 font-bold uppercase tracking-widest">
                                                no results yet
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                                        <div className="flex -space-x-2">
                                            {top3.map((s, i) => (
                                                <div key={i} className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[8px] font-black text-blue-600">
                                                    {s.name.charAt(0)}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            {quizScores.length} attempts
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Top Performers Section */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-slate-800">Top Performers</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {topPerformers.map((s: any) => (
                            <div key={s.id} className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm group hover:border-blue-200 transition-all cursor-pointer" onClick={() => onSelectStudent(s)}>
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-11 h-11 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center font-black text-lg shadow-inner">
                                            {s.name.charAt(0).toLowerCase()}
                                        </div>
                                        <div>
                                            <div className="font-black text-slate-800 group-hover:text-blue-600 transition-colors uppercase tracking-tight text-sm">{s.name.toLowerCase()}</div>
                                            <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{s.student_id}</div>
                                        </div>
                                    </div>
                                    <div className="px-2 py-0.5 bg-orange-50 text-orange-600 rounded-lg text-[9px] font-black">{s.average_score || 0}%</div>
                                </div>

                                <div className="grid grid-cols-3 gap-2 text-center mb-6 border-t border-slate-50 pt-5">
                                    <div>
                                        <div className="text-xs font-black text-slate-800">{s.attempts_count || 0}</div>
                                        <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Done</div>
                                    </div>
                                    <div className="border-x border-slate-50">
                                        <div className="text-xs font-black text-slate-800">{s.average_score || 0}%</div>
                                        <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Score</div>
                                    </div>
                                    <div>
                                        <div className="text-xs font-black text-slate-800">{Math.max(0, quizzes.length - (s.attempts_count || 0))}</div>
                                        <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Missed</div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <span>Progress</span>
                                        <span>{s.average_score || 0}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-600 rounded-full"
                                            style={{ width: `${s.average_score || 0}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Student Roster Section */}
                <div className="bg-white border border-slate-100 rounded-[3rem] overflow-hidden shadow-sm">
                    <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                        <h3 className="text-2xl font-bold text-slate-900">Student Roster</h3>
                        <button
                            onClick={() => setShowAddStudent(true)}
                            className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                        >
                            + Add Students
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#F8FAFC]">
                                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                    <th className="px-10 py-6">Position</th>
                                    <th className="px-10 py-6">Identity</th>
                                    <th className="px-10 py-6">Progress</th>
                                    <th className="px-10 py-6">Avg Score</th>
                                    <th className="px-10 py-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {sortedStudents.map((s: any, index: number) => {
                                    const position = index + 1;
                                    const isTop3 = position <= 3;

                                    return (
                                        <tr key={s.id} onClick={() => onSelectStudent(s)} className="hover:bg-slate-50 transition-all cursor-pointer group">
                                            <td className="px-10 py-6">
                                                <div className="flex items-center space-x-3">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shadow-sm shadow-inner
                                                        ${position === 1 ? 'bg-amber-100 text-amber-600 border border-amber-200' :
                                                            position === 2 ? 'bg-slate-100 text-slate-600 border border-slate-200' :
                                                                position === 3 ? 'bg-orange-100 text-orange-600 border border-orange-200' :
                                                                    'bg-slate-50 text-slate-400'}`}
                                                    >
                                                        {position === 1 ? <Trophy size={16} /> :
                                                            position === 2 ? <Medal size={16} /> :
                                                                position === 3 ? <Medal size={16} /> :
                                                                    position}
                                                    </div>
                                                    {isTop3 && (
                                                        <span className={`text-[10px] font-black uppercase tracking-widest
                                                            ${position === 1 ? 'text-amber-600' :
                                                                position === 2 ? 'text-slate-500' :
                                                                    'text-orange-600'}`}
                                                        >
                                                            {position === 1 ? '1st' : position === 2 ? '2nd' : '3rd'}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-10 py-6">
                                                <div className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{s.name.toLowerCase()}</div>
                                                <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{s.student_id}</div>
                                            </td>
                                            <td className="px-10 py-6">
                                                <div className="h-1.5 w-32 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${quizzes.length > 0 ? ((s.attempts_count || 0) / quizzes.length) * 100 : 0}%` }} />
                                                </div>
                                            </td>
                                            <td className="px-10 py-6">
                                                <div className={`px-3 py-1 rounded-lg text-sm font-black inline-block
                                                    ${isTop3 ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-blue-50 text-blue-600'}`}
                                                >
                                                    {s.average_score || 0}%
                                                </div>
                                            </td>
                                            <td className="px-10 py-6 text-right">
                                                <div className="flex items-center justify-end space-x-3">
                                                    <button
                                                        onClick={(e) => handleDeleteClick(e, s)}
                                                        className="w-10 h-10 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl flex items-center justify-center transition-all"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                    <ChevronRight className="text-slate-300 group-hover:text-blue-600 transition-colors" size={20} strokeWidth={3} />
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showAddStudent && (
                    <AddStudentModal
                        classroomId={classroom.id}
                        onClose={() => setShowAddStudent(false)}
                        onSuccess={() => { fetchDetails(); }}
                    />
                )}
                {selectedQuiz && (
                    <div className="fixed inset-0 z-[500] flex items-start justify-center p-6 pt-10 bg-slate-900/60 backdrop-blur-sm overflow-y-auto" onClick={() => setSelectedQuiz(null)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white rounded-[3rem] p-10 shadow-2xl max-w-4xl w-full relative overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-10">
                                <div>
                                    <h3 className="text-3xl font-black text-slate-900 lowercase tracking-tight">{selectedQuiz.topic.toLowerCase()}</h3>
                                    <p className="text-slate-400 font-bold uppercase text-[11px] tracking-widest mt-1">
                                        Detailed Performance Distribution • {selectedQuiz.allScores.length} Students
                                    </p>
                                </div>
                                <button onClick={() => setSelectedQuiz(null)} className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:text-red-500 transition-all">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="h-[400px] w-full">
                                {selectedQuiz.allScores.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={selectedQuiz.allScores}>
                                            <defs>
                                                <linearGradient id="modalGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                                                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="name" fontSize={11} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontWeight: 700 }} />
                                            <YAxis fontSize={11} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontWeight: 700 }} />
                                            <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                            <Bar dataKey="score" radius={[12, 12, 0, 0]} fill="url(#modalGradient)" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-300 font-black space-y-4">
                                        <BarChart3 size={48} />
                                        <span className="uppercase tracking-widest text-sm">no submission data yet</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {studentToDelete && (
                    <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-[2.5rem] p-10 shadow-2xl max-w-sm w-full text-center relative overflow-hidden"
                        >
                            <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-6 ${deleteStep === 1 ? 'bg-orange-50 text-orange-500' : 'bg-red-50 text-red-500'}`}>
                                <ShieldAlert size={40} />
                            </div>

                            <h3 className="text-2xl font-black text-slate-900 mb-2">
                                {deleteStep === 1 ? 'Wait a minute!' : 'Final Warning!'}
                            </h3>

                            <p className="text-slate-500 font-medium mb-10">
                                {deleteStep === 1
                                    ? `do you want to delete "${studentToDelete.name.toLowerCase()}"?`
                                    : "you won't see it again are you sure?"
                                }
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setStudentToDelete(null)}
                                    className="py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    disabled={deleting}
                                    className={`py-4 text-white rounded-2xl font-bold shadow-lg transition-all flex items-center justify-center space-x-2 ${deleteStep === 1 ? 'bg-orange-500 hover:bg-orange-600' : 'bg-red-500 hover:bg-red-600'
                                        }`}
                                >
                                    {deleting ? <Loader2 className="animate-spin" size={20} /> : (
                                        <span>{deleteStep === 1 ? 'Yes, I do' : 'Delete Now'}</span>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ClassroomDetail;
