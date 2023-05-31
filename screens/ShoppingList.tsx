import React, { useState } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Center, Box, Select, CheckIcon, Button } from 'native-base';
import mockData from '../src/data/mockData.json';

interface ShoppingItem {
  name: string;
  amount: number;
  unit: string;
}

const ShoppingList: React.FC = () => {
  const [users, setUsers] = useState(mockData.users);
  const [newItemName, setNewItemName] = useState<string>('');
  const [newItemAmount, setNewItemAmount] = useState<number>(0);
  const [newItemUnit, setNewItemUnit] = useState<string>('');



  const currentUserIndex = 0; // Index of the current user (hardcoded for now)

  const shoppingList = users[currentUserIndex].shoppingList;
  const [items, setItems] = useState<ShoppingItem[]>(shoppingList);

  const updateMockData = (updatedUsers: any) => {
    const updatedMockData = { ...mockData, users: updatedUsers };
    setUsers(updatedUsers);
    console.log(updatedMockData);
  };

  const addItem = () => {
    const updatedItems = [...items, { name: newItemName, amount: newItemAmount, unit: newItemUnit }];
    const updatedUsers = [...users];
    updatedUsers[currentUserIndex].shoppingList = updatedItems;
    updateMockData(updatedUsers);

    setItems(updatedItems);
    setNewItemName('');
    setNewItemAmount(0);
    setNewItemUnit('');
  };

  const deleteItem = (index: number) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    const updatedUsers = [...users];
    updatedUsers[currentUserIndex].shoppingList = updatedItems;
    updateMockData(updatedUsers);

    setItems(updatedItems);
  };

  const updateAmount = (index: number, value: number) => {
    const updatedItems = [...items];
    updatedItems[index].amount = value;
    const updatedUsers = [...users];
    updatedUsers[currentUserIndex].shoppingList = updatedItems;
    updateMockData(updatedUsers);

    setItems(updatedItems);
  };


  const renderItem = ({ item, index }: { item: ShoppingItem; index: number }) => {
    return (
      <Box
        p={4}
        borderBottomWidth={1}
        borderBottomColor="gray"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text>{item.name}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TextInput
            value={item.amount.toString()}
            onChangeText={(text) => updateAmount(index, Number(text))}
            keyboardType="numeric"
            style={{
              borderWidth: 1,
              borderColor: 'gray',
              borderRadius: 4,
              padding: 4,
              width: 50,
              marginRight: 10,
              textAlign: 'center',
            }}
          />
          <Text>{item.unit}</Text>
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
      {items.length === 0 ? (
        <Box
        p={4}
        borderBottomWidth={1}
        borderBottomColor="gray"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text style={{ textAlign: 'center' }}>Shopping list is empty</Text>
          </Box>
        ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
        )}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
          <TextInput
            value={newItemName}
            onChangeText={setNewItemName}
            placeholder="Tuote"
            style={{
              borderWidth: 1,
              borderColor: 'gray',
              borderRadius: 4,
              padding: 4,
              width: 150,
              marginRight: 10,
            }}
          />
          <TextInput
            value={newItemAmount.toString()}
            onChangeText={(text) => setNewItemAmount(Number(text))}
            keyboardType="numeric"
            placeholder="Amount"
            style={{
              borderWidth: 1,
              borderColor: 'gray',
              borderRadius: 4,
              padding: 4,
              width: 70,
              marginRight: 10,
            }}
          />
          <Select
            selectedValue={newItemUnit}
            minWidth="120"
            onValueChange={(value) => setNewItemUnit(value)}
            placeholder="yksikkö"
            _selectedItem={{
              bg: 'orange.500',
              endIcon: <CheckIcon size={4} />,
            }}
          >
            <Select.Item label="m²" value="m²" />
            <Select.Item label="kpl" value="kpl" />
            <Select.Item label="l" value="l" />
            <Select.Item label="pkt" value="pkt" />
            <Select.Item label="kg" value="kg" />
          </Select>
        </View>
        <Button onPress={addItem} colorScheme="orange" mt={2}>
          Add
        </Button>
      </Box>
      <Box style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 2 }}>
      <Button onPress={addItem} colorScheme="orange" mt={2} w={20}>
          save
        </Button>
        <Button onPress={addItem} colorScheme="orange" mt={2} w={20}>
          share
        </Button>
        </Box>
    </Center>
  );
};

export default ShoppingList;
