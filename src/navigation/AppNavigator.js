import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import SplashScreen from '../screens/auth/SplashScreen';

import CreateChallengeScreen from '../screens/main/CreateChallengeScreen';
import OpponentProfileScreen from '../screens/main/OpponentProfileScreen';
import ChatScreen from '../screens/main/ChatScreen';
import VenueMapScreen from '../screens/main/VenueMapScreen';
import MatchVerificationScreen from '../screens/main/MatchVerificationScreen';
import ChatListScreen from '../screens/main/ChatListScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Auth" component={AuthNavigator} />
      <Stack.Screen name="Main" component={MainTabNavigator} />
      <Stack.Screen name="CreateChallenge" component={CreateChallengeScreen} />
      <Stack.Screen name="OpponentProfile" component={OpponentProfileScreen} />
      <Stack.Screen name="ChatList" component={ChatListScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="VenueMap" component={VenueMapScreen} />
      <Stack.Screen name="MatchVerification" component={MatchVerificationScreen} />
    </Stack.Navigator>
  );
}
