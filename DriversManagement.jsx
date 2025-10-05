import React, { useState } from 'react';
import { FaBuilding, FaUser, FaPlus, FaSearch } from 'react-icons/fa';
import CompanyDrivers from './CompanyDrivers';
import IndividualDrivers from './IndividualDrivers';
import NewDriverForm from './NewDriverForm';

function DriversManagement() {
  const [activeTab, setActiveTab] = useState('company');
  const [showNewDriverModal, setShowNewDriverModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des chauffeurs</h2>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un chauffeur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <button
            onClick={() => setShowNewDriverModal(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <FaPlus className="mr-2" />
            Nouveau chauffeur
          </button>
          <button
            onClick={() => setActiveTab('company')}
            className={`flex items-center px-4 py-2 rounded-lg ${
              activeTab === 'company' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            <FaBuilding className="mr-2" />
            Chauffeurs société
          </button>
          <button
            onClick={() => setActiveTab('individual')}
            className={`flex items-center px-4 py-2 rounded-lg ${
              activeTab === 'individual' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            <FaUser className="mr-2" />
            Chauffeurs individuels
          </button>
        </div>
      </div>

      {activeTab === 'company' ? (
        <CompanyDrivers searchQuery={searchQuery} />
      ) : (
        <IndividualDrivers searchQuery={searchQuery} />
      )}

      {showNewDriverModal && (
        <NewDriverForm onClose={() => setShowNewDriverModal(false)} />
      )}
    </div>
  );
}

export default DriversManagement;