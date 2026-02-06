import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, ChevronDown, User, Mail, CheckCircle, Copy, Check } from 'lucide-react';
import { schoolService } from '../../services/api';
import { Classroom } from '../../types';

interface AddStudentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    classrooms: Classroom[];
}

const AddStudentModal: React.FC<AddStudentModalProps> = ({
    isOpen, onClose, onSuccess, classrooms
}) => {
    const [selectedClassroom, setSelectedClassroom] = useState('');
    const [studentRows, setStudentRows] = useState([{ name: '', email: '' }]);
    const [submitting, setSubmitting] = useState(false);
    const [createdStudents, setCreatedStudents] = useState<any[]>([]);
    const [copied, setCopied] = useState(false);

    const handleAddRow = () => {
        setStudentRows([...studentRows, { name: '', email: '' }]);
    };

    const handleRemoveRow = (index: number) => {
        if (studentRows.length > 1) {
            setStudentRows(studentRows.filter((_, i) => i !== index));
        }
    };

    const handleInputChange = (index: number, field: 'name' | 'email', value: string) => {
        const updatedRows = [...studentRows];
        updatedRows[index][field] = value;
        setStudentRows(updatedRows);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedClassroom) {
            alert("Please select a classroom");
            return;
        }

        const validStudents = studentRows.filter(s => s.name.trim() && s.email.trim());
        if (validStudents.length === 0) {
            alert("Please add at least one student");
            return;
        }

        setSubmitting(true);
        try {
            const response = await schoolService.bulkImportStudents(selectedClassroom, { students: validStudents });
            setCreatedStudents(response.students);
            onSuccess();
            // Don't close or reset yet, show success view
        } catch (err) {
            console.error("Failed to import students", err);
            alert("Failed to import students. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 overflow-y-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        className="relative bg-white rounded-[3rem] p-12 w-full max-w-2xl shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto"
                    >
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                                    {createdStudents.length > 0 ? 'Students Added' : 'Add New Students'}
                                </h3>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-12 h-12 hover:bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all font-black"
                            >
                                <X size={24} strokeWidth={3} />
                            </button>
                        </div>

                        {!createdStudents.length && (
                            <form onSubmit={handleSubmit} className="space-y-10 animate-in fade-in duration-300">
                                {/* Classroom Selection */}
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Select Classroom</label>
                                    <div className="relative group">
                                        <select
                                            required
                                            value={selectedClassroom}
                                            onChange={e => setSelectedClassroom(e.target.value)}
                                            className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-[1.5rem] py-5 px-8 font-black text-slate-800 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all appearance-none cursor-pointer pr-14"
                                        >
                                            <option value="" className="text-slate-300">Choose a classroom...</option>
                                            {classrooms.map(cls => (
                                                <option key={cls.id} value={cls.id}>{cls.name.toLowerCase()} ({cls.grade_level})</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-blue-600 transition-colors" size={20} strokeWidth={3} />
                                    </div>
                                </div>

                                {/* Student Rows */}
                                <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {studentRows.map((row, index) => (
                                        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end relative group p-8 bg-slate-50/30 rounded-[2rem] border border-transparent hover:border-slate-100 transition-all">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Student Name</label>
                                                <div className="relative">
                                                    <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                                    <input
                                                        required
                                                        placeholder="e.g. John Doe"
                                                        value={row.name}
                                                        onChange={e => handleInputChange(index, 'name', e.target.value)}
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
                                                                required
                                                                type="email"
                                                                placeholder="john@example.com"
                                                                value={row.email}
                                                                onChange={e => handleInputChange(index, 'email', e.target.value)}
                                                                className="w-full bg-white border-2 border-slate-100 rounded-2xl py-5 pl-14 pr-6 font-bold text-slate-800 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all placeholder:text-slate-300"
                                                            />
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveRow(index)}
                                                        className={`mt-7 p-4 border-2 border-slate-100 rounded-2xl text-slate-300 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-all ${studentRows.length === 1 ? 'opacity-0 pointer-events-none' : ''}`}
                                                    >
                                                        <Trash2 size={20} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col md:flex-row gap-6">
                                    <button
                                        type="button"
                                        onClick={handleAddRow}
                                        className="flex-1 flex items-center justify-center space-x-3 bg-white border-2 border-slate-100 hover:border-blue-100 hover:bg-blue-50/30 text-slate-600 hover:text-blue-600 rounded-[1.5rem] py-5 px-8 font-black transition-all active:scale-95 shadow-sm"
                                    >
                                        <Plus size={22} strokeWidth={3} />
                                        <span>Add Another</span>
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-[2] bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-[1.5rem] py-5 px-8 font-black text-xl shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                                    >
                                        {submitting ? (
                                            <div className="animate-spin w-6 h-6 border-4 border-white border-t-transparent rounded-full" />
                                        ) : (
                                            <span>Generate Credentials</span>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}

                        {createdStudents.length > 0 && (
                            <div className="space-y-8 animate-in fade-in zoom-in duration-300">
                                <div className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100 flex items-center gap-6">
                                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm">
                                        <CheckCircle size={32} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black text-emerald-900">Credentials Generated!</h4>
                                        <p className="text-emerald-700 text-sm font-medium">Please save these details before closing.</p>
                                    </div>
                                </div>

                                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {createdStudents.map((s, idx) => (
                                        <div key={idx} className="p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100 hover:border-blue-100 transition-all group">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Student</div>
                                                    <div className="text-lg font-black text-slate-800">{s.name}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Student ID</div>
                                                    <div className="text-sm font-mono font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">{s.student_id}</div>
                                                </div>
                                            </div>
                                            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                                                <div>
                                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Initial Password</div>
                                                    <div className="text-lg font-black text-slate-900 tracking-wider select-all">{s.password}</div>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(`${s.name}\nID: ${s.student_id}\nPassword: ${s.password}`);
                                                    }}
                                                    className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-100 transition-all active:scale-95"
                                                >
                                                    <Copy size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-6">
                                    <button
                                        onClick={() => {
                                            const text = createdStudents.map(s => `${s.name} | ID: ${s.student_id} | Pass: ${s.password}`).join('\n');
                                            navigator.clipboard.writeText(text);
                                            setCopied(true);
                                            setTimeout(() => setCopied(false), 2000);
                                        }}
                                        className="flex-1 py-5 bg-white border-2 border-slate-100 hover:border-blue-100 text-slate-600 hover:text-blue-600 rounded-[1.5rem] font-black transition-all flex items-center justify-center gap-3 active:scale-95"
                                    >
                                        {copied ? <Check size={20} /> : <Copy size={20} />}
                                        <span>{copied ? 'Copied All' : 'Copy All List'}</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            onClose();
                                            setCreatedStudents([]);
                                            setStudentRows([{ name: '', email: '' }]);
                                            setSelectedClassroom('');
                                        }}
                                        className="flex-[1.5] py-5 bg-slate-900 border-2 border-slate-900 hover:bg-slate-800 text-white rounded-[1.5rem] font-black transition-all shadow-xl shadow-slate-200 active:scale-95"
                                    >
                                        Done
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AddStudentModal;
