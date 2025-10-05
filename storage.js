// Fonctions utilitaires pour le stockage local
export const storage = {
  // Clients
  getClients: () => {
    const clients = localStorage.getItem('clients');
    return clients ? JSON.parse(clients) : [];
  },
  
  saveClients: (clients) => {
    localStorage.setItem('clients', JSON.stringify(clients));
  },

  // Devis
  getQuotes: () => {
    const quotes = localStorage.getItem('quotes');
    return quotes ? JSON.parse(quotes) : [];
  },
  
  saveQuotes: (quotes) => {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  },

  // Factures
  getInvoices: () => {
    const invoices = localStorage.getItem('invoices');
    return invoices ? JSON.parse(invoices) : [];
  },
  
  saveInvoices: (invoices) => {
    localStorage.setItem('invoices', JSON.stringify(invoices));
  },

  // Génération des numéros
  generateQuoteNumber: () => {
    const quotes = storage.getQuotes();
    const year = new Date().getFullYear();
    const lastNumber = quotes.length > 0 
      ? parseInt(quotes[quotes.length - 1].number.split('-')[2])
      : 0;
    return `DEV-${year}-${String(lastNumber + 1).padStart(4, '0')}`;
  },

  generateInvoiceNumber: () => {
    const invoices = storage.getInvoices();
    const year = new Date().getFullYear();
    const lastNumber = invoices.length > 0 
      ? parseInt(invoices[invoices.length - 1].number.split('-')[2])
      : 0;
    return `FAC-${year}-${String(lastNumber + 1).padStart(4, '0')}`;
  }
};