import React, { useState } from 'react';
import { View } from 'react-native';
import { Modal, Button, FormControl, Input, Toast, } from 'native-base';
import { useTranslation } from 'react-i18next';


/**
 * @typedef {object} ChangePasswordModalProps
 * @property {boolean} isOpen - Indicates whether the Modal is open
 * @property {() => void} onClose - Callback function to close the Modal
 * @property {(oldPassword: string, newPassword: string) => void} updatePassword - Callback function to update password
 */

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  updatePassword: (oldPassword: string, newPassword: string) => void;
}

/**
 * Component that handles password changes with Modal dialog.
 *
 * @param {ChangePasswordModalProps} props - The props for the component.
 * @returns {JSX.Element}
 */

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  updatePassword,
}) => {

    /**
   * @property {string} oldPassword - The password input state.
   * @property {string} newPassword - The new password input state.
   * @property {string} newPasswordAgain - The new password again input state.
   */
  
  const { t } = useTranslation();
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [newPasswordAgain, setNewPasswordAgain] = useState<string>('');
  /**
   * Function to handle password updates.
   * @returns {Promise}
   */
  const handleUpdatePassword = async () => {
    if (newPassword === '') {
      Toast.show({
        title: 'Error',
        variant: "subtle",
        description: 'Please enter new password'
      });
    } else if (newPassword !== newPasswordAgain) {
      Toast.show({
        title: 'Error',
        variant: "subtle",
        description: "Passwords don't match"
      });
    } else {
    try {
      await updatePassword(oldPassword, newPassword);
      Toast.show({
        title: 'Success',
        variant: "subtle",
        description: "Password changed succesfully",
        duration: 4000,
      });
      onClose();
    } catch (error) {
      console.error('Error while updating password:', error);
      let errorMessage = 'Error while updating password';
      if (error && error.message) {
        errorMessage = error.message;
      }
  
      Toast.show({
        title: 'Error',
        variant: 'subtle',
        description: errorMessage,
        duration: 4000,
      });
    }
    }
  };

  return (
    <View>
      <Modal isOpen={isOpen} onClose={onClose}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>{t('changePassword')}</Modal.Header>
            <Modal.Body>
          <FormControl>
            <FormControl.Label>{t('oldPassword')}</FormControl.Label>
            <Input value={oldPassword} onChangeText={(text) => setOldPassword(text)} />
          </FormControl>
          <FormControl>
            <FormControl.Label>{t('newPassword')}</FormControl.Label>
            <Input value={newPassword} onChangeText={(text) => setNewPassword(text)} />
          </FormControl>
          <FormControl>
            <FormControl.Label>{t('newPasswordAgain')}</FormControl.Label>
            <Input value={newPasswordAgain} onChangeText={(text) => setNewPasswordAgain(text)} />
          </FormControl>
        </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button variant="ghost" onPress={onClose} colorScheme="orange">
                Cancel
              </Button>
              <Button onPress={handleUpdatePassword} colorScheme="orange">Update</Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </View>
  );
};

export default ChangePasswordModal;
