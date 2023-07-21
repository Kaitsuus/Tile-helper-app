import React, { useState } from 'react';
import { View } from 'react-native';
import { Modal, Button, FormControl, Input, Toast, Spinner, HStack, Heading } from 'native-base';
import { useTranslation } from 'react-i18next';


/**
 * @typedef {object} RequestVerificationModalProps
 * @property {boolean} isOpen - Indicates whether the Modal is open
 * @property {() => void} onClose - Callback function to close the Modal
 * @property {(email: string) => void} requestVerification - Callback function to update password
 */

interface RequestVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestVerification: (email: string) => void;
}

/**
 * Component that handles password changes with Modal dialog.
 *
 * @param {ChangePasswordModalProps} props - The props for the component.
 * @returns {JSX.Element}
 */

const RequestVerification: React.FC<RequestVerificationModalProps> = ({
  isOpen,
  onClose,
  requestVerification,
}) => {

    /**
   * @property {string} email - The password input state.
   */
  
  const { t } = useTranslation();
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState(false);
  /**
   * Function to handle request verification link
   * @returns {Promise}
   */
  const handleRequestVerication = async () => {
    if (email === '') {
      Toast.show({
        title: 'Error',
        variant: "subtle",
        description: t('enterEmail')
      });
    } else {
    try {
      setLoading(true); // Set loading state to true when starting the login process
      await requestVerification(email);
      Toast.show({
        title: 'Success',
        variant: "subtle",
        description: `${t('LinkSentTo')} ${email}`,
        duration: 4000,
      });
      onClose();
    } catch (error) {
      let errorMessage = 'Error: ';
      if (error && error.message) {
        errorMessage = error.message;
      }
      Toast.show({
        title: 'Error',
        variant: 'subtle',
        description: errorMessage,
        duration: 4000,
      });
    } finally {
      setLoading(false); // Set loading state to false when process is done
    }
    } 
  };

  return (
    <View>
      <Modal isOpen={isOpen} onClose={onClose}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>{t('requestLink')}</Modal.Header>
            <Modal.Body>
            {loading && 
            <HStack space={8} justifyContent="center" alignItems="center" mb={2}>
            <Spinner accessibilityLabel="Loading" size={'lg'} color={"orange.400"}/>
            <Heading color="orange.400" fontSize="lg">
              Loading
            </Heading>
            </HStack>
            }
          <FormControl>
            <FormControl.Label>Email</FormControl.Label>
            <Input value={email} onChangeText={(text) => setEmail(text)} />
          </FormControl>
        </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button variant="ghost" onPress={onClose} colorScheme="orange">
                Cancel
              </Button>
              <Button onPress={handleRequestVerication} colorScheme="orange">Request</Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </View>
  );
};

export default RequestVerification;
