import React, { useCallback, useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { View, ActivityIndicator } from 'react-native';
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
  const [loading, setLoading] = useState(true);
  const refEvents = firestore().collection('Eventos');
  const EVENT_URL_DEFAULT =
    'https://firebasestorage.googleapis.com/v0/b/upf-eventos.appspot.com/o/assets%2Fdefault_event_image.png?alt=media&token=079c91ec-40e0-4a86-a9c4-f177b7bb2508';
  const AVATAR_URL_DEFAULT =
    'https://firebasestorage.googleapis.com/v0/b/upf-eventos.appspot.com/o/assets%2Fdefault_avatar.png?alt=media&token=fda493df-ce4f-4c71-bea6-b310c8b524ad';

  const navigateToProfile = useCallback(() => {
    navigate('Profile');
  }, [navigate]);

  const navigateToSubEvents = useCallback(
    (eventId, eventTitle) => {
      navigate('SubEvents', { eventId, eventTitle });
    },
    [navigate]
  );

  const getSubeventsByEventId = useCallback(async eventId => {
    let subevents = [];
    await refEvents
      .doc(eventId)
      .collection('Subeventos')
      .orderBy('dataInicial')
      .get()
      .then(subeventsCollection =>
        subeventsCollection.forEach(subeventsFirestore => {
          subevents.push(subeventsFirestore.id);
        })
      );
    console.log(subevents);
    return subevents;
  }, []);

  const getParticipantsByEventId = useCallback(async eventId => {
    let participants = [];
    await refEvents
      .doc(eventId)
      .collection('Participantes')
      .get()
      .then(participantsCollection =>
        participantsCollection.forEach(participantsFirestore => {
          participants.push(participantsFirestore.id);
        })
      );
    console.log(participants);
    return participants;
  }, []);

  const formatDate = useCallback(date => {
    return new Date(date).toLocaleDateString('pt-BR');
  }, []);

  const getData = useCallback(async querySnapshot => {
    const eventos = [];

    await Promise.all(
      querySnapshot.docs.map(async doc => {
        const {
          titulo,
          descricao,
          dataInicial,
          dataFinal,
          imgUrl
        } = await doc.data();

        await eventos.push({
          id: doc.id,
          titulo,
          descricao,
          dataInicial: await formatDate(dataInicial),
          dataFinal: await formatDate(dataFinal),
          imgUrl,
          subeventos: await getSubeventsByEventId(doc.id),
          participantes: await getParticipantsByEventId(doc.id)
        });
      })
    );

    setEvents(eventos);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user.nivelAcesso === '1') {
      refEvents.onSnapshot(getData);
    }
    if (user.nivelAcesso === '2') {
      refEvents
        .where('organizadores', 'array-contains', user.uid)
        .onSnapshot(getData);
    }
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#777" />
      </View>
    );
  } else {
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
                uri: user.avatarUrl || AVATAR_URL_DEFAULT
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
              <EventImage
                source={{
                  uri: event.imgUrl || EVENT_URL_DEFAULT
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
                  <EventInfoText>{`${event.subeventos.length}     |    `}</EventInfoText>
                  <Icon name="user" size={14} color="#e04113" />
                  <EventInfoText>{`${event.participantes.length}`}</EventInfoText>
                </EventInfoView>
              </EventInfo>
            </EventContainer>
          )}
        />
      </Container>
    );
  }
};

export default Events;
