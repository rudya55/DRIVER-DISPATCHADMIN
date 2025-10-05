import React, { useState } from 'react';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';

function Location() {
  const [center] = useState({ lat: 48.8566, lng: 2.3522 });
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [drivers] = useState([
    { 
      id: 1, 
      position: { lat: 48.8584, lng: 2.2945 }, 
      type: 'standard', 
      name: 'Jean Dupont',
      status: 'available',
      vehicle: 'Peugeot 508',
      rating: 4.8,
      phone: '+33 6 12 34 56 78'
    },
    { 
      id: 2, 
      position: { lat: 48.8731, lng: 2.2950 }, 
      type: 'berline', 
      name: 'Marie Martin',
      status: 'busy',
      vehicle: 'Mercedes Classe E',
      rating: 4.9,
      phone: '+33 6 98 76 54 32',
      currentRide: {
        pickup: 'Champs-Élysées',
        dropoff: 'Montmartre',
        customer: 'Lucas Petit'
      }
    },
    { 
      id: 3, 
      position: { lat: 48.8600, lng: 2.3400 }, 
      type: 'van', 
      name: 'Pierre Laurent',
      status: 'available',
      vehicle: 'Mercedes Classe V',
      rating: 4.7,
      phone: '+33 6 11 22 33 44'
    },
  ]);

  const vehicleTypes = [
    { id: 'standard', name: 'Standard', icon: '🚗', color: '#3B82F6' },
    { id: 'berline', name: 'Berline', icon: '🚙', color: '#4B5563' },
    { id: 'van', name: 'Van', icon: '🚐', color: '#10B981' },
    { id: 'minibus', name: 'Mini Bus', icon: '🚌', color: '#F59E0B' },
    { id: 'firstclass', name: 'First Class', icon: '👑', color: '#8B5CF6' }
  ];

  const mapContainerStyle = {
    width: '100%',
    height: 'calc(100vh - 200px)'
  };

  const getMarkerIcon = (type) => {
    const vehicleType = vehicleTypes.find(vt => vt.id === type);
    return {
      path: 'M -1.5,-1.5 1.5,-1.5 1.5,1.5 -1.5,1.5 z',
      fillColor: vehicleType?.color || '#3B82F6',
      fillOpacity: 1,
      strokeWeight: 0,
      scale: 4
    };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return '#22c55e'; // Vert
      case 'busy':
        return '#3b82f6'; // Bleu
      case 'offline':
        return '#6b7280'; // Gris
      default:
        return '#f59e0b'; // Orange
    }
  };

  const getMarkerIconWithStatus = (type, status) => {
    const vehicleType = vehicleTypes.find(vt => vt.id === type);
    return {
      path: 'M -8,-8 8,-8 8,8 -8,8 z',
      fillColor: getStatusColor(status),
      fillOpacity: 1,
      strokeColor: '#ffffff',
      strokeWeight: 2,
      scale: 1.5
    };
  };

  return (
    <div className="space-y-4">
      {/* Légende des statuts et types de véhicules */}
      <div className="flex justify-center space-x-4 bg-white p-4 rounded-lg shadow">
        <div className="flex space-x-8">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Statuts des chauffeurs</h4>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-xs text-gray-600">Disponible</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-xs text-gray-600">Occupé</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
                <span className="text-xs text-gray-600">Hors ligne</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Types de véhicules</h4>
            <div className="flex space-x-4">
              {vehicleTypes.map((type) => (
                <div key={type.id} className="flex flex-col items-center justify-center">
                  <span className="text-lg">{type.icon}</span>
                  <span className="text-xs text-gray-600 mt-1">{type.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Google Maps */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={13}
          options={{
            zoomControl: true,
            mapTypeControl: true,
            scaleControl: true,
            streetViewControl: true,
            rotateControl: false,
            fullscreenControl: true,
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
              }
            ]
          }}
        >
          {drivers.map((driver) => (
            <Marker
              key={driver.id}
              position={driver.position}
              icon={getMarkerIconWithStatus(driver.type, driver.status)}
              title={driver.name}
              onClick={() => setSelectedDriver(driver)}
            />
          ))}
          
          {selectedDriver && (
            <InfoWindow
              position={selectedDriver.position}
              onCloseClick={() => setSelectedDriver(null)}
            >
              <div className="p-2 max-w-xs">
                <h3 className="font-semibold text-lg">{selectedDriver.name}</h3>
                <div className="space-y-1 text-sm">
                  <p><strong>Véhicule:</strong> {selectedDriver.vehicle}</p>
                  <p><strong>Note:</strong> ⭐ {selectedDriver.rating}</p>
                  <p><strong>Téléphone:</strong> {selectedDriver.phone}</p>
                  <p>
                    <strong>Statut:</strong> 
                    <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                      selectedDriver.status === 'available' ? 'bg-green-100 text-green-800' :
                      selectedDriver.status === 'busy' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedDriver.status === 'available' ? 'Disponible' :
                       selectedDriver.status === 'busy' ? 'Occupé' : 'Hors ligne'}
                    </span>
                  </p>
                  {selectedDriver.currentRide && (
                    <div className="mt-2 p-2 bg-blue-50 rounded">
                      <p className="font-medium">Course en cours:</p>
                      <p><strong>Client:</strong> {selectedDriver.currentRide.customer}</p>
                      <p><strong>De:</strong> {selectedDriver.currentRide.pickup}</p>
                      <p><strong>À:</strong> {selectedDriver.currentRide.dropoff}</p>
                    </div>
                  )}
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </div>
  );
}

export default Location;