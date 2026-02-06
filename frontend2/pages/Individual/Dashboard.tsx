import React, { useState, useEffect } from 'react';
import { Target, Zap, Clock, TrendingUp, Award, BookOpen } from 'lucide-react';
import { individualService } from '../../services/api';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell
} from 'recharts';

interface DashboardStats {
    total_quizzes: number;
    total_attempts: number;
    avg_score: number;
    recent_activity: Array<{
        id: number;
        quiz_topic: string;
        score: number | string;
        timestamp: string;
    }>;
    performance_history?: Array<{
        id: number;
        quiz_topic: string;
        score: string;
        timestamp: string;
    }>;
}

interface UserProfile {
    name: string;
    email: string;
}

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsData, profileData] = await Promise.all([
                individualService.getDashboard(),
                individualService.getProfile()
            ]);
            setStats(statsData);
            setProfile(profileData);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Process data for charts
    const chartSource = stats?.performance_history || stats?.recent_activity || [];
    const chartData = chartSource.map(activity => ({
        name: activity.quiz_topic.substring(0, 15) + (activity.quiz_topic.length > 15 ? '...' : ''),
        score: typeof activity.score === 'string'
            ? parseFloat(activity.score.replace('%', ''))
            : activity.score,
        fullTopic: activity.quiz_topic,
        date: activity.timestamp
    }));

    // If we were using recent_activity and reversed it, only reverse if it's recent_activity
    if (!stats?.performance_history) {
        chartData.reverse();
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-display text-slate-900">
                        Welcome back, {profile?.name || 'Scholar'}
                    </h1>
                    <p className="text-slate-500">Here's your learning progress overview.</p>
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-100 shadow-sm flex items-center gap-2 px-4">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm font-semibold text-slate-700">System Online</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                        <Target size={28} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Avg Score</p>
                        <h3 className="text-3xl font-bold text-slate-900">{Math.round(stats?.avg_score || 0)}%</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                        <Zap size={28} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total Quizzes</p>
                        <h3 className="text-3xl font-bold text-slate-900">{stats?.total_quizzes || 0}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
                        <Clock size={28} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">attempts</p>
                        <h3 className="text-3xl font-bold text-slate-900">{stats?.total_attempts || 0}</h3>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Performance Chart */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Performance History</h3>
                            <p className="text-slate-500 text-sm">Your scores over the last attempts</p>
                        </div>
                        <TrendingUp className="text-blue-500" />
                    </div>

                    <div className="h-[320px] w-full overflow-x-auto custom-scrollbar pb-6">
                        {chartData.length > 0 ? (
                            <div style={{ minWidth: Math.max(chartData.length * 100, 600), height: '100%' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
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
                                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                                            dy={10}
                                        />
                                        <YAxis
                                            hide={false}
                                            domain={[0, 100]}
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                                        />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            itemStyle={{ color: '#1e293b', fontWeight: 'bold' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="score"
                                            stroke="#3b82f6"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorScore)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                <BookOpen size={48} className="mb-4 opacity-20" />
                                <p>No performance data available yet.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Activity List */}
                <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col">
                    <h3 className="text-xl font-bold text-slate-900 mb-6">Recent Activity</h3>
                    <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[300px] custom-scrollbar">
                        {stats?.recent_activity && stats.recent_activity.length > 0 ? (
                            stats.recent_activity.slice(0, 5).map((activity) => (
                                <div key={activity.id} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-2xl transition-colors border border-transparent hover:border-slate-100">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm
                                        ${(() => {
                                            const s = typeof activity.score === 'string' ? parseFloat(activity.score) : activity.score;
                                            return s >= 80 ? 'bg-green-100 text-green-600' : s >= 60 ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600';
                                        })()}`}>
                                        {typeof activity.score === 'string' ? activity.score : `${Math.round(activity.score || 0)}%`}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-bold text-slate-900 truncate">{activity.quiz_topic}</h4>
                                        <p className="text-xs text-slate-400">{activity.timestamp}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-400 text-sm text-center py-8">No recent activity.</p>
                        )}
                    </div>

                    <button className="mt-6 w-full py-3 bg-slate-50 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors flex items-center justify-center gap-2">
                        View Complete History
                        <Award size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
