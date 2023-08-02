import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Alert, TouchableOpacity, View, Keyboard } from 'react-native';
import { Button, Box, Text, Center, Select, CheckIcon } from 'native-base';
import { MaskedTextInput } from 'react-native-mask-text';
import styles from '../src/styles/style';
import { plasterOptions } from '../src/data/plasterMockData';
import api from '../service/api';
import { MaterialIcons } from '@expo/vector-icons';
import { fetchAndTransformLists, makeAuthenticatedRequest } from '../service/auth';
import { ShoppingList, ShoppingItem, HomeScreenNavigationProp } from '../src/types'
import ShoppingListSelect from '../src/components/ShoppingListSelect';
import { useUserContext } from '../service/UserContext';
import CreateListModal from '../src/components/CreateListModal';
import { useTranslation } from 'react-i18next';
import InfoModal from '../src/components/InfoModal';
import { BannerAd, BannerAdSize, useInterstitialAd, TestIds, } from 'react-native-google-mobile-ads';

/**
 * Plaster is a React functional component used for plaster calculations.
 * It provides UI to select plaster product, enter squaremeters,
 * perform calculation of plaster consumption and total consumption, and add the calculated amount to shopping lists.
 * Users can also create new shopping lists from this component.
 * @component
 */

const Plaster: React.FC = () => {

  /**
   * @typedef {Object} State
   * @property {boolean} showModal - State for managing visibility of the modal.
   * @property {boolean} showInfoModal - State for managing visibility of the modal.
   * @property {ShoppingItem[]} items - State for managing shopping items.
   * @property {ShoppingList[]} lists - State for managing shopping lists.
   * @property {string} brand - State for managing the selected plaster brand.
   * @property {string} squareMeters - State for managing the squareMeters to calculate adhesive consumption.
   * @property {string} adhesiveAmount - State for managing the total calculated plaster consumption.
   * @property {boolean} keyboardStatus - State for tracking visibility of the keyboard.
   */

  const { t } = useTranslation();
  const { currentListIndex, setCurrentListIndex } = useUserContext();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [brand, setBrand] = useState<string>(plasterOptions[0].value);
  const [squareMeters, setSquareMeters] = useState<string>('');
  const [plasterAmount, setPlasterAmount] = useState<string>('');
  const [thickness, setThickness] = useState<string>('');
  const [keyboardStatus, setKeyboardStatus] = React.useState(false);

  /**
   * Navigate to the ShoppingList screen.
   */
  const navigateToShoppingList = () => {
    navigation.navigate('ShoppingList');
  };

  const selectedOption = plasterOptions.find(
    (option) => option.value === brand
  );
  const consumption = selectedOption ? selectedOption.consumption : 0;

  /**
   * Calculate the consumption of plaster and total consumption based on the user's input.
   */
  const calculateConsumption = () => {
    const sqm = parseFloat(squareMeters);
    const result = consumption * sqm * (parseFloat(thickness));
    setPlasterAmount(result.toFixed(2));
  };

  /**
   * Fetch the shopping lists from the server.
   */
  const fetchLists = async () => {
    try {
      const transformedLists = await fetchAndTransformLists();
      setLists(transformedLists);
    } catch (error) {
      console.error('Error while fetching lists:', error);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);
  
  useEffect(() => {
    if (lists.length > 0) {
      setItems(lists[currentListIndex]?.items || []);
    }
  }, [lists, currentListIndex]);
  
  useEffect(() => {
    if (lists.length > 0) {
      setItems(lists[currentListIndex]?.items || []);
    }
  }, [lists, currentListIndex]);

  /**
   * Create a new shopping list with the given title.
   * @param {string} title - The title of the new shopping list.
   */
  const createNewList = async (title: string) => {
    try {
      const newList = {
        title,
        items: [],
      };
      const response = await makeAuthenticatedRequest(`${api.lists}`, 'POST', newList);
      const createdList = response.data;
      setLists([...lists, createdList]);
      setCurrentListIndex((lists.length).toString());
      fetchLists();
    } catch (error) {
      console.error('Error creating new list:', error);
    }
  };

  /**
   * Add a new shopping item to the current shopping list.
   * If no shopping list is selected, it prompts the user to create a new one.
   */
  const addButtonPressed = async () => {
    if (lists.length === 0) {
      setShowModal(true);
      return;
    }
    const newItem: Omit<ShoppingItem, '_id'> = {
      amount: 0,
      content: {
        name: `${brand}`,
        amount: parseFloat(plasterAmount),
        unit: 'kg',
      },
    };
    try {
      const response = await makeAuthenticatedRequest(
        `${api.lists}/${lists[currentListIndex]?._id}/items`,
        'POST',
        { content: newItem.content }
      );
      const message = `${newItem.content.name} ${newItem.content.amount} ${t('kgToList')}`;

      Alert.alert(message, t('toList'), [
        {
          text: t('no'),
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        { text: t('yes'), onPress: () => navigateToShoppingList() }
      ]);
    } catch (error) {
      console.error('Error adding item to the list:', error);
    }
  };

  /**
   * Ad unit ID for banner ads.
   * Uses test ID in development mode and actual ID in production mode.
   * @type {string}
   */
  const bannerAdUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-1024020746297755/9369623631';

  /**
   * Ad unit ID for interstitial ads.
   * Uses test ID in development mode and actual ID in production mode.
   * @type {string}
   */
  const interstitialAdUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-1024020746297755/2979329311';

  /**
   * Hooks and functions for handling interstitial ads.
   * @type {Object}
   */
  const { isLoaded, isClosed, load, show } = useInterstitialAd(interstitialAdUnitId, {
    requestNonPersonalizedAdsOnly: true,
  });

  /**
   * Load ad when the component mounts
   */
  useEffect(() => {
    load();
  }, [load]);

  /**
   * Reload ad each time it's closed and show modal
   */
  useEffect(() => {
    if (isClosed) {
      load();
      setShowModal(true);
    }
  }, [isClosed, load]);

  /**
   * Function to handle button press.
   * If lists have more than 0 items and ad is loaded, show ad.
   * Otherwise, show modal.
   */
  const handleButtonPress = () => {
      /*
      Disable this add for now
      if (lists.length > 0) {
        if (isLoaded) {
          show();
        }
      } else {
        setShowModal(true);
      }
      */
      setShowModal(true)
  };

  /**
   * Listener for keyboard show/hide events.
   */
  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardStatus(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardStatus(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <Center w="100%" flex={1} px="3" background="#fafafa">
            {!keyboardStatus && 
        <View style={{position: 'absolute', bottom: 0, width: '100%'}}>
          <BannerAd
            unitId={bannerAdUnitId}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
          />
        </View>
      }
      <Box safeArea p="2" py="8" w="90%" maxW="290" h="75%">
        <Text color="#fafafa">{t('plasterCalc')}</Text>
        <Select
          bg="white"
          selectedValue={brand}
          minWidth="200"
          accessibilityLabel={t('productLabel')}
          placeholder={t('productLabel')}
          _selectedItem={{
            bg: 'orange.500',
            endIcon: <CheckIcon size="5" />
          }}
          mt={1}
          onValueChange={(itemValue) => setBrand(itemValue)}
        >
          {plasterOptions.map((option) => (
            <Select.Item
              key={option.value}
              label={option.label}
              value={option.value}
            />
          ))}
        </Select>
        <Text mt="2" mb="2" color="#fafafa">
        {t('areInput')}
        </Text>
        <MaskedTextInput
          style={styles.input}
          mask="9999"
          onChangeText={(text) => setSquareMeters(text)}
          value={squareMeters}
          keyboardType="numeric"
          placeholder={t('areInput')}
        />
        <MaskedTextInput
          style={styles.input}
          mask="9999"
          onChangeText={(text) => setThickness(text)}
          value={thickness}
          keyboardType="numeric"
          placeholder='mm'
        />
        <Button
          colorScheme="orange"
          _text={{ fontSize: 'xl', fontWeight: 'bold' }}
          mt="2" mb="1"
          onPress={calculateConsumption}
        >
          {t('calc')}
        </Button>
        {plasterAmount !== '' && (
          <Text mt="2" color="#fafafa">
            {t('plasterAmount')} {plasterAmount} kg
          </Text>
        )}
        <ShoppingListSelect
          lists={lists}
          currentListIndex={currentListIndex}
          setCurrentListIndex={setCurrentListIndex}
        />
        <Button.Group>
            <Button onPress={addButtonPressed}
          colorScheme="orange"
          mt="2" flex={1}>
            {t('addToList')}
            </Button>
            <Button
              onPress={handleButtonPress} colorScheme="orange"
               mt="2" flex={1}
            >
              {t('newList')}
            </Button>
          </Button.Group>
      </Box>
      <Box
        w="100%"
        position="absolute"
        height="90%"
        bottom="0"
        background="#242424"
        opacity="100"
        roundedTopLeft="20"
        zIndex="-10"
      >
        <TouchableOpacity onPress={() => setShowInfoModal(true)}>
          <Box position="absolute" top={1} right={1} p={2}>
            <MaterialIcons name="info-outline" size={24} color="orange" />
          </Box>
        </TouchableOpacity>
      </Box>
        <CreateListModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        createNewList={createNewList}
      />
      <InfoModal 
      isOpen={showInfoModal}
      onClose={() => setShowInfoModal(false)}
      />
    </Center>
  );
};

export default Plaster;
