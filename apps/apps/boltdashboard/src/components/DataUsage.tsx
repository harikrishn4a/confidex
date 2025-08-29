import React, { useState } from 'react';
import { BarChart3, PieChart, Activity, TrendingUp, Calendar } from 'lucide-react';

const DataUsage = () => {
  const [timeRange, setTimeRange] = useState('7d');

  const usageData = [
    { category: 'Personal Information', scanned: 15420, violations: 23, percentage: 0.15 },
    { category: 'Financial Data', scanned: 8930, violations: 18, percentage: 0.20 },
    { category: 'Contact Information', scanned: 24680, violations: 42, percentage: 0.17 },
    { category: 'Health Records', scanned: 5240, violations: 3, percentage: 0.06 },
    { category: 'Legal Documents', scanned: 3670, violations: 8, percentage: 0.22 },
    { category: 'Employment Data', scanned: 12450, violations: 12, percentage: 0.10 }
  ];

  const dailyUsage = [
    { date: '2024-01-09', scans: 1200, violations: 8 },
    { date: '2024-01-10', scans: 1450, violations: 12 },
    { date: '2024-01-11', scans: 1680, violations: 6 },
    { date: '2024-01-12', scans: 1920, violations: 15 },
    { date: '2024-01-13', scans: 2100, violations: 9 },
    { date: '2024-01-14', scans: 1840, violations: 18 },
    { date: '2024-01-15', scans: 2240, violations: 11 }
  ];

  const maxScans = Math.max(...dailyUsage.map(d => d.scans));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Data Usage Analytics</h2>
            <p className="text-gray-600 mt-1">Track how your data is being processed and analyzed</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Usage Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Activity Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Daily Activity</h3>
            <Activity className="h-5 w-5 text-blue-500" />
          </div>
          
          <div className="space-y-4">
            {dailyUsage.map((day, index) => {
              const scanWidth = (day.scans / maxScans) * 100;
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600">{day.scans} scans</span>
                      <span className="text-sm text-red-600">{day.violations} violations</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${scanWidth}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Data Category Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Data Categories</h3>
            <PieChart className="h-5 w-5 text-purple-500" />
          </div>
          
          <div className="space-y-4">
            {usageData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{item.category}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{item.scanned.toLocaleString()}</span>
                    <span className="text-xs text-red-600">({item.violations} violations)</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      item.percentage > 0.15 ? 'bg-red-500' : item.percentage > 0.10 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${(item.percentage * 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Violation Rate: {(item.percentage * 100).toFixed(2)}%</span>
                  <span className={item.percentage > 0.15 ? 'text-red-600' : item.percentage > 0.10 ? 'text-yellow-600' : 'text-green-600'}>
                    {item.percentage > 0.15 ? 'High Risk' : item.percentage > 0.10 ? 'Medium Risk' : 'Low Risk'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Usage Analytics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">70,390</div>
            <div className="text-sm text-gray-600 mt-1">Total Data Points Scanned</div>
            <div className="flex items-center justify-center mt-2 text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="text-xs">+18% from last week</span>
            </div>
          </div>
          
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">106</div>
            <div className="text-sm text-gray-600 mt-1">Privacy Violations Found</div>
            <div className="flex items-center justify-center mt-2 text-green-600">
              <TrendingUp className="h-4 w-4 mr-1 rotate-180" />
              <span className="text-xs">-12% from last week</span>
            </div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">99.85%</div>
            <div className="text-sm text-gray-600 mt-1">Protection Rate</div>
            <div className="flex items-center justify-center mt-2 text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="text-xs">+0.3% from last week</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataUsage;