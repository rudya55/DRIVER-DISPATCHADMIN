import React, { useState } from 'react';
import { FaStar, FaCamera, FaEdit } from 'react-icons/fa';

function Profile() {
  const [profile] = useState({
    name: 'Jean Dupont',
    email: 'jean.dupont@email.com',
    phone: '+33 6 12 34 56 78',
    photo: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    rating: 4.8,
    totalRides: 1250,
    memberSince: 'Janvier 2023',
    comments: [
      {
        id: 1,
        dispatcher: 'Marie L.',
        date: '15 février 2024',
        rating: 5,
        comment: 'Excellent chauffeur, très professionnel et ponctuel.'
      },
      {
        id: 2,
        dispatcher: 'Thomas B.',
        date: '10 février 2024',
        rating: 4.5,
        comment: 'Bonne communication et service de qualité.'
      }
    ]
  });

  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // Logique de changement de mot de passe ici
    setIsEditingPassword(false);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* En-tête du profil */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <img
              src={profile.photo}
              alt="Photo de profil"
              className="w-32 h-32 rounded-full object-cover"
            />
            <button className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700">
              <FaCamera className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
              <button className="text-indigo-600 hover:text-indigo-700">
                <FaEdit className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-500">{profile.email}</p>
            <p className="text-gray-500">{profile.phone}</p>
            <div className="mt-2 flex items-center">
              <span className="text-yellow-400 flex items-center">
                {profile.rating} <FaStar className="ml-1" />
              </span>
              <span className="mx-2 text-gray-300">|</span>
              <span className="text-gray-600">{profile.totalRides} courses</span>
              <span className="mx-2 text-gray-300">|</span>
              <span className="text-gray-600">Membre depuis {profile.memberSince}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sécurité */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Sécurité</h2>
        {!isEditingPassword ? (
          <button
            onClick={() => setIsEditingPassword(true)}
            className="text-indigo-600 hover:text-indigo-700"
          >
            Changer le mot de passe
          </button>
        ) : (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mot de passe actuel
              </label>
              <input
                type="password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nouveau mot de passe
              </label>
              <input
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirmer le nouveau mot de passe
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Enregistrer
              </button>
              <button
                type="button"
                onClick={() => setIsEditingPassword(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Annuler
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Commentaires des dispatchers */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Commentaires des dispatchers</h2>
        <div className="space-y-4">
          {profile.comments.map((comment) => (
            <div key={comment.id} className="border-b pb-4 last:border-0 last:pb-0">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{comment.dispatcher}</p>
                  <p className="text-sm text-gray-500">{comment.date}</p>
                </div>
                <div className="flex items-center text-yellow-400">
                  {comment.rating}
                  <FaStar className="ml-1" />
                </div>
              </div>
              <p className="mt-2 text-gray-600">{comment.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Profile;