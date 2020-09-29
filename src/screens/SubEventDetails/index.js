import React, { useCallback, useState, useRef } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  View,
  Platform
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import QRCodeScanner from 'react-native-qrcode-scanner';
import firestore from '@react-native-firebase/firestore';
import * as Yup from 'yup';

import {
  Header,
  Container,
  BackButton,
  HeaderTitle,
  ParticipantsInfoTitle,
  FormContainer,
  InputCode,
  ButtonSendCode,
  ButtonSendCodeText
} from './styles';
import InputWithButton from '../../components/InputWithButton';

const SubEventDetails = () => {
  // const { user } = useAuth();
  const { navigate, goBack } = useNavigation();
  const route = useRoute();
  const formRef = useRef(null);
  const { subEventId, eventId, subEventTitle } = route.params;

  const [participants, setParticipants] = useState([]);

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

  const getParticipantData = useCallback(participantId => {
    firestore()
      .collection('participantes')
      .doc(participantId)
      .get()
      .then(participant => {
        console.log(participant);
      });
  }, []);

  const readQRCode = useCallback(
    code => {
      const [qrcodeEventId, qrcodeParticipantId] = code.split('|');

      if (!validateEvent(qrcodeEventId)) return;
      getParticipantData(qrcodeParticipantId);

      setParticipants([
        ...participants,
        {
          eventId: qrcodeEventId,
          participantId: qrcodeParticipantId
        }
      ]);
    },
    [participants]
  );

  const handleSendCode = useCallback(async data => {
    formRef.current.setErrors({});
    const schema = Yup.object().shape({
      subscription: Yup.string().required('Código obrigatório!')
    });
    await schema.validate(data);

    readQRCode(data.subscription);
  }, []);

  return (
    <>
      <Header>
        <BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>
        <HeaderTitle>Confirmação de Presença</HeaderTitle>
      </Header>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled>
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          keyboardShouldPersistTaps="handled">
          <ParticipantsInfoTitle>Escaneie o QRCode</ParticipantsInfoTitle>
          <Container>
            {/* <Container> */}
            <QRCodeScanner
              onRead={e => {
                readQRCode(e.data);
              }}
            />
            {/* <ParticipantsList
          data={participants}
          keyExtractor={participant => participant.participantId}
          ListHeaderComponent={<ListTitle>{subEventTitle}</ListTitle>}
          renderItem={({ item: participant }) => (
            <ParticipantsListContainer>
              <ParticipantsInfo>
                <ParticipantsInfoTitle>
                  {participant.participantId}
                </ParticipantsInfoTitle>
              </ParticipantsInfo>
            </ParticipantsListContainer>
          )}
        /> */}
            {/* </Container> */}
            <ParticipantsInfoTitle>
              ou, digite o código abaixo
            </ParticipantsInfoTitle>

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

      {/* <BackToSignIn></BackToSignIn> */}
    </>
  );
};

export default SubEventDetails;
