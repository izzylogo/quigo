import React, { useState, useEffect } from 'react';
import {
    Brain, FileText, Upload, Sparkles, Languages,
    MessageSquare, Settings, ArrowRight, Library, CheckCircle, Loader2, Plus,
    ChevronLeft, ChevronRight, AlertCircle
} from 'lucide-react';
import { individualService } from '../../services/api';
import QuizInterface from './QuizInterface';
import Modal from '../../components/ui/Modal';

interface Quiz {
    id: number;
    topic: string;
    quiz_format: string;
    num_questions: number;
    difficulty: string;
    created_at: string;
    is_completed?: boolean;
}

const QuizArchitect: React.FC = () => {
    // Mode: 'create' (which has sub-tabs) or 'list'
    const [view, setView] = useState<'create' | 'list'>('create');

    // Create Mode Sub-tabs - Default to 'upload' as requested
    const [creationMode, setCreationMode] = useState<'topic' | 'upload' | 'saved'>('upload');

    const [topic, setTopic] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [selectedDocId, setSelectedDocId] = useState<number | null>(null);
    const [savedDocs, setSavedDocs] = useState<any[]>([]);

    // Config
    const [quizFormat, setQuizFormat] = useState('multiple_choice');
    const [difficulty, setDifficulty] = useState('medium');
    const [numQuestions, setNumQuestions] = useState(5);
    const [timeLimit, setTimeLimit] = useState(30);

    // State
    const [isGenerating, setIsGenerating] = useState(false);
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loadingQuizzes, setLoadingQuizzes] = useState(true);
    const [selectedQuizId, setSelectedQuizId] = useState<number | null>(null);

    // Pagination
    const [page, setPage] = useState(1);
    const ITEMS_PER_PAGE = 5;

    const [notification, setNotification] = useState<{ isOpen: boolean; title: string; message: string; type: 'success' | 'error' }>({
        isOpen: false, title: '', message: '', type: 'success'
    });

    useEffect(() => {
        fetchQuizzes();
    }, []);

    useEffect(() => {
        if (creationMode === 'saved') {
            fetchSavedDocs();
        }
    }, [creationMode]);

    const fetchQuizzes = async () => {
        try {
            const data = await individualService.getQuizzes();
            setQuizzes(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch quizzes:', error);
        } finally {
            setLoadingQuizzes(false);
        }
    };

    const fetchSavedDocs = async () => {
        try {
            const docs = await individualService.getDocuments();
            setSavedDocs(docs);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreateQuiz = async () => {
        // Validation: Topic is compulsory if not pure document upload without override? 
        // User said "make the topic compulsory". 
        // For upload/saved, usually topic can be inferred, but let's enforce it if user wants strictness.
        // Actually, if they upload a file, maybe they don't *need* a topic string if the file has it?
        // But the request says "make the topic compulsory". I will enforce it.

        let finalTopic = topic;
        if (creationMode === 'saved' && selectedDocId && !finalTopic) {
            const doc = savedDocs.find(d => d.id === selectedDocId);
            if (doc) finalTopic = doc.filename; // Auto-fill if empty but doc selected?
        }
        if (creationMode === 'upload' && file && !finalTopic) {
            finalTopic = file.name;
        }

        if (!finalTopic && creationMode === 'topic') {
            setNotification({ isOpen: true, title: 'Validation Error', message: 'Topic is required.', type: 'error' });
            return;
        }
        // If we want strict input typing:
        if (!topic && creationMode === 'topic') {
            // handled by button disable usually, but safety check
            return;
        }

        setIsGenerating(true);
        try {
            const formData = new FormData();
            formData.append('quiz_format', quizFormat);
            formData.append('difficulty', difficulty);
            formData.append('num_questions', numQuestions.toString());
            formData.append('time_limit', timeLimit.toString());

            if (creationMode === 'topic') {
                formData.append('topic', topic);
            } else if (creationMode === 'upload' && file) {
                formData.append('file', file);
                formData.append('topic', topic || file.name); // Send topic always
            } else if (creationMode === 'saved' && selectedDocId) {
                formData.append('document_id', selectedDocId.toString());
                const docName = savedDocs.find(d => d.id === selectedDocId)?.filename;
                formData.append('topic', topic || docName || 'Document Quiz');
            }

            await individualService.createQuiz(formData);

            setNotification({ isOpen: true, title: 'Success', message: 'Quiz generated successfully!', type: 'success' });
            fetchQuizzes();
            setView('list');
            setTopic('');
            setFile(null);
            setSelectedDocId(null);
        } catch (error) {
            console.error(error);
            setNotification({ isOpen: true, title: 'Error', message: 'Failed to generate quiz.', type: 'error' });
        } finally {
            setIsGenerating(false);
        }
    };

    const closeNotification = () => setNotification(prev => ({ ...prev, isOpen: false }));

    // Pagination Logic
    const totalPages = Math.ceil(quizzes.length / ITEMS_PER_PAGE);
    const paginatedQuizzes = quizzes.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    if (selectedQuizId) {
        return <QuizInterface quizId={selectedQuizId} onBack={() => setSelectedQuizId(null)} />;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Nav */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-display text-slate-900">Quiz Architect</h1>
                    <p className="text-slate-500">Design your perfect assessment.</p>
                </div>
                <div className="flex p-1 bg-slate-100 rounded-xl">
                    <button
                        onClick={() => setView('create')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'create' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        Create New
                    </button>
                    <button
                        onClick={() => setView('list')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        My Tests ({quizzes.length})
                    </button>
                </div>
            </div>

            {view === 'create' && (
                <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm max-w-2xl mx-auto">
                    {/* Creation Mode Tabs */}
                    <div className="flex p-1 bg-slate-50 rounded-2xl mb-8">
                        {[
                            { id: 'upload', label: 'Upload PDF', icon: Upload }, // Moved first
                            { id: 'topic', label: 'By Topic', icon: Brain },
                            { id: 'saved', label: 'Saved Docs', icon: Library }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setCreationMode(tab.id as any)}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200
                                    ${creationMode === tab.id ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <tab.icon size={16} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-8">
                        {creationMode === 'topic' && (
                            <div className="space-y-4">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Topic <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder="e.g., Quantum Physics, French Revolution..."
                                    className="w-full text-base font-medium placeholder:text-slate-300 border border-slate-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white"
                                />
                            </div>
                        )}

                        {creationMode === 'upload' && (
                            <div className="space-y-4">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Upload Document</label>
                                <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${file ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 hover:border-slate-300 bg-slate-50'}`}>
                                    <input
                                        type="file"
                                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                                        className="hidden"
                                        id="file-upload"
                                        accept=".pdf,.docx,.txt,.md"
                                    />
                                    <label htmlFor="file-upload" className="cursor-pointer block">
                                        {file ? (
                                            <div className="flex flex-col items-center gap-2 text-blue-600">
                                                <CheckCircle size={32} />
                                                <span className="font-bold">{file.name}</span>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 text-slate-400">
                                                <Upload size={32} />
                                                <span className="font-medium text-sm">Click to browse files (PDF, DOCX)</span>
                                            </div>
                                        )}
                                    </label>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Topic (Optional)</label>
                                    <input
                                        type="text"
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        placeholder="Specific focus (optional)..."
                                        className="w-full text-sm font-medium placeholder:text-slate-300 border border-slate-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white"
                                    />
                                </div>
                            </div>
                        )}

                        {creationMode === 'saved' && (
                            <div className="space-y-4">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Saved Document</label>
                                <div className="grid gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar border border-slate-100 rounded-xl p-2">
                                    {savedDocs.length === 0 ? (
                                        <p className="text-slate-400 text-sm italic py-4 text-center">No saved documents found.</p>
                                    ) : (
                                        savedDocs.map(doc => (
                                            <button
                                                key={doc.id}
                                                onClick={() => setSelectedDocId(doc.id)}
                                                className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all group
                                                    ${selectedDocId === doc.id ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-slate-100 hover:border-blue-300 hover:bg-slate-50'}`}
                                            >
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <div className={`p-2 rounded-lg ${selectedDocId === doc.id ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500 group-hover:bg-white'}`}>
                                                        <FileText size={16} />
                                                    </div>
                                                    <span className={`text-sm font-semibold truncate ${selectedDocId === doc.id ? 'text-blue-900' : 'text-slate-700'}`}>{doc.filename}</span>
                                                </div>
                                                <span className="text-xs text-slate-400 flex-shrink-0">{doc.created_at}</span>
                                            </button>
                                        ))
                                    )}
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Topic (Optional)</label>
                                    <input
                                        type="text"
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        placeholder="Specific focus (optional)..."
                                        className="w-full text-sm font-medium placeholder:text-slate-300 border border-slate-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="h-px bg-slate-100" />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Format</label>
                                <select
                                    value={quizFormat}
                                    onChange={(e) => setQuizFormat(e.target.value)}
                                    className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                >
                                    <option value="multiple_choice">Multiple Choice</option>
                                    <option value="true_false">True / False</option>
                                    <option value="theory">Theory / Short Answer</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Difficulty</label>
                                <select
                                    value={difficulty}
                                    onChange={(e) => setDifficulty(e.target.value)}
                                    className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                >
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Number</label>
                                <select
                                    value={numQuestions}
                                    onChange={(e) => setNumQuestions(Number(e.target.value))}
                                    className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                >
                                    <option value={5}>5 Questions</option>
                                    <option value={10}>10 Questions</option>
                                    <option value={15}>15 Questions</option>
                                    <option value={20}>20 Questions</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Time (Mins)</label>
                                <select
                                    value={timeLimit}
                                    onChange={(e) => setTimeLimit(Number(e.target.value))}
                                    className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                >
                                    <option value={5}>5 Minutes</option>
                                    <option value={10}>10 Minutes</option>
                                    <option value={15}>15 Minutes</option>
                                    <option value={20}>20 Minutes</option>
                                    <option value={30}>30 Minutes</option>
                                </select>
                            </div>
                        </div>

                        <button
                            onClick={handleCreateQuiz}
                            disabled={isGenerating || (creationMode === 'topic' && !topic)}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-600/20 flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles size={20} className="group-hover:scale-110 transition-transform" />
                                    Generate Quiz
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {view === 'list' && (
                <div className="space-y-6 max-w-2xl mx-auto">
                    {loadingQuizzes ? (
                        <div className="text-center py-12"><Loader2 className="animate-spin mx-auto text-blue-600" /></div>
                    ) : quizzes.length === 0 ? (
                        <div className="text-center py-12 text-slate-400">No quizzes found. Create one!</div>
                    ) : (
                        paginatedQuizzes.map((quiz) => (
                            <div key={quiz.id} className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center justify-between hover:shadow-lg hover:shadow-blue-500/5 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-lg border border-blue-100">
                                        {quiz.topic.substring(0, 1).toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{quiz.topic}</h4>
                                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                                            <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-500">{quiz.num_questions} Qs</span>
                                            <span>•</span>
                                            <span className="capitalize">{quiz.difficulty}</span>
                                            <span>•</span>
                                            <span className="text-blue-500 font-bold">{quiz.time_limit || 30}m</span>
                                            <span>•</span>
                                            <span>{quiz.created_at}</span>
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedQuizId(quiz.id)}
                                    disabled={quiz.is_completed}
                                    className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${quiz.is_completed ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-blue-600 shadow-lg shadow-slate-900/20 hover:shadow-blue-600/30'}`}
                                >
                                    {quiz.is_completed ? (
                                        <span className="flex items-center gap-2"><CheckCircle size={14} /> Done</span>
                                    ) : 'Start Test'}
                                </button>
                            </div>
                        ))
                    )}

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 pt-4">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <span className="text-sm font-semibold text-slate-600">Page {page} of {totalPages}</span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    )}
                </div>
            )}

            <Modal
                isOpen={notification.isOpen}
                onClose={closeNotification}
                title={notification.title}
                footer={
                    <button onClick={closeNotification} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium">Close</button>
                }
            >
                <div className="flex items-start gap-3 text-slate-600 p-4">
                    {notification.type === 'error' && <AlertCircle className="text-red-500 mt-1 flex-shrink-0" />}
                    <p>{notification.message}</p>
                </div>
            </Modal>
        </div>
    );
};

export default QuizArchitect;
