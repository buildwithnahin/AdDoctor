import { useEffect, useState } from 'react';
import api from '../services/api';
import DashboardLayout from '../layouts/DashboardLayout';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { AlertCircle, RefreshCw, Activity, HeartPulse } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [adAccounts, setAdAccounts] = useState([]);
    const [aiReport, setAiReport] = useState(null);
    const [isFixing, setIsFixing] = useState(false);
    const [fixApplied, setFixApplied] = useState(false);

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const response = await api.get('/meta/accounts');
                setAdAccounts(response.data);
            } catch (error) {
                console.error("Failed to fetch ad accounts", error);
            }
        };

        const fetchInsights = async () => {
            try {
                const response = await api.get('/insights');
                if (response.data.insights && response.data.insights.length > 0) {
                    setAiReport(response.data.insights[0]); // highest priority insight
                }
            } catch (error) {
                console.error("Failed to fetch insights", error);
            }
        };

        fetchAccounts();
        fetchInsights();
    }, []);

    const handleConnectMeta = async () => {
        try {
            const response = await api.get('/meta/auth-url');
            window.location.href = response.data.url;
        } catch (error) {
            console.error("Failed", error);
            alert("Connection error.");
        }
    };

    const handleApplyFix = () => {
        setIsFixing(true);
        // Mocking API call delay for the hackathon demo
        setTimeout(() => {
            setIsFixing(false);
            setFixApplied(true);
        }, 2000); // 2 seconds delay
    };

    return (
        <DashboardLayout>
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Your Ad Health Overview</h1>
                    <p className="text-gray-500 mt-1">Simple explanations of how your ads are performing right now.</p>
                </div>
                <div className="mt-4 md:mt-0">
                    <Button onClick={handleConnectMeta} className="shadow-sm">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        {adAccounts.length > 0 ? 'Sync New Account' : 'Connect Meta Ads'}
                    </Button>
                </div>
            </div>

            {adAccounts.length === 0 ? (
                /* Empty State */
                <div className="bg-white border border-gray-200 border-dashed rounded-2xl p-12 text-center my-10 shadow-sm">
                    <div className="mx-auto w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mb-6">
                        <AlertCircle className="w-10 h-10 text-primary-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Let the AI Doctor Check Your Ads</h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-8">
                        Connect your Facebook/Meta account first. Our AI will analyze your ads and tell you exactly what you need to do in plain English. No technical skills required.
                    </p>
                    <Button onClick={handleConnectMeta} className="px-8 py-3 bg-primary-600">Give Access to Facebook</Button>
                </div>
            ) : (
                <>
                    {/* Plain Text Doctor Report Focus */}
                    {aiReport && (
                        <div className="mb-8 bg-indigo-50 border-l-4 border-indigo-500 rounded-lg p-6 shadow-sm flex flex-col md:flex-row gap-6 items-start">
                            <div className="bg-white p-3 rounded-full shadow-sm shrink-0">
                                <HeartPulse className="w-8 h-8 text-indigo-600" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-bold text-gray-900 mb-1">Doctor's Primary Diagnosis</h2>
                                <p className="text-lg text-red-600 font-medium mb-3">{aiReport.title}</p>
                                
                                <div className="grid md:grid-cols-2 gap-4 mt-4">
                                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                        <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">What is happening?</h3>
                                        <p className="text-gray-800 leading-relaxed">{aiReport.description}</p>
                                        <div className="mt-3 p-3 bg-red-50 rounded-lg text-sm text-red-800">
                                            <strong>Why?</strong> {aiReport.root_cause}
                                        </div>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm">
                                        <h3 className="text-sm font-bold text-indigo-500 uppercase mb-2">What you need to do:</h3>
                                        <p className="text-gray-800 font-medium leading-relaxed">{aiReport.recommendation}</p>
                                        
                                        {!fixApplied ? (
                                            <Button 
                                                onClick={handleApplyFix} 
                                                disabled={isFixing}
                                                className="mt-4 bg-indigo-600 hover:bg-indigo-700 font-medium w-full sm:w-auto transition-all"
                                            >
                                                {isFixing ? (
                                                    <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Processing via API...</>
                                                ) : (
                                                    <>✨ Apply Fix Automatically</>
                                                )}
                                            </Button>
                                        ) : (
                                            <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center">
                                                <Activity className="h-5 w-5 mr-2 text-green-600" />
                                                <strong>Success!</strong> &nbsp; Ad is paused and changes saved via Meta API.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Vitals</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Card>
                            <CardContent className="pt-6">
                                <p className="text-sm font-medium text-gray-500 mb-1">Click Rate (Are people interested?)</p>
                                <div className="text-xl font-bold text-red-600">It's Too Low</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <p className="text-sm font-medium text-gray-500 mb-1">Costs (Are clicks cheap?)</p>
                                <div className="text-xl font-bold text-orange-600">Getting Expensive</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <p className="text-sm font-medium text-gray-500 mb-1">Spending Health</p>
                                <div className="text-xl font-bold text-green-600">Normal</div>
                                <p className="text-xs text-gray-400 mt-1">($140.50 spent today)</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-primary-50 border-primary-100">
                            <CardContent className="pt-6">
                                <p className="text-sm font-medium text-primary-800 mb-1">Need more details?</p>
                                <Link to="/insights" className="text-lg font-bold text-primary-700 hover:underline flex items-center">
                                    Read Full AI Report <Activity className="w-5 h-5 ml-2" />
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </>
            )}
        </DashboardLayout>
    );
};

export default Dashboard;