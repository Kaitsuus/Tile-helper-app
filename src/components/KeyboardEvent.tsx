import { useEffect } from 'react';
import { Keyboard, KeyboardEventName, KeyboardEvent } from 'react-native';

export default function useKeyboardEvent(
  eventName: KeyboardEventName,
  callback: (event: KeyboardEvent) => void
) {
  useEffect(() => {
    const subscription = Keyboard.addListener(eventName, callback);

    return () => {
      subscription.remove();
    };
  }, [eventName, callback]);
}
