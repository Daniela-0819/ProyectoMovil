import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  //General
  container: {
    flex: 1,
    backgroundColor: '#faf7ff',
    padding: 16,
  },

  scrollContainer: {
    flexGrow: 1,
  },

  headerContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6C2DC7',
  },

  //FORMULARIOS (Login, Register, PostTweet)
  card: {
    margin: 15,
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },

  input: {
    marginBottom: 12,
    backgroundColor: '#fff',
  },

  button: {
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: '#9C27B0',
  },

  divider: {
    marginVertical: 10,
  },

  //FEED
  feedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6C2DC7',
    textAlign: 'center',
    marginVertical: 20,
  },

  emptyText: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 40,
  },

  refreshButton: {
    marginHorizontal: 80,
    marginTop: 20,
    borderRadius: 12,
    backgroundColor: '#EDE7F6',
  },

  refreshButtonLabel: {
    color: '#6C2DC7',
    fontWeight: '600',
  },

  //TWEET CARD
  tweetCard: {
    marginBottom: 15,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },

  tweetHeader: {
    fontWeight: 'bold',
    color: '#6C2DC7',
    fontSize: 16,
  },
  tweetHeader02: {
    fontWeight: 'bold',
    color: '#6C2DC7',
    fontSize: 12,
  },

  tweetContent: {
    marginTop: 14,
    fontSize: 15,
    color: '#333',
  },

  tweetDate: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
    marginTop: 8,
  },

  // PERFIL (FeedViwe)
  profileName: {
    marginTop: 5,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6C2DC7',
  },

  profileUsername: {
    fontSize: 14,
    color: 'gray',
  },

  followContainer: {
    flexDirection: 'row',
    marginTop: 6,
  },

  followButtonProfile: {
    marginTop: 10,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6C2DC7',
    marginVertical: 10,
    textAlign: 'center',
  },

  followColumn: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginRight: 10,
    gap:2,
  },

  // FOLLOWERS / FOLLOWING
  followersContainer: {
    flex: 1,
    backgroundColor: '#faf7ff',
    paddingVertical: 10,
  },
  followersTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6C2DC7',
    textAlign: 'center',
    marginVertical: 15,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 15,
    marginVertical: 6,
    marginHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userFullName: {
    fontWeight: 'bold',
    color: '#6C2DC7',
    fontSize: 16,
  },
  userUsername: {
    color: 'gray',
    fontSize: 14,
  },
  followButton: {
    borderRadius: 14,
    backgroundColor: '#EDE7F6',
  },
  followButtonLabel: {
    color: '#6C2DC7',
    fontWeight: '600',
  },

  //CONTADORES DE SEGUIDORES
  countersContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  counterBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  counterNumber: {
    fontWeight: 'bold',
    color: '#6C2DC7',
    fontSize: 16,
    marginRight: 4,
  },
  counterLabel: {
    color: 'gray',
    fontSize: 14,
  },

  //HOME
  fab: {
    position: 'absolute',
    right: 12,
    bottom: 82,
    backgroundColor: '#9C27B0',
  },

  bottomNav: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    bottom: 0,
    width: '110%',
    backgroundColor: '#faf7ff',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
});

export default styles;
