import { useEffect } from 'react';
import { Keyboard } from 'react-native';

export default function KeyboardEvent(eventName, callback) {
  useEffect(() => {
    const subscription = Keyboard.addListener(eventName, callback);

    return () => {
      subscription.remove();
    };
  }, [eventName, callback]);
}
