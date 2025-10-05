import React, { useState } from 'react';

function DriverForm({ type, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    vehicleTypes: [], // Allow multiple vehicle types
    company: type === 'company' ? '' : null,
    status: 'active'
  });

  const companies = [
    { id: 1, name: 'FastTaxi SARL' },
    { id: 2, name: 'SpeedCab SAS' },
    { id: 3, name: 'Elite Transport' }
  ];

  const vehicleTypes = [
    { id: 'standard', name: 'Standard', icon: '🚗' },
    { id: 'berline', name: 'Berline', icon: '🚙' },
    { id: 'van', name: 'Van', icon: '🚐' },
    { id: 'minibus', name: 'Mini Bus', icon: '🚌' },
    { id: 'firstclass', name: 'First Class', icon: '🚘' }
  ];

  const handleVehicleTypeToggle = (typeId) => {
    setFormData(prev => {
      const types = prev.vehicleTypes.includes(typeId)
        ? prev.vehicleTypes.filter(id => id !== typeId)
        : [...prev.vehicleTypes, typeId];
      return { ...prev, vehicleTypes: types };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {type === 'company' ? (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Société
            </label>
            <select
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Sélectionnez une société</option>
              {companies.map(company => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
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
              placeholder="+33 6 12 34 56 78"
            />
          </div>
        </>
      ) : (
        <>
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
              Téléphone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
              placeholder="+33 6 12 34 56 78"
            />
          </div>
        </>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Types de véhicule
        </label>
        <div className="grid grid-cols-5 gap-4">
          {vehicleTypes.map(type => (
            <button
              key={type.id}
              type="button"
              onClick={() => handleVehicleTypeToggle(type.id)}
              className={`p-2 rounded-lg flex items-center justify-center space-x-2 ${
                formData.vehicleTypes.includes(type.id)
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              <span>{type.icon}</span>
              <span>{type.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Statut
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="active">Actif</option>
          <option value="inactive">Inactif</option>
        </select>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Ajouter
        </button>
      </div>
    </form>
  );
}

export default DriverForm;