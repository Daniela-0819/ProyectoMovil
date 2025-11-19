import React, { useEffect, useState } from 'react';
import { db } from '../../config/firebase';
import { collection, query, orderBy, where, getDocs, doc, onSnapshot } from 'firebase/firestore';
import FeedView from '../Views/FeedView';

const Feed = ({ route }) => {
  // Get userId from route params
  const { userId } = route.params;
  
  // State for user data and user's tweets
  const [user, setUser] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [allDocuments, setAllDocuments] = useState([]);

  const TWEETS_PER_PAGE = 10;

  useEffect(() => {
    // Real-time subscription for user data
    const unsubscribeUser = onSnapshot(doc(db, 'users', userId), async userDoc => {
      if (userDoc.exists()) {
        const userData = userDoc.data();

        // References to followers and following collections
        const followersRef = collection(db, 'followers', userId, 'followers');
        const followingRef = collection(db, 'followers', userId, 'following');

        // Real-time listener for followers count
        const unsubscribeFollowers = onSnapshot(followersRef, snapshot => {
          setUser(prev => ({
            ...userData,
            uid: userId,
            followers: snapshot.size,
            following: prev?.following || 0,
          }));
        });

        // Real-time listener for following count
        const unsubscribeFollowing = onSnapshot(followingRef, snapshot => {
          setUser(prev => ({
            ...userData,
            uid: userId,
            followers: prev?.followers || 0,
            following: snapshot.size,
          }));
        });
        
        // Cleanup listeners
        return () => {
          unsubscribeFollowers();
          unsubscribeFollowing();
        };
      }
    });

    loadAllTweets();

    return () => unsubscribeUser();
  }, [userId]);

  const loadAllTweets = async () => {
    try {
      setLoading(true);
      const tweetRef = collection(db, 'tweets');
      const tweetQuery = query(
        tweetRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
      );

      const tweetSnap = await getDocs(tweetQuery);
      const allTweets = tweetSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAllDocuments(allTweets);
      setTotalCount(allTweets.length);
      setTotalPages(Math.ceil(allTweets.length / TWEETS_PER_PAGE) || 1);

      // Show first page
      const firstPage = allTweets.slice(0, TWEETS_PER_PAGE);
      setTweets(firstPage);
      setCurrentPage(1);

      console.log(`Loaded ${allTweets.length} total tweets, showing page 1`);
    } catch (error) {
      console.log('Error loading tweets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      const startIndex = (nextPage - 1) * TWEETS_PER_PAGE;
      const endIndex = startIndex + TWEETS_PER_PAGE;
      const pageData = allDocuments.slice(startIndex, endIndex);

      setTweets(pageData);
      setCurrentPage(nextPage);
      console.log(`Showing page ${nextPage} of ${totalPages}`);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      const startIndex = (prevPage - 1) * TWEETS_PER_PAGE;
      const endIndex = startIndex + TWEETS_PER_PAGE;
      const pageData = allDocuments.slice(startIndex, endIndex);

      setTweets(pageData);
      setCurrentPage(prevPage);
      console.log(`Showing page ${prevPage} of ${totalPages}`);
    }
  };

  const handleRefresh = () => {
    loadAllTweets();
  };

  if (!user) return null;

  return (
    <FeedView
      user={user}
      tweets={tweets}
      loading={loading}
      currentPage={currentPage}
      totalPages={totalPages}
      onNextPage={handleNextPage}
      onPreviousPage={handlePreviousPage}
      onRefresh={handleRefresh}
      hasMore={currentPage < totalPages}
    />
  );
};

export default Feed;
