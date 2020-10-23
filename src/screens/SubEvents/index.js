import React, { useCallback, useState, useEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage';

import {
  BackButton,
  HeaderTitle,
  SubEventsList,
  SubEventContainer,
  SubEventInfo,
  SubEventInfoTitle,
  SubEventInfoView,
  SubEventInfoText
} from './styles';

import TextTitle from '../../components/TextTitle';
import Header from '../../components/Header';

const SubEvents = () => {
  const { navigate, goBack } = useNavigation();
  const route = useRoute();
  const { eventId, eventTitle } = route.params;
  const [subEvents, setSubEvents] = useState([]);
  const refSubEvent = firestore()
    .collection('Eventos')
    .doc(eventId)
    .collection('Subeventos')
    .orderBy('dataInicial');

  const navigateBack = useCallback(() => {
    goBack();
  }, [goBack]);

  const formatDate = useCallback(date => {
    return new Date(date).toLocaleDateString('pt-BR');
  }, []);

  const navigateToCodeScanner = useCallback(
    (subEventId, subEventTitle, startTime, finishTime) => {
      navigate('CodeScanner', {
        subEventId,
        eventId,
        subEventTitle,
        startTime,
        finishTime
      });
    },
    [navigate]
  );

  const getSubeventsParticipants = useCallback(async subeventId => {
    let participants = [];
    await firestore()
      .collection('Eventos')
      .doc(eventId)
      .collection('Subeventos')
      .doc(subeventId)
      .collection('SubeventoParticipantes')
      .get()
      .then(participantsCollection =>
        participantsCollection.forEach(participantsFirestore => {
          participants.push(participantsFirestore.id);
        })
      );
    console.log(participants);
    return participants;
  }, []);

  const getSubeventsData = useCallback(async () => {
    const subEventsFirestore = [];
    refSubEvent.onSnapshot(async querySnapshot => {
      await Promise.all(
        querySnapshot.docs.map(async doc => {
          const {
            titulo,
            dataInicial,
            horaInicial,
            horaFinal,
            palestrante
          } = doc.data();

          await subEventsFirestore.push({
            id: doc.id,
            titulo,
            dataInicial: await formatDate(dataInicial),
            horaInicial,
            horaFinal,
            palestrante,
            participantes: await getSubeventsParticipants(doc.id)
          });
        })
      );

      console.log(subEventsFirestore);

      setSubEvents(subEventsFirestore);
    });
  }, []);

  useEffect(() => {
    getSubeventsData();
  }, []);

  useEffect(() => {
    async function setLocalStorageParticipants() {
      console.log('passed here!');
      await AsyncStorage.setItem(
        `@upf-eventos:${eventId}:subevents`,
        JSON.stringify(subEvents)
      );
    }
    setLocalStorageParticipants();
  }, []);

  return (
    <>
      <Header>
        <BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>
        <HeaderTitle>{eventTitle}</HeaderTitle>
      </Header>

      <SubEventsList
        data={subEvents}
        keyExtractor={subEvent => subEvent.id}
        ListHeaderComponent={<TextTitle>SubEventos</TextTitle>}
        renderItem={({ item: subEvent }) => (
          <SubEventContainer
            onPress={() =>
              navigateToCodeScanner(
                subEvent.id,
                subEvent.titulo,
                subEvent.horaInicial,
                subEvent.horaFinal
              )
            }>
            <SubEventInfo>
              <SubEventInfoTitle>{subEvent.titulo}</SubEventInfoTitle>
              <SubEventInfoView>
                <Icon name="user" size={14} color="#e04113" />
                <SubEventInfoText>
                  {subEvent.participantes.length}
                </SubEventInfoText>
                {subEvent.palestrante && (
                  <>
                    <SubEventInfoText>{`     |     `}</SubEventInfoText>
                    <SimpleLineIcon
                      name="graduation"
                      size={14}
                      color="#e04113"
                    />
                    <SubEventInfoText>{subEvent.palestrante}</SubEventInfoText>
                  </>
                )}
              </SubEventInfoView>
              <SubEventInfoView>
                <Icon name="calendar" size={14} color="#e04113" />
                <SubEventInfoText>{`${subEvent.dataInicial}     |    `}</SubEventInfoText>
                <Icon name="clock" size={14} color="#e04113" />
                <SubEventInfoText>{`${subEvent.horaInicial} - ${subEvent.horaFinal}`}</SubEventInfoText>
              </SubEventInfoView>
            </SubEventInfo>
          </SubEventContainer>
        )}
      />
    </>
  );
};

export default SubEvents;
