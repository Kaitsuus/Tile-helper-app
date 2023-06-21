import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchUserDataById, getLoggedInUserId } from './auth';
import AuthContext from './AuthContext';
import { ShoppingListContextData, UserData, UserProviderProps } from '../src/types';

interface UserContextData extends ShoppingListContextData {
  userData: UserData;
  currentListIndex: string;
  setCurrentListIndex: React.Dispatch<React.SetStateAction<string>>;
}

const UserContext = createContext<UserContextData | null>(null);

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [currentListIndex, setCurrentListIndex] = useState('0');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
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
