import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { Autocomplete } from '@react-google-maps/api';
import { FaPlus, FaCalendarAlt, FaList, FaComments, FaTimes, FaMapMarkerAlt, FaUser, FaCar, FaMoneyBillWave, FaBuilding, FaSuitcase, FaPlane, FaTrain, FaBabyCarriage, FaChair, FaCreditCard, FaPaypal, FaMoneyBill, FaPhone, FaEnvelope } from 'react-icons/fa';

function Planning() {
  const [view, setView] = useState('timeGridWeek');
  const [showNewMissionModal, setShowNewMissionModal] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dispatchMode, setDispatchMode] = useState('all');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedIndividualDriver, setSelectedIndividualDriver] = useState('');

  const [pickupAutocomplete, setPickupAutocomplete] = useState(null);
  const [dropoffAutocomplete, setDropoffAutocomplete] = useState(null);

  const [newMission, setNewMission] = useState({
    dispatchType: 'immediate', // 'immediate' ou 'scheduled'
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    customer: {
      name: '',
      phone: '',
      email: ''
    },
    pickup: {
      address: ''
    },
    dropoff: {
      address: ''
    },
    passengers: 1,
    luggage: 0,
    vehicleType: '',
    paymentMethods: [],
    flightNumber: '',
    trainNumber: '',
    extras: {
      maxiCosi: 0,
      carSeat: 0,
      booster: 0
    },
    price: {
      total: '',
      vatRate: 10,
      commission: 30,
      netDriver: ''
    }
  });

  const companies = [
    { id: 1, name: 'FastTaxi SARL' },
    { id: 2, name: 'SpeedCab SAS' },
    { id: 3, name: 'Elite Transport' }
  ];

  const individualDrivers = [
    { id: 1, name: 'Jean Dupont', vehicle: 'Berline', rating: 4.8 },
    { id: 2, name: 'Marie Martin', vehicle: 'Van', rating: 4.9 },
    { id: 3, name: 'Pierre Durant', vehicle: 'Premium', rating: 4.7 }
  ];

  const vehicleTypes = [
    { id: 'standard', name: 'Standard', icon: <FaCar /> },
    { id: 'berline', name: 'Berline', icon: <FaCar /> },
    { id: 'van', name: 'Van', icon: <FaCar /> },
    { id: 'minibus', name: 'Mini Bus', icon: <FaCar /> },
    { id: 'firstclass', name: 'First Class', icon: <FaCar /> }
  ];

  const paymentMethods = [
    { id: 'cash', name: 'Espèces', icon: <FaMoneyBill /> },
    { id: 'card', name: 'Carte bancaire', icon: <FaCreditCard /> },
    { id: 'paypal', name: 'PayPal', icon: <FaPaypal /> },
    { id: 'transfer', name: 'Virement', icon: <FaMoneyBillWave /> }
  ];

  const handlePriceChange = (value) => {
    const total = parseFloat(value) || 0;
    const vatRate = parseFloat(newMission.price.vatRate) || 0;
    const commission = parseFloat(newMission.price.commission) || 0;
    const netDriver = total - commission;

    setNewMission(prev => ({
      ...prev,
      price: {
        ...prev.price,
        total: value,
        netDriver: netDriver.toFixed(2)
      }
    }));
  };

  const handleVatRateChange = (value) => {
    setNewMission(prev => ({
      ...prev,
      price: {
        ...prev.price,
        vatRate: value
      }
    }));
  };

  const handleCommissionChange = (value) => {
    const total = parseFloat(newMission.price.total) || 0;
    const commission = parseFloat(value) || 0;
    const netDriver = total - commission;

    setNewMission(prev => ({
      ...prev,
      price: {
        ...prev.price,
        commission: value,
        netDriver: netDriver.toFixed(2)
      }
    }));
  };

  const handlePaymentMethodToggle = (methodId) => {
    setNewMission(prev => {
      const methods = prev.paymentMethods.includes(methodId)
        ? prev.paymentMethods.filter(id => id !== methodId)
        : [...prev.paymentMethods, methodId];
      return { ...prev, paymentMethods: methods };
    });
  };

  const handleExtraChange = (type, value) => {
    setNewMission(prev => ({
      ...prev,
      extras: {
        ...prev.extras,
        [type]: parseInt(value) || 0
      }
    }));
  };

  const onPickupLoad = (autocomplete) => {
    setPickupAutocomplete(autocomplete);
  };

  const onDropoffLoad = (autocomplete) => {
    setDropoffAutocomplete(autocomplete);
  };

  const onPickupPlaceChanged = () => {
    if (pickupAutocomplete !== null) {
      const place = pickupAutocomplete.getPlace();
      setNewMission(prev => ({
        ...prev,
        pickup: {
          address: place.formatted_address || place.name
        }
      }));
    }
  };

  const onDropoffPlaceChanged = () => {
    if (dropoffAutocomplete !== null) {
      const place = dropoffAutocomplete.getPlace();
      setNewMission(prev => ({
        ...prev,
        dropoff: {
          address: place.formatted_address || place.name
        }
      }));
    }
  };

  const handleNewMissionSubmit = (e) => {
    e.preventDefault();
    
    // Si mode dispatch individuel avec chauffeur sélectionné, assigner automatiquement
    if (dispatchMode === 'individual' && selectedIndividualDriver) {
      const selectedDriver = individualDrivers.find(d => d.id === parseInt(selectedIndividualDriver));
      if (selectedDriver) {
        const missionWithDriver = {
          ...newMission,
          assignedDriver: selectedDriver,
          status: 'assigned',
          dispatchMode: 'individual'
        };
        console.log('Mission assignée automatiquement à:', selectedDriver.name, missionWithDriver);
        
        // Réinitialiser le formulaire
        setNewMission({
          date: '',
          time: '',
          customer: {
            name: '',
            phone: '',
            email: ''
          },
          pickup: {
            address: ''
          },
          dropoff: {
            address: ''
          },
          passengers: 1,
          luggage: 0,
          vehicleType: '',
          paymentMethods: [],
          flightNumber: '',
          trainNumber: '',
          extras: {
            maxiCosi: 0,
            carSeat: 0,
            booster: 0
          },
          price: {
            total: '',
            vatRate: 10,
            commission: 30,
            netDriver: ''
          }
        });
        setDispatchMode('all');
        setSelectedIndividualDriver('');
        
        alert(`Mission assignée automatiquement à ${selectedDriver.name} !`);
      }
    } else {
      console.log('New mission:', newMission);
    }
    
    setShowNewMissionModal(false);
  };

  const [events] = useState([
    {
      id: 1,
      title: 'Course - Sophie Bernard',
      start: '2024-02-28T14:30:00',
      end: '2024-02-28T15:30:00',
      backgroundColor: '#4F46E5',
      dispatchType: 'immediate',
      extendedProps: {
        driver: 'Jean Dupont',
        pickup: '15 Rue de la Paix, Paris',
        dropoff: 'Aéroport Charles de Gaulle',
        customer: {
          name: 'Sophie Bernard',
          phone: '+33 6 12 34 56 78',
          email: 'sophie.bernard@email.com'
        },
        passengers: 2,
        luggage: 3,
        vehicleType: 'Berline',
        flightNumber: 'AF1234',
        payment: {
          method: 'card',
          amount: '65€'
        },
        extras: {
          maxiCosi: 1,
          carSeat: 0,
          booster: 0
        }
      }
    },
    {
      id: 2,
      title: 'Course - Lucas Petit',
      start: '2024-02-28T15:45:00',
      end: '2024-02-28T16:15:00',
      backgroundColor: '#10B981',
      dispatchType: 'scheduled',
      extendedProps: {
        driver: 'Marie Martin',
        pickup: 'Gare du Nord',
        dropoff: 'Tour Eiffel',
        customer: {
          name: 'Lucas Petit',
          phone: '+33 6 98 76 54 32',
          email: 'lucas.petit@email.com'
        },
        passengers: 1,
        luggage: 1,
        vehicleType: 'Standard',
        trainNumber: '6123',
        payment: {
          method: 'paypal',
          amount: '25€'
        },
        extras: {
          maxiCosi: 0,
          carSeat: 0,
          booster: 0
        }
      }
    }
  ]);

  const [showEventDetails, setShowEventDetails] = useState(false);

  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
    setShowEventDetails(true);
  };

  const handleDeleteEvent = () => {
    setShowDeleteConfirm(false);
    setSelectedEvent(null);
  };

  const handleOpenChat = (driver) => {
    setSelectedDriver(driver);
    setShowChat(true);
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

  const sendMessage = () => {
    if (newMessage.trim()) {
      const translatedText = "Message traduit automatiquement";
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Planning</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowNewMissionModal(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <FaPlus className="mr-2" />
            Nouvelle mission
          </button>
        </div>
      </div>

      <div className="calendar-navigation flex space-x-4 mb-4">
        {/* Légende des couleurs */}
        <div className="flex items-center space-x-4 mr-8">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">En attente</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Assignée</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">En cours</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Terminée</span>
          </div>
        </div>
        
        <div className="view-buttons flex space-x-2">
          <button
            onClick={() => setView('dayGridMonth')}
            className={`px-4 py-2 rounded-lg ${
              view === 'dayGridMonth' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            <FaCalendarAlt className="mr-2 inline" />
            Mois
          </button>
          <button
            onClick={() => setView('timeGridWeek')}
            className={`px-4 py-2 rounded-lg ${
              view === 'timeGridWeek' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            <FaCalendarAlt className="mr-2 inline" />
            Semaine
          </button>
          <button
            onClick={() => setView('timeGridDay')}
            className={`px-4 py-2 rounded-lg ${
              view === 'timeGridDay' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            <FaCalendarAlt className="mr-2 inline" />
            Jour
          </button>
          <button
            onClick={() => setView('listWeek')}
            className={`px-4 py-2 rounded-lg ${
              view === 'listWeek' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            <FaList className="mr-2 inline" />
            Liste
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-4">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
          initialView={view}
          locale="fr"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: ''
          }}
          buttonText={{
            today: "Aujourd'hui",
            month: 'Mois',
            week: 'Semaine',
            day: 'Jour',
            list: 'Liste'
          }}
          slotMinTime="06:00:00"
          slotMaxTime="23:00:00"
          allDaySlot={false}
          nowIndicator={true}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          height="auto"
          events={events}
          eventClick={handleEventClick}
          eventContent={(eventInfo) => {
            const status = eventInfo.event.extendedProps.status;
            const statusText = status === 'pending' ? 'En attente' :
                             status === 'assigned' ? 'Assignée' :
                             status === 'in_progress' ? 'En cours' : 'Terminée';
            
            return (
              <div className="flex items-center justify-between w-full p-1">
                <div className="flex-1">
                  <div className="font-semibold">{eventInfo.event.title}</div>
                  <div className="text-sm">
                    {eventInfo.event.extendedProps.driver || 'Non assigné'}
                  </div>
                  <div className="text-xs opacity-75">
                    {statusText}
                  </div>
                </div>
                {eventInfo.event.extendedProps.driver && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenChat(eventInfo.event.extendedProps.driver);
                    }}
                    className="ml-2 text-white hover:text-gray-200"
                  >
                    <FaComments />
                  </button>
                )}
              </div>
            );
          }}
        />
      </div>

      {showEventDetails && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Détails de la course</h3>
              <button
                onClick={() => setShowEventDetails(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-3 flex items-center">
                  <FaUser className="mr-2" />
                  Informations client
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Nom</p>
                    <p className="font-medium">{selectedEvent.extendedProps.customer.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Téléphone</p>
                    <p className="font-medium flex items-center">
                      <FaPhone className="mr-1" />
                      {selectedEvent.extendedProps.customer.phone}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium flex items-center">
                      <FaEnvelope className="mr-1" />
                      {selectedEvent.extendedProps.customer.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-3 flex items-center">
                  <FaCar className="mr-2" />
                  Détails de la course
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Départ</p>
                    <p className="font-medium">{selectedEvent.extendedProps.pickup}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Arrivée</p>
                    <p className="font-medium">{selectedEvent.extendedProps.dropoff}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">
                      {new Date(selectedEvent.start).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Heure</p>
                    <p className="font-medium">
                      {new Date(selectedEvent.start).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Passagers et bagages</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <FaUser className="mr-2" />
                        Passagers
                      </span>
                      <span className="font-medium">{selectedEvent.extendedProps.passengers}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <FaSuitcase className="mr-2" />
                        Bagages
                      </span>
                      <span className="font-medium">{selectedEvent.extendedProps.luggage}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Paiement</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Mode de paiement</span>
                      <span className="font-medium flex items-center">
                        {selectedEvent.extendedProps.payment.method === 'card' && <FaCreditCard className="mr-1" />}
                        {selectedEvent.extendedProps.payment.method === 'paypal' && <FaPaypal className="mr-1" />}
                        {selectedEvent.extendedProps.payment.method === 'cash' && <FaMoneyBill className="mr-1" />}
                        {selectedEvent.extendedProps.payment.method}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Montant</span>
                      <span className="font-medium">{selectedEvent.extendedProps.payment.amount}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {(selectedEvent.extendedProps.flightNumber || selectedEvent.extendedProps.trainNumber) && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-3">Transport</h4>
                    {selectedEvent.extendedProps.flightNumber && (
                      <div className="flex items-center space-x-2">
                        <FaPlane />
                        <span>Vol: {selectedEvent.extendedProps.flightNumber}</span>
                      </div>
                    )}
                    {selectedEvent.extendedProps.trainNumber && (
                      <div className="flex items-center space-x-2">
                        <FaTrain />
                        <span>Train: {selectedEvent.extendedProps.trainNumber}</span>
                      </div>
                    )}
                  </div>
                )}

                {(selectedEvent.extendedProps.extras.maxiCosi > 0 ||
                  selectedEvent.extendedProps.extras.carSeat > 0 ||
                  selectedEvent.extendedProps.extras.booster > 0) && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-3">Extras</h4>
                    <div className="space-y-2">
                      {selectedEvent.extendedProps.extras.maxiCosi > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="flex items-center">
                            <FaBabyCarriage className="mr-2" />
                            Maxi-Cosi
                          </span>
                          <span>{selectedEvent.extendedProps.extras.maxiCosi}</span>
                        </div>
                      )}
                      {selectedEvent.extendedProps.extras.carSeat > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="flex items-center">
                            <FaChair className="mr-2" />
                            Siège auto
                          </span>
                          <span>{selectedEvent.extendedProps.extras.carSeat}</span>
                        </div>
                      )}
                      {selectedEvent.extendedProps.extras.booster > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="flex items-center">
                            <FaChair className="mr-2" />
                            Rehausseur
                          </span>
                          <span>{selectedEvent.extendedProps.extras.booster}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => handleOpenChat(selectedEvent.extendedProps.driver)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
                >
                  <FaComments className="mr-2" />
                  Chat avec le chauffeur
                </button>
                <button
                  onClick={() => setShowEventDetails(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showNewMissionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Nouvelle mission</h3>
              <button
                onClick={() => setShowNewMissionModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleNewMissionSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    <FaMapMarkerAlt className="inline mr-2" />
                    Adresse de départ
                  </label>
                  <Autocomplete
                    onLoad={onPickupLoad}
                    onPlaceChanged={onPickupPlaceChanged}
                  >
                    <input
                      type="text"
                      value={newMission.pickup.address}
                      onChange={(e) => setNewMission({
                        ...newMission,
                        pickup: { address: e.target.value }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Entrez l'adresse de départ"
                      required
                    />
                  </Autocomplete>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    <FaMapMarkerAlt className="inline mr-2" />
                    Adresse de destination
                  </label>
                  <Autocomplete
                    onLoad={onDropoffLoad}
                    onPlaceChanged={onDropoffPlaceChanged}
                  >
                    <input
                      type="text"
                      value={newMission.dropoff.address}
                      onChange={(e) => setNewMission({
                        ...newMission,
                        dropoff: { address: e.target.value }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Entrez l'adresse de destination"
                      required
                    />
                  </Autocomplete>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nom du client
                  </label>
                  <input
                    type="text"
                    value={newMission.customer.name}
                    onChange={(e) => setNewMission({
                      ...newMission,
                      customer: { ...newMission.customer, name: e.target.value }
                    })}
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
                    value={newMission.customer.phone}
                    onChange={(e) => setNewMission({
                      ...newMission,
                      customer: { ...newMission.customer, phone: e.target.value }
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newMission.customer.email}
                    onChange={(e) => setNewMission({
                      ...newMission,
                      customer: { ...newMission.customer, email: e.target.value }
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    value={newMission.date}
                    onChange={(e) => setNewMission({...newMission, date: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Heure</label>
                  <input
                    type="time"
                    value={newMission.time}
                    onChange={(e) => setNewMission({...newMission, time: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaUser className="inline mr-2" />
                    Nombre de passagers
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newMission.passengers}
                    onChange={(e) => setNewMission({...newMission, passengers: parseInt(e.target.value)})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaSuitcase className="inline mr-2" />
                    Nombre de bagages
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newMission.luggage}
                    onChange={(e) => setNewMission({...newMission, luggage: parseInt(e.target.value)})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type de véhicule</label>
                <div className="grid grid-cols-5 gap-2">
                  {vehicleTypes.map(type => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setNewMission({...newMission, vehicleType: type.id})}
                      className={`p-2 rounded-lg flex flex-col items-center justify-center ${
                        newMission.vehicleType === type.id
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {type.icon}
                      <span className="mt-1 text-sm">{type.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mode(s) de paiement</label>
                <div className="grid grid-cols-4 gap-2">
                  {paymentMethods.map(method => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => handlePaymentMethodToggle(method.id)}
                      className={`p-2 rounded-lg flex flex-col items-center justify-center ${
                        newMission.paymentMethods.includes(method.id)
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {method.icon}
                      <span className="mt-1 text-sm">{method.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaPlane className="inline mr-2" />
                    Numéro de vol
                  </label>
                  <input
                    type="text"
                    value={newMission.flightNumber}
                    onChange={(e) => setNewMission({...newMission, flightNumber: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="ex: AF1234"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaTrain className="inline mr-2" />
                    Numéro de train
                  </label>
                  <input
                    type="text"
                    value={newMission.trainNumber}
                    onChange={(e) => setNewMission({...newMission, trainNumber: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="ex: 6123"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Extras</label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="flex items-center space-x-2 text-sm text-gray-700 mb-1">
                      <FaBabyCarriage className="inline" />
                      <span>Maxi-Cosi</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={newMission.extras.maxiCosi}
                      onChange={(e) => handleExtraChange('maxiCosi', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="flex items-center space-x-2 text-sm text-gray-700 mb-1">
                      <FaChair className="inline" />
                      <span>Siège auto</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={newMission.extras.carSeat}
                      onChange={(e) => handleExtraChange('carSeat', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="flex items-center space-x-2 text-sm text-gray-700 mb-1">
                      <FaChair className="inline" />
                      <span>Rehausseur</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={newMission.extras.booster}
                      onChange={(e) => handleExtraChange('booster', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Prix TTC</label>
                    <input
                      type="number"
                      value={newMission.price.total}
                      onChange={(e) => handlePriceChange(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">TVA (%)</label>
                    <input
                      type="number"
                      value={newMission.price.vatRate}
                      onChange={(e) => handleVatRateChange(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Commission</label>
                    <input
                      type="number"
                      value={newMission.price.commission}
                      onChange={(e) => handleCommissionChange(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Net chauffeur</label>
                    <input
                      type="text"
                      value={newMission.price.netDriver}
                      readOnly
                      className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Mode de dispatch</h4>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setDispatchMode('all')}
                    className={`flex-1 py-2 px-4 rounded-lg ${
                      dispatchMode === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    Tout le monde
                  </button>
                  <button
                    type="button"
                    onClick={() => setDispatchMode('company')}
                    className={`flex-1 py-2 px-4 rounded-lg ${
                      dispatchMode === 'company' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    Société
                  </button>
                  <button
                    type="button"
                    onClick={() => setDispatchMode('individual')}
                    className={`flex-1 py-2 px-4 rounded-lg ${
                      dispatchMode === 'individual' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    Chauffeur individuel
                  </button>
                </div>

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
                    value={selectedIndividualDriver}
                    onChange={(e) => setSelectedIndividualDriver(e.target.value)}
                    className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="">Sélectionner un chauffeur</option>
                    {individualDrivers.map(driver => (
                      <option key={driver.id} value={driver.id}>
                        {driver.name} - {driver.vehicle} (★{driver.rating})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowNewMissionModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-white rounded-lg hover:bg-opacity-90 ${
                    newMission.dispatchType === 'immediate' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : dispatchMode === 'individual' && selectedIndividualDriver
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {newMission.dispatchType === 'immediate' 
                    ? '⚡ Dispatcher immédiatement' 
                    : dispatchMode === 'individual' && selectedIndividualDriver
                      ? `👤 Assigner à ${individualDrivers.find(d => d.id === parseInt(selectedIndividualDriver))?.name}`
                      : '📅 Programmer la mission'
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteConfirm && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Supprimer la course</h3>
            <div className="space-y-4">
              <p>Êtes-vous sûr de vouloir supprimer cette course ?</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>Client:</strong> {selectedEvent.extendedProps.customer.name}</p>
                <p><strong>Chauffeur:</strong> {selectedEvent.extendedProps.driver}</p>
                <p><strong>Départ:</strong> {selectedEvent.extendedProps.pickup}</p>
                <p><strong>Arrivée:</strong> {selectedEvent.extendedProps.dropoff}</p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handleDeleteEvent}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Supprimer
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setSelectedEvent(null);
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showChat && selectedDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full h-[500px] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Chat avec {selectedDriver}</h3>
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
    </div>
  );
}

export default Planning;