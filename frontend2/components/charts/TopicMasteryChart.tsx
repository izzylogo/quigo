import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';

interface TopicData {
    title: string;
    score: number;
}

interface Props {
    data: TopicData[];
}

const TopicMasteryChart: React.FC<Props> = ({ data }) => {
    const chartData = data.slice(0, 7);

    return (
        <div className="w-full h-[400px] bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col group hover:border-emerald-100 transition-all">
            <h3 className="text-xl font-black mb-8 text-slate-800 lowercase">Topic Mastery</h3>
            {data.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-slate-400 text-sm font-bold italic pb-10">
                    No conceptual dominance data available.
                </div>
            ) : (
                <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 0, right: 30, left: 0, bottom: 0 }} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                            <XAxis type="number" domain={[0, 100]} hide />
                            <YAxis
                                dataKey="title"
                                type="category"
                                width={120}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 800 }}
                            />
                            <Tooltip
                                cursor={{ fill: '#f8fafc', radius: 10 }}
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    borderRadius: '24px',
                                    border: '1px solid #f1f5f9',
                                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.05)',
                                    padding: '16px'
                                }}
                                itemStyle={{ fontWeight: 800 }}
                            />
                            <Bar dataKey="score" barSize={12} radius={[0, 10, 10, 0]}>
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.score >= 80 ? '#10b981' : entry.score >= 60 ? '#f59e0b' : '#f43f5e'}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default TopicMasteryChart;
