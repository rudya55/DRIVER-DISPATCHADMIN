import React, { useState } from 'react';
import { FaUser, FaStar, FaDownload, FaEnvelope, FaEye } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

function Drivers() {
  const [drivers] = useState([
    { 
      id: 1, 
      name: 'Jean Dupont', 
      phone: '+33 6 12 34 56 78',
      vehicleType: 'berline',
      status: 'active',
      rating: 4.8,
      currentRide: null,
      stats: {
        rides: 150,
        revenue: 4500,
        rank: 1,
        performance: {
          lastMonth: 4200,
          growth: 7,
          completionRate: 98,
          customerSatisfaction: 4.9
        }
      }
    },
    { 
      id: 2, 
      name: 'Marie Martin', 
      phone: '+33 6 98 76 54 32',
      vehicleType: 'van',
      status: 'active',
      rating: 4.9,
      currentRide: { pickup: 'Champs-Élysées', dropoff: 'Montmartre', customer: 'Lucas Petit' },
      stats: {
        rides: 120,
        revenue: 3600,
        rank: 2,
        performance: {
          lastMonth: 3400,
          growth: 5,
          completionRate: 97,
          customerSatisfaction: 4.8
        }
      }
    }
  ]);

  const [showDriverDetails, setShowDriverDetails] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const handleShowDetails = (driver) => {
    setSelectedDriver(driver);
    setShowDriverDetails(true);
  };

  const handleDownloadInvoice = (driver) => {
    const doc = new jsPDF();
    
    // En-tête
    doc.setFontSize(20);
    doc.text('FACTURE CHAUFFEUR', 105, 20, { align: 'center' });
    
    // Informations du chauffeur
    doc.setFontSize(12);
    doc.text('Chauffeur:', 20, 40);
    doc.text(driver.name, 20, 50);
    doc.text(driver.phone, 20, 60);
    
    // Statistiques
    doc.text('Statistiques du mois:', 20, 80);
    doc.text(`Nombre de courses: ${driver.stats.rides}`, 20, 90);
    doc.text(`Chiffre d'affaires: ${formatCurrency(driver.stats.revenue)}`, 20, 100);
    doc.text(`Note moyenne: ${driver.rating}`, 20, 110);
    
    // Performance
    doc.text('Performance:', 20, 130);
    doc.text(`Croissance: +${driver.stats.performance.growth}%`, 20, 140);
    doc.text(`Taux de complétion: ${driver.stats.performance.completionRate}%`, 20, 150);
    doc.text(`Satisfaction client: ${driver.stats.performance.customerSatisfaction}`, 20, 160);
    
    // Sauvegarde du PDF
    doc.save(`facture_${driver.name.replace(' ', '_')}_${new Date().toISOString().slice(0,7)}.pdf`);
  };

  const handleSendEmail = (driver) => {
    // Logique d'envoi d'email
    console.log('Envoi de la facture par email à', driver.name);
  };

  return (
    <div className="space-y-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h2 className="text-2xl font-bold text-gray-900">Chauffeurs</h2>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Chauffeur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Note
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Courses
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                CA
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Performance
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {drivers.map((driver) => (
              <tr key={driver.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleShowDetails(driver)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    {driver.name}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span>{driver.rating}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {driver.stats.rides}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatCurrency(driver.stats.revenue)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    driver.stats.performance.growth >= 5 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    +{driver.stats.performance.growth}%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleShowDetails(driver)}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="Voir les détails"
                    >
                      <FaEye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleSendEmail(driver)}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="Envoyer par email"
                    >
                      <FaEnvelope className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDownloadInvoice(driver)}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="Télécharger"
                    >
                      <FaDownload className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Détails Chauffeur */}
      {showDriverDetails && selectedDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <span className="text-2xl mr-3">
                  {selectedDriver.stats.rank === 1 ? '🥇' :
                   selectedDriver.stats.rank === 2 ? '🥈' :
                   '🥉'}
                </span>
                <div>
                  <h3 className="text-xl font-semibold">{selectedDriver.name}</h3>
                  <div className="flex items-center mt-1">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span>{selectedDriver.rating}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowDriverDetails(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Performance mensuelle</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Mois précédent</span>
                    <span className="font-medium">{formatCurrency(selectedDriver.stats.performance.lastMonth)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Croissance</span>
                    <span className={`font-medium ${
                      selectedDriver.stats.performance.growth > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      +{selectedDriver.stats.performance.growth}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Indicateurs de qualité</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Taux de complétion</span>
                    <span className={`font-medium ${
                      selectedDriver.stats.performance.completionRate >= 95 ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {selectedDriver.stats.performance.completionRate}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Satisfaction client</span>
                    <span className="font-medium flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      {selectedDriver.stats.performance.customerSatisfaction}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Statistiques globales</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Courses totales</p>
                  <p className="text-xl font-semibold">{selectedDriver.stats.rides}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Chiffre d'affaires</p>
                  <p className="text-xl font-semibold">{formatCurrency(selectedDriver.stats.revenue)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Classement</p>
                  <p className="text-xl font-semibold">#{selectedDriver.stats.rank}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => handleSendEmail(selectedDriver)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <FaEnvelope className="inline-block mr-2" />
                Envoyer par email
              </button>
              <button
                onClick={() => handleDownloadInvoice(selectedDriver)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <FaDownload className="inline-block mr-2" />
                Télécharger
              </button>
              <button
                onClick={() => setShowDriverDetails(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Drivers;