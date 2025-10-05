import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaChartBar, 
  FaCalendarAlt,
  FaCar,
  FaChartLine,
  FaFileInvoice,
  FaCog,
  FaSignOutAlt,
  FaUser,
  FaMapMarkerAlt,
  FaUsers,
  FaBuilding
} from 'react-icons/fa';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { 
      name: 'Tableau de bord',
      path: '/dashboard',
      icon: <FaChartBar />
    },
    { 
      name: 'Localisation',
      path: '/location',
      icon: <FaMapMarkerAlt />
    },
    { 
      name: 'Devis/Facture',
      path: '/invoices',
      icon: <FaFileInvoice />
    },
    { 
      name: 'Chauffeurs',
      path: '/drivers',
      icon: <FaUsers />
    },
    { 
      name: 'Sociétés',
      path: '/companies',
      icon: <FaBuilding />
    },
    { 
      name: 'Planning',
      path: '/planning',
      icon: <FaCalendarAlt />
    },
    { 
      name: 'Véhicules',
      path: '/vehicles',
      icon: <FaCar />
    },
    { 
      name: 'Analyses',
      path: '/analytics',
      icon: <FaChartLine />
    },
    { 
      name: 'Paramètres',
      path: '/settings',
      icon: <FaCog />
    }
  ];

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-50">
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold text-indigo-600">DriverDispatch</h1>
        <p className="text-sm text-gray-500">Gestionnaire de Flotte</p>
      </div>

      <div className="h-[calc(100vh-80px)] overflow-y-auto">
        <div className="p-4">
          <Link to="/profile" className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <FaUser className="text-indigo-600" />
            </div>
            <div>
              <p className="font-medium">Jean Dupont</p>
              <p className="text-sm text-gray-500">Gestionnaire</p>
            </div>
          </Link>

          <div className="space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-2 rounded-lg ${
                  location.pathname === item.path
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}

            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-2 w-full text-left text-red-600 hover:bg-red-50 rounded-lg mt-4"
            >
              <FaSignOutAlt />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;