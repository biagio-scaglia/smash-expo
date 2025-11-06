import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { FontAwesome5 } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useLocalSearchParams } from 'expo-router';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://UR-IP:3000/api';
const nintendoRed = '#E60012';

// Mapping immagini personaggi
const characterImages: { [key: string]: any } = {
  'Mario': require('@/assets/images/Pngs/mario.png'),
  'Donkey Kong': require('@/assets/images/Pngs/donkey_kong.png'),
  'Link': require('@/assets/images/Pngs/link.png'),
  'Samus': require('@/assets/images/Pngs/samus.png'),
  'Yoshi': require('@/assets/images/Pngs/yoshi.png'),
  'Kirby': require('@/assets/images/Pngs/kirby.png'),
  'Fox': require('@/assets/images/Pngs/fox.png'),
  'Pikachu': require('@/assets/images/Pngs/pikachu.png'),
  'Luigi': require('@/assets/images/Pngs/luigi.png'),
  'Ness': require('@/assets/images/Pngs/ness.png'),
  'Captain Falcon': require('@/assets/images/Pngs/captain_falcon.png'),
  'Jigglypuff': require('@/assets/images/Pngs/jigglypuff.png'),
  'Peach': require('@/assets/images/Pngs/peach.png'),
  'Bowser': require('@/assets/images/Pngs/bowser.png'),
  'Sonic': require('@/assets/images/Pngs/sonic.png'),
  'Cloud': require('@/assets/images/Pngs/cloud.png'),
  'Zelda': require('@/assets/images/Pngs/zelda.png'),
  'Mewtwo': require('@/assets/images/Pngs/mewtwo.png'),
  'Sephiroth': require('@/assets/images/Pngs/sephiroth.png'),
};

type PublicUser = {
  id: string;
  username: string;
  profileImage?: string | null;
  main?: string | null;
  description?: string | null;
};

