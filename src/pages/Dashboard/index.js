import React, { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../../hooks/auth';
import {
  Container,
  Header,
  HeaderTitle,
  UserName,
  ProfileButton,
  UserAvatar
} from './styles';

const Dashboard = () => {
  const { user } = useAuth();
  const { navigate } = useNavigation();

  const navigateToProfile = useCallback(() => {
    navigate('Profile');
  }, [navigate]);

  console.log(user);

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
    </Container>
  );
};

export default Dashboard;
