import React from 'react';
import { AlertTriangle, Clock, User } from 'lucide-react';

const RecentAlerts = () => {
  const alerts = [
    {
      id: 1,
      type: 'PII Exposure',
      severity: 'high',
      description: 'Social Security Number detected in chat input',
      user: 'john.doe@company.com',
      timestamp: '2 minutes ago',
      status: 'active'
    },
    {
      id: 2,
      type: 'Credit Card Info',
      severity: 'critical',
      description: 'Credit card number pattern found',
      user: 'sarah.smith@company.com',
      timestamp: '15 minutes ago',
      status: 'resolved'
    },
    {
      id: 3,
      type: 'Email Exposure',
      severity: 'medium',
      description: 'Personal email addresses shared',
      user: 'mike.wilson@company.com',
      timestamp: '1 hour ago',
      status: 'investigating'
    },
    {
      id: 4,
      type: 'Phone Number',
      severity: 'medium',
      description: 'Phone number detected in conversation',
      user: 'lisa.brown@company.com',
      timestamp: '3 hours ago',
      status: 'resolved'
    },
    {
      id: 5,
      type: 'Address Info',
      severity: 'low',
      description: 'Partial address information found',
      user: 'david.chen@company.com',
      timestamp: '5 hours ago',
      status: 'dismissed'
    }
  ];

  const severityColors = {
    critical: 'bg-red-100 text-red-800 border-red-200',
    high: 'bg-orange-100 text-orange-800 border-orange-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-blue-100 text-blue-800 border-blue-200'
  };

  const statusColors = {
    active: 'bg-red-100 text-red-700',
    investigating: 'bg-yellow-100 text-yellow-700',
    resolved: 'bg-green-100 text-green-700',
    dismissed: 'bg-gray-100 text-gray-700'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Alerts</h3>
        <button className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="flex items-start space-x-3 p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${severityColors[alert.severity]}`}>
                  {alert.type}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[alert.status]}`}>
                  {alert.status}
                </span>
              </div>
              <p className="text-sm text-gray-900 mt-2 font-medium">{alert.description}</p>
              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <User className="h-3 w-3" />
                  <span>{alert.user}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{alert.timestamp}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentAlerts;