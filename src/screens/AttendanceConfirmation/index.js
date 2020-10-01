import React, { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import firestore from '@react-native-firebase/firestore';

import {
  BackButton,
  HeaderTitle,
  ParticipantInfoContainer,
  ParticipantName,
  ParticipantDocument,
  ConfirmationContainer
} from './styles';
import Header from '../../components/Header';
import TextTitle from '../../components/TextTitle';
import Button from '../../components/Button';
import ToggleButton from '../../components/ToggleButton';

const AttendanceConfirmation = () => {
  // const { user } = useAuth();
  const { navigate, goBack } = useNavigation();
  const { subEventId, eventId, participantId } = useRoute().params;
  const [test, setTest] = useState();
  const printTest = useCallback(() => {
    console.log(test);
  }, [test]);
  printTest();

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

  const getEntryTimeFromFirebase = useCallback(() => {
    firestore()
      .collection('eventos')
      .doc(eventId)
      .collection('subeventos')
      .doc(subEventId)
      .collection('participantes')
      .doc('EMtm6kXX7ShRKF6rre6D')
      .get({})
      .then(horaEntrada => {
        console.log(horaEntrada);
      });
  });

  const confirmation = useCallback(() => {
    getEntryTimeFromFirebase();
    firestore()
      .collection('eventos')
      .doc(eventId)
      .collection('subeventos')
      .doc(subEventId)
      .collection('participantes')
      .doc('EMtm6kXX7ShRKF6rre6D')
      .update({ horaSaida: new Date() })
      .then(horaSaida => {
        console.log(horaSaida);
      });
  }, []);

  return (
    <>
      <Header>
        <BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>
        <HeaderTitle>Confirmação de leitura</HeaderTitle>
      </Header>
      <ParticipantInfoContainer>
        <TextTitle>Dados do participante</TextTitle>
        <ParticipantName>Fabricio Bedin</ParticipantName>
        <ParticipantDocument>025.122.810-00</ParticipantDocument>
        <ToggleButton type="in" status={setTest}>
          Entrada|Saída
        </ToggleButton>
        <ConfirmationContainer>
          <Button onPress={confirmation}>Confirmar</Button>
        </ConfirmationContainer>
      </ParticipantInfoContainer>
    </>
  );
};

export default AttendanceConfirmation;
