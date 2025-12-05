// components/profile/SecuritySettings.tsx
import React, { useState } from 'react';
import { Shield, Key, Trash2, AlertTriangle, Eye } from 'lucide-react';
import useI18n from '../../hooks/useI18n';

interface SecuritySettingsProps {
  onChangePassword: () => void;
  onDeleteAccount: () => void;
  className?: string;
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({
  onChangePassword,
  onDeleteAccount,
  className = ''
}) => {
  const { t } = useI18n();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const handleDeleteAccount = () => {
    if (deleteConfirmText === 'DELETE') {
      onDeleteAccount();
      setShowDeleteConfirm(false);
      setDeleteConfirmText('');
    }
  };

  const SecurityItem = ({ 
    icon: Icon, 
    title, 
    description, 
    action, 
    actionText, 
    actionColor = 'blue',
    isDanger = false 
  }: {
    icon: any;
    title: string;
    description: string;
    action: () => void;
    actionText: string;
    actionColor?: string;
    isDanger?: boolean;
  }) => {
    const colorClasses = {
      blue: 'bg-blue-600 hover:bg-blue-700 text-white',
      red: 'bg-red-600 hover:bg-red-700 text-white',
      gray: 'bg-gray-200 hover:bg-gray-300 text-gray-700'
    };

    return (
      <div className={`flex items-center justify-between p-4 rounded-lg ${isDanger ? 'bg-red-50 border border-red-200' : 'bg-gray-50'}`}>
        <div className="flex items-start space-x-3">
          <div className={`p-2 rounded-lg ${isDanger ? 'bg-red-100' : 'bg-blue-100'}`}>
            <Icon className={`w-5 h-5 ${isDanger ? 'text-red-600' : 'text-blue-600'}`} />
          </div>
          <div>
            <h4 className={`font-medium ${isDanger ? 'text-red-800' : 'text-gray-900'}`}>
              {title}
            </h4>
            <p className={`text-sm ${isDanger ? 'text-red-600' : 'text-gray-600'} mt-1`}>
              {description}
            </p>
          </div>
        </div>
        <button
          onClick={action}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${colorClasses[actionColor as keyof typeof colorClasses]}`}
        >
          {actionText}
        </button>
      </div>
    );
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Shield className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            {t('components:profile.security_settings')}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-4 space-y-4">
        {/* Change Password */}
        <SecurityItem
          icon={Key}
          title={t('components:profile.password')}
          description={t('components:profile.password_description')}
          action={onChangePassword}
          actionText={t('components:profile.change_password')}
          actionColor="blue"
        />

        {/* Privacy Settings */}
        <SecurityItem
          icon={Eye}
          title={t('components:profile.privacy_settings')}
          description={t('components:profile.privacy_description')}
          action={() => {}} // À implémenter selon vos besoins
          actionText={t('components:profile.manage')}
          actionColor="gray"
        />

        {/* Two-Factor Authentication */}
        <SecurityItem
          icon={Shield}
          title={t('components:profile.two_factor_auth')}
          description={t('components:profile.two_factor_description')}
          action={() => {}} // À implémenter selon vos besoins
          actionText={t('components:profile.setup')}
          actionColor="blue"
        />
      </div>

      {/* Danger Zone */}
      <div className="px-6 py-4 border-t border-gray-200">
        <div className="mb-4">
          <h4 className="text-lg font-semibold text-red-800 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            {t('components:profile.danger_zone')}
          </h4>
          <p className="text-sm text-red-600 mt-1">
            {t('components:profile.danger_zone_description')}
          </p>
        </div>

        <SecurityItem
          icon={Trash2}
          title={t('components:profile.delete_account')}
          description={t('components:profile.delete_account_description')}
          action={() => setShowDeleteConfirm(true)}
          actionText={t('components:profile.delete')}
          actionColor="red"
          isDanger={true}
        />
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-red-800">
                {t('components:profile.confirm_delete')}
              </h3>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                {t('components:profile.delete_warning')}
              </p>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-red-800 font-medium mb-2">
                  {t('components:profile.delete_consequences')}
                </p>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• {t('components:profile.lose_access')}</li>
                  <li>• {t('components:profile.delete_data')}</li>
                  <li>• {t('components:profile.cannot_undo')}</li>
                </ul>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {t('components:profile.type_delete_confirm')}
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="DELETE"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== 'DELETE'}
                className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {t('components:profile.delete_account')}
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteConfirmText('');
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
              >
                {t('components:profile.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecuritySettings;