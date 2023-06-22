import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { ShoppingItem, ShoppingList } from '../types';

interface ShoppingListImageProps {
  lists: ShoppingList[];
  currentListIndex: string;
  items: ShoppingItem[];
}

const ListImage = React.forwardRef<View, ShoppingListImageProps>(
  ({ lists, currentListIndex, items }, ref) => {
    return (
      <View style={styles.container} ref={ref}>
        <Image source={require('../../assets/apuriLogo.png')} style={styles.logo} />

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
