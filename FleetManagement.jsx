import React, { useState } from 'react';
import DriverForm from './DriverForm';
import { FaCar, FaUser, FaPhone, FaEnvelope, FaIdCard, FaPencilAlt, FaTrash } from 'react-icons/fa';

function FleetManagement() {
  const [showDriverForm, setShowDriverForm] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [drivers, setDrivers] = useState([
    {
      id: 1,
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean.dupont@email.com',
      phone: '+33 6 12 34 56 78',
      licenseNumber: 'P123456789',
      vtcCard: 'VTC123456',
      vehicleType: 'berline',
      vehicleBrand: 'Mercedes',
      vehicleModel: 'Classe E',
      vehiclePlate: 'AB-123-CD',
      vehicleYear: 2023,
      status: 'active',
      rating: 4.8,
      totalRides: 156,
      totalRevenue: 4850
    },
    {
      id: 2,
      firstName: 'Marie',
      lastName: 'Martin',
      email: 'marie.martin@email.com',
      phone: '+33 6 98 76 54 32',
      licenseNumber: 'P987654321',
      vtcCard: 'VTC654321',
      vehicleType: 'standard',
      vehicleBrand: 'Peugeot',
      vehicleModel: '508',
      vehiclePlate: 'EF-456-GH',
      vehicleYear: 2022,
      status: 'active',
      rating: 4.9,
      totalRides: 132,
      totalRevenue: 3960
    }
  ]);

  const handleAddDriver = (driverData) => {
    const newDriver = {
      id: drivers.length + 1,
      ...driverData,
      status: 'active',
      rating: 0,
      totalRides: 0,
      totalRevenue: 0
    };
    setDrivers([...drivers, newDriver]);
    setShowDriverForm(false);
  };

  const handleUpdateDriver = (driverData) => {
    setDrivers(drivers.map(driver => 
      driver.id === selectedDriver.id ? { ...driver, ...driverData } : driver
    ));
    setSelectedDriver(null);
    setShowDriverForm(false);
  };

  const handleDeleteDriver = (driverId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce chauffeur ?')) {
      setDrivers(drivers.filter(driver => driver.id !== driverId));
    }
  };

  const getVehicleIcon = (type) => {
    switch (type) {
      case 'standard': return '🚗';
      case 'berline': return '🚙';
      case 'van': return '🚐';
      case 'minibus': return '🚌';
      case 'firstclass': return '🚘';
      default: return '🚗';
    }
  };

  if (showDriverForm) {
    return (
      <div className="max-w-4xl mx-auto py-6 px-4">
        <h2 className="text-2xl font-bold mb-6">
          {selectedDriver ? 'Modifier le chauffeur' : 'Ajouter un chauffeur'}
        </h2>
        <DriverForm
          onSubmit={selectedDriver ? handleUpdateDriver : handleAddDriver}
          onCancel={() => {
            setShowDriverForm(false);
            setSelectedDriver(null);
          }}
          initialData={selectedDriver}
        />
      </div>
    );
  }

  return (
    <div className="py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestion de la flotte</h2>
        <button
          onClick={() => setShowDriverForm(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Ajouter un chauffeur
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {drivers.map(driver => (
          <div key={driver.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-xl">
                  {getVehicleIcon(driver.vehicleType)}
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">
                    {driver.firstName} {driver.lastName}
                  </h3>
                  <p className="text-sm text-gray-500">{driver.vehicleBrand} {driver.vehicleModel}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedDriver(driver);
                    setShowDriverForm(true);
                  }}
                  className="p-2 text-gray-600 hover:text-indigo-600"
                >
                  <FaPencilAlt />
                </button>
                <button
                  onClick={() => handleDeleteDriver(driver.id)}
                  className="p-2 text-gray-600 hover:text-red-600"
                >
                  <FaTrash />
                </button>
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
                <FaCar className="w-4 h-4 mr-2" />
                <span className="text-sm">{driver.vehiclePlate}</span>
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
                  <p className="font-semibold">{driver.totalRides}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Revenus</p>
                  <p className="font-semibold">{driver.totalRevenue}€</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FleetManagement;