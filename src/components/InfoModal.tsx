import React from 'react';
import { Modal, FormControl, Input, Button, Text } from 'native-base';
import { useTranslation } from 'react-i18next';

/**
 * @interface InfoModalProps
 * @description Represents the props for the InfoModal component.
 * @property {boolean} isOpen - Indicates if the modal is open.
 * @property {() => void} onClose - Callback function to close the modal.
 */
interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * @component InfoModal
 * @description The InfoModal component.
 * @param {InfoModalProps} props - The props for InfoModal component.
 * @returns {React.FC} A React functional component.
 */
const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        <Modal.Header>Info.</Modal.Header>
        <Modal.Body>
          <Text color={'orange.500'}>{t('noticeTxt')}</Text>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};

export default InfoModal;
