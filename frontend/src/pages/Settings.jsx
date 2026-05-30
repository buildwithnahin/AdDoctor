import DashboardLayout from '../layouts/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

const Settings = () => {
    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600 mt-1">Manage your account preferences and application settings.</p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-500">Settings feature is coming soon.</p>
                </CardContent>
            </Card>
        </DashboardLayout>
    );
};

export default Settings;