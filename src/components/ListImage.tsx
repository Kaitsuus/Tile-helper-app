import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { ShoppingItem, ShoppingList } from '../types';

/**
 * @interface ShoppingListImageProps
 * @description Represents the props for the ShoppingListImage component.
 * @property {ShoppingList[]} lists - The array of shopping lists.
 * @property {string} currentListIndex - The index of the current shopping list.
 * @property {ShoppingItem[]} items - The array of shopping items.
 */
interface ShoppingListImageProps {
  lists: ShoppingList[];
  currentListIndex: string;
  items: ShoppingItem[];
}

/**
 * @component ListImage
 * @description The ListImage component.
 * @param {ShoppingListImageProps} props - The props for ListImage component.
 * @param {React.ForwardedRef<View>} ref - The ref for the ListImage component.
 * @returns {React.FC} A React functional component.
 */
const ListImage = React.forwardRef<View, ShoppingListImageProps>(
  ({ lists, currentListIndex, items }, ref) => {
    return (
      <View style={styles.container} ref={ref}>
        <Image source={require('../../assets/favicon.png')} style={styles.logo} />

        {/* Add the shopping list title */}
        <Text style={styles.title}>{lists[currentListIndex]?.title}</Text>

        {/* Add the shopping list items */}
        {items.map((item, index) => (
          <Text key={index} style={styles.item}>
            {item.content.name} {item.content.amount} {item.content.unit}
          </Text>
        ))}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  logo: {
    width: 15,
    height: 15,
    position: 'absolute',
    top: 5,
    left: 5,
  },
  title: {
    fontSize: 8,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 5,
  },
  item: {
    fontSize: 6,
    marginBottom: 1,
  },
});

export default ListImage;