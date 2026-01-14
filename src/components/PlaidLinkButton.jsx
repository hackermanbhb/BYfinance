import React, { useCallback, useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { createLinkToken, exchangePublicToken } from '../services/api';
import { Link2 } from 'lucide-react';

const PlaidLinkButton = ({ onLinkSuccess }) => {
    const [token, setToken] = useState(null);

    useEffect(() => {
        const getToken = async () => {
            const linkToken = await createLinkToken();
            setToken(linkToken);
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

    const { open, ready } = usePlaidLink(config);

    if (!token) return <button className="opacity-50 cursor-not-allowed text-white">Loading...</button>;

    return (
        <button
            onClick={() => open()}
            disabled={!ready}
            className="flex items-center gap-2 bg-gradient-to-r from-bg-secondary to-bg-card border border-white/10 hover:border-primary/50 text-white py-2 px-4 rounded-lg transition-all hover:shadow-lg"
        >
            <Link2 size={18} className="text-secondary" />
            <span>Connect Account</span>
        </button>
    );
};

export default PlaidLinkButton;
