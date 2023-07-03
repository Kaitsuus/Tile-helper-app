import React from 'react';
import { debounce } from 'lodash';
import { Modal, FormControl, Input, Button } from 'native-base';

/**
 * @interface CreateListModalProps
 * @description Represents the props for the CreateListModal component.
 * @property {boolean} isOpen - Indicates if the modal is open.
 * @property {() => void} onClose - Callback function to close the modal.
 * @property {(title: string) => void} createNewList - Callback function to create a new list.
 */
interface CreateListModalProps {
  isOpen: boolean;
  onClose: () => void;
  createNewList: (title: string) => void;
}

/**
 * @component CreateListModal
 * @description The CreateListModal component.
 * @param {CreateListModalProps} props - The props for CreateListModal component.
 * @returns {React.FC} A React functional component.
 */
const CreateListModal: React.FC<CreateListModalProps> = ({ isOpen, onClose, createNewList }) => {
  const [newListName, setNewListName] = React.useState('');

  // Debounced version of createNewList function to avoid rapid consecutive calls
  const debouncedCreateNewList = React.useMemo(() => debounce(createNewList, 200), [createNewList]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        <Modal.Header>Create new list</Modal.Header>
        <Modal.Body>
          <FormControl>
            <FormControl.Label>List Name</FormControl.Label>
            <Input value={newListName} onChangeText={(text) => setNewListName(text)} />
          </FormControl>
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button variant="ghost" onPress={onClose} colorScheme="orange">
              Cancel
            </Button>
            <Button
              onPress={() => {
                if (newListName.trim() !== '') {
                  debouncedCreateNewList(newListName.trim());
                  setNewListName('');
                  onClose();
                }
              }}
              colorScheme="orange"
            >
              Create
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default CreateListModal;
