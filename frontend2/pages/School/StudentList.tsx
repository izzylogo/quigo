import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Filter, Eye, EyeOff, ExternalLink, Trash2, Plus,
    CheckCircle2, ShieldAlert, Loader2, X
} from 'lucide-react';
import { Student } from '../../types';

interface StudentListProps {
    students: Student[];
    onSelectStudent: (student: Student) => void;
    onDeleteStudent: (id: string) => void;
    onOpenAddModal: () => void;
}

const StudentList: React.FC<StudentListProps> = ({ students, onSelectStudent, onDeleteStudent, onOpenAddModal }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClassroom, setSelectedClassroom] = useState('All Students');
    const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
    const [visibleIds, setVisibleIds] = useState<Record<string, boolean>>({});
    const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
    const [deleteStep, setDeleteStep] = useState(1);
    const [deleting, setDeleting] = useState(false);

    const classrooms = ['All Students', ...Array.from(new Set(students.map(s => s.classroom_name || s.classroom)))];

    const filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.student_id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesClassroom = selectedClassroom === 'All Students' || (student.classroom_name || student.classroom) === selectedClassroom;
        return matchesSearch && matchesClassroom;
    });

    const toggleId = (id: string) => {
        setVisibleIds(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const togglePassword = (id: string) => {
        setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleDeleteClick = (student: Student) => {
        setStudentToDelete(student);
        setDeleteStep(1);
    };

    const confirmDelete = async () => {
        if (!studentToDelete) return;
        if (deleteStep === 1) {
            setDeleteStep(2);
            return;
        }

        setDeleting(true);
        try {
            await onDeleteStudent(studentToDelete.id);
            setStudentToDelete(null);
        } catch (err) {
            console.error("Failed to delete student", err);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <>
            <div className="space-y-8 pb-16 font-outfit">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight lowercase">Student Directory</h1>
                        <p className="text-slate-400 font-bold uppercase text-[11px] tracking-widest mt-1">
                            Managing {students.length} verified student identities
                        </p>
                    </div>
                    <button
                        onClick={onOpenAddModal}
                        className="flex items-center space-x-2 bg-slate-900 text-white px-8 py-4 rounded-[1.5rem] font-black hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                    >
                        <Plus size={20} strokeWidth={3} />
                        <span>New Student</span>
                    </button>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3">
                    {classrooms.map(cls => (
                        <button
                            key={cls}
                            onClick={() => setSelectedClassroom(cls)}
                            className={`px-8 py-3.5 rounded-[1.2rem] font-black text-sm transition-all border-2 ${selectedClassroom === cls
                                ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-105'
                                : 'bg-white text-slate-500 border-slate-50 hover:border-slate-100 hover:bg-slate-50'
                                }`}
                        >
                            {cls}
                        </button>
                    ))}
                </div>

                {/* Search and Table Container */}
                <div className="bg-white border border-slate-100 rounded-[3rem] p-8 shadow-sm space-y-8">
                    {/* Search Bar */}
                    <div className="flex items-center space-x-4">
                        <div className="flex-1 relative group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Search students by name, email or ID..."
                                className="w-full bg-slate-50/50 border border-slate-100 rounded-[1.5rem] py-5 pl-14 pr-8 font-bold text-slate-600 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 transition-all placeholder:text-slate-300"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="p-5 bg-white border border-slate-100 rounded-[1.5rem] text-slate-400 hover:text-blue-500 hover:bg-blue-50/50 transition-all shadow-sm">
                            <Filter size={20} />
                        </button>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-[11px] font-black text-slate-300 uppercase tracking-[0.15em]">
                                    <th className="px-6 py-4 pb-8">Identity Profile</th>
                                    <th className="px-6 py-4 pb-8">Classroom</th>
                                    <th className="px-6 py-4 pb-8 text-center">Tests Completed</th>
                                    <th className="px-6 py-4 pb-8 text-center">Student ID</th>
                                    <th className="px-6 py-4 pb-8 text-center">Student Password</th>
                                    <th className="px-6 py-4 pb-8 text-center">Status</th>
                                    <th className="px-6 py-4 pb-8 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredStudents.map(student => (
                                    <tr key={student.id} className="group hover:bg-blue-50/30 transition-all">
                                        <td className="px-6 py-8">
                                            <div className="flex items-center space-x-5">
                                                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-[1.2rem] flex items-center justify-center text-xl font-black shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                    {student.name.charAt(0).toLowerCase()}
                                                </div>
                                                <div className="space-y-0.5">
                                                    <div className="text-lg font-black text-slate-800 tracking-tight group-hover:text-blue-700 transition-colors cursor-pointer" onClick={() => onSelectStudent(student)}>
                                                        {student.name.toLowerCase()}
                                                    </div>
                                                    <div className="text-sm font-bold text-slate-400">{student.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-8">
                                            <div className="px-4 py-2 bg-blue-50/50 border border-blue-100 text-blue-600 rounded-xl font-black text-xs inline-block">
                                                {student.classroom_name || student.classroom}
                                            </div>
                                        </td>
                                        <td className="px-6 py-8 text-center">
                                            <div className="text-lg font-black text-slate-800">
                                                {student.attempts_count || 0}<span className="text-slate-300">/{student.total_quizzes || 0}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-8 text-center">
                                            <div className="flex items-center justify-center space-x-2">
                                                <div className="px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl font-bold font-mono text-sm text-slate-500 min-w-[120px]">
                                                    {visibleIds[student.id] ? student.student_id : '••••••••'}
                                                </div>
                                                <button
                                                    onClick={() => toggleId(student.id)}
                                                    className="p-2 text-slate-300 hover:text-blue-500 transition-colors"
                                                >
                                                    {visibleIds[student.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-8 text-center">
                                            <div className="flex items-center justify-center space-x-2">
                                                <div className="px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl font-bold font-mono text-sm text-slate-500 min-w-[120px]">
                                                    {visiblePasswords[student.id] ? (student.password || '••••••••') : '••••••••'}
                                                </div>
                                                <button
                                                    onClick={() => togglePassword(student.id)}
                                                    className="p-2 text-slate-300 hover:text-blue-500 transition-colors"
                                                >
                                                    {visiblePasswords[student.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-8 text-center">
                                            <div className={`flex items-center justify-center space-x-1.5 px-3 py-1.5 ${student.status === 'active' || true ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'} border rounded-xl inline-flex font-black text-[10px] uppercase tracking-wider`}>
                                                <CheckCircle2 size={12} strokeWidth={3} />
                                                <span>Active</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-8 text-right">
                                            <div className="flex items-center justify-end space-x-1">
                                                <button
                                                    onClick={() => onSelectStudent(student)}
                                                    className="p-3 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                                    title="View Profile"
                                                >
                                                    <ExternalLink size={20} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(student)}
                                                    className="p-3 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                                    title="Delete Student"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredStudents.length === 0 && (
                            <div className="py-20 text-center space-y-3">
                                <div className="text-slate-300 font-black text-xl italic font-display">No students matching your search.</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {studentToDelete && (
                    <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-[2.5rem] p-10 shadow-2xl max-w-sm w-full text-center relative overflow-hidden"
                        >
                            <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-6 ${deleteStep === 1 ? 'bg-orange-50 text-orange-500' : 'bg-red-50 text-red-500'}`}>
                                <ShieldAlert size={40} />
                            </div>

                            <h3 className="text-2xl font-black text-slate-900 mb-2">
                                {deleteStep === 1 ? 'Wait a minute!' : 'Final Warning!'}
                            </h3>

                            <p className="text-slate-500 font-medium mb-10">
                                {deleteStep === 1
                                    ? `do you want to delete "${studentToDelete.name.toLowerCase()}"?`
                                    : "you won't see it again are you sure?"
                                }
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setStudentToDelete(null)}
                                    className="py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    disabled={deleting}
                                    className={`py-4 text-white rounded-2xl font-bold shadow-lg transition-all flex items-center justify-center space-x-2 ${deleteStep === 1 ? 'bg-orange-500 hover:bg-orange-600' : 'bg-red-500 hover:bg-red-600'
                                        }`}
                                >
                                    {deleting ? <Loader2 className="animate-spin" size={20} /> : (
                                        <span>{deleteStep === 1 ? 'Yes, I do' : 'Delete Now'}</span>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default StudentList;
