import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 8000;

// Plaid Configuration
const configuration = new Configuration({
    basePath: PlaidEnvironments[process.env.PLAID_ENV || 'sandbox'],
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
            'PLAID-SECRET': process.env.PLAID_SECRET,
        },
    },
});

const client = new PlaidApi(configuration);

// In-memory storage for access tokens (Do not use in production)
let ACCESS_TOKEN = null;
let ITEM_ID = null;

// Generate Link Token
app.post('/api/create_link_token', async (req, res) => {
    try {
        const response = await client.linkTokenCreate({
            user: { client_user_id: 'user-id-mock' },
            client_name: 'BY Finance',
            products: ['auth', 'transactions'],
            country_codes: ['US'],
            language: 'en',
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error creating link token:', error);
        // Return mock token if in development/demo mode without keys
        if (!process.env.PLAID_CLIENT_ID) {
            console.log('Returning MOCK Link Token for UI testing');
            return res.json({ link_token: 'link-sandbox-mock-token', expiration: '2026-01-01T00:00:00Z' });
        }
        res.status(500).json({ error: error.message });
    }
});

// Exchange Public Token
app.post('/api/set_access_token', async (req, res) => {
    const { public_token } = req.body;
    try {
        const response = await client.itemPublicTokenExchange({
            public_token,
        });
        ACCESS_TOKEN = response.data.access_token;
        ITEM_ID = response.data.item_id;
        res.json({ item_id: ITEM_ID, message: 'Access token set successfully' });
    } catch (error) {
        console.error('Error exchanging token:', error);
        if (!process.env.PLAID_CLIENT_ID) {
            // Mock success
            ACCESS_TOKEN = 'access-sandbox-mock-token';
            return res.json({ item_id: 'item-id-mock', message: 'Mock Access token set' });
        }
        res.status(500).json({ error: error.message });
    }
});

// Get Transactions
app.get('/api/transactions', async (req, res) => {
    if (!ACCESS_TOKEN) {
        if (!process.env.PLAID_CLIENT_ID) {
            // Return Mock Transactions
            return res.json({
                transactions: [
                    { transaction_id: '1', name: 'Starbucks', amount: 5.50, date: '2025-01-14', category: ['Food and Drink', 'Coffee Shop'] },
                    { transaction_id: '2', name: 'Uber Digitals', amount: 24.00, date: '2025-01-13', category: ['Travel', 'Taxi'] },
                    { transaction_id: '3', name: 'United Airlines', amount: 350.00, date: '2025-01-10', category: ['Travel', 'Airlines'] },
                    { transaction_id: '4', name: 'Apple Store', amount: 999.00, date: '2025-01-05', category: ['Shops', 'Electronics'] },
                ]
            });
        }
        return res.status(400).json({ error: 'Access token not set' });
    }

    try {
        const response = await client.transactionsSync({
            access_token: ACCESS_TOKEN,
        });
        // Normalize the transactionsSync response to a flat transactions array
        const allTransactions = [
            ...(response.data.added || []),
            ...(response.data.modified || [])
        ];
        res.json({ transactions: allTransactions });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
