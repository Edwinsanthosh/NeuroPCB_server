import React from 'react';
import { Navigation } from '../components/layout-component';

const Analytics = () => {
  return (
    <>
      <Navigation />
      <div className="min-h-screen p-4 md:p-8 pb-24 md:pb-8 md:pt-24">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gradient mb-8">Analytics</h1>
          <div className="grid gap-6">
            <div className="glass-card p-6">
              <h2 className="text-2xl font-bold mb-4">Fault History</h2>
              <p className="text-gray-400">Historical data and analytics coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Analytics;