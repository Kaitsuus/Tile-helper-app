import React, {useState, useEffect} from 'react';
import {WebView} from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Modal, Button} from 'native-base';
import axios from 'axios';
import Markdown from 'markdown-to-jsx';

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

  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        const response = await fetch('https://raw.githubusercontent.com/<username>/<repository>/master/terms.md');  // replace <username> and <repository> with your GitHub account details
        const text = await response.text();
        setMdContent(text);
      } catch (err) {
        console.error(err);
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
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>Terms & Conditions</Modal.Header>
        <Modal.Body>
          <Markdown>
                {mdContent}
            </Markdown>
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button variant="ghost" onPress={handleReject}>
              Reject
            </Button>
            <Button onPress={handleAccept}>
              Accept
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default TermsModal;
