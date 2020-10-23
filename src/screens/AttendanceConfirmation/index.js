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

  useEffect(() => {
    console.log('EventoID', eventId);
    console.log('ParticipanteID', participantId);
    async function getParticipantData() {
      await firestore()
        .collection('Eventos')
        .doc(eventId)
        .collection('Participantes')
        .doc(participantId)
        .get()
        .then(participant => {
          console.log(participant.id);
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
    }
    getParticipantData();
  }, []);

  useEffect(() => {
    setLoading(true);
    async function getEntryTimeFromFirebase() {
      await firestore()
        .collection('Eventos')
        .doc(eventId)
        .collection('Subeventos')
        .doc(subEventId)
        .collection('SubeventoParticipantes')
        .doc(participantId)
        .get({})
        .then(participant => {
          if (participant.exists && !!participant._data.horaEntrada) {
            setAction('out');
          } else {
            setAction('in');
          }
        });
      setLoading(false);
    }
    getEntryTimeFromFirebase();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        setLoading(false);
        Alert.alert(
          'Erro na conexão',
          'Não foi possível buscar os dados do participante, mas fique tranquilo a presença será confirmada da mesma forma.'
        );
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const navigateBack = useCallback(() => {
    goBack();
  }, [goBack]);

  const navigateToCodeScanner = useCallback(() => {
    navigate('CodeScanner', {
      subEventId,
      eventId
    });
  }, [navigate]);

  const confirmation = useCallback(() => {
    const participantRef = firestore()
      .collection('Eventos')
      .doc(eventId)
      .collection('Subeventos')
      .doc(subEventId)
      .collection('SubeventoParticipantes')
      .doc(participantId);

    participantRef
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
