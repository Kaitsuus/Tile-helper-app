/**
 * @module ShoppingList
 * @description This module exports the ShoppingList component which is used to render the shopping list screen of the app.
 */

import React, { useState, useEffect, useRef } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View, Platform } from 'react-native';
import { Center, Box, Select, Button, CheckIcon, Modal, FormControl, Input } from 'native-base';
import { makeAuthenticatedRequest, deleteItemFromDB, deleteListFromDB, fetchAndTransformLists } from '../service/auth';
import api from '../service/api';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { ShoppingItem, EditingAmount } from '../src/types'
import ShoppingListSelect from '../src/components/ShoppingListSelect';
import { useUserContext } from '../service/UserContext';
import CreateListModal from '../src/components/CreateListModal';
import ListImage from '../src/components/ListImage';
import { useTranslation } from 'react-i18next';

/**
 * @typedef ShoppingList
 * @property {string} _id - The ID of the shopping list.
 * @property {string} title - The title of the shopping list.
 * @property {string} user - The user associated with the shopping list.
 * @property {ShoppingItem[]} items - The items in the shopping list.
 */

/**
 * @typedef {object} ShoppingItem
 * @property {string} _id - The ID of the shopping item.
 * @property {number} amount - The amount of the item.
 * @property {object} content - The content of the item.
 */

/**
 * @function ShoppingList
 * @description This is the functional component for the ShoppingList screen.
 * @returns {React.FC} A React functional component.
 */

interface ShoppingList {
  _id: string;
  title: string;
  user: string;
  items: ShoppingItem[];
}

