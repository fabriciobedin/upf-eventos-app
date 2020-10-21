import React, { useCallback, useState, useEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import firestore from '@react-native-firebase/firestore';

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
    .collection('Subeventos');

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

  useEffect(() => {
    return refSubEvent.onSnapshot(querySnapshot => {
      const subEventsFirestore = [];
      querySnapshot.forEach(doc => {
        const {
          titulo,
          dataInicial,
          horaInicial,
          horaFinal,
          palestrante
        } = doc.data();

        subEventsFirestore.push({
          id: doc.id,
          titulo,
          dataInicial: formatDate(dataInicial),
          horaInicial,
          horaFinal,
          palestrante
        });
      });

      setSubEvents(subEventsFirestore);
    });
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
