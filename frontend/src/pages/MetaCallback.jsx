import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';

const MetaCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('Connecting to Meta...');

    useEffect(() => {
        const code = searchParams.get('code');
        if (code) {
            connectMeta(code);
        } else {
            setStatus('Invalid callback URL.');
            setTimeout(() => navigate('/dashboard'), 2000);
        }
    }, [searchParams, navigate]);

    const connectMeta = async (code) => {
        try {
            await api.post('/meta/callback', { code });
            setStatus('Connected successfully!');
            setTimeout(() => navigate('/dashboard'), 1000);
        } catch (error) {
            console.error(error);
            setStatus('Failed to connect Meta account.');
            setTimeout(() => navigate('/dashboard'), 3000);
        }
    };

    return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
            <h2>{status}</h2>
        </div>
    );
};

export default MetaCallback;
