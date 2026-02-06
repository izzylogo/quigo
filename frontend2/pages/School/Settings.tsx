import React from 'react';
import { LogOut, MapPin, Mail, CheckCircle2 } from 'lucide-react';

interface SettingsProps {
    profile: any;
}

const Settings: React.FC<SettingsProps> = ({ profile }) => {
    // Mock education system if not present for visual demo, but it should come from profile
    const educationLevels = profile?.education_system || [
        "Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5", "Primary 6",
        "JSS 1", "JSS 2", "JSS 3", "SS 1", "SS 2", "SS 3"
    ];

    const schoolInitial = profile?.name?.charAt(0).toUpperCase() || 'S';

    return (
        <div className="space-y-10 pb-16 font-outfit">
            <div>
                <h1 className="text-4xl font-bold text-slate-900 leading-tight">Institution Settings</h1>
                <p className="text-slate-400 font-bold uppercase text-[11px] tracking-widest mt-1">Manage profile and configurations</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Profile & Education System Card */}
                <div className="lg:col-span-8 bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm space-y-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex items-center space-x-6">
                            <div className="w-24 h-24 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white text-4xl font-black shadow-lg shadow-blue-200">
                                {schoolInitial}
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-slate-900 lowercase">{profile?.name || 'school'}</h3>
                                <div className="space-y-1 mt-2">
                                    <div className="flex items-center space-x-2 text-slate-400 font-bold text-sm">
                                        <MapPin size={16} />
                                        <span>{profile?.country || 'Nigeria'}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-slate-400 font-bold text-sm">
                                        <Mail size={16} />
                                        <span>{profile?.email || 'school@gmail.com'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 px-6 py-3 bg-emerald-50 text-emerald-600 rounded-full font-black text-[11px] tracking-widest uppercase border border-emerald-100">
                            <CheckCircle2 size={18} />
                            <span>Verified</span>
                        </div>
                    </div>

                    <div className="bg-slate-50/50 rounded-[2.5rem] p-10 space-y-8 border border-slate-50">
                        <h4 className="text-xl font-bold text-slate-800">Education System</h4>
                        <div className="flex flex-wrap gap-4">
                            {educationLevels.map((level: string, i: number) => (
                                <div key={i} className="px-6 py-3 bg-white border border-slate-100 rounded-2xl text-[13px] font-bold text-slate-600 shadow-sm hover:border-blue-200 hover:text-blue-600 transition-all cursor-default">
                                    {level}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Account Actions Card */}
                <div className="lg:col-span-4 bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm h-fit">
                    <h4 className="text-xl font-bold text-slate-800 mb-8">Account Actions</h4>
                    <button
                        onClick={() => {
                            localStorage.removeItem('quigo_token');
                            localStorage.removeItem('quigo_role');
                            window.location.href = '/auth';
                        }}
                        className="w-full flex items-center justify-between p-6 bg-rose-50 text-rose-500 rounded-3xl font-bold hover:bg-rose-100 transition-all group"
                    >
                        <span className="text-lg">Sign Out</span>
                        <LogOut size={22} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
