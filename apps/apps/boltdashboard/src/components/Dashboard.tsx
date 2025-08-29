import React from 'react';
import { AlertTriangle, Shield, TrendingUp, Users, Activity, Eye } from 'lucide-react';
import MetricCard from './MetricCard';
import ViolationChart from './ViolationChart';
import RecentAlerts from './RecentAlerts';
import DataTypeRisk from './DataTypeRisk';

const Dashboard = () => {
  const metrics = [
    {
      title: 'Total Scans',
      value: '12,847',
      change: '+12%',
      trend: 'up',
      icon: Eye,
      color: 'blue'
    },
    {
      title: 'Violations Detected',
      value: '23',
      change: '-8%',
      trend: 'down',
      icon: AlertTriangle,
      color: 'red'
    },
    {
      title: 'Data Protected',
      value: '1.2M',
      change: '+24%',
      trend: 'up',
      icon: Shield,
      color: 'green'
    },
    {
      title: 'Active Users',
      value: '342',
      change: '+5%',
      trend: 'up',
      icon: Users,
      color: 'purple'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ViolationChart />
        </div>
        <div>
          <DataTypeRisk />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentAlerts />
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
            <Activity className="h-5 w-5 text-green-500" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Detection Engine</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Online</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Data Processing</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Normal</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Alert System</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Data Retention</span>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Warning</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;