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
  EventContainer,
  EventImage,
  EventInfo,
  EventInfoTitle,
  EventInfoView,
  EventInfoText
} from './styles';

import TextTitle from '../../components/TextTitle';

const Events = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState();
  const { navigate } = useNavigation();
  const refEvents = firestore().collection('Eventos');

  const navigateToProfile = useCallback(() => {
    navigate('Profile');
  }, [navigate]);

  const navigateToSubEvents = useCallback(
    (eventId, eventTitle) => {
      navigate('SubEvents', { eventId, eventTitle });
    },
    [navigate]
  );

  const getCollectionIdsByEventId = useCallback(async (eventId, collection) => {
    let data = [];
    await refEvents
      .doc(eventId)
      .collection(collection)
      .get()
      .then(dataCollection =>
        dataCollection.forEach(dataFirestore => {
          data.push(dataFirestore.id);
        })
      );
    console.log(collection, data);
    return data;
  }, []);

  useEffect(() => {
    refEvents
      .where('organizadores', 'array-contains', user.uid)
      .onSnapshot(async querySnapshot => {
        const eventos = [];

        await Promise.all(
          querySnapshot.forEach(async doc => {
            const {
              titulo,
              descricao,
              dataInicial,
              dataFinal,
              imgUrl
            } = await doc.data();

            eventos.push({
              id: doc.id,
              titulo,
              descricao,
              dataInicial,
              dataFinal,
              imgUrl,
              participantes: await getCollectionIdsByEventId(
                doc.id,
                'Participantes'
              ),
              subeventos: await getCollectionIdsByEventId(doc.id, 'Subeventos')
            });
          })
        );

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
        ListHeaderComponent={<TextTitle>Eventos</TextTitle>}
        renderItem={({ item: event }) => (
          <EventContainer
            onPress={() => navigateToSubEvents(event.id, event.titulo)}>
            <EventImage source={{ uri: event.imgUrl }} />
            <EventInfo>
              <EventInfoTitle>{event.titulo}</EventInfoTitle>
              <EventInfoView>
                <Icon name="calendar" size={14} color="#e04113" />
                <EventInfoText>{event.dataInicial}</EventInfoText>
              </EventInfoView>
              <EventInfoView>
                <Icon name="plus-circle" size={14} color="#e04113" />
                <EventInfoText>{`${event.subeventos.length}     |    `}</EventInfoText>
                {console.log(event)}
                <Icon name="user" size={14} color="#e04113" />
                <EventInfoText>{`${event.participantes.length}`}</EventInfoText>
              </EventInfoView>
            </EventInfo>
          </EventContainer>
        )}
      />
    </Container>
  );
};

export default Events;
