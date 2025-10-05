import React, { useState } from 'react';
import { FaBuilding, FaUser, FaStar, FaCarAlt, FaMoneyBillWave, FaChartLine } from 'react-icons/fa';

function Analytics() {
  const [view, setView] = useState('company'); // 'company' or 'individual'
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedCompany, setSelectedCompany] = useState(null);
  
  // Données simulées pour les sociétés et leurs chauffeurs
  const [companyData] = useState({
    companies: [
      {
        id: 1,
        name: 'Transport Express',
        stats: {
          totalRevenue: 45000,
          totalRides: 1200,
          averageRating: 4.8,
          monthlyGrowth: 12,
          averageTime: '25 min',
          drivers: 12
        },
        drivers: [
          {
            id: 1,
            name: 'Jean Dupont',
            rides: 150,
            revenue: 4500,
            rating: 4.8,
            rank: 1,
            performance: {
              lastMonth: 4200,
              growth: 7,
              completionRate: 98,
              customerSatisfaction: 4.9,
              monthlyStats: [
                { month: 'Jan', revenue: 4200 },
                { month: 'Fév', revenue: 4500 },
                { month: 'Mar', revenue: 4800 }
              ]
            }
          },
          {
            id: 2,
            name: 'Marie Martin',
            rides: 120,
            revenue: 3600,
            rating: 4.9,
            rank: 2,
            performance: {
              lastMonth: 3400,
              growth: 5,
              completionRate: 97,
              customerSatisfaction: 4.8,
              monthlyStats: [
                { month: 'Jan', revenue: 3200 },
                { month: 'Fév', revenue: 3400 },
                { month: 'Mar', revenue: 3600 }
              ]
            }
          }
        ]
      },
      {
        id: 2,
        name: 'LogiRapide',
        stats: {
          totalRevenue: 35000,
          totalRides: 950,
          averageRating: 4.7,
          monthlyGrowth: 8,
          averageTime: '28 min',
          drivers: 8
        }
      },
      {
        id: 3,
        name: 'Livraison Plus',
        stats: {
          totalRevenue: 52000,
          totalRides: 1500,
          averageRating: 4.9,
          monthlyGrowth: 15,
          averageTime: '22 min',
          drivers: 15
        }
      }
    ]
  });

  // Données simulées pour les chauffeurs individuels
  const [individualDrivers] = useState([
    {
      id: 1,
      name: 'Pierre Durant',
      stats: {
        totalRevenue: 3800,
        totalRides: 95,
        rating: 4.7,
        monthlyGrowth: 8
      },
      performance: {
        lastMonth: 3500,
        growth: 8,
        completionRate: 96,
        customerSatisfaction: 4.7,
        monthlyStats: [
          { month: 'Jan', revenue: 3200 },
          { month: 'Fév', revenue: 3500 },
          { month: 'Mar', revenue: 3800 }
        ]
      }
    }
  ]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const getPerformanceColor = (value, type) => {
    if (type === 'growth') {
      return value > 0 ? 'text-green-600' : 'text-red-600';
    }
    if (type === 'completion') {
      return value >= 95 ? 'text-green-600' : 'text-yellow-600';
    }
    return 'text-gray-900';
  };

  const renderCompanyList = () => (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Sélectionnez une société</h3>
      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher une société"
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        {companyData.companies.map(company => (
          <button
            key={company.id}
            onClick={() => setSelectedCompany(company)}
            className="w-full p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold">{company.name}</h4>
                <p className="text-sm text-gray-500">{company.stats.drivers} chauffeurs</p>
              </div>
              <FaChartLine className="text-indigo-600" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderCompanyStats = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold">{selectedCompany.name}</h3>
          <p className="text-gray-500">Statistiques pour {selectedPeriod === 'month' ? 'ce mois' : 'cette année'}</p>
        </div>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="month">Ce mois</option>
          <option value="year">Cette année</option>
        </select>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center text-gray-500 mb-2">
            <FaMoneyBillWave className="mr-2" />
            <span>Revenus totaux</span>
          </div>
          <p className="text-2xl font-bold">{formatCurrency(selectedCompany.stats.totalRevenue)}</p>
          <p className="text-sm text-green-600">+{selectedCompany.stats.monthlyGrowth}% ce mois</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center text-gray-500 mb-2">
            <FaCarAlt className="mr-2" />
            <span>Courses</span>
          </div>
          <p className="text-2xl font-bold">{selectedCompany.stats.totalRides}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center text-gray-500 mb-2">
            <FaUser className="mr-2" />
            <span>Chauffeurs</span>
          </div>
          <p className="text-2xl font-bold">{selectedCompany.stats.drivers}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center text-gray-500 mb-2">
            <FaStar className="mr-2" />
            <span>Note moyenne</span>
          </div>
          <p className="text-2xl font-bold">{selectedCompany.stats.averageRating}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h4 className="font-semibold mb-4">Performance des chauffeurs</h4>
        <div className="space-y-4">
          {selectedCompany.drivers?.map(driver => (
            <div key={driver.id} className="p-4 border rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h5 className="font-semibold">{driver.name}</h5>
                  <div className="flex items-center text-sm text-gray-500">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span>{driver.rating}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">{formatCurrency(driver.revenue)}</p>
                  <p className="text-sm text-gray-500">{driver.rides} courses</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Taux de complétion</p>
                  <p className={`font-semibold ${getPerformanceColor(driver.performance.completionRate, 'completion')}`}>
                    {driver.performance.completionRate}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Croissance</p>
                  <p className={`font-semibold ${getPerformanceColor(driver.performance.growth, 'growth')}`}>
                    +{driver.performance.growth}%
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Analyses</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setView('company')}
            className={`px-4 py-2 rounded-lg ${
              view === 'company' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            <FaBuilding className="inline-block mr-2" />
            Sociétés
          </button>
          <button
            onClick={() => setView('individual')}
            className={`px-4 py-2 rounded-lg ${
              view === 'individual' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            <FaUser className="inline-block mr-2" />
            Chauffeurs individuels
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-3">
          {renderCompanyList()}
        </div>
        <div className="col-span-9">
          {selectedCompany ? renderCompanyStats() : (
            <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
              <p className="text-gray-500">Sélectionnez une société pour voir les statistiques</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Analytics;