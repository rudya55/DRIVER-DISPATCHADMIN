import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaIdCard, FaCar, FaBuilding } from 'react-icons/fa';
import { supabase } from '../lib/supabase';

function Register() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('driver'); // 'driver' or 'fleet'
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    driverLicense: '',
    professionalCard: '',
    vehicleRegistration: '',
    insurance: '',
    vehicleBrand: '',
    vehicleModel: '',
    vehicleYear: '',
    vehiclePlate: '',
    // Informations gestionnaire de flotte
    companyName: '',
    companySiret: '',
    companyAddress: '',
    companyCity: '',
    companyPostalCode: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (step < 3) {
      // Validation for step 1
      if (step === 1) {
        if (formData.password !== formData.confirmPassword) {
          setError('Les mots de passe ne correspondent pas');
          return;
        }
      }
      setStep(step + 1);
    } else {
      setLoading(true);
      
      try {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              first_name: formData.firstName,
              last_name: formData.lastName,
              phone: formData.phone,
              driver_license: formData.driverLicense,
              professional_card: formData.professionalCard,
              vehicle_brand: formData.vehicleBrand,
              vehicle_model: formData.vehicleModel,
              vehicle_year: formData.vehicleYear,
              vehicle_plate: formData.vehiclePlate
            }
          }
        });

        if (error) {
          setError(error.message);
        } else {
          alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
          navigate('/login');
        }
      } catch (err) {
        setError('Une erreur est survenue lors de l\'inscription');
      } finally {
        setLoading(false);
      }
    }
  };

  const renderUserTypeSelection = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Type de compte</h3>
        <p className="text-sm text-gray-500">Choisissez le type de compte que vous souhaitez créer</p>
      </div>
      
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => setUserType('driver')}
          className={`w-full p-6 rounded-lg border-2 transition-all ${
            userType === 'driver' 
              ? 'border-indigo-600 bg-indigo-50' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              userType === 'driver' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}>
              <FaUser className="text-xl" />
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-gray-900">Chauffeur</h4>
              <p className="text-sm text-gray-500">
                Je suis un chauffeur VTC et je veux recevoir des courses
              </p>
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setUserType('fleet')}
          className={`w-full p-6 rounded-lg border-2 transition-all ${
            userType === 'fleet' 
              ? 'border-indigo-600 bg-indigo-50' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              userType === 'fleet' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}>
              <FaBuilding className="text-xl" />
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-gray-900">Gestionnaire de flotte</h4>
              <p className="text-sm text-gray-500">
                Je gère une flotte de véhicules et je veux dispatcher des courses
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <>
      {userType === 'driver' && (
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
      )}

      {userType === 'fleet' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nom de l'entreprise
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
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
              name="companySiret"
              value={formData.companySiret}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Adresse de l'entreprise
            </label>
            <input
              type="text"
              name="companyAddress"
              value={formData.companyAddress}
              onChange={handleChange}
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
                name="companyPostalCode"
                value={formData.companyPostalCode}
                onChange={handleChange}
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
                name="companyCity"
                value={formData.companyCity}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            Prénom
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUser className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              value={formData.firstName}
              onChange={handleChange}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Nom
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUser className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              value={formData.lastName}
              onChange={handleChange}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaEnvelope className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Téléphone
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaPhone className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            value={formData.phone}
            onChange={handleChange}
            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Mot de passe
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaLock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Confirmer le mot de passe
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaLock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {userType === 'driver' && driverType === 'company' && (
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
            Nom de l'entreprise
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaBuilding className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="companyName"
              name="companyName"
              type="text"
              required
              value={formData.companyName}
              onChange={handleChange}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      )}
    </>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      {userType === 'driver' && (
        <>
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
        </>
      )}
      
      {userType === 'fleet' && (
        <div className="text-center py-8">
          <FaBuilding className="mx-auto h-12 w-12 text-indigo-600" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            Informations de l'entreprise complétées
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Passez à l'étape suivante pour finaliser votre inscription
          </p>
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      {userType === 'driver' && (
        <>
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
        </>
      )}
      
      {userType === 'fleet' && (
        <div className="text-center py-8">
          <FaUser className="mx-auto h-12 w-12 text-indigo-600" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            Prêt pour la création du compte
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Créez vos identifiants de connexion pour finaliser l'inscription
          </p>
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
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold text-gray-900">DriverDispatch</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Inscription chauffeur
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="mb-8">
            <div className="flex justify-between relative">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 0 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {userType === 'driver' ? <FaUser /> : <FaBuilding />}
                </div>
                <div className={`h-1 w-24 ${
                  step > 0 ? 'bg-indigo-600' : 'bg-gray-200'
                }`} />
              </div>
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
                  {userType === 'driver' ? <FaIdCard /> : <FaBuilding />}
                </div>
                <div className={`h-1 w-24 ${
                  step > 2 ? 'bg-indigo-600' : 'bg-gray-200'
                }`} />
              </div>
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {userType === 'driver' ? <FaCar /> : <FaUser />}
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
            <div className="mt-2 text-center text-sm text-gray-600">
              {step === 0 && 'Type de compte'}
              {step === 1 && 'Informations personnelles'}
              {step === 2 && (userType === 'driver' ? 'Documents professionnels' : 'Informations entreprise')}
              {step === 3 && (userType === 'driver' ? 'Informations véhicule' : 'Identifiants de connexion')}
              {step === 4 && 'Identifiants de connexion'}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {step === 0 && renderUserTypeSelection()}
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => step > 0 && setStep(step - 1)}
                className={`px-4 py-2 ${
                  step === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } rounded-lg`}
                disabled={step === 0}
              >
                Précédent
              </button>
              {step === 0 ? (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Continuer
                </button>
              ) : step < (userType === 'driver' ? 4 : 3) ? (
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
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'Inscription...' : 'Finaliser l\'inscription'}
                </button>
              )}
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Déjà inscrit ?</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/login"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100"
              >
                Se connecter
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;