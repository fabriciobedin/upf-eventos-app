import React, { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import QRCodeScanner from 'react-native-qrcode-scanner';
import firestore from '@react-native-firebase/firestore';

import {
  Header,
  Container,
  BackButton,
  HeaderTitle,
  ParticipantsList,
  ListTitle,
  ParticipantsListContainer,
  ParticipantsInfo,
  ParticipantsInfoTitle
} from './styles';

const SubEventDetails = () => {
  // const { user } = useAuth();
  const { navigate, goBack } = useNavigation();
  const route = useRoute();
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

  const readQRCode = useCallback(e => {
    const [qrcodeEventId, qrcodeParticipantId] = e.data.split('|');

    if (!validateEvent(qrcodeEventId)) return;
    getParticipantData(qrcodeParticipantId);

    setParticipants([
      ...participants,
      {
        eventId: qrcodeEventId,
        participantId: qrcodeParticipantId
      }
    ]);
  }, []);

  return (
    <>
      <Header>
        <BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>
        <HeaderTitle>Confirmação de Presença</HeaderTitle>
      </Header>
      <Container>
        <QRCodeScanner onRead={readQRCode} />
        <ParticipantsList
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
        />
      </Container>
    </>
  );
};

export default SubEventDetails;
