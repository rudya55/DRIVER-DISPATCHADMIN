import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug: Log environment variables
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key:', supabaseAnonKey ? 'Present' : 'Missing');
console.log('All env vars:', import.meta.env);

// Create a mock client if environment variables are missing
let supabase;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Variables d\'environnement Supabase manquantes. Création d\'un client mock.');
  
  // Create a mock Supabase client that returns helpful error messages
  supabase = {
    auth: {
      signInWithPassword: () => Promise.reject(new Error('Supabase non configuré. Veuillez configurer les variables d\'environnement VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY.')),
      signUp: () => Promise.reject(new Error('Supabase non configuré. Veuillez configurer les variables d\'environnement VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY.')),
      resetPasswordForEmail: () => Promise.reject(new Error('Supabase non configuré. Veuillez configurer les variables d\'environnement VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY.')),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
    },
    from: () => ({
      select: () => Promise.reject(new Error('Supabase non configuré')),
      insert: () => Promise.reject(new Error('Supabase non configuré')),
      update: () => Promise.reject(new Error('Supabase non configuré')),
      delete: () => Promise.reject(new Error('Supabase non configuré'))
    })
  };
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    },
  });
}

export { supabase };

// Fonctions utilitaires pour la gestion des clients
export const clientsService = {
  async getClients() {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createClient(clientData) {
    const { data, error } = await supabase
      .from('clients')
      .insert([clientData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateClient(id, clientData) {
    const { data, error } = await supabase
      .from('clients')
      .update(clientData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteClient(id) {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Fonctions utilitaires pour la gestion des devis et factures
export const invoicesService = {
  async getQuotes() {
    const { data, error } = await supabase
      .from('quotes')
      .select('*, clients (*)')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createQuote(quoteData) {
    const { data, error } = await supabase
      .from('quotes')
      .insert([quoteData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getInvoices() {
    const { data, error } = await supabase
      .from('invoices')
      .select('*, clients (*), quotes (*)')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createInvoice(invoiceData) {
    const { data, error } = await supabase
      .from('invoices')
      .insert([invoiceData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Fonctions utilitaires pour la gestion des paramètres de facturation
export const invoiceSettingsService = {
  async getSettings() {
    const { data, error } = await supabase
      .from('invoice_settings')
      .select('*')
      .limit(1)
      .maybeSingle();
    
    // Return null if no settings exist, or throw if there's a real error
    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  },

  async updateSettings(settingsData) {
    // First check if any settings exist
    const { data: existingSettings } = await supabase
      .from('invoice_settings')
      .select('id')
      .limit(1)
      .maybeSingle();

    let result;
    if (existingSettings) {
      // Update existing settings
      const { data, error } = await supabase
        .from('invoice_settings')
        .update(settingsData)
        .eq('id', existingSettings.id)
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    } else {
      // Create new settings
      const { data, error } = await supabase
        .from('invoice_settings')
        .insert([settingsData])
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    }

    return result;
  },

  async uploadLogo(file) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `logos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('invoices')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl }, error: urlError } = await supabase.storage
      .from('invoices')
      .getPublicUrl(filePath);

    if (urlError) throw urlError;

    return publicUrl;
  }
};

// Fonctions utilitaires pour la gestion des informations de l'entreprise
export const companyService = {
  async getCompanyInfo() {
    const { data, error } = await supabase
      .from('company_info')
      .select('*')
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async updateCompanyInfo(companyData) {
    const { data, error } = await supabase
      .from('company_info')
      .upsert(companyData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};