const ShoppingList: React.FC = () => {

  /**
   * @typedef {Object} State
   * @property {number} currentListIndex - Index of the currently selected list.
   * @property {function} setCurrentListIndex - Function to change the value of currentListIndex.
   * @property {ShoppingList[]} lists - State variable that holds an array of ShoppingList objects.
   * @property {string} newListName - State variable to hold the name of a new list.
   * @property {string} newItemName - State variable to hold the name of a new item.
   * @property {number} newItemAmount - State variable to hold the amount of a new item.
   * @property {string} newItemUnit - State variable to hold the unit of a new item.
   * @property {EditingAmount|null} editingAmount - State variable to hold an object representing the amount currently being edited, or null if no amount is being edited.
   * @property {ShoppingItem[]} items - State variable that holds an array of ShoppingItem objects.
   * @property {boolean} showModal - State variable to control the visibility of a modal.
   * @property {Object} shoppingListRef - Ref to the shopping list.
   * @property {boolean} captureScreenshot - State variable to indicate if a screenshot should be captured.
   */

  const { t } = useTranslation();
  const { currentListIndex, setCurrentListIndex } = useUserContext();
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [newListName, setNewListName] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState<number>(0);
  const [newItemUnit, setNewItemUnit] = useState<string>('kpl');
  const [editingAmount, setEditingAmount] = useState<EditingAmount | null>(null);
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const shoppingListRef = useRef(null);
  const [captureScreenshot, setCaptureScreenshot] = useState(false);

  /**
   * @function fetchLists
   * @description Fetches the shopping lists from the server and updates the local state.
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
   * @function addItem
   * @description Adds a new item to the shopping list.
   */
  const addItem = async () => {
    if (lists.length === 0) {
      setShowModal(true);
      return;
    }
    const newItem: Omit<ShoppingItem, '_id'> = {
      amount: 0,
      content: {
        name: newItemName,
        amount: newItemAmount,
        unit: newItemUnit,
      },
    };
    try {
      const response = await makeAuthenticatedRequest(
        `${api.lists}/${lists[currentListIndex]?._id}/items`,
        'POST',
        { content: newItem.content }
      );
      const createdItem = response.data;
      const updatedLists = [...lists];
      updatedLists[currentListIndex].items.push(createdItem);

      setLists(updatedLists);
      setNewItemName('');
      setNewItemAmount(0);
      setNewItemUnit('kpl');
    } catch (error) {
      console.error('Error adding item to the list:', error);
    }
  };

  /**
   * @function deleteItem
   * @description Deletes an item from the shopping list.
   * @param {string} itemId - The ID of the item to be deleted.
   */
  const deleteItem = async (index: number) => {
    const itemToDelete = items[index];
    const itemId = itemToDelete._id;
    const listId = lists[currentListIndex]._id;

    try {
      await deleteItemFromDB(listId, itemId);
    } catch (error) {
      console.error('Error deleting item from the database:', error);
      return;
    }
    // Update the local state
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    const updatedLists = [...lists];
    updatedLists[currentListIndex].items = updatedItems;
  
    setLists(updatedLists);
  };

  /**
   * @function deleteList
   * @description Deletes the current shopping list.
   */
  const deleteList = async (listId: string) => {
    try {
      await deleteListFromDB(listId);
      const updatedLists = lists.filter((list) => list._id !== listId);
      setLists(updatedLists);
      setCurrentListIndex('0');
    } catch (error) {
      console.error('Error deleting list:', error);
    }
  };

  /**
   * @function updateAmount
   * @description Updates item amount.
   */
  const updateAmount = async (index: number, value: number) => {
    const updatedItems = [...items];
    const updatedContent = {
      ...updatedItems[index].content,
      amount: value,
    };
    updatedItems[index].content = updatedContent;
    const updatedLists = [...lists];
    updatedLists[currentListIndex].items = updatedItems;
  
    try {
      await makeAuthenticatedRequest(
        `${api.lists}/${lists[currentListIndex]._id}/items/${updatedItems[index]._id}`,
        'PUT',
        { content: updatedContent } // Update the request body to contain the entire updated content object
      );
      setLists(updatedLists);
    } catch (error) {
      console.error('Error updating item amount:', error);
    }
  };

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
   * Render a shopping item.
   *
   * @param {object} params - The parameters object.
   * @param {ShoppingItem} params.item - The shopping item to render.
   * @param {number} params.index - The index of the shopping item.
   * @returns {JSX.Element} - The rendered item component.
   */
  const renderItem = ({ item, index }: { item: ShoppingItem; index: number }) => {
    const content = item.content;
    
    return (
      <Box
        p={4}
        borderBottomWidth={1}
        borderBottomColor="gray"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text>{content.name}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TextInput
            value={editingAmount !== null && index === editingAmount.index ? editingAmount.value.toString() : content.amount.toString()}
            onChangeText={(text) => setEditingAmount({ index, value: Number(text) })}
            onBlur={() => {
              if (editingAmount !== null && index === editingAmount.index) {
                updateAmount(editingAmount.index, editingAmount.value);
                setEditingAmount(null);
              }
            }}
            keyboardType="numeric"
            style={{
              borderWidth: 1,
              borderColor: 'gray',
              borderRadius: 4,
              padding: 8,
              marginRight: 8,
              width: 60,
            }}
          />
          <Text>{content.unit}</Text>
          <TouchableOpacity onPress={() => deleteItem(index)}>
            <Text style={{ color: 'red', marginLeft: 10 }}>Delete</Text>
          </TouchableOpacity>
        </View>
      </Box>
    );
  };

  /**
   * Request permissions to access the media library on Android.
   *
   * @returns {Promise<void>} - A promise that resolves when the permissions are requested.
   */
  const requestMediaLibraryPermissions = async () => {
    if (Platform.OS === 'android') {
      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status === 'granted') {
        // Permission granted, you can proceed with saving or sharing the image
      } else {
        // Permission denied
      }
    }
  };

  /**
   * Handle the save image action.
   *
   * @returns {Promise<void>} - A promise that resolves when the image is saved.
   */
  const handleSaveImage = async () => {
    setCaptureScreenshot(true);
    await requestMediaLibraryPermissions();
  
    if (shoppingListRef.current) {
      setTimeout(async () => {
        try {
          const uri = await captureRef(shoppingListRef, {
            format: 'png',
          });
  
          const asset = await MediaLibrary.createAssetAsync(uri);
          await MediaLibrary.createAlbumAsync('Shopping Lists', asset, false);
  
          console.log('Shopping list image saved successfully.');
        } catch (error) {
          console.error('Error saving shopping list image:', error);
        } finally {
          setCaptureScreenshot(false);
        }
      }, 100);
    }
  };

  /**
   * Handle the share image action.
   *
   * @returns {Promise<void>} - A promise that resolves when the image is shared.
   */
  const handleShareImage = async () => {
    setCaptureScreenshot(true);
    await requestMediaLibraryPermissions();
    if (shoppingListRef.current) {
      setTimeout(async () => {
      try {
        const uri = await captureRef(shoppingListRef, {
          format: 'png',
        });

        if (!(await Sharing.isAvailableAsync())) {
          console.log('Sharing is not available on this device.');
          return;
        }

        await Sharing.shareAsync(uri);
      } catch (error) {
        console.error('Error sharing shopping list image:', error);
      } finally {
          setCaptureScreenshot(false);
      }
      }, 100);
    }
  };
  
  return (
    <Center w="100%" flex={1} px={3} background="#fafafa">
      <Modal isOpen={captureScreenshot}>
        <ListImage
          ref={shoppingListRef}
          lists={lists}
          currentListIndex={currentListIndex}
          items={items}
        />
      </Modal>
      <Box safeArea p={2} py={8} w="100%" h="80%">
      <ShoppingListSelect
          lists={lists}
          currentListIndex={currentListIndex}
          setCurrentListIndex={setCurrentListIndex}
        />
        <FlatList
          data={items}
          renderItem={({ item, index }) => renderItem({ item, index })}
          keyExtractor={(item) => item._id}
        />
        <Box flexDirection="row" alignItems="center" marginTop={4}>
          <TextInput
            value={newItemName}
            onChangeText={setNewItemName}
            placeholder={t('item')}
            style={{
              borderWidth: 1,
              borderColor: 'gray',
              borderRadius: 4,
              padding: 8,
              marginRight: 8,
              flex: 1,
            }}
          />
          <TextInput
            value={newItemAmount.toString()}
            onChangeText={(text) => setNewItemAmount(Number(text))}
            placeholder="Amount"
            keyboardType="numeric"
            style={{
              borderWidth: 1,
              borderColor: 'gray',
              borderRadius: 4,
              padding: 8,
              marginRight: 8,
              width: 60,
            }}
          />
          <Select
            selectedValue={newItemUnit}
            minWidth="90"
            onValueChange={(value) => setNewItemUnit(value)}
            placeholder="kpl"
            _selectedItem={{
              bg: 'orange.500',
              endIcon: <CheckIcon size={3} />
            }}
          >
            <Select.Item label="m²" value="m²" />
            <Select.Item label="kpl" value="kpl" />
            <Select.Item label="l" value="l" />
            <Select.Item label="pkt" value="pkt" />
            <Select.Item label="kg" value="kg" />
          </Select>

          <Button onPress={addItem} colorScheme="orange" marginLeft={2}>{t('add')}</Button>
        </Box>
      </Box>
      <Box
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 10,
          gap: 2
        }}
      >
        <Button colorScheme="orange" mt={2} w={20} onPress={handleSaveImage}>
        {t('save')}
        </Button>

        <Button colorScheme="orange" mt={2} w={20} onPress={handleShareImage}>
        {t('share')}
        </Button>
        <Button onPress={() => deleteList(lists[currentListIndex]._id)} colorScheme="orange" mt={2} w={20}>
        {t('delete')}
        </Button>
        <Button onPress={() => setShowModal(true)} colorScheme="orange" mt={2} w={20}>{t('new')}</Button>
      </Box>
      <CreateListModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        createNewList={createNewList}
      />
    </Center>
  );
};

export default ShoppingList;