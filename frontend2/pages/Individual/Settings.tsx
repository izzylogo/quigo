import React, { useState, useEffect } from 'react';
import { User, Key, LogOut } from 'lucide-react';
import { individualService } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import Modal from '../../components/ui/Modal';

const Settings: React.FC = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<any>(null);
    const [apiKey, setApiKey] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showApiKeyModal, setShowApiKeyModal] = useState(false);
    const [notification, setNotification] = useState<{ isOpen: boolean; title: string; message: string; type: 'success' | 'error' }>({
        isOpen: false,
        title: '',
        message: '',
        type: 'success'
    });

    const closeNotification = () => setNotification(prev => ({ ...prev, isOpen: false }));

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            console.log('Fetching profile...');
            const data = await individualService.getProfile();
            console.log('Profile response:', data);
            setProfile(data);
            if (data.google_api_key) {
                setApiKey(data.google_api_key);
            }

            // Check if API key exists, if not show modal
            if (!data.google_api_key) {
                setShowApiKeyModal(true);
            }
        } catch (error) {
            console.error('Failed to fetch profile:', error);
            // Set empty profile to show N/A
            setProfile({ name: null, email: null, country: null, google_api_key: null });
        } finally {
            setLoading(false);
        }
    };

    const handleSaveApiKey = async () => {
        if (!apiKey.trim()) {
            setNotification({ isOpen: true, title: 'Error', message: 'Please enter a valid API key.', type: 'error' });
            return;
        }

        setSaving(true);
        try {
            await individualService.updateApiKey({ google_api_key: apiKey });
            setShowApiKeyModal(false);
            setNotification({ isOpen: true, title: 'Success', message: 'API key saved successfully!', type: 'success' });
            fetchProfile();
        } catch (error) {
            console.error('Failed to save API key:', error);
            setNotification({ isOpen: true, title: 'Error', message: 'Failed to save API key. Please try again.', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('quigo_token');
        localStorage.removeItem('quigo_role');
        navigate('/auth');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <>
            {/* API Key Modal */}
            {showApiKeyModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Google API Key Required</h2>
                        <p className="text-slate-600 mb-6">
                            Please enter your Google API key to create and take AI-powered quizzes via Gemini. Get your key at{' '}
                            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                Google AI Studio
                            </a>
                        </p>
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="AIzaSy..."
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 mb-4 outline-none focus:bg-white focus:ring-2 focus:ring-blue-600 transition-all font-mono text-sm"
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowApiKeyModal(false)}
                                className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all"
                            >
                                Skip for Now
                            </button>
                            <button
                                onClick={handleSaveApiKey}
                                disabled={saving || !apiKey}
                                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : 'Save Key'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-2xl space-y-8">
                <h1 className="text-2xl font-bold text-slate-900">Settings</h1>

                <div className="bg-white border border-slate-100 rounded-2xl p-8 space-y-8 shadow-sm">
                    {/* Profile Section */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3 text-slate-400">
                            <User size={20} />
                            <h3 className="text-xs font-bold uppercase tracking-wider">Profile</h3>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Name</label>
                                <div className="mt-2 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-700 font-medium">
                                    {profile?.name || 'N/A'}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email</label>
                                <div className="mt-2 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-700 font-medium">
                                    {profile?.email || 'N/A'}
                                </div>
                            </div>
                            {profile?.country && (
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Country</label>
                                    <div className="mt-2 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-700 font-medium">
                                        {profile.country}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* API Key Section */}
                    <div className="pt-8 border-t border-slate-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3 text-slate-400">
                                <Key size={20} />
                                <h3 className="text-xs font-bold uppercase tracking-wider">Google API Key (Gemini)</h3>
                            </div>
                            <button
                                onClick={() => setShowApiKeyModal(true)}
                                className="text-xs font-bold text-blue-600 hover:text-blue-700"
                            >
                                Update Key
                            </button>
                        </div>
                        <p className="text-sm text-slate-500">
                            {profile?.google_api_key ? (
                                <span className="text-emerald-600 font-semibold">✓ API Key Configured</span>
                            ) : (
                                <span className="text-orange-600 font-semibold">⚠ No API Key Set</span>
                            )}
                        </p>
                    </div>

                    {/* Account Actions */}
                    <div className="pt-8 border-t border-slate-100">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-red-500 mb-4">Account Actions</h3>
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={handleLogout}
                                className="px-6 py-3 bg-slate-50 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-100 transition-all flex items-center space-x-2"
                            >
                                <LogOut size={16} />
                                <span>Logout</span>
                            </button>
                            <button className="px-6 py-3 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition-all">
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Notification Modal */}
            <Modal
                isOpen={notification.isOpen}
                onClose={closeNotification}
                title={notification.title}
                footer={
                    <button
                        onClick={closeNotification}
                        className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
                    >
                        Close
                    </button>
                }
            >
                <div className={`p-4 rounded-lg bg-slate-50 text-slate-700`}>
                    <p>{notification.message}</p>
                </div>
            </Modal>

            {/* API Key Input Modal */}
            <Modal
                isOpen={showApiKeyModal}
                onClose={() => setShowApiKeyModal(false)}
                title="Configure API Key"
                footer={
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => setShowApiKeyModal(false)}
                            className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg text-sm font-bold"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSaveApiKey}
                            disabled={saving}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save Key'}
                        </button>
                    </div>
                }
            >
                <div className="space-y-4">
                    <p className="text-slate-600 text-sm">
                        To generate unlimited quizzes, you need to provide your Google API key for Gemini.
                        Your key is stored securely and never shared.
                    </p>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Google API Key
                        </label>
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="AIzaSy..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-600 font-mono text-sm"
                        />
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default Settings;
