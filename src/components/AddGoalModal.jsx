import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, DollarSign, Calendar } from 'lucide-react';

const AddGoalModal = ({ isOpen, onClose, onAdd }) => {
    const [formData, setFormData] = useState({
        name: '',
        targetAmount: '',
        currentAmount: '',
        deadline: '',
        color: '#2ECC71'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd({
            ...formData,
            targetAmount: Number(formData.targetAmount),
            currentAmount: Number(formData.currentAmount)
        });
        onClose();
        setFormData({ name: '', targetAmount: '', currentAmount: '', deadline: '', color: '#2ECC71' });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-0 m-auto w-full max-w-md h-fit z-50 p-4"
                    >
                        <div className="glass-card p-8 relative bg-[#18181B]">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-text-muted hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>

                            <h2 className="text-2xl font-bold mb-6 text-white text-center">New Savings Goal</h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm text-text-secondary flex items-center gap-2">
                                        <Target size={16} /> Goal Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g., Tesla Model 3"
                                        className="w-full bg-bg-primary border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm text-text-secondary flex items-center gap-2">
                                            <DollarSign size={16} /> Target ($)
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            placeholder="30000"
                                            className="w-full bg-bg-primary border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                                            value={formData.targetAmount}
                                            onChange={e => setFormData({ ...formData, targetAmount: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-text-secondary flex items-center gap-2">
                                            <DollarSign size={16} /> Current ($)
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            placeholder="0"
                                            className="w-full bg-bg-primary border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                                            value={formData.currentAmount}
                                            onChange={e => setFormData({ ...formData, currentAmount: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-text-secondary flex items-center gap-2">
                                        <Calendar size={16} /> Target Date
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full bg-bg-primary border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                                        value={formData.deadline}
                                        onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-text-secondary">Color Accent</label>
                                    <div className="flex gap-2">
                                        {['#2ECC71', '#3498DB', '#9B59B6', '#F1C40F', '#E74C3C'].map(color => (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, color })}
                                                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${formData.color === color ? 'border-white scale-110' : 'border-transparent'}`}
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-primary hover:bg-green-400 text-bg-primary font-bold py-3 rounded-lg shadow-glow mt-6 transition-colors"
                                >
                                    Create Goal
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AddGoalModal;
