import { useEffect, useState } from 'react';
import api from '../services/api';
import DashboardLayout from '../layouts/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';

const Insights = () => {
    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                const response = await api.get('/insights');
                setInsights(response.data.insights || []);
            } catch (error) {
                console.error("Failed to fetch insights", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInsights();
    }, []);

    const critical = insights.filter(i => i.severity === 'high');
    const warnings = insights.filter(i => i.severity === 'medium');
    const logs = insights.filter(i => i.severity === 'low');

    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Diagnostic Insights</h1>
                <p className="text-gray-500 mt-1">AI-generated breakdown of ad performance.</p>
            </div>

            {loading ? (
                <div className="animate-pulse space-y-4">
                    <div className="h-32 bg-gray-200 rounded-xl w-full"></div>
                    <div className="h-32 bg-gray-200 rounded-xl w-full"></div>
                </div>
            ) : insights.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm text-gray-500">
                    No anomalies or insights detected recently.
                </div>
            ) : (
                <div className="space-y-10">
                    {critical.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold flex items-center text-red-700 mb-4 border-b border-red-100 pb-2">
                                <AlertTriangle className="h-5 w-5 mr-2" /> Critical Issues
                            </h2>
                            <div className="grid gap-4">
                                {critical.map(insight => <InsightCard key={insight.id} insight={insight} />)}
                            </div>
                        </section>
                    )}

                    {warnings.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold flex items-center text-yellow-700 mb-4 border-b border-yellow-100 pb-2">
                                <AlertCircle className="h-5 w-5 mr-2" /> Warnings
                            </h2>
                            <div className="grid gap-4">
                                {warnings.map(insight => <InsightCard key={insight.id} insight={insight} />)}
                            </div>
                        </section>
                    )}
                    
                    {logs.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold flex items-center text-gray-700 mb-4 border-b border-gray-200 pb-2">
                                <CheckCircle2 className="h-5 w-5 mr-2 text-green-600" /> Notifications
                            </h2>
                            <div className="grid gap-4">
                                {logs.map(insight => <InsightCard key={insight.id} insight={insight} />)}
                            </div>
                        </section>
                    )}
                </div>
            )}
        </DashboardLayout>
    );
};

const InsightCard = ({ insight }) => {
    const isHigh = insight.severity === 'high';
    const isMed = insight.severity === 'medium';
    
    return (
        <Card className={`border-l-4 overflow-hidden shadow-sm transition-shadow hover:shadow-md ${isHigh ? 'border-l-red-500' : isMed ? 'border-l-yellow-500' : 'border-l-gray-400'}`}>
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{insight.title}</h3>
                    <Badge variant={isHigh ? 'red' : isMed ? 'yellow' : 'gray'}>
                        {insight.severity}
                    </Badge>
                </div>
                <p className="text-gray-600 mb-5">{insight.description}</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-red-50/50 p-4 rounded-xl border border-red-100/50">
                        <span className="text-xs font-bold text-red-800 uppercase tracking-wider mb-2 block">Detected Root Cause</span>
                        <p className="text-sm text-red-900">{insight.root_cause}</p>
                    </div>
                    <div className="bg-primary-50/50 p-4 rounded-xl border border-primary-100/50">
                        <span className="text-xs font-bold text-primary-800 uppercase tracking-wider mb-2 block">Action Recommendation</span>
                        <p className="text-sm text-primary-900">{insight.recommendation}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default Insights;
