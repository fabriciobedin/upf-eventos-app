import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Dashboard from '../screens/Dashboard';
import Profile from '../screens/Profile';
import EventDetails from '../screens/EventDetails';
import SubEventDetails from '../screens/SubEventDetails';

const App = createStackNavigator();

const AppRoutes = () => (
  <App.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: '#eee' }
    }}>
    <App.Screen name="Dashboard" component={Dashboard} />
    <App.Screen name="Profile" component={Profile} />
    <App.Screen name="EventDetails" component={EventDetails} />
    <App.Screen name="SubEventDetails" component={SubEventDetails} />
  </App.Navigator>
);

export default AppRoutes;
