import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { FaDownload, FaCheck, FaEye, FaEnvelope, FaBuilding, FaUser, FaPlus, FaTrash, FaFileAlt, FaSearch } from 'react-icons/fa';
import { mockDataService } from '../lib/auth';

function InvoicesList({ clients = [] }) {
  const [invoices, setInvoices] = useState([
    {
      id: 1,
      number: 'FAC-2024-0001',
      client_id: 1,
      clients: {
        name: 'FastTaxi SARL',
        type: 'company',
        address: '15 Rue de la Paix, 75002 Paris'
      },
      quotes: {
        number: 'DEV-2024-0001'
      },
      items: [
        {
          description: 'Service de transport VTC - Janvier 2024',
          quantity: 120,
          unit_price_ttc: 35,
          unit_price_ht: 31.82,
          total_ht: 3818.40,
          total_ttc: 4200
        }
      ],
      amount_ht: 3818.40,
      amount_ttc: 4200,
      vat_rate: 10,
      status: 'pending',
      date: '2024-01-15',
      due_date: '2024-02-15'
    },
    {
      id: 2,
      number: 'FAC-2024-0002',
      client_id: 2,
      clients: {
        name: 'SpeedCab SAS',
        type: 'company',
        address: '25 Avenue des Champs-Élysées, 75008 Paris'
      },
      quotes: {
        number: 'DEV-2024-0002'
      },
      items: [
        {
          description: 'Service de transport VTC - Février 2024',
          quantity: 150,
          unit_price_ttc: 32,
          unit_price_ht: 29.09,
          total_ht: 4363.50,
          total_ttc: 4800
        }
      ],
      amount_ht: 4363.50,
      amount_ttc: 4800,
      vat_rate: 10,
      status: 'paid',
      date: '2024-02-01',
      due_date: '2024-03-01'
    }
  ]);

  const [loading, setLoading] = useState(true);
  const [clientStats, setClientStats] = useState({});
  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [clientType, setClientType] = useState('company');
  const [newInvoice, setNewInvoice] = useState({
    client_id: '',
    client_type: 'company',
    items: [
      {
        description: '',
        quantity: 1,
        unit_price_ttc: '',
        unit_price_ht: '',
        total_ht: '',
        total_ttc: ''
      }
    ],
    vat_rate: 10,
    amount_ht: '',
    amount_ttc: '',
    date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]
  });

  useEffect(() => {
    if (supabase && typeof supabase.from === 'function') {
      fetchInvoices();
    } else {
      setLoading(false);
    }
    calculateClientStats();
  }, []);

  useEffect(() => {
    calculateClientStats();
  }, [invoices]);

  const calculateClientStats = () => {
    const stats = {};
    invoices.forEach(invoice => {
      if (!stats[invoice.client_id]) {
        stats[invoice.client_id] = { quotes: 0, invoices: 0 };
      }
      stats[invoice.client_id].invoices += 1;
    });
    setClientStats(stats);
  };

  async function fetchInvoices() {
    setLoading(true);
    try {
      // Always use mock data service to avoid network issues
      const mockInvoices = await mockDataService.getInvoices();
      setInvoices(mockInvoices);
    } catch (error) {
      console.error('Error loading invoices:', error);
      // Set empty array as final fallback
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  }

  const handleMarkAsPaid = async (invoiceId) => {
    try {
      // Always use mock data service to avoid network errors
      setInvoices(invoices.map(inv => 
        inv.id === invoiceId ? { ...inv, status: 'paid' } : inv
      ));
    } catch (error) {
      console.error('Error marking invoice as paid:', error);
    }
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...newInvoice.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    // Recalculate for this item
    const item = updatedItems[index];
    const unitPriceTTC = parseFloat(item.unit_price_ttc) || 0;
    const quantity = parseFloat(item.quantity) || 0;
    const vatRate = parseFloat(newInvoice.vat_rate) || 0;
    
    const unitPriceHT = unitPriceTTC / (1 + vatRate/100);
    const totalHT = unitPriceHT * quantity;
    const totalTTC = unitPriceTTC * quantity;

    updatedItems[index] = {
      ...item,
      unit_price_ht: unitPriceHT.toFixed(2),
      total_ht: totalHT.toFixed(2),
      total_ttc: totalTTC.toFixed(2)
    };

    // Calculate totals for all items
    const totalAmountHT = updatedItems.reduce((sum, item) => sum + (parseFloat(item.total_ht) || 0), 0);
    const totalAmountTTC = updatedItems.reduce((sum, item) => sum + (parseFloat(item.total_ttc) || 0), 0);

    setNewInvoice({
      ...newInvoice,
      items: updatedItems,
      amount_ht: totalAmountHT.toFixed(2),
      amount_ttc: totalAmountTTC.toFixed(2)
    });
  };

  const addNewItem = () => {
    setNewInvoice({
      ...newInvoice,
      items: [
        ...newInvoice.items,
        {
          description: '',
          quantity: 1,
          unit_price_ttc: '',
          unit_price_ht: '',
          total_ht: '',
          total_ttc: ''
        }
      ]
    });
  };

  const removeItem = (index) => {
    if (newInvoice.items.length > 1) {
      const updatedItems = newInvoice.items.filter((_, i) => i !== index);
      
      // Recalculate totals
      const totalAmountHT = updatedItems.reduce((sum, item) => sum + (parseFloat(item.total_ht) || 0), 0);
      const totalAmountTTC = updatedItems.reduce((sum, item) => sum + (parseFloat(item.total_ttc) || 0), 0);

      setNewInvoice({
        ...newInvoice,
        items: updatedItems,
        amount_ht: totalAmountHT.toFixed(2),
        amount_ttc: totalAmountTTC.toFixed(2)
      });
    }
  };

  const handleVatChange = (e) => {
    const vatRate = parseFloat(e.target.value) || 0;
    
    // Recalculate all items with new VAT rate
    const updatedItems = newInvoice.items.map(item => {
      const unitPriceTTC = parseFloat(item.unit_price_ttc) || 0;
      const quantity = parseFloat(item.quantity) || 0;
      
      const unitPriceHT = unitPriceTTC / (1 + vatRate/100);
      const totalHT = unitPriceHT * quantity;
      const totalTTC = unitPriceTTC * quantity;
      
      return {
        ...item,
        unit_price_ht: unitPriceHT.toFixed(2),
        total_ht: totalHT.toFixed(2),
        total_ttc: totalTTC.toFixed(2)
      };
    });
    
    const totalAmountHT = updatedItems.reduce((sum, item) => sum + (parseFloat(item.total_ht) || 0), 0);
    const totalAmountTTC = updatedItems.reduce((sum, item) => sum + (parseFloat(item.total_ttc) || 0), 0);

    setNewInvoice({
      ...newInvoice,
      items: updatedItems,
      vat_rate: e.target.value,
      amount_ht: totalAmountHT.toFixed(2),
      amount_ttc: totalAmountTTC.toFixed(2)
    });
  };

  const handleNewInvoice = async (e) => {
    e.preventDefault();
    try {
      if (supabase && typeof supabase.from === 'function') {
        const { error } = await supabase
          .from('invoices')
          .insert([newInvoice]);

        if (error) throw error;
        fetchInvoices();
      } else {
        console.log('Invoice created (demo mode):', newInvoice);
      }
      
      setShowNewInvoiceModal(false);
      setNewInvoice({
        client_id: '',
        client_type: 'company',
        items: [
          {
            description: '',
            quantity: 1,
            unit_price_ttc: '',
            unit_price_ht: '',
            total_ht: '',
            total_ttc: ''
          }
        ],
        vat_rate: 10,
        amount_ht: '',
        amount_ttc: '',
        date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]
      });
    } catch (error) {
      console.error('Error creating invoice:', error);
    }
  };

  const handlePreviewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowPreviewModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Barre d'actions */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold text-gray-900">Actions</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher une facture..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 w-64"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowNewInvoiceModal(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
            >
              <FaPlus className="mr-2" />
              Nouvelle Facture
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                N° Facture
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                Devis d'origine
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-36">
                Client
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-44">
                Description
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                Quantité
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                Prix unitaire TTC
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                TVA
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                Échéance
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                Montant
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                Statut
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invoices
              .filter(invoice => 
                invoice.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                invoice.clients?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (invoice.items?.[0]?.description || invoice.description || '').toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((invoice) => (
              <tr key={invoice.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 text-sm font-medium text-gray-900">
                  {invoice.number}
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  {invoice.quotes?.number || '-'}
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  <div className="truncate" title={invoice.clients?.name}>
                    {invoice.clients?.name}
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  <div className="truncate" title={invoice.items?.[0]?.description || invoice.description || '-'}>
                    {invoice.items?.[0]?.description || invoice.description || '-'}
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  {invoice.items?.[0]?.quantity || invoice.quantity || '-'}
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  {invoice.items?.[0]?.unit_price_ttc || invoice.unit_price_ttc || '-'} €
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  {invoice.vat_rate}%
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  {new Date(invoice.date).toLocaleDateString()}
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  {new Date(invoice.due_date).toLocaleDateString()}
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  {invoice.amount_ttc} €
                </td>
                <td className="px-4 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {invoice.status === 'paid' ? 'Payée' : 'En attente'}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePreviewInvoice(invoice)}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="Aperçu"
                    >
                      <FaEye />
                    </button>
                    {invoice.status === 'pending' && (
                      <button
                        onClick={() => handleMarkAsPaid(invoice.id)}
                        className="text-green-600 hover:text-green-900"
                        title="Marquer comme payée"
                      >
                        <FaCheck />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nouvelle Facture */}
      {showNewInvoiceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Nouvelle facture</h3>
              <button
                onClick={() => setShowNewInvoiceModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                ✕
              </button>
            </div>

            <div className="mb-6">
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setClientType('company');
                    setNewInvoice({...newInvoice, client_type: 'company'});
                  }}
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
                  type="button"
                  onClick={() => {
                    setClientType('individual');
                    setNewInvoice({...newInvoice, client_type: 'individual'});
                  }}
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

            <form onSubmit={handleNewInvoice} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {clientType === 'company' ? 'Société' : 'Client particulier'}
                </label>
                <select
                  value={newInvoice.client_id}
                  onChange={(e) => setNewInvoice({...newInvoice, client_id: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                >
                  <option value="">
                    {clientType === 'company' ? 'Sélectionner une société' : 'Sélectionner un client'}
                  </option>
                  {clients
                    .filter(client => client.type === clientType)
                    .map(client => (
                    <option key={client.id} value={client.id}>
                      {client.name} ({clientStats[client.id]?.invoices || 0} factures)
                    </option>
                    ))}
                </select>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-700">
                    Articles
                  </label>
                  <button
                    type="button"
                    onClick={addNewItem}
                    className="flex items-center px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
                  >
                    <FaPlus className="mr-1" />
                    Ajouter un article
                  </button>
                </div>
                
                {newInvoice.items.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Article {index + 1}</h4>
                      {newInvoice.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-800 flex items-center"
                        >
                          <FaTrash className="mr-1" />
                          Supprimer
                        </button>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Quantité
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Prix unitaire TTC
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={item.unit_price_ttc}
                          onChange={(e) => handleItemChange(index, 'unit_price_ttc', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Total HT
                        </label>
                        <input
                          type="text"
                          value={item.total_ht}
                          readOnly
                          className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Total TTC
                        </label>
                        <input
                          type="text"
                          value={item.total_ttc}
                          readOnly
                          className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  TVA (%)
                </label>
                <input
                  type="number"
                  value={newInvoice.vat_rate}
                  onChange={handleVatChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Total général HT
                  </label>
                  <input
                    type="text"
                    value={newInvoice.amount_ht}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Total général TTC
                  </label>
                  <input
                    type="text"
                    value={newInvoice.amount_ttc}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date de facture
                  </label>
                  <input
                    type="date"
                    value={newInvoice.date}
                    onChange={(e) => setNewInvoice({...newInvoice, date: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date d'échéance
                  </label>
                  <input
                    type="date"
                    value={newInvoice.due_date}
                    onChange={(e) => setNewInvoice({...newInvoice, due_date: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowNewInvoiceModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Créer la facture
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Aperçu Facture */}
      {showPreviewModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">FACTURE</h2>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-gray-400 hover:text-gray-500 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-8">
              {/* En-tête de la facture */}
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">De :</h3>
                  <div className="space-y-1">
                    <p className="font-semibold">DriverDispatch SARL</p>
                    <p>123 Avenue des Champs-Élysées</p>
                    <p>75008 Paris</p>
                    <p>SIRET: 123 456 789 00001</p>
                    <p>TVA: FR12345678900</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">À :</h3>
                  <div className="space-y-1">
                    <p className="font-semibold">{selectedInvoice.clients?.name}</p>
                    <p>{selectedInvoice.clients?.address}</p>
                    {selectedInvoice.clients?.siret && (
                      <p>SIRET: {selectedInvoice.clients?.siret}</p>
                    )}
                    {selectedInvoice.clients?.vat_number && (
                      <p>TVA: {selectedInvoice.clients?.vat_number}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Informations de la facture */}
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p><strong>N° Facture:</strong> {selectedInvoice.number}</p>
                  <p><strong>Date:</strong> {new Date(selectedInvoice.date).toLocaleDateString('fr-FR')}</p>
                  <p><strong>Échéance:</strong> {new Date(selectedInvoice.due_date).toLocaleDateString('fr-FR')}</p>
                  {selectedInvoice.quotes?.number && (
                    <p><strong>Devis d'origine:</strong> {selectedInvoice.quotes.number}</p>
                  )}
                </div>
                <div>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    selectedInvoice.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedInvoice.status === 'paid' ? 'Payée' : 'En attente'}
                  </span>
                </div>
              </div>

              {/* Tableau des articles */}
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantité</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix unitaire TTC</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total TTC</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedInvoice.items ? selectedInvoice.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 text-sm text-gray-900">{item.description}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{item.quantity}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{item.unit_price_ttc} €</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{item.total_ttc} €</td>
                      </tr>
                    )) : (
                      <tr>
                        <td className="px-6 py-4 text-sm text-gray-900">{selectedInvoice.description}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{selectedInvoice.quantity}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{selectedInvoice.unit_price_ttc} €</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{selectedInvoice.amount_ttc} €</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Totaux */}
              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between">
                    <span>Total HT:</span>
                    <span className="font-semibold">{selectedInvoice.amount_ht} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TVA ({selectedInvoice.vat_rate}%):</span>
                    <span className="font-semibold">{(selectedInvoice.amount_ttc - selectedInvoice.amount_ht).toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-bold">Total TTC:</span>
                    <span className="font-bold text-lg">{selectedInvoice.amount_ttc} €</span>
                  </div>
                </div>
              </div>

              {/* Actions de la facture */}
              {selectedInvoice.status === 'pending' && (
                <div className="flex justify-center space-x-4 pt-6 border-t">
                  <button
                    onClick={() => {
                      handleMarkAsPaid(selectedInvoice.id);
                      setShowPreviewModal(false);
                    }}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                  >
                    <FaCheck className="mr-2" />
                    Marquer comme payée
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InvoicesList;