import React from 'react';
import { Modal, Button } from 'native-base';

/**
 * @interface DeleteUserModalProps
 * @description Represents the props for the DeleteUserModal component.
 * @property {boolean} isOpen - Indicates if the modal is open.
 * @property {() => void} onClose - Callback function to close the modal.
 * @property {(userId: string) => void} deleteUser - Callback function to delete a user.
 * @property {string} userId - The ID of the user to delete.
 */
interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  deleteUser: (userId: string) => void;
  userId: string;
}

/**
 * @component DeleteUserModal
 * @description The DeleteUserModal component.
 * @param {DeleteUserModalProps} props - The props for DeleteUserModal component.
 * @returns {React.FC} A React functional component.
 */
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
