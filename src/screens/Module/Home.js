import React, { useState, useEffect } from 'react';
import { View, ScrollView, Image } from 'react-native';
import { Appbar, Button, FAB, Avatar,IconButton } from 'react-native-paper';
import { auth, db } from '../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import ForYou from './ForYou';
import FollowingTweets from './FollowingTweets';
import styles from '../../Styles/styles';

const Home = ({ navigation }) => {
  const [tab, setTab] = useState('foryou');
  const [userData, setUserData] = useState(null);

  //Load complete user data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
        } else {
          console.warn('No user data found in Firestore');
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      {/*Top header*/}
      <Appbar.Header style={{ backgroundColor: '#faf7ff' }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            
          }}
        >
          <Image
            source={require('../../../images/logo-horizo.png')}
            style={{ width: 150, height: 65, resizeMode: 'contain'}}
          />

          <Avatar.Image
            size={65}
            source={
              userData?.photo ? { uri: userData.photo } : require('../../../images/icono.jpg')
            }
            onTouchEnd={() => navigation.navigate('Feed', { userId: auth.currentUser.uid })}
          />
        </View>
      </Appbar.Header>

      {/* Scrollable container */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Tabs */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 20 }}>
          <Button
            mode={tab === 'foryou' ? 'contained' : 'outlined'}
            textColor={tab === 'foryou' ? '#fff' : '#9C27B0'}
            buttonColor={tab === 'foryou' ? '#9C27B0' : 'transparent'}
            onPress={() => setTab('foryou')}
            style={{ marginRight: 10, borderColor: '#9C27B0', borderRadius: 10 }}
            labelStyle={{ fontWeight: 'bold', fontSize: 14 }}
          >
            For You
          </Button>

          <Button
            mode={tab === 'following' ? 'contained' : 'outlined'}
            textColor={tab === 'following' ? '#fff' : '#9C27B0'}
            buttonColor={tab === 'following' ? '#9C27B0' : 'transparent'}
            onPress={() => setTab('following')}
            style={{ borderColor: '#9C27B0', borderRadius: 10 }}
            labelStyle={{ fontWeight: 'bold', fontSize: 14 }}
          >
            Following
          </Button>
        </View>

        {/* Dynamic content */}
        <View style={{ flex: 1, paddingBottom: 100 }}>
          {tab === 'foryou' ? (
            <ForYou key="foryou-feed" />
          ) : (
            <FollowingTweets key="following-feed" />
          )}
        </View>
      </ScrollView>

      {/*fab- new teet*/}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => {
          if (!userData) return;
          navigation.navigate('PostTweet', {
            user: {
              uid: auth.currentUser.uid,
              username: userData.username || 'Unknown',
              fullName: userData.fullName || 'No name',
            },
          });
        }}
      />

      {/* bottom navigationHome Modification*/}
      <View style={styles.bottomNav}>
        <IconButton
          icon="home"
          iconColor="#9C27B0"
          size={28} // 👈 tamaño del ícono
          onPress={() => setTab('foryou')}
        />

        <IconButton
          icon="magnify"
          iconColor="#9C27B0"
          size={28}
          onPress={() => navigation.navigate('SearchUsers')}
        />

        <IconButton
          icon="logout"
          iconColor="#9C27B0"
          size={28}
          onPress={async () => {
            try {
              await auth.signOut();
              navigation.reset({
                index: 0,
                routes: [{ name: 'LogIn' }],
              });
            } catch (error) {
              console.error('Error signing out:', error);
            }
          }}
        />
      </View>
    </View>
  );
};

export default Home;
