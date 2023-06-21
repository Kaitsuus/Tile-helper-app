import React from 'react';
import { Select, CheckIcon } from 'native-base';
import { ShoppingListSelectProps } from '../types';
import { useUserContext } from '../../service/UserContext';

const ShoppingListSelect: React.FC<ShoppingListSelectProps> = ({ lists, currentListIndex, setCurrentListIndex }) => {
  return (
    <Select
      bg="white"
      selectedValue={currentListIndex}
      _selectedItem={{
        bg: 'orange.500',
        endIcon: <CheckIcon size="5" />,
      }}
      mt={1}
      onValueChange={(value) => setCurrentListIndex(value)}
    >
      {lists.length > 0 ? (
        lists.map((list, index) => (
          <Select.Item key={list._id} label={list.title} value={index.toString()} />
        ))
      ) : (
        <Select.Item label="No lists available" value="" />
      )}
    </Select>
  );
};

export default ShoppingListSelect;
