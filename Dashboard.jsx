import React, { useState } from 'react';
import { FaUser, FaCar, FaCalendarAlt, FaChartLine, FaRedoAlt, FaTimes, FaComments, FaMapMarkerAlt, FaPhone, FaClock } from 'react-icons/fa';

function Dashboard() {
  const [drivers] = useState([
    { 
      id: 1, 
      name: 'Jean Dupont',
      status: 'busy',
      type: 'berline',
      vehicle: 'Mercedes Classe E',
      plate: 'AB-123-CD',
      phone: '+33 6 12 34 56 78',
      rating: 4.8,
      location: { lat: 48.8584, lng: 2.2945, address: 'Champs-Élysées, Paris' },
      currentRide: {
        id: 1,
        customer: 'Sophie Bernard',
        pickup: '15 Rue de la Paix, Paris',
        dropoff: 'Aéroport Charles de Gaulle',
        startTime: '14:30',
        estimatedArrival: '15:15',
        progress: 65,
        phase: 'en_route_client' // 'en_route_client', 'client_a_bord', 'en_route_destination'
      }
    },
    { 
      id: 2, 
      name: 'Marie Martin',
      status: 'available',
      type: 'van',
      vehicle: 'Mercedes Classe V',
      plate: 'EF-456-GH',
      phone: '+33 6 98 76 54 32',
      rating: 4.9,
      location: { lat: 48.8731, lng: 2.2950, address: 'Arc de Triomphe, Paris' },
      currentRide: null
    },
    { 
      id: 3, 
      name: 'Pierre Laurent',
      status: 'busy',
      type: 'standard',
      vehicle: 'Peugeot 508',
      plate: 'IJ-789-KL',
      phone: '+33 6 11 22 33 44',
      rating: 4.7,
      location: { lat: 48.8600, lng: 2.3400, address: 'Gare du Nord, Paris' },
      currentRide: {
        id: 2,
        customer: 'Lucas Petit',
        pickup: 'Gare du Nord, Paris',
        dropoff: 'Tour Eiffel',
        startTime: '15:45',
        estimatedArrival: '16:05',
        progress: 30,
        phase: 'client_a_bord'
      }
    },
    { 
      id: 4, 
      name: 'Sophie Moreau',
      status: 'offline',
      type: 'berline',
      vehicle: 'BMW Série 5',
      plate: 'MN-012-OP',
      phone: '+33 6 55 66 77 88',
      rating: 4.6,
      location: { lat: 48.8566, lng: 2.3522, address: 'Châtelet, Paris' },
      currentRide: null
    }
  ]);

  const [missions, setMissions] = useState([
    {
      id: 1,
      date: '2024-02-28',
      time: '14:30',
      customer: 'Sophie Bernard',
      pickup: '15 Rue de la Paix, Paris',
      dropoff: 'Aéroport Charles de Gaulle',
      status: 'in_progress',
      driver: 'Jean Dupont',
      estimatedDuration: '45 min',
      price: '65€',
      dispatchType: 'immediate'
    },
    {
      id: 2,
      date: '2024-02-28',
      time: '15:45',
      customer: 'Lucas Petit',
      pickup: 'Gare du Nord, Paris',
      dropoff: 'Tour Eiffel',
      status: 'in_progress',
      driver: 'Pierre Laurent',
      estimatedDuration: '20 min',
      price: '25€',
      dispatchType: 'scheduled'
    },
    {
      id: 3,
      date: '2024-02-28',
      time: '16:30',
      customer: 'Emma Roux',
      pickup: 'Opéra, Paris',
      dropoff: 'Gare de Lyon',
      status: 'pending',
      driver: null,
      estimatedDuration: '25 min',
      price: '35€',
      dispatchType: 'scheduled'
    }
  ]);

  // Calculer les statistiques en temps réel
  const stats = {
    activeDrivers: drivers.filter(d => d.status !== 'offline').length,
    ongoingRides: drivers.filter(d => d.currentRide).length,
    waitingRides: missions.filter(m => m.status === 'pending').length,
    totalRevenue: missions.reduce((sum, m) => sum + parseFloat(m.price.replace('€', '')), 0)
  };

  const [showRedispatchModal, setShowRedispatchModal] = useState(false);
  const [selectedMission, setSelectedMission] = useState(null);
  const [showDriverDetails, setShowDriverDetails] = useState(false);
  const [selectedDriverDetails, setSelectedDriverDetails] = useState(null);
  const [dispatchMode, setDispatchMode] = useState('all');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedDriver, setSelectedDriver] = useState('');
  const [showConfirmRemove, setShowConfirmRemove] = useState(false);
  const [missionToRemove, setMissionToRemove] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [selectedDriverChat, setSelectedDriverChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showActiveDriversModal, setShowActiveDriversModal] = useState(false);
  const [showOngoingRidesModal, setShowOngoingRidesModal] = useState(false);
  const [showWaitingRidesModal, setShowWaitingRidesModal] = useState(false);
  const [showRevenueModal, setShowRevenueModal] = useState(false);

  const companies = [
    { id: 1, name: 'FastTaxi SARL' },
    { id: 2, name: 'SpeedCab SAS' },
    { id: 3, name: 'Elite Transport' }
  ];

  const individualDrivers = [
    { id: 1, name: 'Jean Dupont' },
    { id: 2, name: 'Marie Martin' },
    { id: 3, name: 'Pierre Durant' }
  ];

  const handleRedispatch = (mission) => {
    setSelectedMission(mission);
    setShowRedispatchModal(true);
  };

  const handleRedispatchSubmit = () => {
    // Logique de redispatch ici
    setShowRedispatchModal(false);
    setSelectedMission(null);
    setDispatchMode('all');
    setSelectedCompany('');
    setSelectedDriver('');
  };

  const handleRemoveDriver = (mission) => {
    setMissionToRemove(mission);
    setShowConfirmRemove(true);
  };

  const confirmRemoveDriver = () => {
    setMissions(missions.map(m => 
      m.id === missionToRemove.id 
        ? { ...m, status: 'pending', driver: null }
        : m
    ));
    setShowConfirmRemove(false);
    setMissionToRemove(null);
  };

  const handleOpenChat = (driver) => {
    setSelectedDriverChat(typeof driver === 'string' ? { name: driver } : driver);
    setShowChat(true);
    // Simuler le chargement des messages précédents
    setMessages([
      {
        id: 1,
        text: "Bonjour, je suis en route vers le client.",
        translated: "Hello, I'm on my way to the customer.",
        sender: 'driver',
        timestamp: new Date(Date.now() - 300000).toISOString()
      },
      {
        id: 2,
        text: "D'accord, le client est prévenu.",
        translated: "Okay, the customer has been notified.",
        sender: 'dispatcher',
        timestamp: new Date(Date.now() - 240000).toISOString()
      }
    ]);
  };

  const handleShowDriverDetails = (driver) => {
    setSelectedDriverDetails(driver);
    setShowDriverDetails(true);
  };

  const getPhaseText = (phase) => {
    switch (phase) {
      case 'en_route_client':
        return 'En route vers le client';
      case 'client_a_bord':
        return 'Client à bord';
      case 'en_route_destination':
        return 'En route vers la destination';
      default:
        return 'En cours';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'busy':
        return 'bg-blue-100 text-blue-800';
      case 'offline':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'available':
        return 'Disponible';
      case 'busy':
        return 'En course';
      case 'offline':
        return 'Hors ligne';
      default:
        return 'Inconnu';
    }
  };
  const sendMessage = () => {
    if (newMessage.trim()) {
      const translatedText = "Message traduit automatiquement"; // Simulation de traduction
      setMessages([...messages, {
        id: messages.length + 1,
        text: newMessage,
        translated: translatedText,
        sender: 'dispatcher',
        timestamp: new Date().toISOString()
      }]);
      setNewMessage('');
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button 
          onClick={() => setShowActiveDriversModal(true)}
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer text-left"
        >
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <FaUser className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Chauffeurs actifs</h3>
              <p className="text-2xl font-semibold text-green-600">{stats.activeDrivers}</p>
            </div>
          </div>
        </button>

        <button 
          onClick={() => setShowOngoingRidesModal(true)}
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer text-left"
        >
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <FaCar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Courses en cours</h3>
              <p className="text-2xl font-semibold text-blue-600">{stats.ongoingRides}</p>
            </div>
          </div>
        </button>

        <button 
          onClick={() => setShowWaitingRidesModal(true)}
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer text-left"
        >
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <FaCalendarAlt className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">En attente</h3>
              <p className="text-2xl font-semibold text-yellow-600">{stats.waitingRides}</p>
            </div>
          </div>
        </button>

        <button 
          onClick={() => setShowRevenueModal(true)}
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer text-left"
        >
          <div className="flex items-center">
            <div className="p-3 bg-indigo-100 rounded-full">
              <FaChartLine className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Revenus du jour</h3>
              <p className="text-2xl font-semibold text-indigo-600">{stats.totalRevenue.toFixed(0)}€</p>
            </div>
          </div>
        </button>
      </div>

      {/* Tableau des missions */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Missions</h2>
          <div className="mb-4 flex space-x-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
              En attente
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              En cours
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Terminée
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Heure
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Départ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Destination
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prix
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type dispatch
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {missions.map((mission) => (
                  <tr key={mission.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {mission.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {mission.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {mission.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {mission.pickup}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {mission.dropoff}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      {mission.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        mission.dispatchType === 'immediate' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {mission.dispatchType === 'immediate' ? '⚡ Immédiat' : '📅 Programmé'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {mission.status === 'in_progress' ? (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleRemoveDriver(mission)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            {mission.driver}
                          </button>
                          <button
                            onClick={() => handleOpenChat({ name: mission.driver })}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <FaComments className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          En attente
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleRedispatch(mission)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Redispatcher"
                      >
                        <FaRedoAlt className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Tableau des chauffeurs actifs */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Chauffeurs actifs</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chauffeur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Véhicule
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course actuelle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {drivers.map((driver) => (
                  <tr key={driver.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleShowDriverDetails(driver)}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-900"
                      >
                        {driver.name}
                      </button>
                      <div className="text-xs text-gray-500">★ {driver.rating}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{driver.vehicle}</div>
                      <div className="text-xs text-gray-500">{driver.plate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <FaMapMarkerAlt className="mr-1 text-gray-400" />
                        {driver.location.address}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${getStatusColor(driver.status)}`}>
                        <span className={`w-2 h-2 rounded-full mr-2 ${
                          driver.status === 'available' ? 'bg-green-500' :
                          driver.status === 'busy' ? 'bg-blue-500' :
                          'bg-gray-500'
                        }`}></span>
                        {getStatusText(driver.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {driver.currentRide ? (
                        <div className="space-y-1">
                          <div className="font-medium text-gray-900">{driver.currentRide.customer}</div>
                          <div className="text-xs text-gray-500">
                            {getPhaseText(driver.currentRide.phase)}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" 
                              style={{ width: `${driver.currentRide.progress}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500 flex items-center">
                            <FaClock className="mr-1" />
                            Arrivée prévue: {driver.currentRide.estimatedArrival}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">Aucune course</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleOpenChat(driver)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Chat"
                        >
                          <FaComments className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleShowDriverDetails(driver)}
                          className="text-gray-600 hover:text-gray-900"
                          title="Détails"
                        >
                          <FaUser className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Détails Chauffeur */}
      {showDriverDetails && selectedDriverDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                  <FaUser className="w-8 h-8 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{selectedDriverDetails.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedDriverDetails.status)}`}>
                      {getStatusText(selectedDriverDetails.status)}
                    </span>
                    <span className="text-yellow-500">★ {selectedDriverDetails.rating}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowDriverDetails(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Informations véhicule</h4>
                  <div className="space-y-2">
                    <p><span className="text-gray-500">Véhicule:</span> {selectedDriverDetails.vehicle}</p>
                    <p><span className="text-gray-500">Plaque:</span> {selectedDriverDetails.plate}</p>
                    <p><span className="text-gray-500">Type:</span> {selectedDriverDetails.type}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Contact</h4>
                  <div className="space-y-2">
                    <p className="flex items-center">
                      <FaPhone className="mr-2 text-gray-400" />
                      {selectedDriverDetails.phone}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Position actuelle</h4>
                  <div className="space-y-2">
                    <p className="flex items-center">
                      <FaMapMarkerAlt className="mr-2 text-gray-400" />
                      {selectedDriverDetails.location.address}
                    </p>
                    <p className="text-sm text-gray-500">
                      Lat: {selectedDriverDetails.location.lat.toFixed(4)}, 
                      Lng: {selectedDriverDetails.location.lng.toFixed(4)}
                    </p>
                  </div>
                </div>
                {selectedDriverDetails.currentRide && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Course en cours</h4>
                    <div className="bg-blue-50 p-3 rounded-lg space-y-2">
                      <p><span className="font-medium">Client:</span> {selectedDriverDetails.currentRide.customer}</p>
                      <p><span className="font-medium">Départ:</span> {selectedDriverDetails.currentRide.pickup}</p>
                      <p><span className="font-medium">Arrivée:</span> {selectedDriverDetails.currentRide.dropoff}</p>
                      <p><span className="font-medium">Phase:</span> {getPhaseText(selectedDriverDetails.currentRide.phase)}</p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Progression</span>
                          <span>{selectedDriverDetails.currentRide.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${selectedDriverDetails.currentRide.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <p className="text-sm flex items-center">
                        <FaClock className="mr-1" />
                        Arrivée prévue: {selectedDriverDetails.currentRide.estimatedArrival}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => handleOpenChat(selectedDriverDetails)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
              >
                <FaComments className="mr-2" />
                Ouvrir le chat
              </button>
              <button
                onClick={() => setShowDriverDetails(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal de redispatch */}
      {showRedispatchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Mode de dispatch</h3>
            <div className="space-y-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="all"
                  checked={dispatchMode === 'all'}
                  onChange={(e) => setDispatchMode(e.target.value)}
                  className="form-radio"
                />
                <span>Tout le monde</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="company"
                  checked={dispatchMode === 'company'}
                  onChange={(e) => setDispatchMode(e.target.value)}
                  className="form-radio"
                />
                <span>Société</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="individual"
                  checked={dispatchMode === 'individual'}
                  onChange={(e) => setDispatchMode(e.target.value)}
                  className="form-radio"
                />
                <span>Chauffeur individuel</span>
              </label>

              {dispatchMode === 'company' && (
                <select
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Sélectionner une société</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>{company.name}</option>
                  ))}
                </select>
              )}

              {dispatchMode === 'individual' && (
                <select
                  value={selectedDriver}
                  onChange={(e) => setSelectedDriver(e.target.value)}
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Sélectionner un chauffeur</option>
                  {individualDrivers.map(driver => (
                    <option key={driver.id} value={driver.id}>{driver.name}</option>
                  ))}
                </select>
              )}

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setShowRedispatchModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleRedispatchSubmit}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {showConfirmRemove && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirmer la suppression</h3>
            <p className="mb-6">
              Êtes-vous sûr de vouloir retirer {missionToRemove?.driver} de cette mission ?
            </p>
            <div className="flex space-x-4">
              <button
                onClick={confirmRemoveDriver}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Confirmer
              </button>
              <button
                onClick={() => {
                  setShowConfirmRemove(false);
                  setMissionToRemove(null);
                }}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de chat */}
      {showChat && selectedDriverChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full h-[500px] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Chat avec {selectedDriverChat.name || 'Chauffeur'}</h3>
              <button onClick={() => setShowChat(false)} className="text-gray-500">
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`space-y-1 ${
                    msg.sender === 'dispatcher' ? 'ml-auto' : ''
                  }`}
                >
                  <div
                    className={`p-3 rounded-lg max-w-[80%] ${
                      msg.sender === 'dispatcher'
                        ? 'bg-indigo-600 text-white ml-auto'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <p className="text-xs opacity-75">{formatTimestamp(msg.timestamp)}</p>
                  </div>
                  <div
                    className={`p-2 rounded-lg text-sm ${
                      msg.sender === 'dispatcher'
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

      {/* Modal Chauffeurs Actifs */}
      {showActiveDriversModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Chauffeurs actifs ({stats.activeDrivers})</h3>
              <button
                onClick={() => setShowActiveDriversModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {drivers.filter(d => d.status !== 'offline').map((driver) => (
                <div key={driver.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold">{driver.name}</h4>
                      <p className="text-sm text-gray-500">{driver.vehicle}</p>
                      <p className="text-xs text-gray-400">{driver.plate}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(driver.status)}`}>
                      {getStatusText(driver.status)}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="mr-1" />
                      {driver.location.address}
                    </div>
                  </div>

                  {driver.currentRide && (
                    <div className="bg-blue-50 p-3 rounded-lg mb-3">
                      <p className="font-medium text-sm">{driver.currentRide.customer}</p>
                      <p className="text-xs text-gray-600">{getPhaseText(driver.currentRide.phase)}</p>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                        <div 
                          className="bg-blue-600 h-1.5 rounded-full" 
                          style={{ width: `${driver.currentRide.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleOpenChat(driver)}
                      className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
                    >
                      <FaComments className="mr-1" />
                      Chat
                    </button>
                    <button
                      onClick={() => handleShowDriverDetails(driver)}
                      className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
                    >
                      Détails
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal Courses en Cours */}
      {showOngoingRidesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Courses en cours ({stats.ongoingRides})</h3>
              <button
                onClick={() => setShowOngoingRidesModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {drivers.filter(d => d.currentRide).map((driver) => (
                <div key={driver.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold text-lg">{driver.currentRide.customer}</h4>
                      <p className="text-sm text-gray-600">Chauffeur: {driver.name}</p>
                      <p className="text-xs text-gray-500">{driver.vehicle} - {driver.plate}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Départ: {driver.currentRide.startTime}</p>
                      <p className="text-sm text-gray-500">Arrivée prévue: {driver.currentRide.estimatedArrival}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Départ</p>
                      <p className="font-medium">{driver.currentRide.pickup}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Destination</p>
                      <p className="font-medium">{driver.currentRide.dropoff}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>{getPhaseText(driver.currentRide.phase)}</span>
                      <span>{driver.currentRide.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${driver.currentRide.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        handleOpenChat(driver);
                        setShowOngoingRidesModal(false);
                      }}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
                    >
                      <FaComments className="mr-2" />
                      Chat
                    </button>
                    <button
                      onClick={() => {
                        handleShowDriverDetails(driver);
                        setShowOngoingRidesModal(false);
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center"
                    >
                      <FaUser className="mr-2" />
                      Détails
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal Missions en Attente */}
      {showWaitingRidesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Missions en attente ({stats.waitingRides})</h3>
              <button
                onClick={() => setShowWaitingRidesModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {missions.filter(m => m.status === 'pending').map((mission) => (
                <div key={mission.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold text-lg">{mission.customer}</h4>
                      <p className="text-sm text-gray-600">{mission.date} à {mission.time}</p>
                      <p className="text-sm font-medium text-green-600">{mission.price}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                      En attente
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Départ</p>
                      <p className="font-medium">{mission.pickup}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Destination</p>
                      <p className="font-medium">{mission.dropoff}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">Durée estimée: {mission.estimatedDuration}</p>
                    <button
                      onClick={() => {
                        handleRedispatch(mission);
                        setShowWaitingRidesModal(false);
                      }}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
                    >
                      <FaRedoAlt className="mr-2" />
                      Assigner
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal Revenus du Jour */}
      {showRevenueModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Revenus du jour</h3>
              <button
                onClick={() => setShowRevenueModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-indigo-600">{stats.totalRevenue.toFixed(0)}€</p>
                <p className="text-gray-500">Total des revenus aujourd'hui</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{missions.length}</p>
                  <p className="text-sm text-gray-500">Missions totales</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{stats.ongoingRides}</p>
                  <p className="text-sm text-gray-500">En cours</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">
                    {missions.filter(m => m.status === 'completed').length}
                  </p>
                  <p className="text-sm text-gray-500">Terminées</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Détail par mission</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {missions.map((mission) => (
                    <div key={mission.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{mission.customer}</p>
                        <p className="text-sm text-gray-500">{mission.time} - {mission.driver || 'Non assigné'}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600">{mission.price}</p>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          mission.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          mission.status === 'completed' ? 'bg-green-100 text-green-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {mission.status === 'in_progress' ? 'En cours' :
                           mission.status === 'completed' ? 'Terminée' : 'En attente'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;