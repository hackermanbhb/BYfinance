import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, AlertTriangle, CheckCircle, Brain } from 'lucide-react';

const AiInsightsCard = ({ insights, isAnalyzing }) => {
    if (isAnalyzing) {
        return (
            <div className="glass-card p-6 flex flex-col items-center justify-center min-h-[250px] relative overflow-hidden">
                <Sparkles className="text-primary w-10 h-10 animate-spin-slow mb-4" />
                <p className="text-text-secondary animate-pulse">AI Agents Analyzing Financial data...</p>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-shimmer" />
            </div>
        );
    }

    if (!insights.spending && !insights.budget) {
        return (
            <div className="glass-card p-6 flex flex-col items-center justify-center min-h-[250px] text-center">
                <Brain className="text-text-muted w-12 h-12 mb-4" />
                <p className="text-text-muted">Connect your accounts to generate AI insights.</p>
            </div>
        );
    }

    return (
        <div className="glass-card p-0 overflow-hidden flex flex-col h-full">
            <div className="p-4 border-b border-white/5 bg-gradient-to-r from-primary/10 to-transparent flex items-center gap-2">
                <Sparkles size={18} className="text-primary" />
                <h3 className="font-bold text-white">AI Financial Analysis</h3>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto max-h-[400px] custom-scrollbar">
                {/* Spending Analysis */}
                {insights.spending && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                        <h4 className="text-sm uppercase tracking-wider text-text-secondary font-semibold">Spending Patterns</h4>

                        {insights.spending.alert && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex gap-3 items-start">
                                <AlertTriangle size={18} className="text-red-400 shrink-0 mt-0.5" />
                                <p className="text-sm text-red-200">{insights.spending.alert}</p>
                            </div>
                        )}

                        <p className="text-white text-lg font-light leading-relaxed">
                            "{insights.spending.insight}"
                        </p>

                        <div className="flex gap-2 flex-wrap mt-2">
                            {insights.spending.top_categories.map((cat, idx) => (
                                <span key={idx} className="text-xs bg-bg-secondary px-2 py-1 rounded-full text-text-secondary border border-white/5">
                                    {cat.category}: ${cat.amount}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                )}

                {insights.budget && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-3 pt-4 border-t border-white/5 mt-4">
                        <h4 className="text-sm uppercase tracking-wider text-text-secondary font-semibold">Budget Recommendations</h4>
                        <div className="space-y-3">
                            {insights.budget.recommendations.map((rec, idx) => (
                                <div key={idx} className="flex gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group">
                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                                        <CheckCircle size={16} />
                                    </div>
                                    <div>
                                        <p className="text-white font-medium text-sm">{rec.title}</p>
                                        <p className="text-xs text-text-secondary mt-0.5">{rec.detail}</p>
                                    </div>
                                    <span className={`text-xs ml-auto px-2 py-0.5 rounded border ${rec.impact === 'High' ? 'border-primary/50 text-primary' : 'border-white/10 text-text-muted'} h-fit`}>
                                        {rec.impact}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default AiInsightsCard;
