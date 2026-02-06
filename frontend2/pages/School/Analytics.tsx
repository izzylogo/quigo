import React, { useState, useEffect } from 'react';
import {
    AreaChart, Area, PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
    CartesianGrid, XAxis, YAxis
} from 'recharts';
import { LayoutGrid, Users, Target, Zap, BookOpen, Award, TrendingUp, BarChart3 } from 'lucide-react';
import { schoolService } from '../../services/api';

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const Analytics: React.FC = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await schoolService.getAnalytics();
                setData(res);
            } catch (err) {
                console.error("Failed to fetch analytics", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) {
        return <div className="p-20 text-center font-bold text-slate-400">Loading mission-critical data...</div>;
    }

    const stats = [
        { label: 'Total Classrooms', val: data?.stats?.total_classrooms || 0, icon: <LayoutGrid /> },
        { label: 'Verified Students', val: data?.stats?.total_students || 0, icon: <Users /> },
        { label: 'Avg Achievement', val: data?.stats?.avg_achievement || '0%', icon: <Target /> },
        { label: 'Cognitive Velocity', val: data?.stats?.cognitive_velocity || '4.8x', icon: <Zap /> },
    ];

    return (
        <div className="space-y-12 pb-16 font-outfit">
            <div>
                <h1 className="text-4xl font-bold text-slate-900 leading-tight">Institutional <br />Command Center</h1>
                <p className="text-slate-400 mt-2 font-bold uppercase text-[11px] tracking-widest">Full spectrum analysis across all departments</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {stats.map((item, i) => (
                    <div key={i} className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm flex flex-col items-start">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                            {item.icon}
                        </div>
                        <div className="text-4xl font-black text-slate-900 mb-1">{item.val}</div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm h-[550px] flex flex-col">
                    <div className="flex items-center space-x-3 mb-10">
                        <TrendingUp size={24} className="text-blue-500" />
                        <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Meta-Growth Vector</h3>
                    </div>
                    <div className="flex-1 w-full">
                        {data?.growth_trends?.some((t: any) => t.score > 0) ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data?.growth_trends || []}>
                                    <defs>
                                        <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="month" fontSize={11} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontWeight: 800 }} />
                                    <YAxis fontSize={11} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontWeight: 800 }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Area type="monotone" dataKey="score" stroke="#3b82f6" fill="url(#growthGrad)" strokeWidth={5} dot={{ r: 6, fill: '#3b82f6', strokeWidth: 3, stroke: '#fff' }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                                <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center">
                                    <TrendingUp size={32} className="text-slate-200" />
                                </div>
                                <p className="font-bold text-sm italic">Insufficient performance data for trend analysis.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-4 bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm h-[550px] flex flex-col">
                    <div className="flex items-center space-x-3 mb-10">
                        <BarChart3 size={24} className="text-blue-500" />
                        <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Departmental Spectrum</h3>
                    </div>
                    <div className="flex-1 w-full">
                        {data?.classroom_distribution?.some((c: any) => c.value > 0) ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data?.classroom_distribution || []}
                                        cx="50%" cy="45%"
                                        innerRadius={70}
                                        outerRadius={100}
                                        paddingAngle={10}
                                        dataKey="value"
                                    >
                                        {(data?.classroom_distribution || []).map((_: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '24px', border: 'none' }} />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                                <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center">
                                    <BarChart3 size={32} className="text-slate-200" />
                                </div>
                                <p className="font-bold text-sm italic">No classroom performance metrics available.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-[3rem] p-12 shadow-sm">
                <h3 className="text-2xl font-bold text-slate-900 mb-12 uppercase tracking-tight">System Activity Stream</h3>
                <div className="space-y-6">
                    {(data?.recent_activity || []).map((act: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-8 bg-slate-50 rounded-[2.5rem] hover:bg-white border border-transparent hover:border-slate-100 transition-all cursor-pointer group">
                            <div className="flex items-center space-x-6">
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-blue-600 transition-all">
                                    <BookOpen className="text-blue-600 group-hover:text-white transition-all" />
                                </div>
                                <div>
                                    <div className="font-black text-slate-800 text-lg group-hover:text-blue-600 transition-all lowercase">{act.title}</div>
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{act.user} • {act.score}</div>
                                </div>
                            </div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{act.time}</div>
                        </div>
                    ))}
                    {(!data?.recent_activity || data.recent_activity.length === 0) && (
                        <div className="p-20 text-center text-slate-300 font-bold italic">No recent system activity detected.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Analytics;
