import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Loader2, FileUp, Sparkles, Clock, Trash2, Eye, EyeOff, Plus, ArrowLeft, Activity, ChevronLeft, ChevronRight } from 'lucide-react';
import { Classroom, Student } from '../../types';
import { schoolService } from '../../services/api';
import { AnimatePresence } from 'framer-motion';
import AddStudentModal from '../../components/school/AddStudentModal';
import SuccessModal from '../../components/common/SuccessModal';

interface PrepareTestProps {
    classroom: Classroom;
    onBack: () => void;
    students: Student[];
    quizzes: any[]; // Replace with Quiz type if available
    onRefresh?: () => void;
}

const PrepareTest: React.FC<PrepareTestProps> = ({ classroom, onBack, students, quizzes, onRefresh }) => {
    const [loading, setLoading] = useState(false);
    const [showAddStudent, setShowAddStudent] = useState(false);
    const [formData, setFormData] = useState({
        topic: '',
        notes: '',
        aiModel: 'Xiaomi Mimo V2 Flash (Free) - Recommended',
        quizFormat: 'objective',
        numQuestions: 10,
        difficulty: 'medium',
    });
    const [file, setFile] = useState<File | null>(null);
    const [documents, setDocuments] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'upload' | 'library'>('upload');
    const [selectedDocId, setSelectedDocId] = useState<number | null>(null);
    const [visiblePasswords, setVisiblePasswords] = useState<Record<number, boolean>>({});
    const [showSuccess, setShowSuccess] = useState(false);
    const [rosterPage, setRosterPage] = useState(1);
    const [testsPage, setTestsPage] = useState(1);
    const rosterItemsPerPage = 10;
    const testsItemsPerPage = 2;

    const togglePassword = (studentId: number) => {
        setVisiblePasswords(prev => ({
            ...prev,
            [studentId]: !prev[studentId]
        }));
    };

    useEffect(() => {
        const fetchDocs = async () => {
            try {
                const docs = await schoolService.getDocuments();
                setDocuments(docs);
            } catch (err) {
                console.error("Failed to fetch documents", err);
            }
        };
        fetchDocs();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            data.append('topic', formData.topic);
            if (formData.notes) data.append('additional_notes', formData.notes);
            data.append('ai_model', formData.aiModel);
            data.append('quiz_format', formData.quizFormat);
            data.append('num_questions', formData.numQuestions.toString());
            data.append('difficulty', formData.difficulty);

            if (activeTab === 'upload' && file) {
                data.append('file', file);
            } else if (activeTab === 'library' && selectedDocId) {
                data.append('document_id', selectedDocId.toString());
            } else {
                alert(activeTab === 'upload' ? "Please upload a file" : "Please select a document");
                setLoading(false);
                return;
            }

            await schoolService.createQuiz(classroom.id, data);
            setShowSuccess(true);
            if (onRefresh) onRefresh();
        } catch (error) {
            console.error("Failed to create quiz", error);
            alert('Failed to create quiz');
        } finally {
            setLoading(false);
        }
    };

    // Scroll lock for modals
    useEffect(() => {
        if (showAddStudent || showSuccess) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showAddStudent, showSuccess]);

    return (
        <div className="font-outfit">
            <div className="space-y-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center space-x-6">
                        <button onClick={onBack} className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm">
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">{classroom.name.toLowerCase()}</h1>
                            <p className="text-slate-400 font-bold uppercase text-[11px] tracking-widest mt-1">
                                {classroom.grade_level || 'SS 3'} • CLASSROOM MANAGER
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onBack}
                        className="flex items-center space-x-3 px-8 py-4 bg-white border border-blue-100 text-blue-600 rounded-[2rem] font-bold text-sm shadow-sm hover:bg-blue-50 transition-all"
                    >
                        <Activity size={20} />
                        <span>View Analytics</span>
                    </button>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                >
                    {/* Left Column: Form + Previous Tests */}
                    <div className="lg:col-span-6 space-y-8">
                        {/* Form Card */}
                        <div className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm">
                            <h2 className="text-xl font-display font-bold text-slate-900 mb-8 flex items-center gap-3">
                                <FileUp className="text-blue-600" size={24} />
                                Prepare New Test
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Quiz Topic</label>
                                    <input
                                        required
                                        placeholder="e.g., Introduction to Algebra"
                                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-700 placeholder:font-normal"
                                        value={formData.topic}
                                        onChange={e => setFormData({ ...formData, topic: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-6">
                                    <div className="flex border-b border-slate-100">
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab('upload')}
                                            className={`pb-4 px-6 text-sm font-bold transition-all relative ${activeTab === 'upload' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                                        >
                                            Upload New
                                            {activeTab === 'upload' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab('library')}
                                            className={`pb-4 px-6 text-sm font-bold transition-all relative ${activeTab === 'library' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                                        >
                                            Uploaded Document
                                            {activeTab === 'library' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
                                        </button>
                                    </div>

                                    {activeTab === 'upload' ? (
                                        <div className="space-y-3">
                                            <label className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Study Material</label>
                                            <div className="p-2 border border-slate-100 rounded-2xl bg-slate-50 flex items-center gap-4">
                                                <label className="px-5 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold shadow-sm cursor-pointer hover:bg-slate-50 transition-colors">
                                                    Choose File
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        onChange={e => setFile(e.target.files ? e.target.files[0] : null)}
                                                        accept=".pdf,.docx,.txt"
                                                    />
                                                </label>
                                                <span className="text-xs font-medium text-slate-400 truncate">
                                                    {file ? file.name : 'No file chosen'}
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <label className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Select From Library</label>
                                            <div className="grid grid-cols-1 gap-2 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                                                {documents.map(doc => (
                                                    <div
                                                        key={doc.id}
                                                        onClick={() => setSelectedDocId(doc.id)}
                                                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${selectedDocId === doc.id ? 'border-blue-600 bg-blue-50/50' : 'border-slate-100 bg-slate-50 hover:border-blue-200'}`}
                                                    >
                                                        <span className="text-sm font-bold text-slate-700">{doc.filename}</span>
                                                        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">{new Date(doc.created_at).toLocaleDateString()}</span>
                                                    </div>
                                                ))}
                                                {documents.length === 0 && (
                                                    <div className="p-8 text-center bg-slate-50 rounded-xl text-slate-400 font-bold text-xs uppercase tracking-widest italic">
                                                        No documents found. Please upload one first.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Format</label>
                                        <select
                                            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-700 appearance-none"
                                            value={formData.quizFormat}
                                            onChange={e => setFormData({ ...formData, quizFormat: e.target.value })}
                                        >
                                            <option value="objective">Objective</option>
                                            <option value="theory">Theory</option>
                                            <option value="fill in the blank">Fill in the blank</option>
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Questions</label>
                                        <input
                                            type="number"
                                            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-700"
                                            value={formData.numQuestions}
                                            onChange={e => setFormData({ ...formData, numQuestions: parseInt(e.target.value) })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Difficulty</label>
                                        <select
                                            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-700 appearance-none"
                                            value={formData.difficulty}
                                            onChange={e => setFormData({ ...formData, difficulty: e.target.value })}
                                        >
                                            <option value="easy">Easy</option>
                                            <option value="medium">Medium</option>
                                            <option value="hard">Hard</option>
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black text-slate-800 uppercase tracking-widest">AI Model</label>
                                        <select
                                            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-700 text-xs appearance-none"
                                            value={formData.aiModel}
                                            onChange={e => setFormData({ ...formData, aiModel: e.target.value })}
                                        >
                                            <option>Xiaomi Mimo V2 Flash (Free) - Recommended</option>
                                            <option>Claude 3.5 Sonnet</option>
                                            <option>GPT-4o Cognitive</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Additional Instructions</label>
                                    <textarea
                                        rows={3}
                                        placeholder="Specific focus areas for the AI..."
                                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 resize-none font-medium text-slate-700 placeholder:font-normal"
                                        value={formData.notes}
                                        onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                    />
                                </div>

                                <button
                                    disabled={loading}
                                    className="w-full py-4 bg-[#0f172a] text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                                    Deploy Test to Students
                                </button>
                            </form>
                        </div>

                        {/* Previous Tests Card */}
                        <div className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm">
                            <h3 className="text-xl font-display font-bold text-slate-900 mb-8 flex items-center gap-3">
                                <Clock className="text-purple-500" size={24} />
                                Previous Tests
                            </h3>
                            <div className="space-y-4">
                                {quizzes.length > 0 ? (
                                    quizzes.slice((testsPage - 1) * testsItemsPerPage, testsPage * testsItemsPerPage).map((quiz, idx) => (
                                        <div key={idx} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between group hover:border-blue-200 transition-all">
                                            <div>
                                                <h4 className="font-bold text-slate-900 mb-1">{quiz.topic}</h4>
                                                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                    <span>{quiz.quiz_format || 'objective'}</span>
                                                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                                    <span>{quiz.num_questions || 10} QS</span>
                                                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                                    <span className={quiz.difficulty === 'hard' ? 'text-red-500' : 'text-emerald-500'}>
                                                        {quiz.difficulty || 'medium'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="px-4 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-500">
                                                {new Date(quiz.created_at || Date.now()).toLocaleDateString()}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-slate-400 font-bold text-sm">No previous tests found.</div>
                                )}
                            </div>

                            {quizzes.length > testsItemsPerPage && (
                                <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Page {testsPage} of {Math.ceil(quizzes.length / testsItemsPerPage)}</span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setTestsPage(p => Math.max(1, p - 1))}
                                            disabled={testsPage === 1}
                                            className="p-2 text-slate-400 hover:text-blue-600 disabled:opacity-20 transition-colors"
                                        >
                                            <ChevronLeft size={18} />
                                        </button>
                                        <button
                                            onClick={() => setTestsPage(p => Math.min(Math.ceil(quizzes.length / testsItemsPerPage), p + 1))}
                                            disabled={testsPage === Math.ceil(quizzes.length / testsItemsPerPage)}
                                            className="p-2 text-slate-400 hover:text-blue-600 disabled:opacity-20 transition-colors"
                                        >
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Roster */}
                    <div className="lg:col-span-6">
                        <div className="bg-white border border-slate-100 rounded-[3rem] p-8 shadow-sm h-full">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-display font-bold text-slate-900 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                                        <Plus size={20} />
                                    </div>
                                    Roster ({students.length})
                                </h3>
                                <button
                                    onClick={() => setShowAddStudent(true)}
                                    className="px-6 py-2 bg-[#0f172a] text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-slate-800 transition-all"
                                >
                                    <Plus size={14} /> Add
                                </button>
                            </div>

                            <div className="space-y-1">
                                <div className="grid grid-cols-12 gap-4 px-4 py-2 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <div className="col-span-4">Student</div>
                                    <div className="col-span-5">ID</div>
                                    <div className="col-span-3 text-right">Actions</div>
                                </div>
                                <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                                    {students.slice((rosterPage - 1) * rosterItemsPerPage, rosterPage * rosterItemsPerPage).map((s) => (
                                        <div key={s.id} className="grid grid-cols-12 gap-4 px-4 py-5 items-center hover:bg-slate-50/80 rounded-2xl transition-all group">
                                            <div className="col-span-4">
                                                <div className="font-bold text-slate-900 text-sm">{s.name}</div>
                                                <div className="text-xs text-slate-400 font-medium">{s.email || 'No email'}</div>
                                            </div>
                                            <div className="col-span-5">
                                                <div className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-600 inline-block">
                                                    {s.student_id}
                                                </div>
                                                {/* <div className="mt-1 text-[10px] font-mono text-slate-400">0000{s.id}</div> */}
                                            </div>
                                            <div className="col-span-3 flex items-center justify-end gap-2">
                                                <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                                    <div className="font-mono text-slate-600 text-[10px] tracking-widest min-w-[60px] text-center">
                                                        {visiblePasswords[s.id] ? s.password : '••••••••'}
                                                    </div>
                                                    <button
                                                        onClick={() => togglePassword(s.id)}
                                                        className="text-slate-400 hover:text-blue-600 transition-colors"
                                                    >
                                                        {visiblePasswords[s.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                                                    </button>
                                                </div>
                                                <button className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all ml-1">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {students.length === 0 && (
                                        <div className="py-20 text-center text-slate-400">
                                            <p className="font-bold text-sm">No students enrolled</p>
                                            <p className="text-xs mt-1">Add students to start tracking</p>
                                        </div>
                                    )}
                                </div>

                                {students.length > rosterItemsPerPage && (
                                    <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Page {rosterPage} of {Math.ceil(students.length / rosterItemsPerPage)}</span>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setRosterPage(p => Math.max(1, p - 1))}
                                                disabled={rosterPage === 1}
                                                className="p-2 text-slate-400 hover:text-blue-600 disabled:opacity-20 transition-colors"
                                            >
                                                <ChevronLeft size={18} />
                                            </button>
                                            <button
                                                onClick={() => setRosterPage(p => Math.min(Math.ceil(students.length / rosterItemsPerPage), p + 1))}
                                                disabled={rosterPage === Math.ceil(students.length / rosterItemsPerPage)}
                                                className="p-2 text-slate-400 hover:text-blue-600 disabled:opacity-20 transition-colors"
                                            >
                                                <ChevronRight size={18} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Add Student Modal */}
            <AnimatePresence>
                {showAddStudent && (
                    <AddStudentModal
                        classroomId={classroom.id}
                        onClose={() => setShowAddStudent(false)}
                        onSuccess={() => {
                            if (onRefresh) onRefresh();
                        }}
                    />
                )}
            </AnimatePresence>

            <SuccessModal
                isOpen={showSuccess}
                onClose={() => setShowSuccess(false)}
                onAction={onBack}
                title="test prepared successfully"
                message="the test has been created and is now available for students in this classroom."
                actionLabel="done"
                theme="blue"
                position="top"
            />
        </div>
    );
};

export default PrepareTest;
