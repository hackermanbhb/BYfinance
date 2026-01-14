import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import GoalCard from '../components/GoalCard';
import AddGoalModal from '../components/AddGoalModal';
import PlaidLinkButton from '../components/PlaidLinkButton';
import AiInsightsCard from '../components/AiInsightsCard';
import ThemeToggle from '../components/ThemeToggle';
import { motion } from 'framer-motion';
import { Plus, TrendingUp, TrendingDown } from 'lucide-react';

const Dashboard = () => {
    const { goals, addGoal, transactions, handleLinkSuccess, connected, aiInsights, isAnalyzing } = useFinance();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddGoal = (goalData) => {
        addGoal(goalData);
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="container py-8 relative">
            {/* Header */}
            <header className="mb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-bold text-[var(--color-primary)] mb-2">
                        Dashboard
                    </h1>
                    <p className="text-[var(--text-secondary)]">Track your path to financial freedom.</p>
                </div>
                <div className="flex gap-4 items-center">
                    <ThemeToggle />
                    <PlaidLinkButton onLinkSuccess={handleLinkSuccess} />
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-[var(--color-primary)] hover:opacity-90 active:scale-95 transition-all text-white font-bold py-2 px-6 rounded-lg shadow-lg"
                    >
                        <Plus size={20} />
                        <span>New Goal</span>
                    </button>
                </div>
            </header>

            {/* Goals Section */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Your Goals</h2>
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {goals.map(goal => (
                        <motion.div variants={item} key={goal.id}>
                            <GoalCard goal={goal} />
                        </motion.div>
                    ))}

                    {/* Add Goal Placeholder Card */}
                    <motion.div
                        variants={item}
                        onClick={() => setIsModalOpen(true)}
                        className="glass-card border-dashed border-2 border-[var(--text-muted)] border-opacity-30 p-6 flex flex-col items-center justify-center min-h-[300px] cursor-pointer hover:border-[var(--color-primary)] hover:bg-[var(--bg-glass)] group transition-colors bg-[var(--bg-card)]"
                    >
                        <div className="w-16 h-16 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Plus size={32} className="text-[var(--text-muted)] group-hover:text-[var(--color-primary)] transition-colors" />
                        </div>
                        <p className="text-[var(--text-muted)] font-medium group-hover:text-[var(--color-primary)] transition-colors">Create New Goal</p>
                    </motion.div>
                </motion.div>
            </section>

            {/* Other Sections Placeholder */}
            <section>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="glass-card p-6 lg:col-span-2 bg-[var(--bg-card)] border border-[var(--bg-secondary)]">
                        <h2 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">Financial Overview</h2>
                        <div className="flex flex-col gap-4">
                            {transactions.length > 0 ? (
                                transactions.map(tx => (
                                    <div key={tx.transaction_id} className="flex justify-between items-center p-3 hover:bg-[var(--bg-glass)] rounded-lg transition-colors border-b border-[var(--bg-secondary)] last:border-0">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[var(--bg-secondary)] flex-center text-[var(--text-muted)]">
                                                {tx.amount > 0 ? <TrendingDown size={16} /> : <TrendingUp size={16} />}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-[var(--text-primary)]">{tx.name}</p>
                                                <p className="text-xs text-[var(--text-secondary)]">{tx.date} • {tx.category?.[0]}</p>
                                            </div>
                                        </div>
                                        <span className={`font-bold ${tx.amount > 100 ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                                            ${tx.amount.toFixed(2)}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="flex-center h-48 text-[var(--text-muted)] bg-[var(--bg-secondary)] rounded-lg flex-col gap-3">
                                    <p>No transactions yet.</p>
                                    {!connected && <p className="text-sm">Connect your bank account to see data.</p>}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="lg:col-span-1 h-full">
                        <AiInsightsCard insights={aiInsights} isAnalyzing={isAnalyzing} />
                    </div>
                </div>
            </section>

            <AddGoalModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddGoal}
            />
        </div>
    );
};

export default Dashboard;
