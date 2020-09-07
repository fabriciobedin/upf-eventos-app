import React from 'react';
import { View, Text, Button } from 'react-native';

import { useAuth } from '../../hooks/auth';

const Profile = () => {
  const { signOut } = useAuth;
  return (
    <View>
      <Text>Profile</Text>
      <Button size={50} title="Sair" onPress={signOut} />
    </View>
  );
};

export default Profile;
