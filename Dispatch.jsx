import React, { useState } from 'react';
import { FaUser, FaCar, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaEuroSign, FaCheck, FaTimes } from 'react-icons/fa';

function Dispatch() {
  const [rides, setRides] = useState([
    {
      id: 1,
      customer: {
        name: 'Sophie Bernard',
        phone: '+33 6 12 34 56 78',
        email: 'sophie.bernard@email.com'
      },
      pickup: '15 Rue de la Paix, Paris',
      dropoff: 'Aéroport Charles de Gaulle',
      date: '2024-02-28',
      time: '14:30',
      passengers: 2,
      luggage: 3,
      vehicleType: 'Berline',
      status: 'pending',
      price: '80€',
      assignedDriver: null
    },
    {
      id: 2,
      customer: {
        name: 'Lucas Petit',
        phone: '+33 6 98 76 54 32',
        email: 'lucas.petit@email.com'
      },
      pickup: 'Gare du Nord, Paris',
      dropoff: 'Tour Eiffel',
      date: '2024-02-28',
      time: '15:45',
      passengers: 1,
      luggage: 1,
      vehicleType: 'Standard',
      status: 'assigned',
      price: '25€',
      assignedDriver: {
        id: 1,
        name: 'Jean Dupont',
        rating: 4.8
      }
    }
  ]);

  const [drivers] = useState([
    {
      id: 1,
      name: 'Jean Dupont',
      rating: 4.8,
      status: 'available',
      vehicle: {
        type: 'Berline',
        model: 'Mercedes Classe E',
        plate: 'AB-123-CD'
      }
    },
    {
      id: 2,
      name: 'Marie Martin',
      rating: 4.9,
      status: 'busy',
      vehicle: {
        type: 'Van',
        model: 'Mercedes Classe V',
        plate: 'EF-456-GH'
      }
    }
  ]);

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const [showRideDetails, setShowRideDetails] = useState(false);
  const [showNewRideModal, setShowNewRideModal] = useState(false);
  const [newRide, setNewRide] = useState({
    customer: {
      name: '',
      phone: '',
      email: ''
    },
    pickup: '',
    dropoff: '',
    date: '',
    time: '',
    passengers: 1,
    luggage: 0,
    vehicleType: 'Berline',
    price: ''
  });

  const handleAssignDriver = (ride, driver) => {
    setRides(rides.map(r => {
      if (r.id === ride.id) {
        return {
          ...r,
          status: 'assigned',
          assignedDriver: {
            id: driver.id,
            name: driver.name,
            rating: driver.rating
          }
        };
      }
      return r;
    }));
    setShowAssignModal(false);
  };

  const handleNewRideSubmit = (e) => {
    e.preventDefault();
    const ride = {
      id: rides.length + 1,
      ...newRide,
      status: 'pending',
      assignedDriver: null
    };
    setRides([...rides, ride]);
    setShowNewRideModal(false);
    setNewRide({
      customer: {
        name: '',
        phone: '',
        email: ''
      },
      pickup: '',
      dropoff: '',
      date: '',
      time: '',
      passengers: 1,
      luggage: 0,
      vehicleType: 'Berline',
      price: ''
    });
  };

  const handleNewRideChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('customer.')) {
      const field = name.split('.')[1];
      setNewRide({
        ...newRide,
        customer: {
          ...newRide.customer,
          [field]: value
        }
      });
    } else {
      setNewRide({
        ...newRide,
        [name]: value
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Dispatch</h2>
        <button
          onClick={() => setShowNewRideModal(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Nouvelle course
        </button>
      </div>

      {/* Liste des courses */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="divide-y divide-gray-200">
          {rides.map((ride) => (
            <div key={ride.id} className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium">{ride.customer.name}</h3>
                  <p className="text-sm text-gray-500">{ride.customer.phone}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    ride.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {ride.status === 'pending' ? 'En attente' : 'Assignée'}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center text-gray-500">
                    <FaMapMarkerAlt className="mr-2" />
                    <span>Départ:</span>
                  </div>
                  <p className="mt-1">{ride.pickup}</p>
                </div>
                <div>
                  <div className="flex items-center text-gray-500">
                    <FaMapMarkerAlt className="mr-2" />
                    <span>Arrivée:</span>
                  </div>
                  <p className="mt-1">{ride.dropoff}</p>
                </div>
                <div>
                  <div className="flex items-center text-gray-500">
                    <FaCalendarAlt className="mr-2" />
                    <span>Date:</span>
                  </div>
                  <p className="mt-1">{ride.date}</p>
                </div>
                <div>
                  <div className="flex items-center text-gray-500">
                    <FaClock className="mr-2" />
                    <span>Heure:</span>
                  </div>
                  <p className="mt-1">{ride.time}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center space-x-4">
                <div className="flex items-center">
                  <FaUser className="text-gray-400 mr-1" />
                  <span>{ride.passengers}</span>
                </div>
                <div className="flex items-center">
                  <FaCar className="text-gray-400 mr-1" />
                  <span>{ride.vehicleType}</span>
                </div>
                <div className="flex items-center">
                  <FaEuroSign className="text-gray-400 mr-1" />
                  <span>{ride.price}</span>
                </div>
              </div>

              {ride.assignedDriver ? (
                <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gray-300" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {ride.assignedDriver.name}
                      </p>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500">
                          {ride.assignedDriver.rating}
                        </span>
                        <span className="ml-1 text-yellow-400">★</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-4">
                  <button
                    onClick={() => {
                      setSelectedRide(ride);
                      setShowAssignModal(true);
                    }}
                    className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Assigner un chauffeur
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal d'assignation de chauffeur */}
      {showAssignModal && selectedRide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h3 className="text-lg font-semibold mb-4">
              Assigner un chauffeur pour {selectedRide.customer.name}
            </h3>
            <div className="space-y-4">
              {drivers
                .filter((driver) => driver.status === 'available')
                .map((driver) => (
                  <button
                    key={driver.id}
                    onClick={() => handleAssignDriver(selectedRide, driver)}
                    className="w-full p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-300" />
                      </div>
                      <div className="ml-3 flex-1 text-left">
                        <p className="font-medium">{driver.name}</p>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500">
                            {driver.rating}
                          </span>
                          <span className="ml-1 text-yellow-400">★</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{driver.vehicle.type}</p>
                        <p className="text-sm text-gray-500">{driver.vehicle.model}</p>
                      </div>
                    </div>
                  </button>
                ))}
            </div>
            <button
              onClick={() => setShowAssignModal(false)}
              className="mt-6 w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Modal de nouvelle course */}
      {showNewRideModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h3 className="text-lg font-semibold mb-4">Nouvelle course</h3>
            <form onSubmit={handleNewRideSubmit} className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nom du client
                  </label>
                  <input
                    type="text"
                    name="customer.name"
                    value={newRide.customer.name}
                    onChange={handleNewRideChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="customer.phone"
                    value={newRide.customer.phone}
                    onChange={handleNewRideChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="customer.email"
                    value={newRide.customer.email}
                    onChange={handleNewRideChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Adresse de départ
                  </label>
                  <input
                    type="text"
                    name="pickup"
                    value={newRide.pickup}
                    onChange={handleNewRideChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Adresse d'arrivée
                  </label>
                  <input
                    type="text"
                    name="dropoff"
                    value={newRide.dropoff}
                    onChange={handleNewRideChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={newRide.date}
                      onChange={handleNewRideChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Heure
                    </label>
                    <input
                      type="time"
                      name="time"
                      value={newRide.time}
                      onChange={handleNewRideChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Passagers
                    </label>
                    <input
                      type="number"
                      name="passengers"
                      value={newRide.passengers}
                      onChange={handleNewRideChange}
                      min="1"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Bagages
                    </label>
                    <input
                      type="number"
                      name="luggage"
                      value={newRide.luggage}
                      onChange={handleNewRideChange}
                      min="0"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Type de véhicule
                  </label>
                  <select
                    name="vehicleType"
                    value={newRide.vehicleType}
                    onChange={handleNewRideChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="Berline">Berline</option>
                    <option value="Van">Van</option>
                    <option value="Premium">Premium</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Prix
                  </label>
                  <input
                    type="text"
                    name="price"
                    value={newRide.price}
                    onChange={handleNewRideChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                    placeholder="ex: 80€"
                  />
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  Créer la course
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewRideModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dispatch;