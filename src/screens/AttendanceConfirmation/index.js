import React, { useCallback, useState, useEffect } from 'react';
import { Alert, View, ActivityIndicator } from 'react-native';
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
  const { navigate, goBack } = useNavigation();
  const { subEventId, eventId, participantId } = useRoute().params;
  const [action, setAction] = useState();
  const [participantData, setParticipantData] = useState({});
  const [loading, setLoading] = useState(true);

  const navigateBack = useCallback(() => {
    goBack();
  }, [goBack]);

  const navigateToCodeScanner = useCallback(() => {
    navigate('CodeScanner', {
      subEventId,
      eventId
    });
  }, [navigate]);

  const getParticipantConfirmation = useCallback(async () => {
    await firestore()
      .collection('Eventos')
      .doc(eventId)
      .collection('Subeventos')
      .doc(subEventId)
      .collection('SubeventoParticipantes')
      .get()
      .then(async querySnapshot => {
        let participantConfirmationStatus = false;
        await Promise.all(
          querySnapshot.docs.map(participant => {
            console.log(participantId, participant.id);
            if (participantId == participant.id)
              participantConfirmationStatus = true;
          })
        );
        if (!!participantConfirmationStatus) {
          await getParticipantData();
          await getEntryTimeFromFirebase();
          setLoading(false);
        } else {
          Alert.alert('Erro', 'O participante não está inscrito nesse evento');
          navigateToCodeScanner();
        }
      })
      .catch(err => {
        console.log('Error getting documents: ', err);
      });
  });

  const getParticipantData = useCallback(async () => {
    await firestore()
      .collection('Eventos')
      .doc(eventId)
      .collection('Participantes')
      .doc(participantId)
      .get()
      .then(participant => {
        const { nome, documento, idEstrangeiro } = participant.data();
        if (participant.exists) {
          setParticipantData({
            nome,
            documento: documento || idEstrangeiro
          });
        } else {
          console.log('Error geting participant data');
        }
      });
  });

  const getEntryTimeFromFirebase = useCallback(async () => {
    await firestore()
      .collection('Eventos')
      .doc(eventId)
      .collection('Subeventos')
      .doc(subEventId)
      .collection('SubeventoParticipantes')
      .doc(participantId)
      .get({})
      .then(async participant => {
        if (participant.exists && !!participant._data.horaEntrada) {
          setAction('out');
        } else {
          setAction('in');
        }
      });
  });

  useEffect(() => {
    getParticipantConfirmation();
  }, []);

  const confirmation = useCallback(() => {
    firestore()
      .collection('Eventos')
      .doc(eventId)
      .collection('Subeventos')
      .doc(subEventId)
      .collection('SubeventoParticipantes')
      .doc(participantId)
      .update(
        action === 'in'
          ? { horaEntrada: new Date() }
          : { horaSaida: new Date() }
      )
      .then(() => {
        console.log(
          action === 'in'
            ? 'Horário de entrada atualizado!'
            : 'Horário de saída atualizado!'
        );
        navigateToCodeScanner();
      })
      .catch(err => {
        console.log(err);
        Alert(
          'Erro',
          'Erro na confirmação, por favor verifique se o usuário está inscrito.'
        );
      });
  }, [action]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#777" />
      </View>
    );
  } else {
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
          <ParticipantName>{participantData.nome}</ParticipantName>
          <ParticipantDocument>{participantData.documento}</ParticipantDocument>
          <ToggleButton type={action} status={setAction}>
            Entrada|Saída
          </ToggleButton>
          <ConfirmationContainer>
            <Button onPress={confirmation}>Confirmar</Button>
          </ConfirmationContainer>
        </ParticipantInfoContainer>
      </>
    );
  }
};

export default AttendanceConfirmation;
