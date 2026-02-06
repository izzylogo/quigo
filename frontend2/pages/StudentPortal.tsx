import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Layout';
import api, { studentService } from '../services/api';
import { Settings as SettingsIcon, ShieldCheck, Zap } from 'lucide-react';

import AssessmentList from './Student/AssessmentList';
import AnalysisView from './Student/AnalysisView';
import HistoryList from './Student/HistoryList';
import HistoryDetailsView from './Student/HistoryDetailsView';
import QuizInterface from './Student/QuizInterface';
import Settings from './Student/Settings';

const StudentPortal: React.FC<{ tab: string }> = ({ tab }) => {
  const navigate = useNavigate();
  const [activeQuiz, setActiveQuiz] = useState<any>(null);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAttemptId, setSelectedAttemptId] = useState<string | null>(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [savingKey, setSavingKey] = useState(false);

  useEffect(() => {
    fetchData();
  }, [tab]);

  // Reset drill-down states when switching tabs
  useEffect(() => {
    setSelectedAttemptId(null);
  }, [tab]);

  const fetchData = async () => {
    const token = localStorage.getItem('quigo_token');
    if (!token) {
      console.warn("No token found in StudentPortal, redirecting to auth...");
      navigate('/auth');
      return;
    }

    setLoading(true);
    try {
      const profile = await studentService.getProfile();
      if (!profile.google_api_key) {
        setShowApiKeyModal(true);
      }

      if (tab === 'assessments') {
        const q = await studentService.getQuizzes();
        setQuizzes(q);
        const a = await studentService.getAnalysis();
        setAnalysis(a);
      } else if (tab === 'history') {
        const h = await studentService.getHistory();
        setHistory(h);
      } else if (tab === 'analysis') {
        const [a, h, q] = await Promise.all([
          studentService.getAnalysis(),
          studentService.getHistory(),
          studentService.getQuizzes()
        ]);
        setAnalysis(a);
        setHistory(h);
        setQuizzes(q);
      }
    } catch (err: any) {
      console.error("Failed to fetch student data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveApiKey = async () => {
    setSavingKey(true);
    try {
      await api.post('/api/student/profile', { google_api_key: apiKey });
      localStorage.setItem('student_google_api_key', apiKey);
      setShowApiKeyModal(false);
      fetchData();
    } catch (err) {
      console.error("Failed to save API key", err);
      alert("Failed to save API key. Please try again.");
    } finally {
      setSavingKey(false);
    }
  };

  const renderContent = () => {
    switch (tab) {
      case 'assessments':
        return (
          <AssessmentList
            quizzes={quizzes}
            loading={loading}
            analysis={analysis}
            onStartQuiz={setActiveQuiz}
          />
        );
      case 'analysis':
        return <AnalysisView analysis={analysis} history={history} quizzes={quizzes} />;
      case 'history':
        if (selectedAttemptId) {
          return <HistoryDetailsView attemptId={selectedAttemptId} onBack={() => setSelectedAttemptId(null)} />;
        }
        return <HistoryList history={history} loading={loading} onSelectAttempt={setSelectedAttemptId} />;
      case 'settings':
        return <Settings />;
      default: return null;
    }
  };

  return (
    <div className={`flex min-h-screen bg-white font-outfit ${showApiKeyModal ? 'pointer-events-none' : ''}`}>
      <Sidebar portal="student" />
      <main className="flex-1 lg:ml-64 p-8 lg:p-16 overflow-y-auto">
        <AnimatePresence mode="wait">
          {!activeQuiz && (
            <motion.div key={tab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {renderContent()}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {activeQuiz && (
          <QuizInterface
            quiz={activeQuiz}
            onClose={() => setActiveQuiz(null)}
            onSuccess={() => {
              setActiveQuiz(null);
              fetchData();
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showApiKeyModal && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-8 bg-slate-900/60 backdrop-blur-md pointer-events-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-[3rem] p-12 max-w-lg w-full shadow-2xl space-y-8"
            >
              <div className="w-20 h-20 bg-blue-600 text-white rounded-[2rem] flex items-center justify-center shadow-xl shadow-blue-100 mx-auto">
                <ShieldCheck size={40} />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-3xl font-black text-slate-900 lowercase">Guardian AI Sync</h3>
                <p className="text-slate-500 font-medium italic">Please enter your Google API Key to enable real-time cognitive monitoring and quiz generation via Gemini.</p>
              </div>
              <div className="space-y-4">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 text-sm font-bold focus:border-blue-600 outline-none transition-all shadow-inner"
                />
                <button
                  onClick={handleSaveApiKey}
                  disabled={!apiKey || savingKey}
                  className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-slate-800 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center space-x-3"
                >
                  <span>{savingKey ? 'Syncing...' : 'Initialize Logic Hub'}</span>
                  {!savingKey && <Zap size={20} fill="currentColor" />}
                </button>

                <button
                  onClick={() => setShowApiKeyModal(false)}
                  className="w-full py-3 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-600 transition-colors"
                >
                  Skip for now
                </button>

                <button
                  onClick={() => {
                    localStorage.removeItem('quigo_token');
                    localStorage.removeItem('quigo_role');
                    window.location.href = '/auth';
                  }}
                  className="w-full py-1 text-slate-300 font-black text-[9px] uppercase tracking-widest hover:text-slate-500 transition-colors"
                >
                  Terminate Session
                </button>
              </div>
              <p className="text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">Security Protocol Alpha-9</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentPortal;
