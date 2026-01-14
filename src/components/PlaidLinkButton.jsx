import React, { useCallback, useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { createLinkToken, exchangePublicToken } from '../services/api';
import { Link2 } from 'lucide-react';

const PlaidLinkButton = ({ onLinkSuccess }) => {
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getToken = async () => {
            const linkToken = await createLinkToken();
            if (!linkToken) {
                setError("Failed to initialize Plaid");
                setLoading(false);
                return;
            }
            setToken(linkToken);
            setLoading(false);
        };
        getToken();
    }, []);

    const onSuccess = useCallback(async (public_token) => {
        await exchangePublicToken(public_token);
        if (onLinkSuccess) onLinkSuccess();
    }, [onLinkSuccess]);

    const config = {
        token,
        onSuccess,
    };

    const isMock = token === 'link-sandbox-mock-token';
    const { open, ready } = usePlaidLink(isMock ? null : config);

    if (loading) {
        return (
            <button disabled className="flex items-center gap-2 bg-white/5 border border-white/5 text-white/50 py-2 px-4 rounded-lg cursor-wait">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Initializing...</span>
            </button>
        );
    }

    if (error || (!ready && !isMock)) {
        return (
            <button disabled className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 py-2 px-4 rounded-lg cursor-not-allowed">
                <span>{error || 'Connecting...'}</span>
            </button>
        );
    }

    const handleClick = () => {
        if (isMock) {
            // Simulate Plaid Link Flow for Demo
            const mockPublicToken = 'public-sandbox-mock-token';
            // Add a small artificial delay to simulate "linking"
            setTimeout(() => {
                onSuccess(mockPublicToken);
            }, 1000);
        } else {
            open();
        }
    };

    if (error || !ready) {
        return (
            <button disabled className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 py-2 px-4 rounded-lg cursor-not-allowed">
                <span>{error || 'Connecting...'}</span>
            </button>
        );
    }

    return (
        <button
            onClick={handleClick}
            disabled={!ready && !isMock}
            className="flex items-center gap-2 bg-gradient-to-r from-[var(--bg-secondary)] to-[var(--bg-card)] border border-[var(--text-muted)] border-opacity-20 hover:border-[var(--color-primary)] hover:border-opacity-50 text-[var(--text-primary)] py-2 px-4 rounded-lg transition-all hover:shadow-lg"
        >
            <Link2 size={18} className="text-[var(--color-secondary)]" />
            <span>Connect Account</span>
        </button>
    );
};

export default PlaidLinkButton;
