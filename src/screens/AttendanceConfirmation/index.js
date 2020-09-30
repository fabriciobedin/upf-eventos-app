import React, { useCallback, useState, useRef } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import firestore from '@react-native-firebase/firestore';
import * as Yup from 'yup';

import { Header, Container, BackButton, HeaderTitle } from './styles';
import TextTitle from '../../components/TextTitle';

const AttendanceConfirmation = () => {
  // const { user } = useAuth();
  const { navigate, goBack } = useNavigation();
  const route = useRoute();
  const formRef = useRef(null);
  const { subEventId, eventId, participantId } = route.params;

  const [participants, setParticipants] = useState([]);

  const navigateBack = useCallback(() => {
    goBack();
  }, [goBack]);

  const getParticipantData = useCallback(participantId => {
    firestore()
      .collection('participantes')
      .doc(participantId)
      .get()
      .then(participant => {
        console.log(participant);
      });
  }, []);

  const readQRCode = useCallback(() => {
    getParticipantData(qrcodeParticipantId);

    setParticipants([
      ...participants,
      {
        eventId: qrcodeEventId,
        participantId: qrcodeParticipantId
      }
    ]);
  }, [participants]);

  return (
    <>
      <Header>
        <BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>
        <HeaderTitle>Confirmação de leitura</HeaderTitle>
      </Header>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled>
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          keyboardShouldPersistTaps="handled">
          {/* <TextTitle>Confirmação de presença</TextTitle> */}
          <Container></Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default AttendanceConfirmation;
