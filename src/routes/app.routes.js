import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Events from '../screens/Events';
import Profile from '../screens/Profile';
import SubEvents from '../screens/SubEvents';
import CodeScanner from '../screens/CodeScanner';
import AttendanceConfirmation from '../screens/AttendanceConfirmation';

const App = createStackNavigator();

const AppRoutes = () => (
  <App.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: '#eee' }
    }}>
    <App.Screen name="Events" component={Events} />
    <App.Screen name="Profile" component={Profile} />
    <App.Screen name="SubEvents" component={SubEvents} />
    <App.Screen name="CodeScanner" component={CodeScanner} />
    <App.Screen
      name="AttendanceConfirmation"
      component={AttendanceConfirmation}
    />
  </App.Navigator>
);

export default AppRoutes;
