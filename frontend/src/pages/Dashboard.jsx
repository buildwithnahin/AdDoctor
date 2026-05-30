import { useEffect, useState } from 'react';
import api from '../services/api';
import DashboardLayout from '../layouts/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { MousePointerClick, CircleDollarSign, TrendingUp, AlertCircle, RefreshCw, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [adAccounts, setAdAccounts] = useState([]);
    const [stats, setStats] = useState({ ctr: '-4.2%', cpc: '+12.5%', spend: '$842.50', score: '72/100' });

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
            console.error("Failed", error);
            alert("Connection error.");
        }
    };

    return (
        <DashboardLayout>
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Account Overview</h1>
                    <p className="text-gray-500 mt-1">Here's what's happening with your ads today.</p>
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
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Ad Data Found</h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-8">
                        Connect your Meta Ads account to start receiving AI-powered diagnostics and performance insights instantly.
                    </p>
                    <Button onClick={handleConnectMeta} className="px-8 py-3">Connect Meta Account</Button>
                </div>
            ) : (
                /* Dashboard Loaded State */
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard title="CTR Change" value={stats.ctr} icon={MousePointerClick} trend="down" />
                        <StatCard title="CPC Change" value={stats.cpc} icon={CircleDollarSign} trend="down" />
                        <StatCard title="Spend Today" value={stats.spend} icon={TrendingUp} trend="neutral" />
                        <StatCard title="Health Score" value={stats.score} icon={Activity} trend="up" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                                    <div className="space-y-1">
                                        <CardTitle>Connected Accounts</CardTitle>
                                        <p className="text-sm text-gray-500">Actively sinking data</p>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <ul className="divide-y divide-gray-100">
                                        {adAccounts.map(acc => (
                                            <li key={acc.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                                <div className="flex items-center space-x-4">
                                                    <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold">M</div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{acc.name}</p>
                                                        <p className="text-xs text-gray-500">ID: {acc.platform_account_id}</p>
                                                    </div>
                                                </div>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${acc.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                    {acc.status}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                        
                        <div className="space-y-6">
                            <Card className="bg-gradient-to-br from-indigo-600 to-primary-700 border-none">
                                <CardContent className="p-8 text-white">
                                    <h3 className="text-xl font-bold mb-2">Automated Insights</h3>
                                    <p className="text-indigo-100 text-sm mb-6">Our AI just analyzed yesterday's performance.</p>
                                    <Link to="/insights">
                                        <Button variant="secondary" className="w-full text-primary-700 font-bold">
                                            View Full Report
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </>
            )}
        </DashboardLayout>
    );
};

const StatCard = ({ title, value, icon: Icon, trend }) => {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                        <h4 className={`text-2xl font-bold ${trend === 'down' ? 'text-red-600' : trend === 'up' ? 'text-green-600' : 'text-gray-900'}`}>
                            {value}
                        </h4>
                    </div>
                    <div className="h-12 w-12 bg-primary-50 rounded-xl flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary-600" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default Dashboard;
