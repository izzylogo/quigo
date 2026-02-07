import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, ShieldAlert, Zap } from 'lucide-react';

interface AssessmentListProps {
    quizzes: any[];
    loading: boolean;
    analysis: any;
    onStartQuiz: (quiz: any) => void;
}

const AssessmentList: React.FC<AssessmentListProps> = ({ quizzes, loading, analysis, onStartQuiz }) => {
    const [showDoneTests, setShowDoneTests] = React.useState(true);

    const undoneTests = quizzes.filter(q => q.status === 'active');
    const doneTests = quizzes.filter(q => q.status === 'completed');

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 lowercase tracking-tight">Your Tests</h1>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">Manage your active and completed tests here.</p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setShowDoneTests(!showDoneTests)}
                        className={`px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${showDoneTests
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                            : 'bg-white text-slate-400 border border-slate-100 hover:border-blue-100 hover:text-blue-600'
                            }`}
                    >
                        {showDoneTests ? 'Hide Done Tests' : 'Show Done Tests'}
                    </button>
                    <div className="flex items-center space-x-6 pl-4 border-l border-slate-100">
                        <div className="text-right">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">My Progress</div>
                            <div className="text-xl font-black text-blue-600">{analysis?.avg_score ? `${analysis.avg_score}%` : '—'}</div>
                        </div>
                        <div className="w-10 h-10 rounded-full border-2 border-slate-100 border-t-blue-600 flex items-center justify-center text-[10px] font-black">{analysis?.avg_score ? `${analysis.avg_score}%` : '—'}</div>
                    </div>
                </div>
            </div>

            <div className="space-y-12">
                {/* Undone Tests Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                        <h4 className="text-[12px] font-black text-slate-400 uppercase tracking-widest">undone tests</h4>
                        <span className="px-2 py-0.5 bg-orange-50 text-orange-500 rounded-md text-[10px] font-black">{undoneTests.length}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {undoneTests.map(quiz => (
                            <motion.div
                                key={quiz.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ y: -4 }}
                                className="bg-white border border-slate-100 rounded-[32px] p-5 flex flex-col justify-between shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50/50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-14 h-14 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-orange-500 group-hover:text-white transition-all">
                                            <ClipboardList size={24} />
                                        </div>
                                        <div className="flex items-center space-x-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full shadow-sm border border-emerald-100/50">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                                            <span className="text-[9px] font-black uppercase tracking-widest">Active</span>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-black text-slate-900 mb-1 lowercase tracking-tight group-hover:text-orange-600 transition-colors">{quiz.title}</h3>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        <span className="px-2.5 py-1 bg-slate-50 text-slate-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-slate-100/50">
                                            {quiz.quiz_format || 'Objective'}
                                        </span>
                                        <span className="px-2.5 py-1 bg-slate-50 text-slate-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-slate-100/50">
                                            {quiz.num_questions} Questions
                                        </span>
                                        <span className="px-2.5 py-1 bg-blue-50 text-blue-500 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-100/30">
                                            {quiz.time_limit || 30} Minutes
                                        </span>
                                    </div>
                                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-4 flex items-center gap-2">
                                        <ShieldAlert size={12} /> Due: {quiz.due_date}
                                    </p>
                                </div>

                                <div className="mt-4 relative z-10">
                                    <button
                                        onClick={() => onStartQuiz(quiz)}
                                        className="w-full bg-slate-900 text-white py-4 rounded-[20px] font-black text-xs flex items-center justify-center space-x-2 hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-500/20"
                                    >
                                        <span>Start Test</span>
                                        <Zap size={14} fill="currentColor" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                        {!loading && undoneTests.length === 0 && (
                            <div className="col-span-full py-12 bg-slate-50 rounded-[32px] border border-dashed border-slate-200 text-center">
                                <p className="text-slate-400 font-bold text-sm lowercase italic">All clear! No pending neural evaluations.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Done Tests Section */}
                {showDoneTests && (
                    <div className="space-y-6 pt-4 border-t border-slate-50">
                        <div className="flex items-center gap-3 px-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <h4 className="text-[12px] font-black text-slate-400 uppercase tracking-widest">done tests</h4>
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-500 rounded-md text-[10px] font-black">{doneTests.length}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {doneTests.map(quiz => (
                                <motion.div
                                    key={quiz.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="bg-slate-50/50 border border-slate-100 rounded-[32px] p-5 flex flex-col justify-between group grayscale-[0.3] hover:grayscale-0 transition-all"
                                >
                                    <div>
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="w-12 h-12 bg-white text-slate-300 rounded-xl flex items-center justify-center shadow-sm group-hover:text-emerald-500 transition-all">
                                                <ClipboardList size={24} />
                                            </div>
                                            <div className="flex flex-col items-end space-y-2">
                                                <span className="px-3 py-1 bg-white text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border border-emerald-50">
                                                    Score: {quiz.score || (quiz.avg_score ? `${quiz.avg_score}%` : 'Graded')}
                                                </span>
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-black text-slate-400 group-hover:text-slate-900 transition-colors mb-1 lowercase tracking-tight">{quiz.title}</h3>
                                        <div className="flex items-center gap-2 mt-3 opacity-60">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{quiz.quiz_format}</span>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">• {quiz.num_questions} Questions</span>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">• {quiz.time_limit || 30} Mins</span>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <button className="w-full bg-white text-slate-300 py-4 rounded-[20px] font-black text-xs flex items-center justify-center space-x-2 border border-slate-100 shadow-sm cursor-not-allowed group-hover:text-emerald-500 group-hover:border-emerald-100 transition-all">
                                            <span>Results Available</span>
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {loading && quizzes.length === 0 && <div className="col-span-full py-20 text-center text-slate-400 font-bold text-sm lowercase animate-pulse italic">Synchronizing with Guardian AI...</div>}
                {!loading && quizzes.length === 0 && (
                    <div className="py-20 text-center bg-white rounded-[40px] border border-slate-100 shadow-sm">
                        <p className="text-slate-400 font-black text-sm lowercase italic">No assessment protocols found in this sector.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssessmentList;
