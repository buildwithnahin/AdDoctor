import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [adAccounts, setAdAccounts] = useState([]);

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const response = await api.get('/meta/accounts');
                setAdAccounts(response.data);
            } catch (error) {
                console.error("Failed to fetch ad accounts", error);
            }
        };
        fetchAccounts();
    }, []);

    const handleConnectMeta = async () => {
        try {
            const response = await api.get('/meta/auth-url');
            window.location.href = response.data.url;
        } catch (error) {
            console.error("Failed to get auth URL", error);
            alert("Could not connect to Meta at this time.");
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
                <h1>Welcome back, {user?.name}!</h1>
                <button onClick={logout}>Logout</button>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                
                {/* Meta Connect Card */}
                <div style={cardStyle}>
                    <h3>Meta Ads Accounts</h3>
                    {adAccounts.length > 0 ? (
                        <ul style={{ paddingLeft: '20px' }}>
                            {adAccounts.map(acc => (
                                <li key={acc.id} style={{ marginBottom: '10px' }}>
                                    <strong>{acc.name}</strong> 
                                    <span style={{ fontSize: '0.85em', color: '#666', marginLeft: '10px' }}>({acc.status})</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Link your Meta account to start importing your ad campaigns for analysis.</p>
                    )}
                    <button onClick={handleConnectMeta} style={btnStyle}>
                        {adAccounts.length > 0 ? 'Reconnect Meta Account' : 'Connect Meta Account'}
                    </button>
                </div>

                <div style={cardStyle}>
                    <h3>View Insights</h3>
                    <p>Discover AI-powered diagnoses of your current ad performance drops.</p>
                    <button onClick={() => window.location.href = '/insights'} style={{...btnStyle, backgroundColor: '#0056b3', color: '#fff', border: 'none', borderRadius: '4px'}}>
                        Go to Insights
                    </button>
                </div>

                <div style={cardStyle}>
                    <h3>Ad Performance Summary</h3>
                    <p>A quick glance at your daily metrics: Impressions, Clicks, Spend, and CPC.</p>
                    <button style={btnStyle}>View Data</button>
                </div>

            </div>
        </div>
    );
};

const cardStyle = {
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
};

const btnStyle = {
    marginTop: '10px',
    padding: '8px 16px',
    cursor: 'pointer',
};

export default Dashboard;
