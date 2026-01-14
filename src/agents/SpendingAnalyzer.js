import BaseAgent from './BaseAgent';

class SpendingAnalyzer extends BaseAgent {
    constructor(apiKey) {
        super('Spending Analyzer', 'Analyze spending habits and categorize expenses.', apiKey);
    }

    buildPrompt(context) {
        const { transactions } = context;
        const txString = JSON.stringify(transactions.slice(0, 20)); // Limit context

        return `
      You are a Financial Spending Analyzer Agent.
      Analyze the following transactions and identify patterns, top categories, and unusual spending.
      Return the output as valid JSON with the following structure:
      {
        "top_categories": [{"category": "Name", "amount": 0}],
        "insight": "One sentence summary of spending behavior.",
        "alert": "Any red flags (e.g., high dining spend) or null"
      }

      Transactions: ${txString}
    `;
    }

    mockResponse() {
        return {
            top_categories: [
                { category: "Food & Drink", amount: 450 },
                { category: "Travel", amount: 1200 },
                { category: "Shopping", amount: 300 }
            ],
            insight: "Spending is heavily skewed towards Travel this month.",
            alert: "High dining expenses detected on weekends."
        };
    }
}

export default SpendingAnalyzer;
