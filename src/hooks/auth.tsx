import React, {
  createContext,
  useCallback,
  useState,
  useContext,
  useEffect
} from 'react';
import AsyncStorage from '@react-native-community/async-storage';

interface AuthState {
  token: string;
  user: object;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: object;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>({} as AuthState);

  useEffect(() => {
    async function loadStoragedData(): Promise<void> {
      const user = await AsyncStorage.getItem('@upf-eventos:user');
      const token = await AsyncStorage.getItem('@upf-eventos:token');
      // const [user[1], token[1]] = await AsyncStorage.multiGet([
      //   '@upf-eventos:user',
      //   '@upf-eventos:token'
      // ]);
      if (user && token) {
        setAuth({ user: JSON.parse(user), token: token });
      }
    }
    loadStoragedData();
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    // TODO get auth from firebase
    await AsyncStorage.setItem('@upf-eventos:user', JSON.stringify(email));
    setAuth({ user: email, token: password });
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.removeItem('@upf-eventos:user');
    // await AsyncStorage.multiRemove(['@upf-eventos:user', '@upf-eventos:someotherkey']);
    setAuth({} as AuthState);
  }, []);

  return (
    <AuthContext.Provider value={{ user: auth, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('AuthProvider is requered to use useAuth');
  }
  return context;
}

export { AuthProvider, useAuth };
