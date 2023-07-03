import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchUserDataById, getLoggedInUserId } from './auth';
import AuthContext from './AuthContext';
import { ShoppingListContextData, UserData, UserProviderProps } from '../src/types';

/**
 * @interface UserContextData
 * @description Represents the shape of the user context data.
 * @extends ShoppingListContextData
 * @property {UserData} userData - The user data.
 * @property {string} currentListIndex - The current list index.
 * @property {React.Dispatch<React.SetStateAction<string>>} setCurrentListIndex - Callback function to set the current list index.
 */
interface UserContextData extends ShoppingListContextData {
  userData: UserData;
  currentListIndex: string;
  setCurrentListIndex: React.Dispatch<React.SetStateAction<string>>;
}

/**
 * @constant UserContext
 * @description The user context object.
 */
const UserContext = createContext<UserContextData | null>(null);

/**
 * @function useUserContext
 * @description Custom hook to access the user context.
 * @throws {Error} Throws an error if used outside of UserProvider.
 * @returns {UserContextData} The user context data.
 */
export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

/**
 * @component UserProvider
 * @description The UserProvider component.
 * @param {UserProviderProps} props - The props for UserProvider component.
 * @returns {React.FC} A React functional component.
 */
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [currentListIndex, setCurrentListIndex] = useState('0');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const userId = await getLoggedInUserId();
          if (userId) {
            const response = await fetchUserDataById(userId);
            setUserData(response.data);
          } else {
            console.log('User not logged in, skipping user data fetch.');
          }
        } catch (error) {
          console.error('Error while fetching user data:', error);
        }
      }
    };
    fetchData();
  }, [user]);

  const userContextValue: UserContextData = {
    userData,
    currentListIndex,
    setCurrentListIndex,
  };

  return (
    <UserContext.Provider value={userContextValue}>
      {children}
    </UserContext.Provider>
  );
};
