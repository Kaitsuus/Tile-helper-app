import React, {useState, useEffect} from 'react';
import {Modal, Button, Spinner} from 'native-base';

/**
 * @typedef {object} ReadTermsModalProps
 * @property {boolean} isOpen - Indicates whether the Modal is open
 * @property {() => void} onClose - Callback function to close the Modal
 * @property {() => void} onReject - Callback function when the user rejects the terms
 */


interface ReadTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReject: () => void;
}

/**
 * Component that displays terms and conditions in a Modal dialog.
 *
 * @param {TermsModalProps} props - The props for the component.
 * @returns {JSX.Element}
 */

const ReadTermsModal: React.FC<ReadTermsModalProps> = ({
  isOpen,
  onClose,
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

  const handleReject = () => {
    onReject();
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
              Close
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default ReadTermsModal;
