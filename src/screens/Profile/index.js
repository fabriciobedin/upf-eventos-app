import React, { useRef, useCallback } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import * as Yup from 'yup';
import ImagePicker from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';

import Input from '../../components/Input';
import Button from '../../components/Button';
import {
  Container,
  Title,
  BackToSignIn,
  BackToSignInText,
  FormContainer,
  UserAvatarButton,
  UserAvatar,
  BackButton
} from './styles';
import getValidationErrors from '../../utils/getValidationErrors';
import { useAuth } from '../../hooks/auth';

const Profile = () => {
  const formRef = useRef(null);
  const emailInputRef = useRef(null);
  const oldPasswordInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const confirmPasswordInputRef = useRef(null);

  const { goBack } = useNavigation();
  const { signOut, user, updateUser } = useAuth();

  const storageReference = storage().ref(`users/${user.uid}/avatar.png`);

  const navigateBack = useCallback(() => {
    goBack();
  }, [goBack]);

  const sendToStorage = useCallback(async url => {
    const pathToFile = url;
    await storageReference.putFile(pathToFile);
  });

  const getStorageUrl = useCallback(async () => {
    return await storageReference.getDownloadURL();
  });

  const handleUpdateAvatar = useCallback(() => {
    ImagePicker.showImagePicker(
      {
        title: 'Carregue uma imagem',
        cancelButtonTitle: 'Cancelar',
        takePhotoButtonTitle: 'Tirar foto',
        chooseFromLibraryButtonTitle: 'Selecionar da galeria'
      },
      async response => {
        if (response.didCancel) {
          return;
        }

        if (response.error) {
          Alert.alert('Erro!', 'Por favor tente novamente.');
          return;
        }

        await sendToStorage(response.uri);
        const storageUrl = await getStorageUrl();

        updateUser({
          uid: user.uid,
          name: user.name,
          email: user.email,
          nivelAcesso: user.nivelAcesso,
          avatarUrl: storageUrl
        });

        Alert.alert('Avatar alterado com sucesso!');
      }
    );
  });

  const handleSaveProfile = useCallback(async data => {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        oldPassword: Yup.string(),
        password: Yup.string().when('oldPassword', {
          is: val => val,
          then: Yup.string().required('Campo obrigatório'),
          otherwise: Yup.string()
        }),
        confirmPassword: Yup.string()
          .when('oldPassword', {
            is: val => val,
            then: Yup.string().required('Campo obrigatório'),
            otherwise: Yup.string()
          })
          .oneOf([Yup.ref('password'), null], 'Confirmação incorreta')
      });

      await schema.validate(data, {
        abortEarly: false
      });

      const { name, email, oldPassword, password, confirmPassword } = data;
      const formData = {
        uid: user.uid,
        name: name || user.name,
        email: email || user.email,
        avatarUrl: user.avatarUrl,
        nivelAcesso: user.nivelAcesso,
        ...(oldPassword ? { oldPassword, password, confirmPassword } : {})
      };

      updateUser(formData);

      Alert.alert(
        'Perfil atualizado com sucesso!',
        'As informações do perfil foram atualizadas.'
      );

      navigateBack();
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);
        formRef.current.setErrors(errors);
        return;
      }
      console.log(err);

      Alert.alert(
        'Erro na atualização do perfil!',
        'Ocorreu um erro ao salvar, por favor tente novamente.'
      );
    }
  }, []);

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled>
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          keyboardShouldPersistTaps="handled">
          <Container>
            <BackButton onPress={navigateBack}>
              <Icon name="chevron-left" size={30} color={'#777'} />
            </BackButton>

            <UserAvatarButton onPress={handleUpdateAvatar}>
              <UserAvatar
                source={{
                  uri:
                    user.avatarUrl ||
                    'https://avatars3.githubusercontent.com/u/50773681?s=460&v=4'
                }}
              />
            </UserAvatarButton>

            <View>
              <Title>Meu Perfil</Title>
            </View>

            <FormContainer
              initialData={user}
              ref={formRef}
              onSubmit={handleSaveProfile}>
              <Input
                autoCapitalize="words"
                name="name"
                icon="user"
                placeholder={user.name}
                returnKeyType="next"
                onSubmitEditing={() => {
                  emailInputRef.current?.focus();
                }}
              />

              <Input
                ref={emailInputRef}
                keyboardType="email-address"
                autoCorrect={false}
                autoCapitalize="none"
                name="email"
                icon="mail"
                placeholder="E-mail"
                returnKeyType="next"
                onSubmitEditing={() => {
                  oldPasswordInputRef.current?.focus();
                }}
              />

              <Input
                ref={oldPasswordInputRef}
                secureTextEntry
                name="oldPassword"
                icon="lock"
                placeholder="Senha Atual"
                textContentType="oneTimeCode"
                containerStyle={{ marginTop: 15 }}
                returnKeyType="next"
                onSubmitEditing={() => {
                  passwordInputRef.current?.focus();
                }}
              />

              <Input
                ref={passwordInputRef}
                secureTextEntry
                name="password"
                icon="lock"
                placeholder="Nova Senha"
                textContentType="oneTimeCode"
                returnKeyType="next"
                onSubmitEditing={() => {
                  confirmPasswordInputRef.current?.focus();
                }}
              />

              <Input
                ref={confirmPasswordInputRef}
                secureTextEntry
                name="confirmPassword"
                icon="lock"
                placeholder="Confirmar Senha"
                textContentType="oneTimeCode"
                returnKeyType="send"
                onSubmitEditing={() => formRef.current?.submitForm()}
              />

              <Button onPress={() => formRef.current?.submitForm()}>
                Salvar Alterações
              </Button>
            </FormContainer>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <BackToSignIn onPress={signOut}>
        <Icon name="log-out" size={20} color="#777" />
        <BackToSignInText>Sair</BackToSignInText>
      </BackToSignIn>
    </>
  );
};

export default Profile;
