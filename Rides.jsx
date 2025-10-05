import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlane, FaUser, FaSuitcase, FaCar, FaFileAlt, FaComments } from 'react-icons/fa';

function Rides() {
  const navigate = useNavigate();
  const [rides, setRides] = useState([
    {
      id: 1,
      pickupTime: new Date(Date.now() + 10000).toISOString(),
      pickup: 'Gare du Nord, Paris',
      dropoff: 'Tour Eiffel',
      flightNumber: 'AF1234',
      isLocked: false,
      canStart: true,
      timeLeft: '10',
      progress: 0,
      passengers: 2,
      luggage: 3,
      vehicleType: 'Berline',
      payment: { 
        type: 'paypal',
        amount: '77.50€'
      },
      dispatcherInfo: {
        companyName: "DispatchPro SARL",
        address: "123 Avenue des Champs-Élysées, 75008 Paris",
        license: "VTC-75-2024-12345"
      },
      driverInfo: {
        name: "Jean Dupont",
        companyName: "JD Transport SARL",
        address: "45 Rue de la Paix, 75002 Paris",
        evtNumber: "EVT-75-2024-6789"
      },
      vehicleInfo: {
        brand: "Mercedes",
        model: "Classe E",
        plate: "AB-123-CD"
      },
      orderInfo: {
        orderDate: "2024-02-26 14:30",
        pickupDate: "2024-02-26 15:00",
        distance: "5 km",
        grossAmount: "80.00€",
        netAmount: "77.50€"
      }
    }
  ]);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const [showCustomerInfo, setShowCustomerInfo] = useState(false);
  const [showFlightInfo, setShowFlightInfo] = useState(false);
  const [showPoliceControl, setShowPoliceControl] = useState(false);
  const [policeControlSection, setPoliceControlSection] = useState('dispatcher');
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setRides(currentRides => 
        currentRides.map(ride => {
          const now = new Date();
          const pickupTime = new Date(ride.pickupTime);
          const timeDiff = (pickupTime - now) / 1000;
          
          let timeLeft = Math.max(0, Math.floor(timeDiff));
          let progress = ((10 - timeLeft) / 10) * 100;

          return {
            ...ride,
            timeLeft: timeLeft.toString(),
            progress,
            canStart: timeLeft === 0
          };
        })
      );
    }, 100);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    
    const d = new Date(date);
    return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} à ${d.getHours().toString().padStart(2, '0')}H${d.getMinutes().toString().padStart(2, '0')}`;
  };

  const handleStartRide = (ride) => {
    if (ride.timeLeft === '0') {
      setSelectedRide(ride);
      setShowConfirmation(true);
    }
  };

  const confirmStartRide = () => {
    setShowConfirmation(false);
    navigate('/current-ride');
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

  const getPaymentIcon = (type) => {
    switch (type) {
      case 'paypal':
        return '💳';
      case 'cash':
        return '💵';
      case 'card':
        return '💳';
      default:
        return '💰';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Mes réservations</h1>
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
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
              <div className="relative w-10 h-10">
                <svg className="transform -rotate-90 w-10 h-10">
                  <circle
                    cx="20"
                    cy="20"
                    r="18"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                    fill="none"
                  />
                  <circle
                    cx="20"
                    cy="20"
                    r="18"
                    stroke="#22c55e"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 18}`}
                    strokeDashoffset={`${2 * Math.PI * 18 * (1 - ride.progress / 100)}`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                  {ride.timeLeft}
                </div>
              </div>
              <div>
                <p className="text-gray-900 font-medium">{formatDate(ride.pickupTime)}</p>
                <button
                  onClick={() => setShowFlightInfo(true)}
                  className="flex items-center text-blue-600"
                >
                  <FaPlane className="mr-1" />
                  <span>Vol: {ride.flightNumber}</span>
                </button>
              </div>
            </div>
            <div className="flex items-center">
              <span className="mr-2">{getPaymentIcon(ride.payment.type)}</span>
              <span className="font-medium">{ride.payment.amount}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <button
              onClick={() => setShowCustomerInfo(true)}
              className="text-gray-900 font-medium hover:text-indigo-600"
            >
              Client: Sophie Bernard
            </button>
            <p className="text-gray-600">Départ: {ride.pickup}</p>
            <p className="text-gray-600">Arrivée: {ride.dropoff}</p>
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

          <div className="flex justify-between items-center">
            <button
              onClick={() => {
                setSelectedRide(ride);
                setShowPoliceControl(true);
                setPoliceControlSection('dispatcher');
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
            >
              <FaFileAlt className="mr-2" />
              Bon de commande
            </button>
          </div>
          
          <button
            onClick={() => handleStartRide(ride)}
            className={`w-full px-4 py-3 rounded-md text-center ${
              ride.timeLeft === '0' 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
            disabled={ride.timeLeft !== '0'}
          >
            {ride.timeLeft === '0' ? 'Démarrer la course' : 'Attente du décompte'}
          </button>
        </div>
      ))}

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Confirmation</h3>
            <p className="mb-6">Êtes-vous sûr de vouloir démarrer cette course ?</p>
            <div className="flex space-x-4">
              <button
                onClick={confirmStartRide}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Confirmer
              </button>
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

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
                <p className="font-bold text-xl">Sophie Bernard</p>
                <p className="text-gray-500">Client #12345</p>
              </div>
              <div className="flex items-center justify-center text-yellow-500">
                <span className="text-lg font-medium">4.8</span>
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

      {showPoliceControl && selectedRide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full relative">
            <div className="flex flex-col h-full">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">INFORMATION</h2>
                <p className="text-lg font-semibold mt-2">SERVICE DE VOITURE DE TRANSPORT AVEC CHAUFFEUR</p>
                <p className="text-md mt-1">JUSTIFICATION DE LA RESERVATION PREALABLE</p>
                <p className="text-sm mt-1">(Article R3120-2 du Code des transports - Arrêté du 30 juillet 2013)</p>
              </div>

              {policeControlSection === 'dispatcher' && (
                <div className="border-t pt-4">
                  <h3 className="font-bold mb-2">Exploitant de véhicules de transport avec chauffeur</h3>
                  <p>{selectedRide.dispatcherInfo.companyName}</p>
                  <p>{selectedRide.dispatcherInfo.address}</p>
                  <p>Licence n° {selectedRide.dispatcherInfo.license}</p>
                </div>
              )}

              {policeControlSection === 'driver' && (
                <div className="border-t pt-4">
                  <h3 className="font-bold mb-2">Chauffeur</h3>
                  <p>Nom: {selectedRide.driverInfo.name}</p>
                  <p>Société: {selectedRide.driverInfo.companyName}</p>
                  <p>Adresse: {selectedRide.driverInfo.address}</p>
                  <p>N° EVT: {selectedRide.driverInfo.evtNumber}</p>
                </div>
              )}

              {policeControlSection === 'vehicle' && (
                <div className="border-t pt-4">
                  <h3 className="font-bold mb-2">Véhicule</h3>
                  <p>{selectedRide.vehicleInfo.brand} {selectedRide.vehicleInfo.model}</p>
                  <p>Immatriculation: {selectedRide.vehicleInfo.plate}</p>
                </div>
              )}

              {policeControlSection === 'ride' && (
                <div className="border-t pt-4">
                  <h3 className="font-bold mb-2">Course</h3>
                  <p>Commande passée le: {selectedRide.orderInfo.orderDate}</p>
                  <p>Prise en charge prévue le: {selectedRide.orderInfo.pickupDate}</p>
                  <p>Départ: {selectedRide.pickup}</p>
                  <p>Destination: {selectedRide.dropoff}</p>
                  <p>Distance: {selectedRide.orderInfo.distance}</p>
                  <p>Montant Brut: {selectedRide.orderInfo.grossAmount}</p>
                  <p>Montant Net: {selectedRide.orderInfo.netAmount}</p>
                </div>
              )}

              <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-4">
                <button
                  onClick={() => setPoliceControlSection(prev => {
                    const sections = ['dispatcher', 'driver', 'vehicle', 'ride'];
                    const currentIndex = sections.indexOf(prev);
                    return sections[currentIndex > 0 ? currentIndex - 1 : sections.length - 1];
                  })}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Précédent
                </button>
                <button
                  onClick={() => setPoliceControlSection(prev => {
                    const sections = ['dispatcher', 'driver', 'vehicle', 'ride'];
                    const currentIndex = sections.indexOf(prev);
                    return sections[currentIndex < sections.length - 1 ? currentIndex + 1 : 0];
                  })}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Suivant
                </button>
              </div>

              <button
                onClick={() => setShowPoliceControl(false)}
                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

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

export default Rides;