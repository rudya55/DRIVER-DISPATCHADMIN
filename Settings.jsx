import React, { useState } from 'react';
import { FaKey, FaLock, FaMobile, FaQrcode, FaExclamationTriangle, FaBell } from 'react-icons/fa';

function Settings() {
  // Security State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showRecoveryCodesModal, setShowRecoveryCodesModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorMethod, setTwoFactorMethod] = useState('app'); // 'app' or 'sms'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [recoveryCodesGenerated, setRecoveryCodesGenerated] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Notifications State
  const [notifications, setNotifications] = useState({
    newRides: true,
    rideUpdates: true,
    messages: true,
    earnings: true,
    documents: true
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword === passwordForm.confirmPassword) {
      // Update password logic here
      setShowPasswordModal(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  };

  const handle2FASubmit = (e) => {
    e.preventDefault();
    // Verify 2FA setup and enable
    setTwoFactorEnabled(true);
    setShow2FAModal(false);
  };

  const generateRecoveryCodes = () => {
    // Generate recovery codes logic here
    setRecoveryCodesGenerated(true);
    setShowRecoveryCodesModal(true);
  };

  const handleNotificationChange = (setting) => {
    setNotifications(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmation === 'SUPPRIMER') {
      // Add account deletion logic here
      console.log('Account deleted');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Security Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Sécurité du compte</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Mot de passe</p>
              <p className="text-sm text-gray-500">Dernière modification il y a 3 mois</p>
            </div>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <FaKey className="inline-block mr-2" />
              Modifier
            </button>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Authentification à deux facteurs</p>
              <p className="text-sm text-gray-500">
                {twoFactorEnabled ? 'Activée' : 'Désactivée'}
              </p>
            </div>
            <button
              onClick={() => setShow2FAModal(true)}
              className={`px-4 py-2 ${
                twoFactorEnabled ? 'bg-green-600' : 'bg-indigo-600'
              } text-white rounded-lg hover:bg-opacity-90`}
            >
              <FaLock className="inline-block mr-2" />
              {twoFactorEnabled ? 'Configurer' : 'Activer'}
            </button>
          </div>

          {twoFactorEnabled && (
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Codes de récupération</p>
                <p className="text-sm text-gray-500">
                  {recoveryCodesGenerated ? 'Générés' : 'Non générés'}
                </p>
              </div>
              <button
                onClick={generateRecoveryCodes}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Générer nouveaux codes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Notifications Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Nouvelles courses</p>
              <p className="text-sm text-gray-500">Recevoir des notifications pour les nouvelles courses disponibles</p>
            </div>
            <button
              onClick={() => handleNotificationChange('newRides')}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                notifications.newRides ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out ${
                  notifications.newRides ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Mises à jour des courses</p>
              <p className="text-sm text-gray-500">Recevoir des notifications pour les modifications de courses</p>
            </div>
            <button
              onClick={() => handleNotificationChange('rideUpdates')}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                notifications.rideUpdates ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out ${
                  notifications.rideUpdates ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Messages</p>
              <p className="text-sm text-gray-500">Recevoir des notifications pour les nouveaux messages</p>
            </div>
            <button
              onClick={() => handleNotificationChange('messages')}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                notifications.messages ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out ${
                  notifications.messages ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Gains</p>
              <p className="text-sm text-gray-500">Recevoir des notifications pour les paiements</p>
            </div>
            <button
              onClick={() => handleNotificationChange('earnings')}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                notifications.earnings ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out ${
                  notifications.earnings ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Documents</p>
              <p className="text-sm text-gray-500">Recevoir des notifications pour les documents</p>
            </div>
            <button
              onClick={() => handleNotificationChange('documents')}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                notifications.documents ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out ${
                  notifications.documents ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Account Deletion Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center space-x-2 text-red-600">
          <FaExclamationTriangle className="w-6 h-6" />
          <h3 className="text-lg font-semibold">Supprimer le compte</h3>
        </div>
        <p className="mt-2 text-gray-600">
          Cette action est irréversible. Toutes vos données seront définitivement supprimées.
        </p>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Supprimer mon compte
        </button>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Modifier le mot de passe</h3>
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  required
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  required
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  required
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Enregistrer
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2FA Setup Modal */}
      {show2FAModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Configuration de l'authentification à deux facteurs</h3>
            <form onSubmit={handle2FASubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Méthode d'authentification
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="app"
                      checked={twoFactorMethod === 'app'}
                      onChange={(e) => setTwoFactorMethod(e.target.value)}
                      className="mr-2"
                    />
                    <FaQrcode className="mr-2" />
                    Application d'authentification
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="sms"
                      checked={twoFactorMethod === 'sms'}
                      onChange={(e) => setTwoFactorMethod(e.target.value)}
                      className="mr-2"
                    />
                    <FaMobile className="mr-2" />
                    SMS
                  </label>
                </div>
              </div>

              {twoFactorMethod === 'app' && (
                <div className="text-center">
                  <div className="bg-gray-100 p-4 rounded-lg mb-4">
                    {/* QR Code placeholder */}
                    <div className="w-48 h-48 mx-auto bg-white"></div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Scannez ce QR code avec votre application d'authentification
                  </p>
                </div>
              )}

              {twoFactorMethod === 'sms' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Numéro de téléphone
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Code de vérification
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  placeholder="123456"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Activer
                </button>
                <button
                  type="button"
                  onClick={() => setShow2FAModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Recovery Codes Modal */}
      {showRecoveryCodesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Codes de récupération</h3>
            <div className="bg-gray-100 p-4 rounded-lg mb-4">
              <p className="font-mono text-sm">
                1234-5678-9012-3456
                <br />
                2345-6789-0123-4567
                <br />
                3456-7890-1234-5678
                <br />
                4567-8901-2345-6789
                <br />
                5678-9012-3456-7890
              </p>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Conservez ces codes dans un endroit sûr. Ils vous permettront de récupérer l'accès à votre compte si vous perdez l'accès à votre méthode d'authentification à deux facteurs.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowRecoveryCodesModal(false)}
                className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                J'ai sauvegardé les codes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center space-x-2 text-red-600 mb-4">
              <FaExclamationTriangle className="w-6 h-6" />
              <h3 className="text-lg font-semibold">Supprimer le compte</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Cette action est irréversible. Pour confirmer la suppression, veuillez écrire "SUPPRIMER" ci-dessous.
            </p>
            <input
              type="text"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm mb-4"
              placeholder="Tapez SUPPRIMER"
            />
            <div className="flex space-x-4">
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmation !== 'SUPPRIMER'}
                className={`flex-1 px-4 py-2 rounded-md ${
                  deleteConfirmation === 'SUPPRIMER'
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Confirmer la suppression
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmation('');
                }}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;