import React, { useState, useEffect } from 'react';
import { FaBuilding, FaUser, FaFileInvoice, FaCog, FaPlus } from 'react-icons/fa';
import Companies from './Companies';
import Drivers from './Drivers';
import Quotes from './Quotes';
import InvoiceSettings from './InvoiceSettings';
import InvoicesList from './InvoicesList';
import Clients from './Clients';
import { mockDataService } from '../lib/auth';

function Invoices() {
  const [activeTab, setActiveTab] = useState('quotes');
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [showNewQuoteModal, setShowNewQuoteModal] = useState(false);
  const [clientType, setClientType] = useState('company');

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      console.log('Loading clients...');
      const data = await mockDataService.getClients();
      console.log('Clients loaded:', data);
      setClients(data);
    } catch (error) {
      console.error('Error loading clients:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const clientData = {
        type: clientType,
        name: clientType === 'company' 
          ? formData.get('name')
          : `${formData.get('first_name')} ${formData.get('last_name')}`,
        siret: formData.get('siret') || null,
        vat_number: formData.get('vat_number') || null,
        address: formData.get('address'),
        postal_code: formData.get('postal_code'),
        city: formData.get('city'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        contact_name: formData.get('contact_name') || null,
        contact_role: formData.get('contact_role') || null
      };

      await mockDataService.createClient(clientData);
      await loadClients(); // Recharger la liste des clients
      setShowNewClientModal(false);
    } catch (error) {
      console.error('Error creating client:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des factures</h2>
      </div>

      {/* Navigation en haut */}
      <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('clients')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors text-sm font-medium ${
              activeTab === 'clients' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <FaUser />
            <span>Clients</span>
          </button>
          <button
            onClick={() => setActiveTab('quotes')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors text-sm font-medium ${
              activeTab === 'quotes' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <FaFileInvoice />
            <span>Devis</span>
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors text-sm font-medium ${
              activeTab === 'invoices' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <FaFileInvoice />
            <span>Factures</span>
          </button>
          <button
            onClick={() => setActiveTab('company')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors text-sm font-medium ${
              activeTab === 'company' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <FaBuilding />
            <span>Factures société</span>
          </button>
          <button
            onClick={() => setActiveTab('driver')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors text-sm font-medium ${
              activeTab === 'driver' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <FaUser />
            <span>Factures chauffeur</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors text-sm font-medium ${
              activeTab === 'settings' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <FaCog />
            <span>Paramètres facturation</span>
          </button>
        </div>
      </div>

      {activeTab === 'clients' && <Clients />}
      {activeTab === 'quotes' && <Quotes clients={clients} />}
      {activeTab === 'invoices' && <InvoicesList clients={clients} />}
      {activeTab === 'company' && <Companies />}
      {activeTab === 'driver' && <Drivers />}
      {activeTab === 'settings' && <InvoiceSettings />}

      {/* Modal Nouveau Client */}
      {showNewClientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Nouveau Client</h3>
              <button
                onClick={() => setShowNewClientModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                ✕
              </button>
            </div>

            <div className="mb-6">
              <div className="flex space-x-4">
                <button
                  onClick={() => setClientType('company')}
                  className={`flex-1 py-2 px-4 rounded-lg ${
                    clientType === 'company'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <FaBuilding className="inline-block mr-2" />
                  Société
                </button>
                <button
                  onClick={() => setClientType('individual')}
                  className={`flex-1 py-2 px-4 rounded-lg ${
                    clientType === 'individual'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <FaUser className="inline-block mr-2" />
                  Particulier
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {clientType === 'company' ? (
                <form id="companyForm" onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Nom de la société
                      </label>
                      <input
                        type="text"
                        name="name"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        SIRET
                      </label>
                      <input
                        type="text"
                        name="siret"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      N° TVA
                    </label>
                    <input
                      type="text"
                      name="vat_number"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Adresse
                    </label>
                    <input
                      type="text"
                      name="address"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Code postal
                      </label>
                      <input
                        type="text"
                        name="postal_code"
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
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
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
                        name="phone"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Contact Name
                      </label>
                      <input
                        type="text"
                        name="contact_name"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Role
                      </label>
                      <input
                        type="text"
                        name="contact_role"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowNewClientModal(false)}
                      className="px-6 py-2 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Enregistrer
                    </button>
                  </div>
                </form>
              ) : (
                <form id="individualForm" onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Prénom
                      </label>
                      <input
                        type="text"
                        name="first_name"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Nom
                      </label>
                      <input
                        type="text"
                        name="last_name"
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
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Code postal
                      </label>
                      <input
                        type="text"
                        name="postal_code"
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
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
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
                        name="phone"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowNewClientModal(false)}
                      className="px-6 py-2 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Enregistrer
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Invoices;