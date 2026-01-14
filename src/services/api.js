const API_URL = 'http://localhost:8000/api';

export const createLinkToken = async () => {
    try {
        const response = await fetch(`${API_URL}/create_link_token`, {
            method: 'POST',
        });
        if (!response.ok) {
            console.error("Server returned error for link token:", response.status);
            return null;
        }
        const data = await response.json();
        return data.link_token;
    } catch (error) {
        console.error("Failed to create link token", error);
        return null;
    }
};

export const exchangePublicToken = async (public_token) => {
    try {
        const response = await fetch(`${API_URL}/set_access_token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ public_token }),
        });
        return await response.json();
    } catch (error) {
        console.error("Failed to exchange token", error);
    }
};

export const fetchTransactions = async () => {
    try {
        const response = await fetch(`${API_URL}/transactions`);
        if (!response.ok) {
            const errorData = await response.json();
            return { error: errorData.error || 'Failed to fetch' };
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch transactions", error);
        return { error: error.message };
    }
};
