import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import Dashboard from './Dashboard';
import Planning from './Planning';
import Location from './Location';
import Vehicles from './Vehicles';
import Analytics from './Analytics';
import Invoices from './Invoices';
import Settings from './Settings';
import Profile from './Profile';
import DriversManagement from './DriversManagement';
import CompaniesManagement from './CompaniesManagement';

function FleetManager() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="pl-64">
        <main className="p-2 md:p-4 pt-16 md:pt-20">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/planning" element={<Planning />} />
              <Route path="/location" element={<Location />} />
              <Route path="/vehicles" element={<Vehicles />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/drivers" element={<DriversManagement />} />
              <Route path="/companies" element={<CompaniesManagement />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default FleetManager;