import React from 'react';
import { ScrollView, View } from 'react-native';
import { Card, Button, Divider } from 'react-native-paper';
import ProfileView from '../Views/ProfileView';
import styles from '../../Styles/styles';

const Home = ({ navigation, route }) => {
  const { user } = route.params;

  return (
    <ScrollView style={styles.container}>
      <ProfileView user={user} />

      <Card style={styles.card}>
        <Card.Content>
          <Button
            mode="contained"
            style={styles.button}
            onPress={() => navigation.navigate('Feed', { user })}
          >
            View Feed
          </Button>

          <Button
            mode="contained"
            style={styles.button}
            onPress={() => navigation.navigate('PostTwett', { user })}
          >
            New Tweet
          </Button>

          <Divider style={styles.divider} />

          <Button mode="text" onPress={() => navigation.navigate('Followers', { user })}>
            Followers List
          </Button>

          <Button mode="text" onPress={() => navigation.navigate('Following', { user })}>
            Following List
          </Button>

          <Button mode="text" onPress={() => navigation.navigate('Login')}>
            Log Out
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

export default Home;
