import React, { useState, useEffect } from 'react';
import { mockDataService } from '../lib/auth';
import { FaCheck, FaTimes, FaDownload, FaEye, FaEnvelope, FaBuilding, FaUser, FaPlus, FaTrash, FaFileAlt, FaSearch } from 'react-icons/fa';

function Quotes({ clients = [] }) {
  const [quotes, setQuotes] = useState([]);
  const [showNewQuoteModal, setShowNewQuoteModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [loading, setLoading] = useState(true);
  const [clientStats, setClientStats] = useState({});
  const [clientType, setClientType] = useState('company');
  const [newQuote, setNewQuote] = useState({
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
    amount_ht: '',
    amount_ttc: '',
    vat_rate: 10,
    date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchQuotes();
    calculateClientStats();
  }, []);

  useEffect(() => {
    calculateClientStats();
  }, [quotes]);

  const calculateClientStats = () => {
    const stats = {};
    quotes.forEach(quote => {
      if (!stats[quote.client_id]) {
        stats[quote.client_id] = { quotes: 0, invoices: 0 };
      }
      stats[quote.client_id].quotes += 1;
    });
    setClientStats(stats);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...newQuote.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    // Recalculate for this item
    const item = updatedItems[index];
    const unitPriceTTC = parseFloat(item.unit_price_ttc) || 0;
    const quantity = parseFloat(item.quantity) || 0;
    const vatRate = parseFloat(newQuote.vat_rate) || 0;
    
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

    setNewQuote({
      ...newQuote,
      items: updatedItems,
      amount_ht: totalAmountHT.toFixed(2),
      amount_ttc: totalAmountTTC.toFixed(2)
    });
  };

  const addNewItem = () => {
    setNewQuote({
      ...newQuote,
      items: [
        ...newQuote.items,
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
    if (newQuote.items.length > 1) {
      const updatedItems = newQuote.items.filter((_, i) => i !== index);
      
      // Recalculate totals
      const totalAmountHT = updatedItems.reduce((sum, item) => sum + (parseFloat(item.total_ht) || 0), 0);
      const totalAmountTTC = updatedItems.reduce((sum, item) => sum + (parseFloat(item.total_ttc) || 0), 0);

      setNewQuote({
        ...newQuote,
        items: updatedItems,
        amount_ht: totalAmountHT.toFixed(2),
        amount_ttc: totalAmountTTC.toFixed(2)
      });
    }
  };

  const handleVatChange = (e) => {
    const vatRate = parseFloat(e.target.value) || 0;
    
    // Recalculate all items with new VAT rate
    const updatedItems = newQuote.items.map(item => {
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

    setNewQuote({
      ...newQuote,
      items: updatedItems,
      vat_rate: e.target.value,
      amount_ht: totalAmountHT.toFixed(2),
      amount_ttc: totalAmountTTC.toFixed(2)
    });
  };

  async function fetchQuotes() {
    try {
      const data = await mockDataService.getQuotes();
      setQuotes(data);
    } catch (error) {
      console.error('Error fetching quotes:', error);
      setQuotes([]);
    } finally {
      setLoading(false);
    }
  }

  const handleNewQuote = async (e) => {
    e.preventDefault();
    try {
      // Mock creation for demo
      console.log('Quote created (demo mode):', newQuote);
      fetchQuotes();
      
      setShowNewQuoteModal(false);
      setNewQuote({
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
        amount_ht: '',
        amount_ttc: '',
        vat_rate: 10,
        date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]
      });
    } catch (error) {
      console.error('Error creating quote:', error);
    }
  };

  const handleAcceptQuote = async (quote) => {
    try {
      console.log('Quote accepted (demo mode):', quote);
      fetchQuotes();
    } catch (error) {
      console.error('Error accepting quote:', error);
    }
  };

  const handleRejectQuote = async (quoteId) => {
    try {
      console.log('Quote rejected (demo mode):', quoteId);
      fetchQuotes();
    } catch (error) {
      console.error('Error rejecting quote:', error);
    }
  };

  const handlePreviewQuote = (quote) => {
    setSelectedQuote(quote);
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
                placeholder="Rechercher un devis..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 w-64"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowNewQuoteModal(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
            >
              <FaPlus className="mr-2" />
              Nouveau Devis
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
                  N° Devis
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
                  Total TTC
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                  Statut
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {quotes
                .filter(quote => 
                  quote.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  quote.clients?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  quote.description.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((quote) => (
                <tr key={quote.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">
                    {quote.number}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    <div className="truncate" title={quote.clients?.name}>
                      {quote.clients?.name}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    <div className="truncate" title={quote.description}>
                      {quote.description}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {quote.quantity}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {quote.unit_price_ttc} €
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {quote.vat_rate}%
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {quote.amount_ttc} €
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      quote.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                      quote.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'}`}>
                      {quote.status === 'accepted' ? 'Accepté' :
                       quote.status === 'rejected' ? 'Refusé' :
                       'En attente'}
                    </span>
                    {quote.status === 'pending' && (
                      <div className="flex space-x-2 mt-2">
                        <button
                          onClick={() => handleAcceptQuote(quote)}
                          className="px-3 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-700 flex items-center"
                        >
                          <FaCheck className="mr-1" />
                          Accepter
                        </button>
                        <button
                          onClick={() => handleRejectQuote(quote.id)}
                          className="px-3 py-1 bg-red-600 text-white text-xs rounded-md hover:bg-red-700 flex items-center"
                        >
                          <FaTimes className="mr-1" />
                          Refuser
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {new Date(quote.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handlePreviewQuote(quote)}
                        className="bg-gray-600 text-white p-2 rounded-lg hover:bg-gray-700"
                        title="Visualiser"
                      >
                        <FaEye />
                      </button>
                      {quote.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleAcceptQuote(quote)}
                            className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700"
                            title="Accepter"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={() => handleRejectQuote(quote.id)}
                            className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700"
                            title="Refuser"
                          >
                            <FaTimes />
                          </button>
                        </>
                      )}
                      <button
                        className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
                        title="Télécharger"
                      >
                        <FaDownload />
                      </button>
                      <button
                        className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700"
                        title="Envoyer par email"
                      >
                        <FaEnvelope />
                      </button>
                      <button
                        className="bg-yellow-600 text-white p-2 rounded-lg hover:bg-yellow-700"
                        title="Fichier"
                      >
                        <FaFileAlt />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nouveau Devis */}
      {showNewQuoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Nouveau devis</h3>
              <button
                onClick={() => setShowNewQuoteModal(false)}
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
                    setNewQuote({...newQuote, client_type: 'company'});
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
                    setNewQuote({...newQuote, client_type: 'individual'});
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

            <form onSubmit={handleNewQuote} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Client
                </label>
                <select
                  value={newQuote.client_id}
                  onChange={(e) => setNewQuote({...newQuote, client_id: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                >
                  <option value="">
                    Sélectionner un client
                  </option>
                  {clients
                    .filter(client => client.type === clientType)
                    .map(client => (
                    <option key={client.id} value={client.id}>
                      {client.name}
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
                
                {newQuote.items.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Article {index + 1}</h4>
                      {newQuote.items.length > 1 && (
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
                  value={newQuote.vat_rate}
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
                    value={newQuote.amount_ht}
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
                    value={newQuote.amount_ttc}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date du devis
                  </label>
                  <input
                    type="date"
                    value={newQuote.date}
                    onChange={(e) => setNewQuote({...newQuote, date: e.target.value})}
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
                    value={newQuote.due_date}
                    onChange={(e) => setNewQuote({...newQuote, due_date: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowNewQuoteModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Créer le devis
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Aperçu Devis */}
      {showPreviewModal && selectedQuote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">DEVIS</h2>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-gray-400 hover:text-gray-500 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-8">
              {/* En-tête du devis */}
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
                    <p className="font-semibold">{selectedQuote.clients?.name}</p>
                    <p>{selectedQuote.clients?.address}</p>
                    {selectedQuote.clients?.siret && (
                      <p>SIRET: {selectedQuote.clients?.siret}</p>
                    )}
                    {selectedQuote.clients?.vat_number && (
                      <p>TVA: {selectedQuote.clients?.vat_number}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Informations du devis */}
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p><strong>N° Devis:</strong> {selectedQuote.number}</p>
                  <p><strong>Date:</strong> {new Date(selectedQuote.date).toLocaleDateString('fr-FR')}</p>
                  <p><strong>Échéance:</strong> {new Date(selectedQuote.due_date).toLocaleDateString('fr-FR')}</p>
                </div>
                <div>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    selectedQuote.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                    selectedQuote.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedQuote.status === 'accepted' ? 'Accepté' :
                     selectedQuote.status === 'rejected' ? 'Refusé' :
                     'En attente'}
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
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-900">{selectedQuote.description}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{selectedQuote.quantity}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{selectedQuote.unit_price_ttc} €</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{selectedQuote.amount_ttc} €</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Totaux */}
              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between">
                    <span>Total HT:</span>
                    <span className="font-semibold">{selectedQuote.amount_ht} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TVA ({selectedQuote.vat_rate}%):</span>
                    <span className="font-semibold">{(selectedQuote.amount_ttc - selectedQuote.amount_ht).toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-bold">Total TTC:</span>
                    <span className="font-bold text-lg">{selectedQuote.amount_ttc} €</span>
                  </div>
                </div>
              </div>

              {/* Actions du devis */}
              {selectedQuote.status === 'pending' && (
                <div className="flex justify-center space-x-4 pt-6 border-t">
                  <button
                    onClick={() => {
                      handleAcceptQuote(selectedQuote);
                      setShowPreviewModal(false);
                    }}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                  >
                    <FaCheck className="mr-2" />
                    Accepter le devis
                  </button>
                  <button
                    onClick={() => {
                      handleRejectQuote(selectedQuote.id);
                      setShowPreviewModal(false);
                    }}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
                  >
                    <FaTimes className="mr-2" />
                    Refuser le devis
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

export default Quotes;