import DashboardLayout from '../layouts/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

const AdAccounts = () => {
    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Ad Accounts</h1>
                <p className="text-gray-600 mt-1">Manage your connected advertising accounts.</p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Connected Accounts</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-500">Ad accounts management feature is coming soon.</p>
                </CardContent>
            </Card>
        </DashboardLayout>
    );
};

export default AdAccounts;