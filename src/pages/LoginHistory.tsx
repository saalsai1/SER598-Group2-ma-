import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { selectLoginHistory } from '@/redux/slices/authSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Clock, Monitor, CheckCircle, XCircle } from 'lucide-react';

const LoginHistory = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const history = user?.email ? selectLoginHistory(user.email) : [];

  if (!user) {
    return <div className="container mx-auto p-8">Please login to view history</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <CardTitle>Login History</CardTitle>
          </div>
          <CardDescription>Your recent login activity</CardDescription>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <p className="text-muted-foreground">No login history yet</p>
          ) : (
            <div className="space-y-4">
              {history.map((entry, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    {entry.success ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <div>
                      <p className="font-medium">
                        {entry.success ? 'Successful Login' : 'Failed Login'}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(entry.timestamp).toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Monitor className="h-3 w-3" />
                          {entry.device} • {entry.browser}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginHistory;