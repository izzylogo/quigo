import React, { useState, useEffect } from 'react';
import { FileText, ArrowRight, Loader2, ChevronLeft, ChevronRight, Clock, Award } from 'lucide-react';
import api from '../../services/api';

interface Attempt {
    id: number;
    quiz_topic: string;
    quiz_format: string;
    num_questions: number;
    score: string;
    mark?: string;
    timestamp: string;
}

interface HistoryListProps {
    onSelectAttempt?: (id: number) => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ onSelectAttempt }) => {
    const [attempts, setAttempts] = useState<Attempt[]>([]);
    const [loading, setLoading] = useState(true);

    // Pagination
    const [page, setPage] = useState(1);
    const ITEMS_PER_PAGE = 5;

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const response = await api.get('/api/individual/attempts');
            setAttempts(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Failed to fetch history:', error);
            setAttempts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (attemptId: number) => {
        if (onSelectAttempt) {
            onSelectAttempt(attemptId);
        }
    };

    // Pagination Logic
    const totalPages = Math.ceil(attempts.length / ITEMS_PER_PAGE);
    const paginatedAttempts = attempts.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="animate-spin w-12 h-12 text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-display text-slate-900">Test History</h1>
                    <p className="text-slate-500">Review your past performance.</p>
                </div>
                <div className="bg-slate-100 px-4 py-2 rounded-xl text-sm font-bold text-slate-600">
                    Total: {attempts.length}
                </div>
            </div>

            {Array.isArray(attempts) && attempts.length > 0 ? (
                <div className="space-y-4">
                    {paginatedAttempts.map((attempt) => (
                        <div
                            key={attempt.id}
                            onClick={() => handleViewDetails(attempt.id)}
                            className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center justify-between group hover:shadow-lg hover:shadow-blue-500/5 transition-all cursor-pointer"
                        >
                            <div className="flex items-center space-x-6">
                                <div className="w-14 h-14 bg-slate-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all border border-slate-100 group-hover:border-blue-600">
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{attempt.quiz_topic}</h4>
                                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 font-medium">
                                        <span className="flex items-center gap-1"><Clock size={12} /> {attempt.timestamp}</span>
                                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                                        <span>{attempt.num_questions} Questions</span>
                                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                                        <span className="uppercase tracking-wide">{attempt.quiz_format}</span>
                                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                                        <span className="text-blue-500 font-bold">{attempt.time_limit || 30}m</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-8">
                                <div className="text-right">
                                    <div className={`text-2xl font-bold font-display ${attempt.score.includes('100') || parseFloat(attempt.score) > 80 ? 'text-emerald-600' : 'text-slate-900'}`}>
                                        {attempt.score}
                                    </div>
                                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                        {attempt.mark ? `Mark: ${attempt.mark}` : 'Score'}
                                    </div>
                                </div>
                                <button className="bg-slate-50 p-3 rounded-xl text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                    <ArrowRight size={20} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 pt-6">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-3 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 transition-all disabled:opacity-30 disabled:hover:shadow-none disabled:hover:border-transparent text-slate-600"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <span className="text-sm font-bold text-slate-600 bg-white px-4 py-2 rounded-lg border border-slate-100 shadow-sm">Page {page} of {totalPages}</span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="p-3 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 transition-all disabled:opacity-30 disabled:hover:shadow-none disabled:hover:border-transparent text-slate-600"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-24 bg-white rounded-[32px] border border-slate-100 border-dashed">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Award size={32} className="text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No test history yet</h3>
                    <p className="text-slate-500 max-w-xs mx-auto">Complete your first quiz to see your performance metrics here.</p>
                </div>
            )}
        </div>
    );
};

export default HistoryList;
