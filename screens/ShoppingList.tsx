import React, { useState, useEffect } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Center, Box, Select, Button, CheckIcon, Modal, FormControl, Input } from 'native-base';
import { makeAuthenticatedRequest, deleteItemFromDB, deleteListFromDB, fetchAndTransformLists } from '../service/auth';
import api from '../service/api';
import { ShoppingItem, EditingAmount } from '../src/types'
import ShoppingListSelect from '../src/components/ShoppingListSelect';
import { useUserContext } from '../service/UserContext';

interface ShoppingList {
  _id: string;
  title: string;
  user: string;
  items: ShoppingItem[];
}


const ShoppingList: React.FC = () => {
  const { currentListIndex, setCurrentListIndex } = useUserContext();
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [newListName, setNewListName] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState<number>(0);
  const [newItemUnit, setNewItemUnit] = useState<string>('kpl');
  const [editingAmount, setEditingAmount] = useState<EditingAmount | null>(null);

  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const transformedLists = await fetchAndTransformLists();
        setLists(transformedLists);
      } catch (error) {
        console.error('Error while fetching lists:', error);
      }
    };
    fetchData();
  }, []);
  
  useEffect(() => {
    if (lists.length > 0) {
      setItems(lists[currentListIndex]?.items || []);
    }
  }, [lists, currentListIndex]);

  const addItem = async () => {
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
      setNewItemUnit('');
    } catch (error) {
      console.error('Error adding item to the list:', error);
    }
  };

  // Delete the item from the database
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
    } catch (error) {
      console.error('Error creating new list:', error);
    }
  };

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
  
  return (
    <Center w="100%" flex={1} px={3} background="#fafafa">
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
            placeholder="Item name"
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

          <Button onPress={addItem} colorScheme="orange" marginLeft={2}>Add Item</Button>
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
        <Button colorScheme="orange" mt={2} w={20}>
          save
        </Button>
        <Button colorScheme="orange" mt={2} w={20}>
          share
        </Button>
        <Button onPress={() => deleteList(lists[currentListIndex]._id)} colorScheme="orange" mt={2} w={20}>
          delete
        </Button>
        <Button onPress={() => setShowModal(true)} colorScheme="orange" mt={2} w={20}>new</Button>
      </Box>
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
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
            <Button variant="ghost" onPress={() => setShowModal(false)} colorScheme="orange">
              Cancel
            </Button>
            <Button
              onPress={() => {
                if (newListName.trim() !== '') {
                  createNewList(newListName.trim());
                  setNewListName('');
                  setShowModal(false);
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
    </Center>
  );
};

export default ShoppingList;