import React from 'react';
import { motion } from 'framer-motion';
import { FloatingCard } from '../../components/Layout';
import {
    LayoutGrid, Users, Zap, CheckCircle2, Plus, ChevronRight
} from 'lucide-react';
import { Classroom } from '../../types';

interface DashboardOverviewProps {
    profile: any;
    stats: {
        classrooms: number;
        students: number;
        quizzes: number;
        completion: string;
    };
    classrooms: Classroom[];
    loading: boolean;
    onOpenCreateModal: () => void;
    onSelectClassroom: (classroom: Classroom) => void;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({
    profile,
    stats,
    classrooms,
    loading,
    onOpenCreateModal,
    onSelectClassroom
}) => {
    return (
        <div className="space-y-10 pb-16">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <h1 className="text-3xl lg:text-4xl font-display font-bold text-slate-900 tracking-tight">School Overview</h1>
                    <p className="text-slate-400 font-semibold mt-2 text-sm">Welcome back, {profile?.name || 'School'}</p>
                </div>
                <div className="flex items-center space-x-3 bg-white border border-slate-100 px-4 py-2.5 rounded-full shadow-sm">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">s</div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none">school</span>
                        <span className="text-sm font-bold text-slate-900 uppercase tracking-tighter">ADMIN</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { label: 'Classrooms', val: stats.classrooms, icon: <LayoutGrid size={24} />, color: 'blue' },
                    { label: 'Total Students', val: stats.students, icon: <Users size={24} />, color: 'emerald' },
                    { label: 'Active Quizzes', val: stats.quizzes, icon: <Zap size={24} />, color: 'amber' },
                    { label: 'Completion Rate', val: stats.completion, icon: <CheckCircle2 size={24} />, color: 'indigo' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm flex items-center space-x-6">
                        <div className={`w-12 h-12 bg-${stat.color}-50 text-${stat.color}-600 rounded-2xl flex items-center justify-center`}>
                            {stat.icon}
                        </div>
                        <div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</span>
                            <div className="text-2xl font-black text-slate-900">{stat.val}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h2 className="text-2xl font-display font-bold text-slate-900">Your Classes</h2>
                        <p className="text-slate-400 font-medium text-sm">Manage your student groups</p>
                    </div>
                    <button
                        onClick={onOpenCreateModal}
                        className="flex items-center space-x-3 px-8 py-4 bg-[#0f172a] text-white rounded-[1.5rem] font-bold text-sm shadow-xl hover:bg-slate-800 transition-all"
                    >
                        <Plus size={20} />
                        <span>Create Classroom</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {classrooms.map(cls => (
                        <motion.div
                            key={cls.id}
                            whileHover={{ y: -4, borderColor: '#3b82f6' }}
                            onClick={() => onSelectClassroom(cls)}
                            className="p-5 bg-slate-50/50 border border-slate-100 rounded-2xl cursor-pointer transition-all group relative overflow-hidden"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="w-10 h-10 bg-white border border-slate-100 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-blue-600 group-hover:border-blue-600 transition-all">
                                    <LayoutGrid size={18} />
                                </div>
                                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[8px] font-black uppercase tracking-widest rounded-md border border-blue-100/50">
                                    {cls.grade_level}
                                </span>
                            </div>

                            <h3 className="text-lg font-black text-slate-900 mb-0.5 group-hover:text-blue-600 transition-colors uppercase tracking-tight truncate">{cls.name}</h3>
                            <div className="flex items-center space-x-1.5 text-slate-400 font-bold text-[9px] uppercase tracking-widest leading-none">
                                <Users size={10} className="text-slate-300" />
                                <span>{cls.student_count || 0} Students</span>
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                                    <div>
                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none block">Tests</span>
                                        <div className="text-base font-black text-slate-800">{cls.active_quizzes || 0}</div>
                                    </div>
                                </div>
                                <div className="w-8 h-8 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-300 group-hover:text-blue-600 group-hover:border-blue-100 transition-all shadow-sm">
                                    <ChevronRight size={16} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {loading && classrooms.length === 0 && <div className="col-span-full py-20 text-center text-slate-400 font-bold">Loading classrooms...</div>}
                    {!loading && classrooms.length === 0 && <div className="col-span-full py-20 text-center text-slate-400 font-bold">No classrooms found. Create your first one above!</div>}
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
