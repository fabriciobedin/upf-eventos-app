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
        firestore()
          .collection('Users')
          .doc(res.user.uid)
          .get()
          .then(async FbUser => {
            console.log(FbUser);
            setUser({
              uid: res.user.uid,
              name: FbUser._data.name,
              email: FbUser._data.email,
              avatarUrl: FbUser._data.avatarUrl
            });
            setLoading(false);
            await AsyncStorage.setItem(
              '@upf-eventos:user',
              JSON.stringify({
                uid: res.user.uid,
                name: FbUser._data.name,
                email: FbUser._data.email,
                avatarUrl: FbUser._data.avatarUrl
              })
            );
          });
      })
      .catch(err => {
        console.log(err);
        Alert.alert(
          'Erro na autenticação!',
          'Por favor, verifique se digitou corretamente o email e senha.'
        );
        setLoading(false);
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
          .then(() => {
            firestore()
              .collection('Users')
              .doc(res.user.uid)
              .get()
              .then(async FbUser => {
                console.log(FbUser);
                setUser({
                  uid: res.user.uid,
                  name: FbUser._data.name,
                  email: FbUser._data.email,
                  avatarUrl:
                    'https://avatars3.githubusercontent.com/u/50773681?s=460&v=4'
                });
                setLoading(false);
                await AsyncStorage.setItem(
                  '@upf-eventos:user',
                  JSON.stringify({
                    uid: res.user.uid,
                    name: FbUser._data.name,
                    email: FbUser._data.email,
                    avatarUrl:
                      'https://avatars3.githubusercontent.com/u/50773681?s=460&v=4'
                  })
                );
              });
            console.log(`User ${name} created`);
          })
          .catch(err => {
            console.log(err);
            Alert.alert(
              'Erro ao cadastrar usuário!',
              'Por favor, verifique as informações inseridas e tente novamente em alguns minutos.'
            );
            setLoading(false);
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
        setLoading(false);
        setUser({});
      });
  }, []);

  const signOut = useCallback(() => {
    setLoading(true);
    auth()
      .signOut()
      .then(async () => {
        setUser({});
        await AsyncStorage.removeItem('@upf-eventos:user');
        console.log('User signed out!');
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        Alert.alert(
          'Erro ao tentar deslogar!',
          'Por favor, atualize a página e tente novamente.'
        );
        setLoading(false);
      });
  }, []);

  const updateUser = useCallback(({ uid, name, email, avatarUrl }) => {
    setLoading(true);
    firestore()
      .collection('Users')
      .doc(uid)
      .set({ name, email, avatarUrl })
      .then(async () => {
        setUser({ name, email, avatarUrl });
        await AsyncStorage.setItem(
          '@upf-eventos:user',
          JSON.stringify({ name, email, avatarUrl })
        );
        setLoading(false);
        console.log(`User ${name} updated`);
      })
      .catch(err => {
        console.log(err);
        Alert.alert(
          'Erro ao cadastrar usuário!',
          'Por favor, verifique as informações inseridas e tente novamente em alguns minutos.'
        );
        setLoading(false);
      });
  });

  return (
    <AuthContext.Provider
      value={{ user, loading, signIn, signUp, signOut, updateUser }}>
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
