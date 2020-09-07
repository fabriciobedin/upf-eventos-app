import React, {
  createContext,
  useCallback,
  useState,
  useContext,
  useEffect
} from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStoragedUser() {
      const storagedUser = await AsyncStorage.getItem('@upf-eventos:user');
      if (storagedUser) {
        setUser(JSON.parse(storagedUser));
      }
      setLoading(false);
    }
    loadStoragedUser();
  }, []);

  const signIn = useCallback(({ email, password }) => {
    setLoading(true);
    console.log(`Trying to login with email: ${email}`);
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(res => {
        console.log(`User ${res['user']['displayName']} logged in!`);
        setUser(res);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        Alert.alert(
          'Erro na autenticação!',
          'Por favor, verifique se digitou corretamente o email e senha.'
        );
      });
  }, []);

  const signUp = useCallback(({ name, email, password }) => {
    setLoading(true);
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(res => {
        firestore()
          .collection('Users')
          .doc(res.user.uid)
          .set({ email, name })
          .then(async () => {
            setLoading(false);
            setUser(res);
            await AsyncStorage.setItem(
              '@upf-eventos:user',
              JSON.stringify(res)
            );
            console.log('User created');
          })
          .catch(err => {
            console.log(err);
            Alert.alert(
              'Erro ao cadastrar usuário!',
              'Por favor, verifique as informações inseridas e tente novamente em alguns minutos.'
            );
          });
      })
      .catch(err => {
        console.log(err);
        if (err.code === 'auth/email-already-in-use') {
          Alert.alert(
            'Esse email já está cadastrado!',
            'Por favor, tente fazer login ao invés de criar uma nova conta.'
          );
        }
        setUser({});
      });
  }, []);

  const signOut = useCallback(() => {
    setLoading(true);
    auth()
      .signOut()
      .then(async () => {
        setLoading(false);
        setUser({});
        await AsyncStorage.removeItem('@upf-eventos:user');
        console.log('User signed out!');
      })
      .catch(err => {
        console.log(err);
        Alert.alert(
          'Erro ao tentar deslogar!',
          'Por favor, atualize a página e tente novamente.'
        );
      });
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
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
