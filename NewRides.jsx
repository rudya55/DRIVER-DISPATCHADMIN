import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaSuitcase, FaCar, FaPaypal, FaCreditCard, FaMoneyBill, FaComments } from 'react-icons/fa';

function NewRides() {
  const navigate = useNavigate();
  const [rides, setRides] = useState([
    {
      id: 1,
      pickupTime: '14:30',
      pickup: '15 Rue de la Paix, Paris',
      dropoff: 'Aéroport Charles de Gaulle',
      distance: '27 km',
      duration: '45 min',
      price: '65€',
      flightNumber: 'AF1234',
      passengers: 2,
      luggage: 3,
      vehicleType: 'Berline',
      paymentMethod: 'paypal',
      customer: {
        name: 'Sophie Bernard',
        phone: '+33 6 12 34 56 78',
        email: 'sophie.bernard@email.com',
        rating: 4.8
      }
    },
    {
      id: 2,
      pickupTime: '15:45',
      pickup: 'Gare du Nord, Paris',
      dropoff: 'Tour Eiffel',
      distance: '5 km',
      duration: '15 min',
      price: '25€',
      passengers: 1,
      luggage: 1,
      vehicleType: 'Standard',
      paymentMethod: 'card',
      customer: {
        name: 'Lucas Petit',
        phone: '+33 6 98 76 54 32',
        email: 'lucas.petit@email.com',
        rating: 4.9
      }
    }
  ]);

  const [showChat, setShowChat] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const handleAcceptRide = (ride) => {
    navigate('/my-rides');
  };

  const handleRejectRide = (rideId) => {
    setRides(rides.filter(ride => ride.id !== rideId));
  };

  const getPaymentIcon = (method) => {
    switch (method) {
      case 'card':
        return <FaCreditCard className="w-5 h-5" />;
      case 'cash':
        return <FaMoneyBill className="w-5 h-5" />;
      case 'paypal':
        return <FaPaypal className="w-5 h-5" />;
      default:
        return null;
    }
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
        <h1 className="text-2xl font-bold text-gray-900">Courses disponibles</h1>
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
            <div>
              <p className="font-semibold">{ride.pickupTime}</p>
              <p className="text-gray-600">{ride.pickup}</p>
              <p className="text-gray-600">{ride.dropoff}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-green-600">{ride.price}</p>
              <p className="text-sm text-gray-500">{ride.distance}</p>
              <p className="text-sm text-gray-500">{ride.duration}</p>
            </div>
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
            <div className="flex items-center">
              {getPaymentIcon(ride.paymentMethod)}
            </div>
          </div>

          {ride.flightNumber && (
            <div className="text-sm text-blue-600">
              Vol: {ride.flightNumber}
            </div>
          )}

          <div className="flex space-x-2">
            <button 
              onClick={() => handleAcceptRide(ride)}
              className="px-4 py-2 bg-green-600 text-white rounded-md flex-1 hover:bg-green-700"
            >
              Accepter
            </button>
            <button 
              onClick={() => handleRejectRide(ride.id)}
              className="px-4 py-2 bg-red-600 text-white rounded-md flex-1 hover:bg-red-700"
            >
              Refuser
            </button>
          </div>
        </div>
      ))}

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

export default NewRides;