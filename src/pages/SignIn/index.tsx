import React from 'react';
import {
  Image,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import logo from '../../assets/logo_upf.png';
import Input from '../../components/Input';
import Button from '../../components/Button';
import {
  Container,
  Title,
  ForgotPassword,
  ForgotPasswordText,
  CreateAccountButton,
  CreateAccountButtonText
} from './styles';

const SignIn: React.FC = () => {
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
              <Title>Faça seu login</Title>
            </View>
            <Input name="email" icon="mail" placeholder="E-mail" />
            <Input name="password" icon="lock" placeholder="Senha" />
            <Button onPress={() => {}}>Entrar</Button>
            <ForgotPassword onPress={() => {}}>
              <ForgotPasswordText>Esqueci minha senha :(</ForgotPasswordText>
            </ForgotPassword>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <CreateAccountButton onPress={() => {}}>
        <Icon name="log-in" size={20} color="#ed6707" />
        <CreateAccountButtonText>Criar conta</CreateAccountButtonText>
      </CreateAccountButton>
    </>
  );
};

export default SignIn;