import { createContext, useContext, useState, useEffect } from 'react';
import { fetchUserDataById, getLoggedInUserId } from './auth';
import AuthContext from './AuthContext';

const UserContext = createContext(null);

export const useUserContext = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = await getLoggedInUserId();
        // Check if the user ID exists before making the request
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

  return (
    <UserContext.Provider value={userData}>
      {children}
    </UserContext.Provider>
  );
};

