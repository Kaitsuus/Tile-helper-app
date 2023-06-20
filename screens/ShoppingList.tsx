import React, { useState, useEffect } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Center, Box, Select, CheckIcon, Button } from 'native-base';
import { makeAuthenticatedRequest, deleteItemFromDB } from '../service/auth';
import api from '../service/api';

interface ShoppingItemContent {
  amount: number;
  name: string;
  unit: string;
}

interface ShoppingItem {
  _id: string;
  amount: number;
  content: ShoppingItemContent;
}


interface ShoppingList {
  _id: string;
  title: string;
  user: string;
  items: ShoppingItem[];
}

interface EditingAmount {
  index: number;
  value: number;
}

const ShoppingList: React.FC = () => {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState<number>(0);
  const [newItemUnit, setNewItemUnit] = useState<string>('');
  const [editingAmount, setEditingAmount] = useState<EditingAmount | null>(null);

  const [currentListIndex, setCurrentListIndex] = useState<string>('0');

  const [items, setItems] = useState<ShoppingItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await makeAuthenticatedRequest(api.lists, 'GET');
        const transformedLists = response.data.map((list: any) => {
          console.log('Raw items:', list.items); // Add this line to log the raw items
  
          const transformedItems = list.items.map((item: any) => {
            console.log('Raw item:', item); // Add this line to log each raw item
            return {
              ...item,
              _id: item._id,
              amount: item.amount || 0, // Set a default value for amount if it is undefined
            };
          });
  
          console.log('Transformed items:', transformedItems); // Add this line to log the transformed items
  
          return {
            ...list,
            _id: list.id, // Change this line to use the correct property name
            items: transformedItems,
          };
        });
        setLists(transformedLists);
        console.log('Lists:', transformedLists);
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
        `${api.lists}/${lists[currentListIndex]._id}/items`,
        'POST',
        { content: newItem.content } // Match the expected request body structure
      );
  
      const createdItem = response.data;
      const updatedLists = [...lists];
      updatedLists[currentListIndex].items.push(createdItem);
  
      console.log('Added item to the list');
      setLists(updatedLists);
      setNewItemName('');
      setNewItemAmount(0);
      setNewItemUnit('');
    } catch (error) {
      console.error('Error adding item to the list:', error);
    }
  };

  const deleteItem = async (index: number) => {
    const itemToDelete = items[index];
    const itemId = itemToDelete._id;
  
    // Retrieve the list ID from the current list using currentListIndex
    const listId = lists[currentListIndex]._id;
  
    // Delete the item from the database
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
      console.log('Updated item amount');
      setLists(updatedLists);
    } catch (error) {
      console.error('Error updating item amount:', error);
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
        <Select
          selectedValue={currentListIndex}
          onValueChange={(value) => setCurrentListIndex(value)}
        >
          {lists.length > 0 ? (
            lists.map((list: ShoppingList, index: number) => (
              <Select.Item key={list._id} label={list.title} value={index.toString()} />
            ))
          ) : (
            <Select.Item label="No lists available" value="" />
          )}
        </Select>

        <FlatList
          data={items}
          renderItem={renderItem}
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

          <TextInput
            value={newItemUnit}
            onChangeText={setNewItemUnit}
            placeholder="Unit"
            style={{
              borderWidth: 1,
              borderColor: 'gray',
              borderRadius: 4,
              padding: 8,
              marginRight: 8,
              width: 80,
            }}
          />

          <Button onPress={addItem} colorScheme="orange">Add Item</Button>
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
        <Button colorScheme="orange" mt={2} w={20}>
          new
        </Button>
      </Box>
    </Center>
  );
};

export default ShoppingList;
