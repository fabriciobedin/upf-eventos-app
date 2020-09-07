import React from 'react';
import { View, Button } from 'react-native';

import { useAuth } from '../../hooks/auth';

const Dashboard = () => {
  const { signOut, user } = useAuth();
  console.log(user);
  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <Button title="Sair" onPress={signOut}></Button>
    </View>
  );
};

export default Dashboard;
