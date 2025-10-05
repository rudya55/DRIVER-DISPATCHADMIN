import React, { useState } from 'react';
import { FaUser, FaSuitcase, FaCar, FaPlane, FaComments } from 'react-icons/fa';

function CompletedRides() {
  const [rides] = useState([
    {
      id: 1,
      date: '2024-02-20',
      startTime: '14:30',
      endTime: '15:15',
      customer: 'Sophie Bernard',
      driver: 'Jean Dupont',
      rating: 4.8,
      distance: '27 km',
      duration: '45 min',
      price: '65€',
      passengers: 2,
      luggage: 3,
      vehicleType: 'Berline',
      flightNumber: 'AF1234',
      route: {
        pickup: '15 Rue de la Paix, Paris',
        dropoff: 'Aéroport Charles de Gaulle'
      }
    },
    {
      id: 2,
      date: '2024-02-20',
      startTime: '12:00',
      endTime: '12:20',
      customer: 'Lucas Petit',
      driver: 'Marie Martin',
      rating: 5.0,
      distance: '5 km',
      duration: '20 min',
      price: '25€',
      passengers: 1,
      luggage: 1,
      vehicleType: 'Standard',
      route: {
        pickup: 'Gare du Nord, Paris',
        dropoff: 'Tour Eiffel'
      }
    }
  ]);

  const [showDetails, setShowDetails] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const [showFlightInfo, setShowFlightInfo] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Bonjour, je suis en route.", sender: "driver", translated: "Hello, I'm on my way." },
    { id: 2, text: "Perfect, the customer is waiting.", sender: "dispatcher", translated: "Parfait, le client attend." }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleShowDetails = (ride) => {
    setSelectedRide(ride);
    setShowDetails(true);
  };

  const openGoogleMaps = (pickup, dropoff) => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(pickup)}&destination=${encodeURIComponent(dropoff)}`;
    window.open(url, '_blank');
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const translatedText = "Message traduit automatiquement"; // Simulation de traduction
      setMessages([...messages, {
        id: messages.length + 1,
        text: newMessage,
        sender: 'driver',
        translated: translatedText
      }]);
      setNewMessage('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Courses terminées</h1>
        <button
          onClick={() => setShowChat(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <FaComments className="mr-2" />
          Chat
        </button>
      </div>
      
      {rides.map((ride) => (
        <div key={ride.id} className="bg-white rounded-lg shadow p-4 space-y-3">
          <div className="flex justify-between">
            <div>
              <p className="font-semibold">{ride.date}</p>
              <p className="text-sm text-gray-500">
                {ride.startTime} - {ride.endTime}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-green-600">{ride.price}</p>
              <div className="flex items-center text-yellow-500">
                <span className="text-sm">{ride.rating}</span>
                <span className="ml-1">★</span>
              </div>
            </div>
          </div>
          
          <div>
            <p className="font-medium">{ride.customer}</p>
            <p className="text-sm text-gray-500">Chauffeur: {ride.driver}</p>
            <p className="text-sm text-gray-500">{ride.distance} • {ride.duration}</p>
            {ride.flightNumber && (
              <button
                onClick={() => setShowFlightInfo(true)}
                className="text-sm text-blue-600 flex items-center mt-1"
              >
                <FaPlane className="mr-1" />
                Vol: {ride.flightNumber}
              </button>
            )}
          </div>

          <div className="flex items-center space-x-4 text-gray-600">
            <div className="flex items-center">
              <FaUser className="mr-1" />
              <span>{ride.passengers}</span>
            </div>
            <div className="flex items-center">
              <FaSuitcase className="mr-1" />
              <span>{ride.luggage}</span>
            </div>
            <div className="flex items-center">
              <FaCar className="mr-1" />
              <span>{ride.vehicleType}</span>
            </div>
          </div>

          <div className="h-32 bg-gray-200 rounded-lg relative">
            <button 
              onClick={() => openGoogleMaps(ride.route.pickup, ride.route.dropoff)}
              className="absolute bottom-2 right-2 bg-white px-3 py-1 rounded-md shadow text-sm"
            >
              Voir l'itinéraire
            </button>
          </div>
          
          <button 
            onClick={() => handleShowDetails(ride)}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Voir les détails
          </button>
        </div>
      ))}

      {showDetails && selectedRide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Détails de la course</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{selectedRide.date}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Horaires</p>
                <p className="font-medium">{selectedRide.startTime} - {selectedRide.endTime}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Client</p>
                <p className="font-medium">{selectedRide.customer}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Chauffeur</p>
                <p className="font-medium">{selectedRide.driver}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Véhicule</p>
                <p className="font-medium">{selectedRide.vehicleType}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Distance et durée</p>
                <p className="font-medium">{selectedRide.distance} • {selectedRide.duration}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Prix</p>
                <p className="font-medium text-green-600">{selectedRide.price}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Note</p>
                <div className="flex items-center text-yellow-500">
                  <span className="font-medium">{selectedRide.rating}</span>
                  <span className="ml-1">★</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowDetails(false)}
              className="mt-6 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {showFlightInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">Suivi du vol AF1234</h3>
                <div className="w-12 h-12 bg-gray-200 rounded"></div>
              </div>
              
              <div className="space-y-2">
                <p className="text-green-600 font-medium">En vol</p>
                <p>Départ prévu: 14:30</p>
                <p>Arrivée prévue: 15:45</p>
                <p>Terminal: 2E - Porte 17</p>
              </div>

              <div className="h-48 bg-gray-200 rounded-lg"></div>
              
              <p className="text-sm text-gray-500">
                Mise à jour automatique toutes les 2 minutes
              </p>
            </div>
            <button
              onClick={() => setShowFlightInfo(false)}
              className="mt-6 w-full px-4 py-2 bg-gray-200 rounded-md"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Modal de chat */}
      {showChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full h-[500px] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Chat avec le dispatcher</h3>
              <button onClick={() => setShowChat(false)} className="text-gray-500">
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`space-y-1 ${
                    msg.sender === 'driver' ? 'ml-auto' : ''
                  }`}
                >
                  <div
                    className={`p-3 rounded-lg max-w-[80%] ${
                      msg.sender === 'driver'
                        ? 'bg-indigo-600 text-white ml-auto'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div
                    className={`p-2 rounded-lg text-sm ${
                      msg.sender === 'driver'
                        ? 'bg-indigo-100 text-indigo-900 ml-auto'
                        : 'bg-gray-50 text-gray-600'
                    }`}
                  >
                    {msg.translated}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Votre message..."
                className="flex-1 border rounded-lg px-3 py-2"
              />
              <button
                onClick={sendMessage}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CompletedRides;