import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user, logout } = useAuth();

    return (
        <div style={{ padding: '20px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
                <h1>Welcome back, {user?.name}!</h1>
                <button onClick={logout}>Logout</button>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                
                {/* Placeholder Cards */}
                <div style={cardStyle}>
                    <h3>Connect Meta Ads Account</h3>
                    <p>Link your Meta account to start importing your ad campaigns for analysis.</p>
                    <button style={btnStyle}>Connect Account</button>
                </div>

                <div style={cardStyle}>
                    <h3>View Insights</h3>
                    <p>Discover AI-powered diagnoses of your current ad performance drops.</p>
                    <button style={btnStyle}>Go to Insights</button>
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
