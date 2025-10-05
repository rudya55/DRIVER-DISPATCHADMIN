import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaCheck, FaPlane, FaUser, FaSuitcase, FaCar, FaComments } from 'react-icons/fa';

function CurrentRide() {
  const navigate = useNavigate();
  const [ride] = useState({
    customer: {
      name: 'Sophie Bernard',
      id: '12345',
      rating: 4.8
    },
    pickup: '15 Rue de la Paix, Paris',
    dropoff: 'Aéroport Charles de Gaulle',
    startTime: new Date(),
    flightNumber: 'AF1234',
    passengers: 2,
    luggage: 3,
    vehicleType: 'Berline'
  });

  const [currentStep, setCurrentStep] = useState('start');
  const [showCustomerInfo, setShowCustomerInfo] = useState(false);
  const [showFlightInfo, setShowFlightInfo] = useState(false);
  const [showAddressOptions, setShowAddressOptions] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Bonjour, je suis en route.", sender: "driver", translated: "Hello, I'm on my way." },
    { id: 2, text: "Perfect, the customer is waiting.", sender: "dispatcher", translated: "Parfait, le client attend." }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const formatDateTime = (date) => {
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]} à ${date.getHours().toString().padStart(2, '0')}H${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const handleNextStep = () => {
    switch (currentStep) {
      case 'start':
        setCurrentStep('arrived');
        break;
      case 'arrived':
        setCurrentStep('onboard');
        break;
      case 'onboard':
        setCurrentStep('dropped');
        break;
      case 'dropped':
        navigate('/completed-rides');
        break;
      default:
        break;
    }
  };

  const getButtonText = () => {
    switch (currentStep) {
      case 'start':
        return 'Je suis arrivé';
      case 'arrived':
        return 'Client à bord';
      case 'onboard':
        return 'Client déposé';
      case 'dropped':
        return 'Terminer la course';
      default:
        return '';
    }
  };

  const handleAddressClick = (address) => {
    setSelectedAddress(address);
    setShowAddressOptions(true);
  };

  const openInMaps = (app) => {
    const address = encodeURIComponent(selectedAddress);
    let url;

    switch (app) {
      case 'google':
        url = `https://www.google.com/maps/search/?api=1&query=${address}`;
        break;
      case 'waze':
        url = `https://waze.com/ul?q=${address}`;
        break;
      case 'apple':
        url = `maps://maps.apple.com/?q=${address}`;
        break;
      default:
        url = `https://www.google.com/maps/search/?api=1&query=${address}`;
    }

    window.open(url, '_blank');
    setShowAddressOptions(false);
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(selectedAddress);
    setShowAddressOptions(false);
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
        <h1 className="text-2xl font-bold text-gray-900">Course en cours</h1>
        <button
          onClick={() => setShowChat(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <FaComments className="mr-2" />
          Chat
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-4 space-y-4">
        {/* Carte Google Maps */}
        <div className="h-48 bg-gray-200 rounded-lg relative">
          <button 
            onClick={() => openInMaps('google')}
            className="absolute bottom-2 right-2 bg-white px-3 py-1 rounded-md shadow text-sm"
          >
            Ouvrir dans Google Maps
          </button>
        </div>
        
        {/* Informations client */}
        <div className="space-y-2">
          <button
            onClick={() => setShowCustomerInfo(true)}
            className="w-full flex items-center space-x-2 hover:bg-gray-50 p-2 rounded-lg"
          >
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
              <img
                src="/dispatcher-logo.png"
                alt="Logo Dispatcher"
                className="w-6 h-6"
              />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold">{ride.customer.name}</p>
              <p className="text-sm text-gray-500">
                Client #{ride.customer.id}
              </p>
            </div>
            <div className="flex items-center text-yellow-500">
              <span className="font-medium">{ride.customer.rating}</span>
              <span className="ml-1">★</span>
            </div>
          </button>

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

          <button
            onClick={() => setShowFlightInfo(true)}
            className="flex items-center text-blue-600"
          >
            <FaPlane className="mr-1" />
            <span>Vol: {ride.flightNumber}</span>
          </button>

          <p className="text-sm text-gray-500">
            Départ: {formatDateTime(ride.startTime)}
          </p>
        </div>

        {/* Étapes de la course */}
        <div className="space-y-4 border-t border-b py-4">
          <div className={`flex items-center ${currentStep === 'arrived' ? 'text-green-600' : 'text-gray-600'}`}>
            <FaMapMarkerAlt className="mr-2" />
            <button 
              onClick={() => handleAddressClick(ride.pickup)}
              className="flex-1 text-left"
            >
              <p className="font-medium">Arrivé</p>
              <p className="text-sm">{ride.pickup}</p>
            </button>
            {currentStep !== 'start' && <FaCheck className="ml-auto text-green-600" />}
          </div>

          <div className={`flex items-center ${currentStep === 'onboard' ? 'text-green-600' : 'text-gray-600'}`}>
            <FaMapMarkerAlt className="mr-2" />
            <div>
              <p className="font-medium">Client à bord</p>
              <p className="text-sm">En route vers {ride.dropoff}</p>
            </div>
            {currentStep === 'onboard' && <FaCheck className="ml-auto text-green-600" />}
          </div>

          <div className={`flex items-center ${currentStep === 'dropped' ? 'text-green-600' : 'text-gray-600'}`}>
            <FaMapMarkerAlt className="mr-2" />
            <button 
              onClick={() => handleAddressClick(ride.dropoff)}
              className="flex-1 text-left"
            >
              <p className="font-medium">Client déposé</p>
              <p className="text-sm">{ride.dropoff}</p>
            </button>
            {currentStep === 'dropped' && <FaCheck className="ml-auto text-green-600" />}
          </div>
        </div>
        
        {/* Bouton d'action */}
        <button
          onClick={handleNextStep}
          className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          {getButtonText()}
        </button>
      </div>

      {/* Modal d'options d'adresse */}
      {showAddressOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-4 w-full max-w-sm">
            <h3 className="font-bold mb-4">Ouvrir avec</h3>
            <div className="space-y-2">
              <button 
                onClick={() => openInMaps('google')}
                className="w-full p-2 text-left hover:bg-gray-100 rounded"
              >
                Google Maps
              </button>
              <button 
                onClick={() => openInMaps('waze')}
                className="w-full p-2 text-left hover:bg-gray-100 rounded"
              >
                Waze
              </button>
              <button 
                onClick={() => openInMaps('apple')}
                className="w-full p-2 text-left hover:bg-gray-100 rounded"
              >
                Apple Plans
              </button>
              <button 
                onClick={copyAddress}
                className="w-full p-2 text-left hover:bg-gray-100 rounded"
              >
                Copier l'adresse
              </button>
            </div>
            <button
              onClick={() => setShowAddressOptions(false)}
              className="mt-4 w-full px-4 py-2 bg-gray-200 rounded-md"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Modal d'information client */}
      {showCustomerInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto bg-indigo-600 rounded-full flex items-center justify-center">
                <img
                  src="/dispatcher-logo.png"
                  alt="Logo Dispatcher"
                  className="w-12 h-12"
                />
              </div>
              <div>
                <p className="font-bold text-xl">{ride.customer.name}</p>
                <p className="text-gray-500">Client #{ride.customer.id}</p>
              </div>
              <div className="flex items-center justify-center text-yellow-500">
                <span className="text-lg font-medium">{ride.customer.rating}</span>
                <span className="ml-1">★</span>
              </div>
            </div>
            <button
              onClick={() => setShowCustomerInfo(false)}
              className="mt-6 w-full px-4 py-2 bg-gray-200 rounded-md"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Modal de suivi du vol */}
      {showFlightInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">Suivi du vol {ride.flightNumber}</h3>
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

export default CurrentRide;