import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Plus, Trash2, Loader2, User, Mail } from 'lucide-react';
import { schoolService } from '../../services/api';

interface AddStudentModalProps {
    classroomId: string;
    onClose: () => void;
    onSuccess: () => void;
}

const AddStudentModal: React.FC<AddStudentModalProps> = ({ classroomId, onClose, onSuccess }) => {
    const [newStudents, setNewStudents] = useState([{ name: '', email: '' }]);
    const [adding, setAdding] = useState(false);

    // Scroll lock implementation
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);
    const [createdStudents, setCreatedStudents] = useState<any[]>([]);

    const handleAddRow = () => {
        setNewStudents([...newStudents, { name: '', email: '' }]);
    };

    const handleRemoveRow = (index: number) => {
        if (newStudents.length > 1) {
            setNewStudents(newStudents.filter((_, i) => i !== index));
        }
    };

    const handleInputChange = (index: number, field: 'name' | 'email', value: string) => {
        const updated = [...newStudents];
        updated[index][field] = value;
        setNewStudents(updated);
    };

    const handleSubmit = async () => {
        const studentsToAdd = newStudents.filter(s => s.name && s.email);
        if (studentsToAdd.length === 0) {
            alert("Please fill in at least one student.");
            return;
        }

        setAdding(true);
        try {
            const response = await schoolService.bulkImportStudents(classroomId, { students: studentsToAdd });
            setCreatedStudents(response.students);
            setNewStudents([{ name: '', email: '' }]);
            onSuccess();
        } catch (error) {
            console.error("Failed to add students", error);
            alert("Failed to add students. Please try again.");
        } finally {
            setAdding(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-start justify-center p-6 pt-10 bg-slate-900/60 backdrop-blur-sm overflow-y-auto" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white w-full max-w-2xl rounded-[40px] p-8 shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto"
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-display font-bold text-slate-900">
                        {createdStudents.length > 0 ? 'Students Added' : 'Add New Students'}
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-6 h-6 text-slate-400" />
                    </button>
                </div>

                {createdStudents.length > 0 ? (
                    <div className="space-y-6">
                        <div className="p-4 bg-green-50 rounded-2xl border border-green-100 flex items-center gap-4 animate-in fade-in zoom-in duration-300">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                            <p className="font-bold text-green-800">Credentials Generated!</p>
                        </div>
                        <p className="text-sm text-slate-500">Please copy these credentials immediately. They will not be shown again.</p>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                            {createdStudents.map((student, idx) => (
                                <div key={idx} className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center text-sm border border-slate-100">
                                    <div>
                                        <p className="font-bold text-slate-900">{student.name}</p>
                                        <p className="text-slate-500 font-mono text-xs mt-0.5">{student.student_id}</p>
                                    </div>
                                    <div className="font-mono bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-blue-600 font-bold tracking-wider select-all">
                                        {student.password}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={onClose}
                            className="w-full py-4 bg-[#0f172a] text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                        >
                            Done
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4">
                            {newStudents.map((student, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end relative group p-8 bg-slate-50/30 rounded-[2rem] border border-transparent hover:border-slate-100 transition-all"
                                >
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Student Name</label>
                                        <div className="relative">
                                            <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                            <input
                                                value={student.name}
                                                onChange={e => handleInputChange(idx, 'name', e.target.value)}
                                                placeholder="e.g. John Doe"
                                                className="w-full bg-white border-2 border-slate-100 rounded-2xl py-5 pl-14 pr-6 font-bold text-slate-800 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all placeholder:text-slate-300"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-1 space-y-3">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Email</label>
                                                <div className="relative">
                                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                                    <input
                                                        value={student.email}
                                                        onChange={e => handleInputChange(idx, 'email', e.target.value)}
                                                        placeholder="john@example.com"
                                                        className="w-full bg-white border-2 border-slate-100 rounded-2xl py-5 pl-14 pr-6 font-bold text-slate-800 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all placeholder:text-slate-300"
                                                    />
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveRow(idx)}
                                                disabled={newStudents.length === 1}
                                                className={`mt-7 p-4 border-2 border-slate-100 rounded-2xl text-slate-300 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="flex gap-4 mt-8">
                            <button
                                onClick={handleAddRow}
                                className="px-6 py-4 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 hover:border-slate-200 transition-all flex items-center gap-2"
                            >
                                <Plus className="w-5 h-5" /> Add Another
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={adding}
                                className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-500 transition-all flex justify-center items-center gap-2 shadow-xl shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {adding ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Generate Credentials'}
                            </button>
                        </div>
                    </>
                )}
            </motion.div>
        </div>
    );
};

export default AddStudentModal;
