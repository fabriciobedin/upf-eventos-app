import React, { useCallback, useRef } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import QRCodeScanner from 'react-native-qrcode-scanner';
import * as Yup from 'yup';

import {
  Container,
  BackButton,
  HeaderTitle,
  InfoTitle,
  FormContainer
} from './styles';
import InputWithButton from '../../components/InputWithButton';
import Header from '../../components/Header';

const CodeScanner = () => {
  const { navigate, goBack } = useNavigation();
  const route = useRoute();
  const formRef = useRef(null);
  const { subEventId, eventId } = route.params;

  const navigateBack = useCallback(() => {
    goBack();
  }, [goBack]);

  const validateEvent = useCallback(qrcodeEventId => {
    if (qrcodeEventId == eventId) return true;

    Alert.alert(
      'Erro!',
      'Por favor, verifique se o participante está cadastrado nesse evento.'
    );
    return false;
  }, []);

  const navigateToAttendanceConfirmation = useCallback(
    participantId => {
      navigate('AttendanceConfirmation', {
        subEventId,
        eventId,
        participantId
      });
    },
    [navigate]
  );

  const readQRCode = useCallback(async code => {
    const [qrcodeEventId, qrcodeParticipantId] = code.split('|');

    if (await !validateEvent(qrcodeEventId)) return;

    navigateToAttendanceConfirmation(qrcodeParticipantId);
  }, []);

  const handleSendCode = useCallback(async data => {
    try {
      const schema = Yup.object().shape({
        subscription: Yup.string()
          .required('Código obrigatório!')
          .min(3, 'Você deve informar pelo menos 3 caracteres!')
      });
      await schema.validate(data);
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        Alert.alert('Erro!', `${err}`);
        return;
      }
    }
    readQRCode(data.subscription);
    // readQRCode('0wXiTC6pzoC4zvKTh82W|6bNnKUEiquchCyPeANGv');
    // readQRCode('YEUy7dZ5qBxDZrGrKtXd|NoNnM6bETrp9BjiCwZ8W');
  }, []);

  return (
    <>
      <Header>
        <BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>
        <HeaderTitle>Leitura do crachá</HeaderTitle>
      </Header>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled>
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          keyboardShouldPersistTaps="handled">
          <InfoTitle>Escaneie o QRCode</InfoTitle>
          <Container>
            <QRCodeScanner
              onRead={e => {
                readQRCode(e.data);
              }}
            />
            <InfoTitle>ou, digite o código abaixo</InfoTitle>

            <FormContainer ref={formRef} onSubmit={handleSendCode}>
              <InputWithButton
                autoCorrect={false}
                autoCapitalize="none"
                name="subscription"
                icon="lock"
                placeholder="Código"
                returnKeyType="next"
                onSubmitEditing={() => {
                  formRef.current.submitForm();
                }}
                buttonText="Enviar"
                onPress={() => {
                  formRef.current.submitForm();
                }}
              />
            </FormContainer>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default CodeScanner;
