import React, {
  createContext,
  useCallback,
  useState,
  useContext,
  useEffect
} from 'react';
import AsyncStorage from '@react-native-community/async-storage';

const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStoragedData() {
      const user = await AsyncStorage.getItem('@upf-eventos:user');
      // const token = await AsyncStorage.getItem('@upf-eventos:token');
      // const [user[1], token[1]] = await AsyncStorage.multiGet([
      //   '@upf-eventos:user',
      //   '@upf-eventos:token'
      // ]);
      if (user) {
        setAuth({ user: JSON.parse(user), token: 'token' });
      }
      setLoading(false);
    }
    loadStoragedData();
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    await AsyncStorage.setItem('@upf-eventos:user', JSON.stringify(email));
    setAuth({ user: email, token: password });
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.removeItem('@upf-eventos:user');
    // await AsyncStorage.multiRemove(['@upf-eventos:user', '@upf-eventos:someotherkey']);
    setAuth({});
  }, []);

  return (
    <AuthContext.Provider value={{ user: auth, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('AuthProvider is requered to use useAuth');
  }
  return context;
}

export { AuthProvider, useAuth };
