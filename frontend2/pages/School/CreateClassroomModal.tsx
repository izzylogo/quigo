import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { schoolService } from '../../services/api';

interface CreateClassroomModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    educationSystems: string[];
}

const CreateClassroomModal: React.FC<CreateClassroomModalProps> = ({
    isOpen, onClose, onSuccess, educationSystems
}) => {
    const [newClassroom, setNewClassroom] = useState({ name: '', grade: '' });
    const [creating, setCreating] = useState(false);

    const handleCreateClassroom = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newClassroom.name && newClassroom.grade) {
            setCreating(true);
            try {
                await schoolService.createClassroom({
                    name: newClassroom.name,
                    grade_level: newClassroom.grade
                });
                setNewClassroom({ name: '', grade: '' });
                onSuccess();
                onClose();
            } catch (err) {
                alert("Failed to create classroom");
            } finally {
                setCreating(false);
            }
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative bg-white rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl border border-slate-100"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-2xl font-display font-bold text-slate-900">New Classroom</h3>
                                <p className="text-slate-400 font-medium text-xs mt-1">Define your curriculum group</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 hover:bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateClassroom} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Classroom Name</label>
                                <input
                                    required
                                    placeholder="e.g. Advanced Physics A"
                                    value={newClassroom.name}
                                    onChange={e => setNewClassroom({ ...newClassroom, name: e.target.value })}
                                    className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-4 px-6 font-bold text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Grade Level</label>
                                <select
                                    required
                                    value={newClassroom.grade}
                                    onChange={e => setNewClassroom({ ...newClassroom, grade: e.target.value })}
                                    className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-4 px-6 font-bold text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition-all appearance-none cursor-pointer"
                                >
                                    <option value="">Select Grade Level</option>
                                    {educationSystems?.map((level: string, index: number) => (
                                        <option key={index} value={level}>{level}</option>
                                    ))}
                                </select>
                            </div>
                            <button
                                disabled={creating}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-2xl py-5 font-display font-bold text-lg shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-3"
                            >
                                {creating ? <div className="animate-spin w-5 h-5 border-3 border-white border-t-transparent rounded-full" /> : <span>Create Classroom</span>}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CreateClassroomModal;
