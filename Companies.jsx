import React, { useState } from 'react';
import { FaDownload, FaEnvelope, FaEye, FaStar, FaTrophy, FaChartLine, FaCarAlt, FaMoneyBillWave } from 'react-icons/fa';
import { jsPDF } from 'jspdf';

function Companies() {
  const [companies, setCompanies] = useState([
    { 
      id: 1, 
      name: 'FastTaxi SARL',
      stats: {
        totalRevenue: 45000,
        totalRides: 1200,
        averageRating: 4.8,
        monthlyGrowth: 12,
        invoices: [
          {
            period: 'Janvier 2024',
            rides: 120,
            drivers: 5,
            amountHT: 3500,
            vat: 350,
            amountTTC: 3850,
            status: 'paid'
          },
          {
            period: 'Février 2024',
            rides: 135,
            drivers: 5,
            amountHT: 3800,
            vat: 380,
            amountTTC: 4180,
            status: 'pending'
          }
        ]
      },
      drivers: [
        { 
          id: 1, 
          name: 'Jean Dupont',
          rides: 150,
          revenue: 4500,
          rating: 4.8,
          rank: 1,
          badge: '🥇',
          performance: {
            lastMonth: 4200,
            growth: 7,
            completionRate: 98,
            customerSatisfaction: 4.9
          }
        },
        { 
          id: 2, 
          name: 'Marie Martin',
          rides: 120,
          revenue: 3600,
          rating: 4.9,
          rank: 2,
          badge: '🥈',
          performance: {
            lastMonth: 3400,
            growth: 5,
            completionRate: 97,
            customerSatisfaction: 4.8
          }
        }
      ]
    }
  ]);

  const [showDriverDetails, setShowDriverDetails] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showCompanyDetails, setShowCompanyDetails] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const handleShowDriverDetails = (driver) => {
    setSelectedDriver(driver);
    setShowDriverDetails(true);
  };

  const handleShowCompanyDetails = (company) => {
    setSelectedCompany(company);
    setShowCompanyDetails(true);
  };

  const handleDownloadInvoice = (invoice) => {
    const doc = new jsPDF();
    
    // En-tête
    doc.setFontSize(20);
    doc.text('FACTURE', 105, 20, { align: 'center' });
    
    // Informations de la société
    doc.setFontSize(12);
    doc.text('Société:', 20, 40);
    doc.text(selectedCompany.name, 20, 50);
    
    // Détails de la facture
    doc.text(`Période: ${invoice.period}`, 20, 80);
    doc.text(`Nombre de courses: ${invoice.rides}`, 20, 90);
    doc.text(`Nombre de chauffeurs: ${invoice.drivers}`, 20, 100);
    
    // Tableau des montants
    doc.autoTable({
      startY: 120,
      head: [['Description', 'Montant']],
      body: [
        ['Montant HT', formatCurrency(invoice.amountHT)],
        ['TVA (10%)', formatCurrency(invoice.vat)],
        ['Montant TTC', formatCurrency(invoice.amountTTC)]
      ]
    });
    
    // Sauvegarde du PDF
    doc.save(`facture_${selectedCompany.name}_${invoice.period}.pdf`);
  };

  const handleSendEmail = (invoice) => {
    // Logique d'envoi d'email
    console.log('Envoi de la facture par email');
  };

  const handlePreviewInvoice = (invoice) => {
    // Logique d'aperçu de la facture
    console.log('Aperçu de la facture');
  };

  const toggleInvoiceStatus = (companyId, invoiceIndex) => {
    setCompanies(companies.map(company => {
      if (company.id === companyId) {
        const updatedInvoices = [...company.stats.invoices];
        updatedInvoices[invoiceIndex] = {
          ...updatedInvoices[invoiceIndex],
          status: updatedInvoices[invoiceIndex].status === 'paid' ? 'pending' : 'paid'
        };
        return {
          ...company,
          stats: {
            ...company.stats,
            invoices: updatedInvoices
          }
        };
      }
      return company;
    }));
  };

  return (
    <div className="space-y-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h2 className="text-2xl font-bold text-gray-900">Sociétés</h2>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Société
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Période
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Courses
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Chauffeurs
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Montant HT
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                TVA
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Montant TTC
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {companies.map((company) => (
              company.stats.invoices.map((invoice, index) => (
                <tr key={`${company.id}-${index}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleShowCompanyDetails(company)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      {company.name}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{invoice.period}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{invoice.rides}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{invoice.drivers}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(invoice.amountHT)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(invoice.vat)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(invoice.amountTTC)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleInvoiceStatus(company.id, index)}
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        invoice.status === 'paid' 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                      }`}
                    >
                      {invoice.status === 'paid' ? 'Payée' : 'En attente'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handlePreviewInvoice(invoice)}
                        className="text-gray-600 hover:text-indigo-600"
                        title="Aperçu"
                      >
                        <FaEye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleSendEmail(invoice)}
                        className="text-gray-600 hover:text-indigo-600"
                        title="Envoyer par email"
                      >
                        <FaEnvelope className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDownloadInvoice(invoice)}
                        className="text-gray-600 hover:text-indigo-600"
                        title="Télécharger"
                      >
                        <FaDownload className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Détails Société */}
      {showCompanyDetails && selectedCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold">{selectedCompany.name}</h3>
                <div className="flex items-center mt-2 space-x-4">
                  <div className="flex items-center">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span>{selectedCompany.stats.averageRating}</span>
                  </div>
                  <div className="flex items-center">
                    <FaCarAlt className="text-gray-400 mr-1" />
                    <span>{selectedCompany.stats.totalRides} courses</span>
                  </div>
                  <div className="flex items-center">
                    <FaMoneyBillWave className="text-green-400 mr-1" />
                    <span>{formatCurrency(selectedCompany.stats.totalRevenue)}</span>
                  </div>
                  <div className="flex items-center">
                    <FaChartLine className="text-indigo-400 mr-1" />
                    <span>+{selectedCompany.stats.monthlyGrowth}%</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowCompanyDetails(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <h4 className="font-semibold text-lg">Classement des chauffeurs</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedCompany.drivers.map((driver) => (
                  <div
                    key={driver.id}
                    className="bg-white rounded-lg border p-4 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleShowDriverDetails(driver)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{driver.badge}</span>
                        <div>
                          <p className="font-semibold">{driver.name}</p>
                          <div className="flex items-center">
                            <FaStar className="text-yellow-400 mr-1" />
                            <span>{driver.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-indigo-600">{formatCurrency(driver.revenue)}</p>
                        <p className="text-sm text-gray-500">{driver.rides} courses</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Taux de complétion</p>
                        <p className={`font-medium ${
                          driver.performance.completionRate >= 95 ? 'text-green-600' : 'text-yellow-600'
                        }`}>
                          {driver.performance.completionRate}%
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Croissance</p>
                        <p className={`font-medium ${
                          driver.performance.growth > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          +{driver.performance.growth}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowCompanyDetails(false)}
              className="mt-6 w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Modal Détails Chauffeur */}
      {showDriverDetails && selectedDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <span className="text-2xl mr-3">{selectedDriver.badge}</span>
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
                    <span className="font-medium">{formatCurrency(selectedDriver.performance.lastMonth)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Croissance</span>
                    <span className={`font-medium ${
                      selectedDriver.performance.growth > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      +{selectedDriver.performance.growth}%
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
                      selectedDriver.performance.completionRate >= 95 ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {selectedDriver.performance.completionRate}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Satisfaction client</span>
                    <span className="font-medium flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      {selectedDriver.performance.customerSatisfaction}
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
                  <p className="text-xl font-semibold">{selectedDriver.rides}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Chiffre d'affaires</p>
                  <p className="text-xl font-semibold">{formatCurrency(selectedDriver.revenue)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Classement</p>
                  <p className="text-xl font-semibold">#{selectedDriver.rank}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => handleDownloadInvoice(selectedDriver)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <FaDownload className="inline-block mr-2" />
                Télécharger facture mensuelle
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

export default Companies;