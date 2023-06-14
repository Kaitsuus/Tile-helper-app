import { createContext, useContext } from 'react';

interface AuthContextData {
  user: boolean;
  setUser: (loggedIn: boolean) => void;
}

const AuthContext = createContext<AuthContextData>({
  user: false,
  setUser: () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
