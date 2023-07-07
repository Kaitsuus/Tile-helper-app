import React, { useState } from 'react';
import { NativeBaseProvider } from 'native-base';
import {
  NavigationContainer,
} from '@react-navigation/native';
import {
  createStackNavigator,
} from '@react-navigation/stack';
import Home from './screens/Home';
import Grout from './screens/Grout';
import Adhesive from './screens/Adhesive';
import WaterProof from './screens/WaterProof';
import Plaster from './screens/Plaster';
import ShoppingList from './screens/ShoppingList';
import UserMenu from './screens/UserMenu';
import { RootStackParamList } from './src/types';
import Login from './screens/Login';
import Signup from './screens/Signup';
import AuthContext from './service/AuthContext';
import { UserProvider } from './service/UserContext';
import HeaderAvatar from './src/components/HeaderAvatar';
import HeaderLeft from './src/components/HeaderLeft';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import 'intl';
import 'intl/locale-data/jsonp/fi';


// Import language files
import en from './src/data/lang/en.json';
import fi from './src/data/lang/fi.json';
import et from './src/data/lang/et.json';
import sv from './src/data/lang/sv.json';


// Initialize i18next
i18n
.use(initReactI18next)
.init({
  compatibilityJSON: 'v3',
  lng: 'fi',
  fallbackLng: 'fi',
  resources: {
    fi: { translation: fi },
    en: { translation: en },
    et: { translation: et },
    sv: { translation: sv },

  },
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense:false,
 }
});

const Stack = createStackNavigator<RootStackParamList>();
/**
 * @component App
 * @description The main App component.
 * @returns {React.FC} A React functional component.
 */
const App: React.FC = () => {
  const [user, setUser] = useState(false);
  const { t } = useTranslation();

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <I18nextProvider i18n={i18n}>
      <NativeBaseProvider>
        <NavigationContainer>
          <UserProvider>
            <Stack.Navigator>
              {user ? (
                <Stack.Group
                  screenOptions={{
                    headerTransparent: true,
                    headerTintColor: '#EF6F20',
                    headerLeft: () => (
                    <HeaderLeft />
                    ),
                    headerRight: () => <HeaderAvatar />
                  }}
                >
                  <Stack.Screen name="Home" component={Home} options={{ title: t('home') }} />
                  <Stack.Screen
                    name="Grout"
                    component={Grout}
                    options={{ title: t('grout') }}
                  />
                  <Stack.Screen
                    name="Adhesive"
                    component={Adhesive}
                    options={{ title: t('adhesive') }}
                  />
                  <Stack.Screen
                    name="WaterProof"
                    component={WaterProof}
                    options={{ title: t('waterproof') }}
                  />
                  <Stack.Screen
                    name="Plaster"
                    component={Plaster}
                    options={{ title: t('plaster') }}
                  />
                  <Stack.Screen
                    name="ShoppingList"
                    component={ShoppingList}
                    options={{ title: t('list') }}
                  />
                  <Stack.Screen
                    name="UserMenu"
                    component={UserMenu}
                    options={{ title: t('userMenu') }}
                  />
                </Stack.Group>
              ) : (
                <Stack.Group screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="Login" component={Login} />
                  <Stack.Screen name="Signup" component={Signup} />
                </Stack.Group>
              )}
            </Stack.Navigator>
          </UserProvider>
        </NavigationContainer>
      </NativeBaseProvider>
      </I18nextProvider>
    </AuthContext.Provider>
  );
};

export default App;
