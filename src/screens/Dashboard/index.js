import React, { useCallback, useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

import { useAuth } from '../../hooks/auth';
import {
  Container,
  Header,
  HeaderTitle,
  UserName,
  ProfileButton,
  UserAvatar,
  EventsList,
  EventsListTitle,
  EventContainer,
  EventImage,
  EventInfo,
  EventInfoTitle,
  EventInfoView,
  EventInfoText
} from './styles';

const Dashboard = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState();
  const { navigate } = useNavigation();
  const refEvents = firestore().collection('eventos');

  const navigateToProfile = useCallback(() => {
    navigate('Profile');
  }, [navigate]);

  const navigateToEventDetails = useCallback(
    (eventId, eventTitle) => {
      navigate('EventDetails', { eventId, eventTitle });
    },
    [navigate]
  );

  useEffect(() => {
    return refEvents.onSnapshot(querySnapshot => {
      const eventos = [];
      querySnapshot.forEach(doc => {
        const {
          titulo,
          descricao,
          dataInicial,
          dataFinal,
          codigo,
          imgLink
        } = doc.data();

        eventos.push({
          id: doc.id,
          titulo,
          descricao,
          dataInicial,
          dataFinal,
          codigo,
          imgLink,
          participantes: 10,
          subeventos: 2
        });
      });

      setEvents(eventos);
    });
  }, []);

  return (
    <Container>
      <Header>
        <HeaderTitle>
          Bem vindo, {'\n'}
          <UserName>{user.name}</UserName>
        </HeaderTitle>

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

      <EventsList
        data={events}
        keyExtractor={event => event.id}
        ListHeaderComponent={
          <EventsListTitle>Próximos Eventos</EventsListTitle>
        }
        renderItem={({ item: event }) => (
          <EventContainer
            onPress={() => navigateToEventDetails(event.id, event.titulo)}>
            <EventImage source={{ uri: event.imgLink }} />
            <EventInfo>
              <EventInfoTitle>{event.titulo}</EventInfoTitle>
              <EventInfoView>
                <Icon name="calendar" size={14} color="#e04113" />
                <EventInfoText>{event.dataInicial}</EventInfoText>
              </EventInfoView>
              <EventInfoView>
                <Icon name="plus-circle" size={14} color="#e04113" />
                <EventInfoText>{`${event.subeventos} subeventos     |    `}</EventInfoText>
                <Icon name="user" size={14} color="#e04113" />
                <EventInfoText>{`${event.participantes} inscritos`}</EventInfoText>
              </EventInfoView>
            </EventInfo>
          </EventContainer>
        )}
      />
    </Container>
  );
};

export default Dashboard;
