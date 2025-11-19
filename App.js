import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider } from 'react-native-paper';
import LogIn from './src/Screens/Module/LogIn';
import Register from './src/Screens/Module/Register';
import Home from './src/Screens/Module/Home';
import PostTweet from './src/Screens/Module/PostTweet';
import Feed from './src/Screens/Module/Feed';
import Followers from './src/Screens/Module/Followers';
import Following from './src/Screens/Module/Following';
import SearchUsers from './src/Screens/Module/SearchUsers';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="LogIn">
          <Stack.Screen name="LogIn" component={LogIn} options={{ headerShown: false }}/>
          <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={Home} options={{ headerShown: false }}/>
          <Stack.Screen name="PostTweet" component={PostTweet} options={{ headerShown: false }} />
          <Stack.Screen name="Feed" component={Feed} options={{ headerShown: false }} />
          <Stack.Screen name="Followers" component={Followers} options={{ headerShown: false }}/>
          <Stack.Screen name="Following" component={Following} options={{ headerShown: false }} />
          <Stack.Screen name="SearchUsers" component={SearchUsers} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
