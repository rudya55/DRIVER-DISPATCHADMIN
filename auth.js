// Système d'authentification admin local
const ADMIN_CREDENTIALS = {
  email: 'admin@driverdispatch.com',
  password: 'admin123',
  role: 'admin',
  name: 'Administrateur',
  permissions: ['all']
};

export const authService = {
  // Connexion admin
  async signIn(email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
          const session = {
            user: {
              id: 'admin-001',
              email: ADMIN_CREDENTIALS.email,
              role: ADMIN_CREDENTIALS.role,
              name: ADMIN_CREDENTIALS.name,
              permissions: ADMIN_CREDENTIALS.permissions
            },
            access_token: 'admin-token-' + Date.now()
          };
          
          // Sauvegarder la session
          localStorage.setItem('admin_session', JSON.stringify(session));
          resolve({ data: { session }, error: null });
        } else {
          resolve({ data: { session: null }, error: { message: 'Email ou mot de passe incorrect' } });
        }
      }, 500);
    });
  },

  // Vérifier la session
  async getSession() {
    return new Promise((resolve) => {
      const sessionData = localStorage.getItem('admin_session');
      if (sessionData) {
        const session = JSON.parse(sessionData);
        resolve({ data: { session }, error: null });
      } else {
        resolve({ data: { session: null }, error: null });
      }
    });
  },

  // Déconnexion
  async signOut() {
    return new Promise((resolve) => {
      localStorage.removeItem('admin_session');
      resolve({ error: null });
    });
  },

  // Écouter les changements d'état
  onAuthStateChange(callback) {
    // Simuler l'écoute des changements
    const checkSession = () => {
      const sessionData = localStorage.getItem('admin_session');
      const session = sessionData ? JSON.parse(sessionData) : null;
      callback('SIGNED_IN', session);
    };

    // Vérifier immédiatement
    checkSession();

    // Retourner un objet de désinscription
    return {
      data: {
        subscription: {
          unsubscribe: () => {}
        }
      }
    };
  }
};

// Service de données mock pour remplacer Supabase
export const mockDataService = {
  clients: [
    {
      id: 1,
      name: 'FastTaxi SARL',
      type: 'company',
      siret: '123 456 789 00001',
      vat_number: 'FR12345678900',
      address: '15 Rue de la Paix',
      postal_code: '75002',
      city: 'Paris',
      email: 'contact@fasttaxi.com',
      phone: '+33 1 23 45 67 89',
      contact_name: 'Jean Martin',
      contact_role: 'Directeur',
      created_at: '2024-01-15T10:00:00Z'
    },
    {
      id: 2,
      name: 'Sophie Bernard',
      type: 'individual',
      address: '25 Avenue des Champs-Élysées',
      postal_code: '75008',
      city: 'Paris',
      email: 'sophie.bernard@email.com',
      phone: '+33 6 12 34 56 78',
      created_at: '2024-02-01T14:30:00Z'
    }
  ],

  async getClients() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.clients);
      }, 300);
    });
  },

  async createClient(clientData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newClient = {
          id: this.clients.length + 1,
          ...clientData,
          created_at: new Date().toISOString()
        };
        this.clients.push(newClient);
        resolve(newClient);
      }, 300);
    });
  },

  quotes: [
    {
      id: 1,
      number: 'DEV-2024-0001',
      client_id: 1,
      client_type: 'company',
      clients: {
        name: 'FastTaxi SARL',
        type: 'company',
        address: '15 Rue de la Paix, 75002 Paris'
      },
      description: 'Service de transport VTC - Janvier 2024',
      quantity: 120,
      unit_price_ttc: 35,
      unit_price_ht: 31.82,
      amount_ht: 3818.40,
      amount_ttc: 4200,
      vat_rate: 10,
      status: 'pending',
      date: '2024-01-15',
      due_date: '2024-02-15'
    },
    {
      id: 2,
      number: 'DEV-2024-0002',
      client_id: 2,
      client_type: 'company',
      clients: {
        name: 'SpeedCab SAS',
        type: 'company',
        address: '25 Avenue des Champs-Élysées, 75008 Paris'
      },
      description: 'Service de transport VTC - Février 2024',
      quantity: 150,
      unit_price_ttc: 32,
      unit_price_ht: 29.09,
      amount_ht: 4363.50,
      amount_ttc: 4800,
      vat_rate: 10,
      status: 'accepted',
      date: '2024-02-01',
      due_date: '2024-03-01'
    }
  ],

  async getQuotes() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.quotes);
      }, 300);
    });
  },

  invoices: [
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
        name: 'Sophie Bernard',
        type: 'individual',
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
  ],

  async getInvoices() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.invoices);
      }, 300);
    });
  },

  async createInvoice(invoiceData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newInvoice = {
          id: this.invoices.length + 1,
          number: `FAC-2024-${String(this.invoices.length + 1).padStart(4, '0')}`,
          ...invoiceData,
          created_at: new Date().toISOString()
        };
        this.invoices.push(newInvoice);
        resolve(newInvoice);
      }, 300);
    });
  },

  async updateInvoice(id, invoiceData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.invoices.findIndex(inv => inv.id === id);
        if (index !== -1) {
          this.invoices[index] = { ...this.invoices[index], ...invoiceData };
          resolve(this.invoices[index]);
        }
      }, 300);
    });
  }
};