export default function PublicProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { token, isLoggedIn, user: currentUser } = useAuth();
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFriend, setIsFriend] = useState(false);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const [sendingRequest, setSendingRequest] = useState(false);

  const userId = params.userId as string;

  useEffect(() => {
    if (userId && isLoggedIn && token) {
      loadPublicProfile();
      checkFriendshipStatus();
    } else {
      setLoading(false);
    }
  }, [userId, isLoggedIn, token]);

  const checkFriendshipStatus = async () => {
    if (!token || !currentUser) return;
    
    try {
      // Usa l'endpoint di verifica per controllare tutto in una volta
      const checkRes = await fetch(`${API_URL}/friends/check/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (checkRes.ok) {
        const checkData = await checkRes.json();
        if (checkData.success) {
          setIsFriend(checkData.isFriend || false);
          setHasPendingRequest(checkData.hasPendingRequest || false);
        }
      }
    } catch (error) {
      console.error('Errore verifica amicizia:', error);
    }
  };

  const handleSendFriendRequest = async () => {
    if (!token) return;

    try {
      setSendingRequest(true);
      const res = await fetch(`${API_URL}/friends/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ toUserId: userId })
      });

      const data = await res.json();
      if (data.success) {
        setHasPendingRequest(true);
        Alert.alert('Successo', 'Richiesta di amicizia inviata');
      } else {
        Alert.alert('Errore', data.error || 'Errore durante l\'invio della richiesta');
      }
    } catch (error: any) {
      Alert.alert('Errore', error.message || 'Errore durante l\'invio');
    } finally {
      setSendingRequest(false);
    }
  };

  const loadPublicProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/user/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
      }
    } catch (error) {
      console.error('Errore caricamento profilo pubblico:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProfileImage = () => {
    if (user?.profileImage && characterImages[user.profileImage]) {
      return characterImages[user.profileImage];
    }
    return null;
  };

  const getMainImage = () => {
    if (user?.main && characterImages[user.main]) {
      return characterImages[user.main];
    }
    return null;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ThemedView style={styles.background} lightColor="#FFFFFF" darkColor="#FFFFFF">
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={nintendoRed} />
          </View>
        </ThemedView>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ThemedView style={styles.background} lightColor="#FFFFFF" darkColor="#FFFFFF">
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <FontAwesome5 name="arrow-left" size={20} color="#000000" />
            </TouchableOpacity>
            <ThemedText type="title" style={styles.title}>Profilo</ThemedText>
            <View style={styles.placeholder} />
          </View>
          <View style={styles.emptyContainer}>
            <FontAwesome5 name="user-slash" size={64} color="#999999" />
            <ThemedText style={styles.emptyText}>Utente non trovato</ThemedText>
          </View>
        </ThemedView>
      </SafeAreaView>
    );
  }

  const profileImageSource = getProfileImage();
  const mainImageSource = getMainImage();
  const hasInfo = user.main || user.description;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ThemedView style={styles.background} lightColor="#FFFFFF" darkColor="#FFFFFF">
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <FontAwesome5 name="arrow-left" size={20} color="#000000" />
          </TouchableOpacity>
          <ThemedText type="title" style={styles.title}>Profilo</ThemedText>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            {profileImageSource ? (
              <Image source={profileImageSource} style={styles.avatarImage} contentFit="contain" />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <FontAwesome5 name="user" size={40} color={nintendoRed} solid />
              </View>
            )}
            <ThemedText type="defaultSemiBold" style={styles.usernameText}>
              {user.username}
            </ThemedText>
            
            {/* Friend Request Button */}
            {isLoggedIn && currentUser && currentUser.id !== user.id && (
              <View style={styles.actionSection}>
                {!isFriend && !hasPendingRequest && (
                  <TouchableOpacity
                    style={styles.friendRequestButton}
                    onPress={handleSendFriendRequest}
                    disabled={sendingRequest}
                    activeOpacity={0.8}>
                    {sendingRequest ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <>
                        <FontAwesome5 name="user-plus" size={18} color="#FFFFFF" solid />
                        <ThemedText style={styles.friendRequestButtonText} lightColor="#FFFFFF" darkColor="#FFFFFF">
                          Invia Richiesta Amicizia
                        </ThemedText>
                      </>
                    )}
                  </TouchableOpacity>
                )}
                {hasPendingRequest && (
                  <View style={styles.pendingBadge}>
                    <FontAwesome5 name="clock" size={16} color="#FF9800" />
                    <ThemedText style={styles.pendingText}>Richiesta inviata</ThemedText>
                  </View>
                )}
                {isFriend && (
                  <View style={styles.friendBadge}>
                    <FontAwesome5 name="check" size={16} color="#4CAF50" />
                    <ThemedText style={styles.friendText}>Amico</ThemedText>
                  </View>
                )}
              </View>
            )}
          </View>

          {/* Main Character Section */}
          {user.main && (
            <ThemedView style={styles.profileCard}>
              <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
                Personaggio Principale
              </ThemedText>
              <View style={styles.mainSection}>
                {mainImageSource ? (
                  <Image source={mainImageSource} style={styles.mainImage} contentFit="contain" />
                ) : null}
                <ThemedText style={styles.mainName}>{user.main}</ThemedText>
              </View>
            </ThemedView>
          )}

          {/* Description Section */}
          {user.description && (
            <ThemedView style={styles.profileCard}>
              <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
                Descrizione
              </ThemedText>
              <ThemedText style={styles.descriptionText}>
                {user.description}
              </ThemedText>
            </ThemedView>
          )}

          {/* Se non ci sono informazioni */}
          {!hasInfo && (
            <View style={styles.emptyInfoContainer}>
              <FontAwesome5 name="info-circle" size={48} color="#CCCCCC" />
              <ThemedText style={styles.emptyInfoText}>
                Nessuna informazione disponibile
              </ThemedText>
            </View>
          )}
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 12,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#000000',
  },
  placeholder: {
    width: 36,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 4,
    borderColor: nintendoRed,
  },
  usernameText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  actionSection: {
    marginTop: 16,
    width: '100%',
    alignItems: 'center',
  },
  friendRequestButton: {
    backgroundColor: nintendoRed,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  friendRequestButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFF3E0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FF9800',
  },
  pendingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF9800',
  },
  friendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#E8F5E9',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  friendText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  mainSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  mainImage: {
    width: 64,
    height: 64,
  },
  mainName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  descriptionText: {
    fontSize: 16,
    color: '#000000',
    lineHeight: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#999999',
  },
  emptyInfoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyInfoText: {
    fontSize: 16,
    color: '#999999',
    textAlign: 'center',
  },
});

