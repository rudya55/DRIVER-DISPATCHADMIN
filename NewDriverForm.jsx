import React, { useState } from 'react';
import { FaBuilding, FaUser, FaIdCard, FaCar } from 'react-icons/fa';

function NewDriverForm({ onClose }) {
  const [driverType, setDriverType] = useState('company');
  const [step, setStep] = useState(1);
  
  // Liste des sociétés disponibles
  const companies = [
    { id: 1, name: 'FastTaxi SARL' },
    { id: 2, name: 'SpeedCab SAS' },
    { id: 3, name: 'Elite Transport' }
  ];

  // Liste des véhicules disponibles
  const vehicles = [
    { id: 1, brand: 'Mercedes', model: 'Classe E', type: 'Berline', year: 2023, plate: 'AB-123-CD' },
    { id: 2, brand: 'Peugeot', model: '508', type: 'Berline', year: 2022, plate: 'EF-456-GH' },
    { id: 3, brand: 'Mercedes', model: 'Classe V', type: 'Van', year: 2023, plate: 'IJ-789-KL' }
  ];

  const [formData, setFormData] = useState({
    // Informations personnelles
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    // Documents
    driverLicense: '',
    vtcCard: '',
    // Informations société (si chauffeur société)
    companyId: '',
    // Informations véhicule
    vehicleId: '',
    // Informations de connexion
    username: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Si un véhicule est sélectionné, pré-remplir les informations
    if (name === 'vehicleId') {
      const selectedVehicle = vehicles.find(v => v.id === parseInt(value));
      if (selectedVehicle) {
        setFormData(prev => ({
          ...prev,
          vehicleId: value,
          vehicleBrand: selectedVehicle.brand,
          vehicleModel: selectedVehicle.model,
          vehicleYear: selectedVehicle.year,
          vehiclePlate: selectedVehicle.plate,
          vehicleType: selectedVehicle.type
        }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Créer le compte chauffeur et générer les identifiants
    console.log('Données du formulaire:', formData);
    onClose();
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="flex space-x-4 mb-6">
        <button
          type="button"
          onClick={() => setDriverType('company')}
          className={`flex-1 py-4 px-6 rounded-lg flex items-center justify-center space-x-3 ${
            driverType === 'company' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          <FaBuilding className="text-xl" />
          <span>Chauffeur société</span>
        </button>
        <button
          type="button"
          onClick={() => setDriverType('individual')}
          className={`flex-1 py-4 px-6 rounded-lg flex items-center justify-center space-x-3 ${
            driverType === 'individual' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          <FaUser className="text-xl" />
          <span>Chauffeur individuel</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Prénom
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
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
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
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
          value={formData.phone}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      {driverType === 'company' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Société
          </label>
          <select
            name="companyId"
            value={formData.companyId}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          >
            <option value="">Sélectionner une société</option>
            {companies.map(company => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Numéro de permis de conduire
        </label>
        <input
          type="text"
          name="driverLicense"
          value={formData.driverLicense}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Numéro de carte VTC
        </label>
        <input
          type="text"
          name="vtcCard"
          value={formData.vtcCard}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Véhicule
        </label>
        <select
          name="vehicleId"
          value={formData.vehicleId}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        >
          <option value="">Sélectionner un véhicule</option>
          {vehicles.map(vehicle => (
            <option key={vehicle.id} value={vehicle.id}>
              {vehicle.brand} {vehicle.model} - {vehicle.plate}
            </option>
          ))}
        </select>
      </div>

      {formData.vehicleId && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-3">Informations du véhicule</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Marque</p>
              <p className="font-medium">{formData.vehicleBrand}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Modèle</p>
              <p className="font-medium">{formData.vehicleModel}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Année</p>
              <p className="font-medium">{formData.vehicleYear}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Immatriculation</p>
              <p className="font-medium">{formData.vehiclePlate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Type</p>
              <p className="font-medium">{formData.vehicleType}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nom d'utilisateur
        </label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Mot de passe
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Confirmer le mot de passe
        </label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">
            {step === 1 && "Nouveau chauffeur"}
            {step === 2 && "Documents"}
            {step === 3 && "Véhicule"}
            {step === 4 && "Identifiants de connexion"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            ✕
          </button>
        </div>

        <div className="mb-8">
          <div className="flex justify-between relative">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                <FaUser />
              </div>
              <div className={`h-1 w-24 ${
                step > 1 ? 'bg-indigo-600' : 'bg-gray-200'
              }`} />
            </div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                <FaIdCard />
              </div>
              <div className={`h-1 w-24 ${
                step > 2 ? 'bg-indigo-600' : 'bg-gray-200'
              }`} />
            </div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                <FaCar />
              </div>
              <div className={`h-1 w-24 ${
                step > 3 ? 'bg-indigo-600' : 'bg-gray-200'
              }`} />
            </div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 4 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                <FaUser />
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => step > 1 && setStep(step - 1)}
              className={`px-4 py-2 ${
                step === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } rounded-lg`}
              disabled={step === 1}
            >
              Précédent
            </button>
            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Suivant
              </button>
            ) : (
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Créer le compte
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewDriverForm;