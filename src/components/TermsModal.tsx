import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Modal, Button, Spinner} from 'native-base';
import { BackHandler } from 'react-native';

/**
 * @typedef {object} TermsModalProps
 * @property {boolean} isOpen - Indicates whether the Modal is open
 * @property {() => void} onClose - Callback function to close the Modal
 * @property {() => void} onAccept - Callback function when the user accepts the terms
 * @property {() => void} onReject - Callback function when the user rejects the terms
 */


interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  onReject: () => void;
}

/**
 * Component that displays terms and conditions in a Modal dialog.
 *
 * @param {TermsModalProps} props - The props for the component.
 * @returns {JSX.Element}
 */

const TermsModal: React.FC<TermsModalProps> = ({
  isOpen,
  onClose,
  onAccept,
  onReject,
}) => {
  const [mdContent, setMdContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('https://raw.githubusercontent.com/Kaitsuus/Tile-helper-app/main/terms.md'); 
        const text = await response.text();
        setMdContent(text);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchMarkdown();
  }, []);

  const handleAccept = () => {
    AsyncStorage.setItem('accepted_terms', 'true')
      .then(() => {
        onAccept();
      })
      .catch((error) => {
        console.error('Error saving accepted terms:', error);
      });
  };

  const handleReject = () => {
    onReject();
    BackHandler.exitApp(); // Close the app when the user rejects
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>Terms & Conditions</Modal.Header>
        <Modal.Body>
          {isLoading ? (
            <Spinner />
          ) : (
            mdContent
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button variant="ghost" onPress={handleReject} colorScheme="orange">
              Reject
            </Button>
            <Button onPress={handleAccept} colorScheme="orange">
              Accept
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default TermsModal;
