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
  const { user, signOut } = useAuth();
  const [events, setEvents] = useState();
  const { navigate } = useNavigation();
  const refEvents = firestore().collection('eventos');

  const navigateToProfile = useCallback(() => {
    navigate('Profile');
  }, [navigate]);

  useEffect(() => {
    return refEvents.onSnapshot(querySnapshot => {
      const list = [];
      querySnapshot.forEach(doc => {
        const {
          titulo,
          descricao,
          dataInicial,
          dataFinal,
          codigo,
          participantes
        } = doc.data();

        list.push({
          id: doc.id,
          titulo,
          descricao,
          dataInicial,
          dataFinal,
          codigo,
          participantes: participantes.length
        });
      });

      setEvents(list);
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
                'https://avatars1.githubusercontent.com/u/18118086?s=460&u=c92e79f9ed6b4e502cfa8e1e3ff8de70aa8e14fb&v=4'
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
          <EventContainer onPress={() => {}}>
            <EventImage
              source={{
                uri:
                  'https://avatars1.githubusercontent.com/u/18118086?s=460&u=c92e79f9ed6b4e502cfa8e1e3ff8de70aa8e14fb&v=4'
              }}
            />
            <EventInfo>
              <EventInfoTitle>{event.titulo}</EventInfoTitle>
              <EventInfoView>
                <Icon name="calendar" size={14} color="#e04113" />
                <EventInfoText>{event.dataInicial}</EventInfoText>
              </EventInfoView>
              <EventInfoView>
                <Icon name="plus-circle" size={14} color="#e04113" />
                <EventInfoText>{`${3} subeventos     |    `}</EventInfoText>
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
