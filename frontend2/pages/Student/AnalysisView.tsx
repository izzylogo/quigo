import React from 'react';
import { motion } from 'framer-motion';
import { Award, Zap, BrainCircuit, Sparkles, Rocket } from 'lucide-react';
import StudentPerformanceChart from '../../components/charts/StudentPerformanceChart';
import TopicMasteryChart from '../../components/charts/TopicMasteryChart';

interface AnalysisViewProps {
    analysis: any;
    history: any[];
    quizzes: any[];
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ analysis, history, quizzes }) => {
    return (
        <div className="space-y-12 pb-16 font-outfit">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 lowercase tracking-tight">Cognitive Analysis</h1>
                    <p className="text-slate-400 font-bold uppercase text-[11px] tracking-widest mt-1">Real-time performance vector mapping</p>
                </div>
                {!analysis && (
                    <div className="px-6 py-3 bg-blue-50 text-blue-600 rounded-2xl font-black text-sm animate-pulse border border-blue-100">
                        Synthesizing AI Insights...
                    </div>
                )}
            </div>

            {analysis?.overall_summary && (
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-12 rounded-[3.5rem] text-white relative overflow-hidden shadow-2xl shadow-blue-200">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center space-x-3 opacity-80 uppercase text-[10px] font-black tracking-[0.3em]">
                            <Sparkles size={16} />
                            <span>Guardian Executive Summary</span>
                        </div>
                        <p className="text-2xl font-bold leading-relaxed italic">"{analysis.overall_summary}"</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <StudentPerformanceChart
                    data={history.filter(a => a.score && a.score.includes('/')).map(a => {
                        const [got, total] = a.score.split('/').map(Number);
                        const scorePerc = total > 0 ? (got / total) * 100 : 0;
                        const topic = a.quiz_topic || 'Unknown';
                        return {
                            date: new Date(a.completed_at).toLocaleDateString(),
                            score: scorePerc,
                            name: topic.substring(0, 15) + (topic.length > 15 ? '...' : ''),
                            topic: topic
                        };
                    }).reverse()}
                />
                <TopicMasteryChart
                    data={quizzes.filter(q => q.status === 'completed').map(q => ({
                        title: q.topic,
                        score: q.avg_score || 0
                    }))}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="p-10 bg-white border border-slate-100 rounded-[3rem] space-y-8 shadow-sm transition-all hover:border-blue-100">
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm"><Award size={28} /></div>
                    <div className="space-y-4">
                        <h3 className="text-2xl font-black text-slate-800 lowercase">Strengths</h3>
                        <ul className="space-y-4">
                            {analysis?.strengths?.map((s: string) => (
                                <li key={s} className="flex items-center space-x-4 text-slate-600 font-bold text-sm">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                                    <span>{s}</span>
                                </li>
                            )) || <li className="text-slate-300 font-bold italic text-sm">No positive vectors identified.</li>}
                        </ul>
                    </div>
                </div>
                <div className="p-10 bg-white border border-slate-100 rounded-[3rem] space-y-8 shadow-sm transition-all hover:border-rose-100">
                    <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center shadow-sm"><Zap size={28} /></div>
                    <div className="space-y-4">
                        <h3 className="text-2xl font-black text-slate-800 lowercase">Weaknesses</h3>
                        <ul className="space-y-4">
                            {analysis?.weaknesses?.map((w: string) => (
                                <li key={w} className="flex items-center space-x-4 text-slate-600 font-bold text-sm">
                                    <div className="w-2 h-2 bg-rose-500 rounded-full" />
                                    <span>{w}</span>
                                </li>
                            )) || <li className="text-slate-300 font-bold italic text-sm">No logic divergences found.</li>}
                        </ul>
                    </div>
                </div>
                <div className="p-10 bg-white border border-slate-100 rounded-[3rem] space-y-8 shadow-sm transition-all hover:border-blue-100">
                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm"><Rocket size={28} /></div>
                    <div className="space-y-4">
                        <h3 className="text-2xl font-black text-slate-800 lowercase">Recommendations</h3>
                        <ul className="space-y-4">
                            {analysis?.recommendations?.map((r: string) => (
                                <li key={r} className="flex items-start space-x-4 text-slate-600 font-bold text-sm">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 shrink-0" />
                                    <span>{r}</span>
                                </li>
                            )) || <li className="text-slate-300 font-bold italic text-sm">Waiting for more data points.</li>}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalysisView;
