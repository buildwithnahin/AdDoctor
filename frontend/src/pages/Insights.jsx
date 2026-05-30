import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Insights = () => {
    const { user, logout } = useAuth();
    const [insights, setInsights] = useState([]);
    const [summary, setSummary] = useState({
        ctr_change: '0%',
        cpc_change: '0%',
        spend_summary: '$0.00'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                const response = await api.get('/insights');
                setInsights(response.data.insights);
                setSummary(response.data.summary);
            } catch (error) {
                console.error("Failed to fetch insights", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInsights();
    }, []);

    const criticalIssues = insights.filter(i => i.severity === 'high');
    const warnings = insights.filter(i => i.severity === 'medium' || i.severity === 'low');

    const getSeverityBadgeColor = (severity) => {
        switch(severity) {
            case 'high': return '#dc3545';
            case 'medium': return '#ffc107';
            case 'low': return '#17a2b8';
            default: return '#6c757d';
        }
    };

    if (loading) return <div style={{ padding: '20px' }}>Loading insights...</div>;

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h1 style={{ margin: 0 }}>AdDoctor Insights</h1>
                    <p style={{ margin: '5px 0 0', color: '#666' }}>Diagnosing performance for {user?.name}</p>
                </div>
                <div>
                    <Link to="/dashboard" style={{ marginRight: '15px' }}>Back to Dashboard</Link>
                    <button onClick={logout} style={{ padding: '8px 16px' }}>Logout</button>
                </div>
            </header>

            {/* Performance Summary Metrics */}
            <section style={{ marginBottom: '40px' }}>
                <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Performance Summary</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                    <div style={statCardStyle}>
                        <h4 style={{ margin: 0, color: '#666' }}>CTR Change</h4>
                        <p style={{ fontSize: '2em', margin: '10px 0', color: summary.ctr_change.includes('-') ? '#dc3545' : '#28a745' }}>
                            {summary.ctr_change}
                        </p>
                    </div>
                    <div style={statCardStyle}>
                        <h4 style={{ margin: 0, color: '#666' }}>CPC Change</h4>
                        <p style={{ fontSize: '2em', margin: '10px 0', color: summary.cpc_change.includes('+') ? '#dc3545' : '#28a745' }}>
                            {summary.cpc_change}
                        </p>
                    </div>
                    <div style={statCardStyle}>
                        <h4 style={{ margin: 0, color: '#666' }}>Recent Spend</h4>
                        <p style={{ fontSize: '2em', margin: '10px 0' }}>{summary.spend_summary}</p>
                    </div>
                </div>
            </section>

            {/* Critical Issues Section */}
            <section style={{ marginBottom: '40px' }}>
                <h2 style={{ borderBottom: '2px solid #dc3545', paddingBottom: '10px', color: '#dc3545' }}>
                    Critical Issues ({criticalIssues.length})
                </h2>
                {criticalIssues.length === 0 ? (
                    <p style={{ color: '#28a745' }}>No critical issues detected. Great job!</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {criticalIssues.map(insight => (
                            <InsightCard key={insight.id} insight={insight} badgeColor={getSeverityBadgeColor(insight.severity)} />
                        ))}
                    </div>
                )}
            </section>

            {/* Warnings Section */}
            <section>
                <h2 style={{ borderBottom: '2px solid #ffc107', paddingBottom: '10px', color: '#d39e00' }}>
                    Warnings & Improvements ({warnings.length})
                </h2>
                {warnings.length === 0 ? (
                    <p>No warnings at this time.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {warnings.map(insight => (
                            <InsightCard key={insight.id} insight={insight} badgeColor={getSeverityBadgeColor(insight.severity)} />
                        ))}
                    </div>
                )}
            </section>

        </div>
    );
};

const InsightCard = ({ insight, badgeColor }) => (
    <div style={{ 
        border: '1px solid #ddd', 
        borderRadius: '8px', 
        padding: '20px', 
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
            <h3 style={{ margin: 0 }}>{insight.title}</h3>
            <span style={{ 
                backgroundColor: badgeColor, 
                color: '#fff', 
                padding: '4px 8px', 
                borderRadius: '4px',
                fontSize: '0.8em',
                textTransform: 'uppercase',
                fontWeight: 'bold'
            }}>
                {insight.severity}
            </span>
        </div>
        <p style={{ fontSize: '1.1em', marginBottom: '15px' }}>{insight.description}</p>
        
        <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '4px', marginBottom: '15px' }}>
            <strong style={{ color: '#dc3545' }}>Root Cause:</strong>
            <p style={{ margin: '5px 0 0 0' }}>{insight.root_cause}</p>
        </div>

        <div style={{ backgroundColor: '#e8f4f8', padding: '15px', borderRadius: '4px' }}>
            <strong style={{ color: '#0056b3' }}>Recommendation:</strong>
            <p style={{ margin: '5px 0 0 0' }}>{insight.recommendation}</p>
        </div>
    </div>
);

const statCardStyle = {
    padding: '20px',
    backgroundColor: '#fff',
    border: '1px solid #eee',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
};

export default Insights;
