import React, { useState } from 'react';
import { FaBuilding, FaPlus, FaSearch, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

function CompaniesManagement() {
  const [companies, setCompanies] = useState([
    {
      id: 1,
      name: 'FastTaxi SARL',
      siret: '123 456 789 00001',
      vatNumber: 'FR12345678900',
      address: '15 Rue de la Paix',
      postalCode: '75002',
      city: 'Paris',
      phone: '+33 1 23 45 67 89',
      email: 'contact@fasttaxi.com',
      contactName: 'Jean Martin',
      contactRole: 'Directeur',
      drivers: 5,
      vehicles: 8
    },
    {
      id: 2,
      name: 'SpeedCab SAS',
      siret: '987 654 321 00001',
      vatNumber: 'FR98765432100',
      address: '25 Avenue des Champs-Élysées',
      postalCode: '75008',
      city: 'Paris',
      phone: '+33 1 98 76 54 32',
      email: 'contact@speedcab.com',
      contactName: 'Marie Dubois',
      contactRole: 'Responsable flotte',
      drivers: 3,
      vehicles: 4
    }
  ]);

  const [showNewCompanyModal, setShowNewCompanyModal] = useState(false);
  const [showCompanyDetails, setShowCompanyDetails] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newCompany, setNewCompany] = useState({
    name: '',
    siret: '',
    vatNumber: '',
    address: '',
    postalCode: '',
    city: '',
    phone: '',
    email: '',
    contactName: '',
    contactRole: ''
  });

  const handleShowCompany = (company) => {
    setSelectedCompany(company);
    setShowCompanyDetails(true);
  };

  const handleNewCompanySubmit = (e) => {
    e.preventDefault();
    const companyToAdd = {
      id: companies.length + 1,
      ...newCompany,
      drivers: 0,
      vehicles: 0
    };
    setCompanies([...companies, companyToAdd]);
    setShowNewCompanyModal(false);
    setNewCompany({
      name: '',
      siret: '',
      vatNumber: '',
      address: '',
      postalCode: '',
      city: '',
      phone: '',
      email: '',
      contactName: '',
      contactRole: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCompany(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des sociétés</h2>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher une société..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <button
            onClick={() => setShowNewCompanyModal(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <FaPlus className="mr-2" />
            Nouvelle société
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {companies
          .filter(company => 
            company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            company.siret.includes(searchQuery)
          )
          .map(company => (
            <div
              key={company.id}
              className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleShowCompany(company)}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{company.name}</h3>
                  <p className="text-gray-500">SIRET: {company.siret}</p>
                </div>
                <FaBuilding className="text-gray-400 w-6 h-6" />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center text-gray-600">
                  <FaEnvelope className="w-4 h-4 mr-2" />
                  <span className="text-sm">{company.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaPhone className="w-4 h-4 mr-2" />
                  <span className="text-sm">{company.phone}</span>
                </div>
                <div className="flex items-center text-gray-600 col-span-2">
                  <FaMapMarkerAlt className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    {company.address}, {company.postalCode} {company.city}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-500">Chauffeurs</p>
                    <p className="font-semibold">{company.drivers}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Véhicules</p>
                    <p className="font-semibold">{company.vehicles}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      {showNewCompanyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Nouvelle société</h3>
              <button
                onClick={() => setShowNewCompanyModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleNewCompanySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nom de la société
                </label>
                <input
                  type="text"
                  name="name"
                  value={newCompany.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    SIRET
                  </label>
                  <input
                    type="text"
                    name="siret"
                    value={newCompany.siret}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Numéro de TVA
                  </label>
                  <input
                    type="text"
                    name="vatNumber"
                    value={newCompany.vatNumber}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Adresse
                </label>
                <input
                  type="text"
                  name="address"
                  value={newCompany.address}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Code postal
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={newCompany.postalCode}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Ville
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={newCompany.city}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={newCompany.phone}
                    onChange={handleInputChange}
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
                    name="email"
                    value={newCompany.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nom du contact
                  </label>
                  <input
                    type="text"
                    name="contactName"
                    value={newCompany.contactName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Fonction du contact
                  </label>
                  <input
                    type="text"
                    name="contactRole"
                    value={newCompany.contactRole}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewCompanyModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Créer la société
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCompanyDetails && selectedCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-semibold">{selectedCompany.name}</h3>
                <p className="text-gray-500">SIRET: {selectedCompany.siret}</p>
              </div>
              <button
                onClick={() => setShowCompanyDetails(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-medium mb-2">Informations générales</h4>
                <div className="space-y-2">
                  <p><span className="text-gray-500">N° TVA:</span> {selectedCompany.vatNumber}</p>
                  <p><span className="text-gray-500">Email:</span> {selectedCompany.email}</p>
                  <p><span className="text-gray-500">Téléphone:</span> {selectedCompany.phone}</p>
                  <p><span className="text-gray-500">Adresse:</span> {selectedCompany.address}</p>
                  <p><span className="text-gray-500">Code postal:</span> {selectedCompany.postalCode}</p>
                  <p><span className="text-gray-500">Ville:</span> {selectedCompany.city}</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Contact principal</h4>
                <div className="space-y-2">
                  <p><span className="text-gray-500">Nom:</span> {selectedCompany.contactName}</p>
                  <p><span className="text-gray-500">Fonction:</span> {selectedCompany.contactRole}</p>
                </div>
                <h4 className="font-medium mt-4 mb-2">Statistiques</h4>
                <div className="space-y-2">
                  <p><span className="text-gray-500">Nombre de chauffeurs:</span> {selectedCompany.drivers}</p>
                  <p><span className="text-gray-500">Nombre de véhicules:</span> {selectedCompany.vehicles}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowCompanyDetails(false)}
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

export default CompaniesManagement;