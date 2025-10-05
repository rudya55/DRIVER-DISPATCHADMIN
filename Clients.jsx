import React, { useState, useEffect } from 'react';
import { FaBuilding, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { mockDataService } from '../lib/auth';

function Clients() {
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [clientType, setClientType] = useState('company');
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedClient, setExpandedClient] = useState(null);
  const [newClient, setNewClient] = useState({
    type: 'company',
    company: {
      name: '',
      siret: '',
      vat_number: '',
      address: '',
      postal_code: '',
      city: '',
      email: '',
      phone: '',
      contact_name: '',
      contact_role: ''
    },
    individual: {
      first_name: '',
      last_name: '',
      address: '',
      postal_code: '',
      city: '',
      email: '',
      phone: ''
    }
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await mockDataService.getClients();
      setClients(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const clientData = {
        type: clientType,
        ...(clientType === 'company' ? {
          name: newClient.company.name,
          siret: newClient.company.siret,
          vat_number: newClient.company.vat_number,
          address: newClient.company.address,
          postal_code: newClient.company.postal_code,
          city: newClient.company.city,
          email: newClient.company.email,
          phone: newClient.company.phone,
          contact_name: newClient.company.contact_name,
          contact_role: newClient.company.contact_role
        } : {
          name: `${newClient.individual.first_name} ${newClient.individual.last_name}`,
          address: newClient.individual.address,
          postal_code: newClient.individual.postal_code,
          city: newClient.individual.city,
          email: newClient.individual.email,
          phone: newClient.individual.phone
        })
      };

      await mockDataService.createClient(clientData);
      await loadClients();
      setShowNewClientModal(false);
      
      // Reset form
      setNewClient({
        type: 'company',
        company: {
          name: '',
          siret: '',
          vat_number: '',
          address: '',
          postal_code: '',
          city: '',
          email: '',
          phone: '',
          contact_name: '',
          contact_role: ''
        },
        individual: {
          first_name: '',
          last_name: '',
          address: '',
          postal_code: '',
          city: '',
          email: '',
          phone: ''
        }
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (clientType === 'company') {
      setNewClient({
        ...newClient,
        company: { ...newClient.company, [name]: value }
      });
    } else {
      setNewClient({
        ...newClient,
        individual: { ...newClient.individual, [name]: value }
      });
    }
  };

  const toggleClientDetails = (clientId) => {
    setExpandedClient(expandedClient === clientId ? null : clientId);
  };

  if (loading && !showNewClientModal) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Clients</h2>
        <button
          onClick={() => setShowNewClientModal(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Nouveau client
        </button>
      </div>

      {/* Client list with dropdown */}
      <div className="space-y-4">
        {clients.map((client) => (
          <div key={client.id} className="bg-white rounded-lg shadow overflow-hidden">
            <button
              onClick={() => toggleClientDetails(client.id)}
              className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50"
            >
              <div className="flex items-center space-x-4">
                {client.type === 'company' ? (
                  <FaBuilding className="w-6 h-6 text-gray-400" />
                ) : (
                  <FaUser className="w-6 h-6 text-gray-400" />
                )}
                <div className="text-left">
                  <h3 className="text-lg font-semibold">{client.name}</h3>
                  {client.type === 'company' && client.siret && (
                    <p className="text-sm text-gray-500">SIRET: {client.siret}</p>
                  )}
                </div>
              </div>
              {expandedClient === client.id ? (
                <FaChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <FaChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {expandedClient === client.id && (
              <div className="px-6 py-4 border-t border-gray-200 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Contact</p>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center text-gray-600">
                        <FaEnvelope className="w-5 h-5 mr-2" />
                        <span>{client.email}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FaPhone className="w-5 h-5 mr-2" />
                        <span>{client.phone}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Address</p>
                    <div className="mt-2">
                      <div className="flex items-center text-gray-600">
                        <FaMapMarkerAlt className="w-5 h-5 mr-2" />
                        <span>{client.address}, {client.postal_code} {client.city}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {client.type === 'company' && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Additional Information</p>
                    <div className="mt-2 grid grid-cols-2 gap-4">
                      {client.contact_name && (
                        <div>
                          <p className="text-sm text-gray-500">Contact</p>
                          <p>{client.contact_name}</p>
                          {client.contact_role && (
                            <p className="text-sm text-gray-500">{client.contact_role}</p>
                          )}
                        </div>
                      )}
                      {client.vat_number && (
                        <div>
                          <p className="text-sm text-gray-500">VAT Number</p>
                          <p>{client.vat_number}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* New Client Modal */}
      {showNewClientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">New Client</h3>
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
                  Company
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
                  Individual
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {clientType === 'company' ? (
                <>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Company Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={newClient.company.name}
                        onChange={handleChange}
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
                        value={newClient.company.siret}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      VAT Number
                    </label>
                    <input
                      type="text"
                      name="vat_number"
                      value={newClient.company.vat_number}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={newClient.company.address}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        name="postal_code"
                        value={newClient.company.postal_code}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={newClient.company.city}
                        onChange={handleChange}
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
                        value={newClient.company.email}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={newClient.company.phone}
                        onChange={handleChange}
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
                        value={newClient.company.contact_name}
                        onChange={handleChange}
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
                        value={newClient.company.contact_role}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="first_name"
                        value={newClient.individual.first_name}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="last_name"
                        value={newClient.individual.last_name}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={newClient.individual.address}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        name="postal_code"
                        value={newClient.individual.postal_code}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={newClient.individual.city}
                        onChange={handleChange}
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
                        value={newClient.individual.email}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={newClient.individual.phone}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowNewClientModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Clients;