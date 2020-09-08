import React, { useCallback, useState, useEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import firestore from '@react-native-firebase/firestore';

import {
  Header,
  BackButton,
  HeaderTitle,
  UserAvatar,
  SubEventsList,
  SubEventsListTitle,
  SubEventContainer,
  ProfileButton,
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

  const navigateToProfile = useCallback(() => {
    navigate('Profile');
  }, [navigate]);

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

        <ProfileButton onPress={navigateToProfile}>
          <UserAvatar
            source={{
              uri:
                user.avatarUrl ||
                'https://avatars3.githubusercontent.com/u/50773681?s=460&v=4'
            }}
          />
        </ProfileButton>
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
