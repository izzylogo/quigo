import React, { useState } from 'react';
import { History as HistoryIcon, ArrowRight, ChevronRight, CheckCircle2, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface HistoryListProps {
    history: any[];
    loading: boolean;
    onSelectAttempt: (id: string) => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ history, loading, onSelectAttempt }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const totalPages = Math.ceil(history.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedHistory = history.slice(startIndex, startIndex + itemsPerPage);

    const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
    const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center px-2">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 lowercase tracking-tight">Past Results</h1>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">Check how you performed on previous tests.</p>
                </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-50 bg-slate-50/50">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Test Name</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date / Time</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Score</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right whitespace-nowrap">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {paginatedHistory.map((h, i) => (
                                <motion.tr
                                    key={h.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    onClick={() => onSelectAttempt(h.id)}
                                    className="hover:bg-blue-50/30 transition-all cursor-pointer group"
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-50 text-slate-400 group-hover:bg-blue-600 group-hover:text-white rounded-xl flex items-center justify-center transition-all shadow-sm">
                                                <HistoryIcon size={18} />
                                            </div>
                                            <div className="font-bold text-slate-900 lowercase tracking-tight">
                                                {h.quiz_topic || h.quiz_title || h.title}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="text-sm font-bold text-slate-900 whitespace-nowrap">{h.date}</div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            {h.completed_at ? new Date(h.completed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '---'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="text-xl font-black text-slate-900">
                                            {h.score ? (
                                                <>{h.score}{!h.score.includes('/') && '%'}</>
                                            ) : (
                                                '--'
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest">
                                            <CheckCircle2 size={10} />
                                            <span>Finished</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button className="p-2 text-slate-300 group-hover:text-blue-600 group-hover:bg-blue-50 rounded-lg transition-all">
                                            <ChevronRight size={20} />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {loading && history.length === 0 && (
                    <div className="py-20 text-center">
                        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-slate-400 font-bold text-sm">Loading history...</p>
                    </div>
                )}

                {!loading && history.length === 0 && (
                    <div className="py-20 text-center text-slate-400 font-bold px-8">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-200">
                            <HistoryIcon size={32} />
                        </div>
                        <p className="text-sm">No history found yet.</p>
                        <p className="text-xs font-medium mt-1 uppercase tracking-widest text-slate-300">Take your first quiz to see verification logs</p>
                    </div>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="px-8 py-6 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Page {currentPage} of {totalPages}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryList;
