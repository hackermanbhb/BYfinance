import BaseAgent from './BaseAgent';

class BudgetOptimizer extends BaseAgent {
    constructor(apiKey) {
        super('Budget Optimizer', 'Suggest budget adjustments and savings opportunities.', apiKey);
    }

    buildPrompt(context) {
        const { transactions, goals } = context;
        const txString = JSON.stringify(transactions.slice(0, 20));
        const goalsString = JSON.stringify(goals);

        return `
      You are a Budget Optimization Agent.
      Analyze the spending against the goals.
      Goals: ${goalsString}
      Transactions: ${txString}

      Suggest 3 specific ways to save money to reach the goals faster.
      Return JSON:
      {
        "recommendations": [
          {"title": "Actionable Title", "detail": "Description of action", "impact": "High/Medium/Low"}
        ]
      }
    `;
    }

    mockResponse() {
        return {
            recommendations: [
                { title: "Reduce Coffee Spend", detail: "Cutting daily coffee could save $150/mo.", impact: "Medium" },
                { title: "Cancel Unused Subs", detail: "Identify unused subscriptions like 'Gym'.", impact: "Low" },
                { title: "Cook at Home", detail: "Dining out is 40% of expenses. Cooking 2x more saves $400/mo.", impact: "High" }
            ]
        };
    }
}

export default BudgetOptimizer;
