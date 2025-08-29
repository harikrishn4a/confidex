import React from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';

const ViolationChart = () => {
  const data = [
    { day: 'Mon', violations: 12, scans: 1840 },
    { day: 'Tue', violations: 8, scans: 2100 },
    { day: 'Wed', violations: 15, scans: 1950 },
    { day: 'Thu', violations: 6, scans: 2300 },
    { day: 'Fri', violations: 19, scans: 2800 },
    { day: 'Sat', violations: 4, scans: 1200 },
    { day: 'Sun', violations: 7, scans: 1600 },
  ];

  const maxViolations = Math.max(...data.map(d => d.violations));
  const maxScans = Math.max(...data.map(d => d.scans));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Privacy Violations Trend</h3>
          <p className="text-sm text-gray-600">Last 7 days</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Violations</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Total Scans</span>
          </div>
        </div>
      </div>

      <div className="relative h-64">
        <div className="flex items-end justify-between h-full space-x-2">
          {data.map((item, index) => {
            const violationHeight = (item.violations / maxViolations) * 100;
            const scanHeight = (item.scans / maxScans) * 100;
            
            return (
              <div key={index} className="flex flex-col items-center space-y-2 flex-1">
                <div className="relative w-full flex justify-center space-x-1">
                  <div
                    className="w-4 bg-red-500 rounded-t transition-all duration-500 hover:bg-red-600"
                    style={{ height: `${violationHeight}%`, minHeight: '4px' }}
                    title={`${item.violations} violations`}
                  ></div>
                  <div
                    className="w-4 bg-blue-500 rounded-t transition-all duration-500 hover:bg-blue-600"
                    style={{ height: `${scanHeight}%`, minHeight: '8px' }}
                    title={`${item.scans} scans`}
                  ></div>
                </div>
                <span className="text-xs text-gray-600 font-medium">{item.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <TrendingDown className="h-4 w-4 text-green-500" />
          <span className="text-sm text-gray-600">23% reduction in violations</span>
        </div>
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-4 w-4 text-blue-500" />
          <span className="text-sm text-gray-600">15% increase in scans</span>
        </div>
      </div>
    </div>
  );
};

export default ViolationChart;