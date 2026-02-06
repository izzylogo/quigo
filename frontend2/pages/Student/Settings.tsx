import React, { useEffect, useState } from 'react';
import { LogOut, Settings as SettingsIcon } from 'lucide-react';
import api, { studentService } from '../../services/api';

const Settings: React.FC = () => {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [googleApiKey, setGoogleApiKey] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        studentService.getProfile().then(data => {
            setProfile(data);
            setGoogleApiKey(data.google_api_key || '');
        }).finally(() => setLoading(false));
    }, []);

    const handleSaveApiKey = async () => {
        setSaving(true);
        try {
            await api.post('/api/student/profile', { google_api_key: googleApiKey });
            localStorage.setItem('student_google_api_key', googleApiKey);
            alert('Settings saved successfully!');
        } catch (error) {
            console.error('Failed to save settings:', error);
            alert('Failed to save settings.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-10 text-slate-400 font-bold">Synchronizing account metrics...</div>;

    return (
        <div className="max-w-4xl space-y-12 pb-16 font-outfit">
            <div>
                <h1 className="text-4xl font-black text-slate-800 lowercase tracking-tight">Student Identity</h1>
                <p className="text-slate-400 font-bold uppercase text-[11px] tracking-widest mt-1">Manage profile and AI configurations</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-12 bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm space-y-12">
                    <div className="flex items-center space-x-8">
                        <div className="w-24 h-24 bg-blue-600 text-white rounded-[2rem] flex items-center justify-center font-black text-4xl shadow-xl shadow-blue-100">
                            {profile?.name?.charAt(0).toUpperCase() || 'S'}
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-3xl font-black text-slate-900 lowercase">{profile?.name || 'Student'}</h3>
                            <div className="flex flex-wrap gap-3">
                                <div className="px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                    ID: <span className="text-slate-600">{profile?.student_id}</span>
                                </div>
                                <div className="px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                    Email: <span className="text-slate-600 lowercase">{profile?.email}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-slate-50" />

                    <div className="space-y-8">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2 text-blue-600">
                                <SettingsIcon size={18} />
                                <h4 className="text-xl font-black lowercase text-slate-800">API Configuration</h4>
                            </div>
                            <p className="text-slate-500 font-medium text-sm">Input your Google API Key to enable Guardian AI quiz generation and real-time cognitive feedback via Gemini.</p>

                            <div className="max-w-xl space-y-4">
                                <input
                                    type="password"
                                    value={googleApiKey}
                                    onChange={(e) => setGoogleApiKey(e.target.value)}
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 text-sm font-bold focus:outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner"
                                    placeholder="AIzaSy..."
                                />
                                <button
                                    onClick={handleSaveApiKey}
                                    disabled={saving}
                                    className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-xl disabled:opacity-50"
                                >
                                    {saving ? 'Saving...' : 'Secure Settings'}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-slate-50" />

                    <button
                        onClick={() => {
                            localStorage.removeItem('quigo_token');
                            localStorage.removeItem('quigo_role');
                            window.location.href = '/auth';
                        }}
                        className="flex items-center space-x-3 text-rose-500 font-black hover:text-rose-600 transition-colors uppercase text-[11px] tracking-[0.2em]"
                    >
                        <LogOut size={18} />
                        <span>Terminate Active Session</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
