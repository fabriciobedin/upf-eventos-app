import React, { useCallback, useState, useEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import firestore from '@react-native-firebase/firestore';

import {
  Container,
  Header,
  BackButton,
  HeaderTitle,
  UserAvatar,
  SubEventsList,
  SubEventsListTitle,
  SubEventContainer,
  SubEventImage,
  SubEventInfo,
  SubEventInfoTitle,
  SubEventInfoView,
  SubEventInfoText
} from './styles';

import { useAuth } from '../../hooks/auth';

const EventDetails = () => {
  const { user } = useAuth();
  const { navigate, goBack } = useNavigation();
  const route = useRoute();
  const { eventId, eventTitle } = route.params;
  const [subEvents, setSubEvents] = useState([]);
  const refSubEvent = firestore()
    .collection('eventos')
    .doc(eventId)
    .collection('subeventos');

  const navigateBack = useCallback(() => {
    goBack();
  }, [goBack]);

  console.log(subEvents);

  useEffect(() => {
    return refSubEvent.onSnapshot(querySnapshot => {
      console.log(querySnapshot);

      const subEventsFirestore = [];
      querySnapshot.forEach(doc => {
        const {
          titulo,
          descricao,
          dataInicial,
          horaInicial,
          horaFinal,
          palestrante
        } = doc.data();

        subEventsFirestore.push({
          id: doc.id,
          titulo,
          descricao,
          dataInicial,
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

        <UserAvatar
          source={{
            uri:
              'https://avatars1.githubusercontent.com/u/18118086?s=460&u=c92e79f9ed6b4e502cfa8e1e3ff8de70aa8e14fb&v=4'
          }}
        />
      </Header>

      <SubEventsList
        data={subEvents}
        keyExtractor={subEvent => subEvent.id}
        ListHeaderComponent={
          <SubEventsListTitle>SubEventos</SubEventsListTitle>
        }
        renderItem={({ item: subEvent }) => (
          <SubEventContainer onPress={() => {}}>
            {/* <SubEventImage source={{ uri: subEvent.imgLink }} /> */}
            <SubEventInfo>
              <SubEventInfoTitle>{subEvent.titulo}</SubEventInfoTitle>
              <SubEventInfoView>
                <Icon name="calendar" size={14} color="#e04113" />
                <SubEventInfoText>{`${subEvent.dataInicial}     |    `}</SubEventInfoText>
                <Icon name="clock" size={14} color="#e04113" />
                <SubEventInfoText>{`${subEvent.horaInicial} - ${subEvent.horaFinal}`}</SubEventInfoText>
              </SubEventInfoView>
              {/* <EventInfoView>
                <Icon name="plus-circle" size={14} color="#e04113" />
                <EventInfoText>{`${subEvent.subeventos} subeventos     |    `}</EventInfoText>
                <Icon name="user" size={14} color="#e04113" />
                <EventInfoText>{`${event.participantes} inscritos`}</EventInfoText>
              </EventInfoView> */}
            </SubEventInfo>
          </SubEventContainer>
        )}
      />
    </>
  );
};

export default EventDetails;
