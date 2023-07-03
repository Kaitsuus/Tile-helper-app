/**
 * @module AuthContext
 * @description This module exports the AuthContext and useAuth hook.
 */

import { createContext, useContext } from 'react';

/**
 * @interface AuthContextData
 * @description Represents the shape of the authentication context data.
 * @property {boolean} user - Indicates if a user is logged in.
 * @property {(loggedIn: boolean) => void} setUser - Callback function to set the user login status.
 */
interface AuthContextData {
  user: boolean;
  setUser: (loggedIn: boolean) => void;
}

/**
 * @constant AuthContext
 * @description The authentication context object.
 */
const AuthContext = createContext<AuthContextData>({
  user: false,
  setUser: () => {},
});

/**
 * @function useAuth
 * @description Custom hook to access the authentication context.
 * @returns {AuthContextData} The authentication context data.
 */
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
