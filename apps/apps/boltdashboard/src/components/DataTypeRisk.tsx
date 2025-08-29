import React from 'react';
import { Shield, AlertTriangle } from 'lucide-react';

const DataTypeRisk = () => {
  const riskData = [
    { type: 'SSN', risk: 95, violations: 8, color: 'red' },
    { type: 'Credit Cards', risk: 89, violations: 5, color: 'red' },
    { type: 'Phone Numbers', risk: 67, violations: 12, color: 'orange' },
    { type: 'Email Addresses', risk: 45, violations: 18, color: 'yellow' },
    { type: 'Names', risk: 34, violations: 25, color: 'blue' },
    { type: 'Addresses', risk: 23, violations: 8, color: 'green' }
  ];

  const getRiskColor = (risk: number) => {
    if (risk >= 80) return 'bg-red-500';
    if (risk >= 60) return 'bg-orange-500';
    if (risk >= 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getRiskBg = (risk: number) => {
    if (risk >= 80) return 'bg-red-50';
    if (risk >= 60) return 'bg-orange-50';
    if (risk >= 40) return 'bg-yellow-50';
    return 'bg-green-50';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Risk by Data Type</h3>
        <Shield className="h-5 w-5 text-blue-500" />
      </div>

      <div className="space-y-4">
        {riskData.map((item, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${getRiskBg(item.risk)} hover:shadow-sm transition-shadow`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900">{item.type}</span>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">{item.violations}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getRiskColor(item.risk)} transition-all duration-500`}
                  style={{ width: `${item.risk}%` }}
                ></div>
              </div>
              <span className="text-sm font-bold text-gray-900">{item.risk}%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Overall Risk Score</span>
          <span className="font-bold text-orange-600">Medium</span>
        </div>
      </div>
    </div>
  );
};

export default DataTypeRisk;