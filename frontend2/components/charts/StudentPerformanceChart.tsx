import React from 'react';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';

interface PerformanceData {
    date: string;
    score: number;
    topic: string;
}

interface Props {
    data: PerformanceData[];
}

const StudentPerformanceChart: React.FC<Props> = ({ data }) => {
    return (
        <div className="w-full h-[400px] bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col group hover:border-blue-100 transition-all">
            <h3 className="text-xl font-black mb-8 text-slate-800 lowercase">Score History</h3>
            {data.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-slate-400 text-sm font-bold italic pb-10">
                    No logical trace vectors found in history.
                </div>
            ) : (
                <div className="flex-1 w-full min-h-0 overflow-x-auto custom-scrollbar pb-6">
                    <div style={{ minWidth: Math.max(data.length * 80, 400), height: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ color: '#1e293b', fontWeight: 'bold' }}
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xl space-y-1">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                                                        {payload[0].payload.date}
                                                    </p>
                                                    <p className="text-sm font-black text-slate-900 lowercase leading-tight">
                                                        {payload[0].payload.topic}
                                                    </p>
                                                    <p className="text-lg font-black text-blue-600 leading-none">
                                                        {Math.round(payload[0].value as number)}%
                                                    </p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                    cursor={{ stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '8 8' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="score"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorScore)"
                                    animationDuration={2000}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentPerformanceChart;
