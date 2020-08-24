import React, { useRef, useCallback } from 'react';
import {
  Image,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import logo from '../../assets/logo_upf.png';
import Input from '../../components/Input';
import Button from '../../components/Button';
import {
  Container,
  Title,
  BackToSignIn,
  BackToSignInText,
  FormContainer
} from './styles';
import getValidationErrors from '../../utils/getValidationErrors';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const navigation = useNavigation();

  const handleSignUp = useCallback(async (data: SignUpFormData) => {
    try {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório!'),
        email: Yup.string()
          .required('Email obrigatório!')
          .email('Digite um email válido!'),
        password: Yup.string()
          .required('Senha obrigatória!')
          .min(6, 'Mínimo 6 dígitos!')
      });
      await schema.validate(data, {
        abortEarly: false
      });

      // await register({
      //   name: data.name,
      //   email: data.email,
      //   password: data.password
      // });

      // history.push('/');
      // addToast({
      //   type: 'success',
      //   title: 'Cadastro Realizado!',
      //   description: 'Estamos lhe redirecionando para a página inicial.'
      // });
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        formRef.current?.setErrors(getValidationErrors(err));
        return;
      }
      Alert.alert(
        'Erro no cadastro!',
        'Não foi possível cadastrar, por favor, tente novamente mais tarde.'
      );
    }
  }, []);

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <Container>
            <Image source={logo} />

            <View>
              <Title>Crie sua conta</Title>
            </View>

            <FormContainer ref={formRef} onSubmit={handleSignUp}>
              <Input
                autoCapitalize="words"
                name="name"
                icon="user"
                placeholder="Nome"
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
                  passwordInputRef.current?.focus();
                }}
              />
              <Input
                ref={passwordInputRef}
                secureTextEntry
                name="password"
                icon="lock"
                placeholder="Senha"
                textContentType="oneTimeCode"
                returnKeyType="send"
                onSubmitEditing={() => formRef.current?.submitForm()}
              />
              <Button onPress={() => formRef.current?.submitForm()}>
                Criar
              </Button>
            </FormContainer>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <BackToSignIn
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Icon name="arrow-left" size={20} color="#777" />
        <BackToSignInText>Voltar para login</BackToSignInText>
      </BackToSignIn>
    </>
  );
};

export default SignUp;
