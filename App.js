import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider } from 'react-native-paper';
import LogIn from './src/Screens/Module/LogIn';
import Register from './src/Screens/Module/Register';
import Home from './src/Screens/Module/Home';
import PostTweet from './src/Screens/Module/PostTweet';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="LogIn">
          <Stack.Screen name="LogIn" component={LogIn} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="PostTweet" component={PostTweet} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
