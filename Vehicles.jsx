import React, { useState } from 'react';
import { FaCar, FaCheck, FaTimes } from 'react-icons/fa';

function Vehicles() {
  const [vehicles, setVehicles] = useState([
    {
      id: 1,
      brand: 'Mercedes',
      model: 'Classe E',
      year: '2023',
      plate: 'AB-123-CD',
      status: 'approved',
      type: 'Berline',
      seats: 4,
      color: 'Noir',
      documents: {
        insurance: true,
        registration: true,
        technicalControl: true
      }
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    brand: '',
    model: '',
    year: '',
    plate: '',
    type: 'Berline',
    seats: 4,
    color: '',
    documents: {
      insurance: false,
      registration: false,
      technicalControl: false
    }
  });

  const vehicleTypes = ['Berline', 'Van', 'SUV', 'Premium'];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('document_')) {
      const documentName = name.replace('document_', '');
      setNewVehicle(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          [documentName]: checked
        }
      }));
    } else {
      setNewVehicle(prev => ({
        ...prev,
        [name]: type === 'number' ? parseInt(value) : value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const vehicleToAdd = {
      ...newVehicle,
      id: vehicles.length + 1,
      status: 'pending'
    };
    setVehicles([...vehicles, vehicleToAdd]);
    setShowAddForm(false);
    setNewVehicle({
      brand: '',
      model: '',
      year: '',
      plate: '',
      type: 'Berline',
      seats: 4,
      color: '',
      documents: {
        insurance: false,
        registration: false,
        technicalControl: false
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Véhicules</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Ajouter un véhicule
        </button>
      </div>

      {/* Liste des véhicules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-4">
                <FaCar className="w-8 h-8 text-indigo-600" />
                <div>
                  <h3 className="font-semibold text-lg">
                    {vehicle.brand} {vehicle.model}
                  </h3>
                  <p className="text-gray-500">{vehicle.plate}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                vehicle.status === 'approved' 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {vehicle.status === 'approved' ? 'Approuvé' : 'En attente'}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p className="font-medium">{vehicle.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Places</p>
                <p className="font-medium">{vehicle.seats}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Année</p>
                <p className="font-medium">{vehicle.year}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Couleur</p>
                <p className="font-medium">{vehicle.color}</p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm font-medium text-gray-500 mb-2">Documents</p>
              <div className="space-y-2">
                <div className="flex items-center">
                  {vehicle.documents.insurance ? (
                    <FaCheck className="w-4 h-4 text-green-500 mr-2" />
                  ) : (
                    <FaTimes className="w-4 h-4 text-red-500 mr-2" />
                  )}
                  <span>Assurance</span>
                </div>
                <div className="flex items-center">
                  {vehicle.documents.registration ? (
                    <FaCheck className="w-4 h-4 text-green-500 mr-2" />
                  ) : (
                    <FaTimes className="w-4 h-4 text-red-500 mr-2" />
                  )}
                  <span>Carte grise</span>
                </div>
                <div className="flex items-center">
                  {vehicle.documents.technicalControl ? (
                    <FaCheck className="w-4 h-4 text-green-500 mr-2" />
                  ) : (
                    <FaTimes className="w-4 h-4 text-red-500 mr-2" />
                  )}
                  <span>Contrôle technique</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal d'ajout de véhicule */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Ajouter un véhicule</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Marque
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={newVehicle.brand}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Modèle
                  </label>
                  <input
                    type="text"
                    name="model"
                    value={newVehicle.model}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Année
                  </label>
                  <input
                    type="number"
                    name="year"
                    value={newVehicle.year}
                    onChange={handleInputChange}
                    min="2000"
                    max={new Date().getFullYear()}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Immatriculation
                  </label>
                  <input
                    type="text"
                    name="plate"
                    value={newVehicle.plate}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Type de véhicule
                  </label>
                  <select
                    name="type"
                    value={newVehicle.type}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    {vehicleTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nombre de places
                  </label>
                  <input
                    type="number"
                    name="seats"
                    value={newVehicle.seats}
                    onChange={handleInputChange}
                    min="2"
                    max="9"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Couleur
                </label>
                <input
                  type="text"
                  name="color"
                  value={newVehicle.color}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <p className="block text-sm font-medium text-gray-700 mb-2">
                  Documents
                </p>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="document_insurance"
                      checked={newVehicle.documents.insurance}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <span className="ml-2">Assurance</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="document_registration"
                      checked={newVehicle.documents.registration}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <span className="ml-2">Carte grise</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="document_technicalControl"
                      checked={newVehicle.documents.technicalControl}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <span className="ml-2">Contrôle technique</span>
                  </label>
                </div>
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Soumettre
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
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

export default Vehicles;