import React, { useState } from 'react';
import { FaStar, FaCarAlt, FaPhone, FaEnvelope, FaIdCard } from 'react-icons/fa';

function CompanyDrivers() {
  const [drivers] = useState([
    {
      id: 1,
      name: 'Jean Dupont',
      company: 'FastTaxi SARL',
      email: 'jean.dupont@fasttaxi.com',
      phone: '+33 6 12 34 56 78',
      licenseNumber: 'P123456789',
      vtcCard: 'VTC123456',
      vehicleType: 'Berline',
      rating: 4.8,
      status: 'active',
      rides: 156,
      revenue: 4850
    },
    {
      id: 2,
      name: 'Marie Martin',
      company: 'FastTaxi SARL',
      email: 'marie.martin@fasttaxi.com',
      phone: '+33 6 98 76 54 32',
      licenseNumber: 'P987654321',
      vtcCard: 'VTC654321',
      vehicleType: 'Van',
      rating: 4.9,
      status: 'active',
      rides: 132,
      revenue: 3960
    }
  ]);

  const [showDriverModal, setShowDriverModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const handleShowDriver = (driver) => {
    setSelectedDriver(driver);
    setShowDriverModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {drivers.map(driver => (
          <div 
            key={driver.id} 
            className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleShowDriver(driver)}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{driver.name}</h3>
                <p className="text-gray-500">{driver.company}</p>
              </div>
              <div className="flex items-center">
                <FaStar className="text-yellow-400 mr-1" />
                <span>{driver.rating}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center text-gray-600">
                <FaEnvelope className="w-4 h-4 mr-2" />
                <span className="text-sm">{driver.email}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FaPhone className="w-4 h-4 mr-2" />
                <span className="text-sm">{driver.phone}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FaIdCard className="w-4 h-4 mr-2" />
                <span className="text-sm">VTC: {driver.vtcCard}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FaCarAlt className="w-4 h-4 mr-2" />
                <span className="text-sm">{driver.vehicleType}</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-500">Note</p>
                  <p className="font-semibold text-yellow-500">★ {driver.rating}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Courses</p>
                  <p className="font-semibold">{driver.rides}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Revenus</p>
                  <p className="font-semibold">{formatCurrency(driver.revenue)}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Détails Chauffeur */}
      {showDriverModal && selectedDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-semibold">{selectedDriver.name}</h3>
                <p className="text-gray-500">{selectedDriver.company}</p>
              </div>
              <button
                onClick={() => setShowDriverModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-medium mb-2">Informations personnelles</h4>
                <div className="space-y-2">
                  <p><span className="text-gray-500">Email:</span> {selectedDriver.email}</p>
                  <p><span className="text-gray-500">Téléphone:</span> {selectedDriver.phone}</p>
                  <p><span className="text-gray-500">Permis:</span> {selectedDriver.licenseNumber}</p>
                  <p><span className="text-gray-500">Carte VTC:</span> {selectedDriver.vtcCard}</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Statistiques</h4>
                <div className="space-y-2">
                  <p><span className="text-gray-500">Note moyenne:</span> {selectedDriver.rating} ★</p>
                  <p><span className="text-gray-500">Courses totales:</span> {selectedDriver.rides}</p>
                  <p><span className="text-gray-500">Revenus:</span> {formatCurrency(selectedDriver.revenue)}</p>
                  <p><span className="text-gray-500">Type de véhicule:</span> {selectedDriver.vehicleType}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDriverModal(false)}
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

export default CompanyDrivers;