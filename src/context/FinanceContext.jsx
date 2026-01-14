import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../services/api';
import SpendingAnalyzer from '../agents/SpendingAnalyzer';
import BudgetOptimizer from '../agents/BudgetOptimizer';

const FinanceContext = createContext();

export const useFinance = () => useContext(FinanceContext);

export const FinanceProvider = ({ children }) => {
    // Initial Mock Data
    const [goals, setGoals] = useState([
        {
            id: 1,
            name: 'Tesla Model 3',
            targetAmount: 38000,
            currentAmount: 12500,
            deadline: '2026-12-31',
            color: '#2ECC71' // Primary Green
        },
        {
            id: 2,
            name: 'Europe Trip',
            targetAmount: 5000,
            currentAmount: 1200,
            deadline: '2026-06-01',
            color: '#3498DB' // Secondary Blue
        }
    ]);

    const [transactions, setTransactions] = useState([]);
    const [connected, setConnected] = useState(false);
    const [aiInsights, setAiInsights] = useState({ spending: null, budget: null });
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    useEffect(() => {
        // Attempt to restore connection state
        const savedConnection = localStorage.getItem('plaid_connected');
        if (savedConnection === 'true') {
            setConnected(true);
            fetchInitialData();
        }
    }, []);

    const fetchInitialData = async () => {
        const data = await api.fetchTransactions();
        if (data?.error) {
            console.warn("Error fetching data:", data.error);
            if (data.error === 'Access token not set') {
                disconnect();
            }
            return;
        }
        if (data && data.transactions) {
            setTransactions(data.transactions);
        }
    };

    // Run AI Analysis when transactions change
    useEffect(() => {
        if (transactions.length > 0) {
            runAnalysis();
        }
    }, [transactions, goals]);

    const runAnalysis = async () => {
        setIsAnalyzing(true);
        // In a real app, get API Key from user secure storage
        const apiKey = localStorage.getItem('gemini_api_key') || null;

        const spendingAgent = new SpendingAnalyzer(apiKey);
        const budgetAgent = new BudgetOptimizer(apiKey);

        const context = { transactions, goals };

        try {
            const [spending, budget] = await Promise.all([
                spendingAgent.analyze(context),
                budgetAgent.analyze(context)
            ]);
            setAiInsights({ spending, budget });
        } catch (e) {
            console.error("AI Analysis failed", e);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const addGoal = (goal) => {
        setGoals([...goals, { ...goal, id: Date.now() }]);
    };

    const updateGoalProgress = (id, amount) => {
        setGoals(goals.map(g => g.id === id ? { ...g, currentAmount: g.currentAmount + amount } : g));
    };

    const handleLinkSuccess = async () => {
        setConnected(true);
        localStorage.setItem('plaid_connected', 'true');
        await fetchInitialData();
    };

    const disconnect = () => {
        setConnected(false);
        setTransactions([]);
        setAiInsights({ spending: null, budget: null });
        localStorage.removeItem('plaid_connected');
        // Optional: Call backend to invalidate token if needed
        console.log('Disconnected');
    };

    return (
        <FinanceContext.Provider value={{ goals, transactions, connected, aiInsights, isAnalyzing, addGoal, updateGoalProgress, handleLinkSuccess, disconnect }}>
            {children}
        </FinanceContext.Provider>
    );
};
