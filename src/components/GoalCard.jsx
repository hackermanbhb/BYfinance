import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const GoalCard = ({ goal }) => {
    const percentage = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
    const remaining = goal.targetAmount - goal.currentAmount;

    const data = {
        labels: ['Saved', 'Remaining'],
        datasets: [
            {
                data: [goal.currentAmount, remaining],
                backgroundColor: [goal.color || '#2ECC71', 'rgba(128, 128, 128, 0.2)'],
                borderWidth: 0,
                cutout: '75%',
            },
        ],
    };

    const options = {
        plugins: {
            legend: { display: false },
            tooltip: { enabled: false },
        },
        maintainAspectRatio: false,
    };

    return (
        <div className="glass-card p-6 flex flex-col items-center relative overflow-hidden group bg-[var(--bg-card)] border border-[var(--bg-secondary)]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-shimmer" />

            <div className="w-full flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-[var(--text-primary)]">{goal.name}</h3>
                    <p className="text-sm text-[var(--text-secondary)]">Target: ${goal.targetAmount.toLocaleString()}</p>
                </div>
                <div className="text-right">
                    <span className="text-2xl font-bold" style={{ color: goal.color || '#2ECC71' }}>{percentage}%</span>
                </div>
            </div>

            <div className="relative w-48 h-48 mb-4">
                <Doughnut data={data} options={options} />
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Saved</span>
                    <span className="text-2xl font-bold text-[var(--text-primary)]">${goal.currentAmount.toLocaleString()}</span>
                </div>
            </div>

            <div className="w-full bg-[var(--bg-secondary)] rounded-full h-2 mt-2 overflow-hidden">
                <div
                    className="h-full transition-all duration-1000 ease-out"
                    style={{ width: `${percentage}%`, backgroundColor: goal.color || '#2ECC71' }}
                />
            </div>

            <p className="mt-4 text-sm text-center text-[var(--text-muted)]">
                ${remaining.toLocaleString()} to go
            </p>
        </div>
    );
};

export default GoalCard;

