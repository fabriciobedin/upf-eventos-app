import React, { useCallback } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

import {
  Header,
  Container,
  BackButton,
  HeaderTitle,
  SubEventTitle,
  SubEventDescription
} from './styles';

// import { useAuth } from '../../hooks/auth';

const SubEventDetails = () => {
  // const { user } = useAuth();
  const { navigate, goBack } = useNavigation();
  const route = useRoute();
  const { subEventId, subEventTitle, subEventDescription } = route.params;

  const navigateBack = useCallback(() => {
    goBack();
  }, [goBack]);

  return (
    <>
      <Header>
        <BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>
        <HeaderTitle>Confirmação de Presença</HeaderTitle>
      </Header>
      <Container>
        <SubEventTitle>{subEventTitle}</SubEventTitle>
        <SubEventDescription>{subEventDescription}</SubEventDescription>
      </Container>
    </>
  );
};

export default SubEventDetails;
