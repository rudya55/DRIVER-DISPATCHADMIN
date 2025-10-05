import React, { useState } from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, startOfMonth, endOfMonth, eachMonthOfInterval, startOfYear, endOfYear } from 'date-fns';
import { fr } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { FaFileDownload } from 'react-icons/fa';

function Accounting() {
  const [selectedView, setSelectedView] = useState('day');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Données simulées pour les factures mensuelles
  const monthlyInvoices = [
    { 
      id: 1, 
      month: 'Janvier 2024',
      rides: 120,
      hours: 180,
      totalHT: 3500,
      tva: 350,
      totalTTC: 3850
    },
    { 
      id: 2, 
      month: 'Février 2024',
      rides: 135,
      hours: 195,
      totalHT: 3800,
      tva: 380,
      totalTTC: 4180
    }
  ];

  // Données simulées pour les factures annuelles
  const yearlyInvoices = [
    {
      id: 1,
      year: '2023',
      rides: 1450,
      hours: 2160,
      totalHT: 42000,
      tva: 4200,
      totalTTC: 46200
    },
    {
      id: 2,
      year: '2024',
      rides: 255,
      hours: 375,
      totalHT: 7300,
      tva: 730,
      totalTTC: 8030
    }
  ];

  // Données simulées pour les statistiques
  const dailyData = [
    { date: '2024-02-20', revenue: 350, rides: 8, onlineHours: 10 },
    { date: '2024-02-21', revenue: 420, rides: 10, onlineHours: 12 },
    { date: '2024-02-22', revenue: 380, rides: 9, onlineHours: 11 },
    { date: '2024-02-23', revenue: 450, rides: 11, onlineHours: 12 },
    { date: '2024-02-24', revenue: 500, rides: 12, onlineHours: 13 },
    { date: '2024-02-25', revenue: 320, rides: 7, onlineHours: 9 },
    { date: '2024-02-26', revenue: 400, rides: 9, onlineHours: 11 }
  ];

  const weeklyData = eachDayOfInterval({
    start: startOfWeek(new Date(), { weekStartsOn: 1 }),
    end: endOfWeek(new Date(), { weekStartsOn: 1 })
  }).map((date) => ({
    date: format(date, 'EEE', { locale: fr }),
    revenue: Math.floor(Math.random() * 500) + 300,
    rides: Math.floor(Math.random() * 12) + 5,
    onlineHours: Math.floor(Math.random() * 6) + 6
  }));

  const monthlyData = eachMonthOfInterval({
    start: startOfYear(new Date()),
    end: endOfYear(new Date())
  }).map((date) => ({
    date: format(date, 'MMM', { locale: fr }),
    revenue: Math.floor(Math.random() * 15000) + 8000,
    rides: Math.floor(Math.random() * 300) + 150,
    onlineHours: Math.floor(Math.random() * 180) + 120
  }));

  const yearlyData = [
    { date: '2023', revenue: 150000, rides: 3600, onlineHours: 2160 },
    { date: '2024', revenue: 180000, rides: 4200, onlineHours: 2400 }
  ];

  const getViewData = () => {
    switch (selectedView) {
      case 'day':
        return dailyData;
      case 'week':
        return weeklyData;
      case 'month':
        return monthlyData;
      case 'year':
        return yearlyData;
      default:
        return dailyData;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const getViewSummary = () => {
    const data = getViewData();
    return {
      totalRevenue: data.reduce((sum, item) => sum + item.revenue, 0),
      totalRides: data.reduce((sum, item) => sum + item.rides, 0),
      totalHours: data.reduce((sum, item) => sum + item.onlineHours, 0),
      averagePerRide: data.reduce((sum, item) => sum + item.revenue, 0) / data.reduce((sum, item) => sum + item.rides, 0)
    };
  };

  const handleDownloadInvoice = (period) => {
    setSelectedPeriod(period);
    setShowInvoiceModal(true);
    // Préparer les factures selon la période
    if (period === 'month') {
      setSelectedInvoice(monthlyInvoices);
    } else {
      setSelectedInvoice(yearlyInvoices);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Comptabilité</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedView('day')}
            className={`px-4 py-2 rounded-lg ${
              selectedView === 'day' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Jour
          </button>
          <button
            onClick={() => setSelectedView('week')}
            className={`px-4 py-2 rounded-lg ${
              selectedView === 'week' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Semaine
          </button>
          <button
            onClick={() => setSelectedView('month')}
            className={`px-4 py-2 rounded-lg ${
              selectedView === 'month' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Mois
          </button>
          <button
            onClick={() => setSelectedView('year')}
            className={`px-4 py-2 rounded-lg ${
              selectedView === 'year' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Année
          </button>
        </div>
      </div>

      {/* Résumé des statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-700">Revenus totaux</h3>
          <p className="text-2xl font-bold text-indigo-600">
            {formatCurrency(getViewSummary().totalRevenue)}
          </p>
          {selectedView === 'month' && (
            <button
              onClick={() => handleDownloadInvoice('month')}
              className="mt-4 w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <FaFileDownload className="w-5 h-5 text-indigo-600" />
              <span className="text-gray-900">Facture du mois</span>
            </button>
          )}
          {selectedView === 'year' && (
            <button
              onClick={() => handleDownloadInvoice('year')}
              className="mt-4 w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <FaFileDownload className="w-5 h-5 text-indigo-600" />
              <span className="text-gray-900">Facture annuelle</span>
            </button>
          )}
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-700">Nombre de courses</h3>
          <p className="text-2xl font-bold text-indigo-600">{getViewSummary().totalRides}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-700">Temps en ligne</h3>
          <p className="text-2xl font-bold text-indigo-600">{getViewSummary().totalHours}h</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-700">Moyenne par course</h3>
          <p className="text-2xl font-bold text-indigo-600">
            {formatCurrency(getViewSummary().averagePerRide)}
          </p>
        </div>
      </div>

      {/* Graphiques */}
      <div className="space-y-6">
        {/* Graphique des revenus */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Revenus</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getViewData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Legend />
                <Bar dataKey="revenue" fill="#4f46e5" name="Revenus" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graphique des courses et temps en ligne */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Courses et temps en ligne</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getViewData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="rides" 
                  stroke="#4f46e5" 
                  name="Courses"
                  strokeWidth={2}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="onlineHours" 
                  stroke="#10b981" 
                  name="Heures en ligne"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Modal de téléchargement */}
      {showInvoiceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h3 className="text-lg font-semibold mb-4">
              Factures {selectedPeriod === 'month' ? 'mensuelles' : 'annuelles'}
            </h3>
            
            <div className="space-y-4">
              {selectedInvoice && selectedInvoice.map((invoice) => (
                <div key={invoice.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold">
                      {selectedPeriod === 'month' ? invoice.month : invoice.year}
                    </h4>
                    <button
                      onClick={() => {
                        console.log(`Téléchargement de la facture ${invoice.id}`);
                        setShowInvoiceModal(false);
                      }}
                      className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      <FaFileDownload />
                      <span>Télécharger</span>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600">Nombre de courses:</p>
                      <p className="font-semibold">{invoice.rides}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Heures travaillées:</p>
                      <p className="font-semibold">{invoice.hours}h</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Total HT:</p>
                      <p className="font-semibold">{formatCurrency(invoice.totalHT)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">TVA (10%):</p>
                      <p className="font-semibold">{formatCurrency(invoice.tva)}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-600">Total TTC:</p>
                      <p className="font-semibold text-lg text-indigo-600">
                        {formatCurrency(invoice.totalTTC)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowInvoiceModal(false)}
              className="mt-6 w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Accounting;