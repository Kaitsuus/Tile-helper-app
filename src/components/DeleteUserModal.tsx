import React from 'react';
import { Modal, Button } from 'native-base';


interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  deleteUser: (userId: String) => void;
  userId: string;
}

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({ isOpen, onClose, deleteUser, userId }) => {

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
            <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        <Modal.Header>Delete account?</Modal.Header>
        <Modal.Footer>
          <Button.Group space={2}>
          <Button variant="ghost" onPress={onClose} colorScheme="orange">
              Cancel
            </Button>
            <Button
              onPress={async () => {
                await deleteUser(userId);
                onClose();
            }}
              colorScheme="orange"
            >
              Delete
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default DeleteUserModal;
