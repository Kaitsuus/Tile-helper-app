import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import { Modal, Button, FormControl, Input } from 'native-base';


interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  updatePassword: (oldPassword: string, newPassword: string) => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  updatePassword,
}) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleUpdatePassword = async () => {
    try {
      await updatePassword(oldPassword, newPassword);
      // REMEMBER TO ADD TOAST
      onClose();
    } catch (error) {
      console.error('Error while updating password:', error);
    }
  };

  return (
    <View>

      <Modal isOpen={isOpen} onClose={onClose}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Change Password</Modal.Header>
            <Modal.Body>
          <FormControl>
            <FormControl.Label>Old Password</FormControl.Label>
            <Input value={oldPassword} onChangeText={(text) => setOldPassword(text)} />
          </FormControl>
          <FormControl>
            <FormControl.Label>New Password</FormControl.Label>
            <Input value={newPassword} onChangeText={(text) => setNewPassword(text)} />
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
