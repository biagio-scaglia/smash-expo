import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity, ActivityIndicator, TextInput, Modal, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { FontAwesome5 } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://UR-IP:3000/api';
const nintendoRed = '#E60012';

// Mapping immagini personaggi (semplificato)
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

type Lobby = {
  id: string;
  name: string;
  description: string;
  owner: { id: string; username: string; profileImage?: string | null };
  members: Array<{ id: string; username: string; profileImage?: string | null }>;
  invitedUsers: Array<{ id: string; username: string; profileImage?: string | null }>;
  maxMembers: number;
  status: string;
  createdAt: string;
};

type FriendRequest = {
  id: string;
  fromUser: { id: string; username: string; profileImage?: string | null };
  status: string;
  createdAt: string;
};

type User = {
  id: string;
  username: string;
  email: string;
  profileImage?: string | null;
};

export default function LobbyScreen() {
  const { user, token, isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<'lobbies' | 'open' | 'friends' | 'requests'>('lobbies');
  const [lobbies, setLobbies] = useState<Lobby[]>([]);
  const [openLobbies, setOpenLobbies] = useState<Lobby[]>([]);
  const [friends, setFriends] = useState<User[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // Modal states
  const [createLobbyModal, setCreateLobbyModal] = useState(false);
  const [searchUserModal, setSearchUserModal] = useState(false);
  const [lobbyForm, setLobbyForm] = useState({ name: '', description: '', maxMembers: '8' });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (isLoggedIn && token) {
      loadData();
    }
  }, [isLoggedIn, token, tab]);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      const timeoutId = setTimeout(async () => {
        try {
          setSearching(true);
          const res = await fetch(`${API_URL}/user/search?query=${encodeURIComponent(searchQuery)}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          if (data.success) {
            setSearchResults(data.users);
          }
        } catch (error) {
          console.error('Errore ricerca:', error);
        } finally {
          setSearching(false);
        }
      }, 500); // Debounce di 500ms
      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, token]);

  const loadData = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      if (tab === 'lobbies') {
        await loadLobbies();
      } else if (tab === 'open') {
        await loadOpenLobbies();
      } else if (tab === 'friends') {
        await loadFriends();
      } else if (tab === 'requests') {
        await loadFriendRequests();
      }
    } catch (error) {
      console.error('Errore caricamento dati:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadOpenLobbies = async () => {
    try {
      const res = await fetch(`${API_URL}/lobbies/open`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setOpenLobbies(data.lobbies);
      }
    } catch (error) {
      console.error('Errore caricamento lobby aperte:', error);
    }
  };

  const loadLobbies = async () => {
    try {
      const res = await fetch(`${API_URL}/lobbies/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setLobbies(data.lobbies);
      }
    } catch (error) {
      console.error('Errore caricamento lobby:', error);
    }
  };

  const loadFriends = async () => {
    try {
      const res = await fetch(`${API_URL}/friends/list`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setFriends(data.friends);
      }
    } catch (error) {
      console.error('Errore caricamento amici:', error);
    }
  };

  const loadFriendRequests = async () => {
    try {
      const res = await fetch(`${API_URL}/friends/requests/received`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setFriendRequests(data.requests);
      }
    } catch (error) {
      console.error('Errore caricamento richieste:', error);
    }
  };

  const handleCreateLobby = async () => {
    if (!lobbyForm.name.trim()) {
      Alert.alert('Errore', 'Inserisci un nome per la lobby');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/lobbies/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: lobbyForm.name,
          description: lobbyForm.description,
          maxMembers: parseInt(lobbyForm.maxMembers) || 8
        })
      });

      const data = await res.json();
      if (data.success) {
        Alert.alert('Successo', 'Lobby creata con successo');
        setCreateLobbyModal(false);
        setLobbyForm({ name: '', description: '', maxMembers: '8' });
        await loadLobbies();
        await loadOpenLobbies();
      } else {
        Alert.alert('Errore', data.error || 'Errore durante la creazione');
      }
    } catch (error: any) {
      Alert.alert('Errore', error.message || 'Errore durante la creazione');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchUsers = async () => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      setSearching(true);
      const res = await fetch(`${API_URL}/user/search?query=${encodeURIComponent(searchQuery)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setSearchResults(data.users);
      }
    } catch (error) {
      console.error('Errore ricerca:', error);
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    if (searchQuery.length >= 2) {
      const timeoutId = setTimeout(async () => {
        try {
          setSearching(true);
          const res = await fetch(`${API_URL}/user/search?query=${encodeURIComponent(searchQuery)}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          if (data.success) {
            setSearchResults(data.users);
          }
        } catch (error) {
          console.error('Errore ricerca:', error);
        } finally {
          setSearching(false);
        }
      }, 500); // Debounce di 500ms
      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, token]);

  const handleSendFriendRequest = async (userId: string) => {
    try {
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
        Alert.alert('Successo', 'Richiesta di amicizia inviata');
        setSearchUserModal(false);
        setSearchQuery('');
      } else {
        Alert.alert('Errore', data.error || 'Errore durante l\'invio');
      }
    } catch (error: any) {
      Alert.alert('Errore', error.message || 'Errore durante l\'invio');
    }
  };

  const handleAcceptFriendRequest = async (requestId: string) => {
    try {
      const res = await fetch(`${API_URL}/friends/accept/${requestId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (data.success) {
        Alert.alert('Successo', 'Richiesta accettata');
        await loadFriendRequests();
        await loadFriends();
      } else {
        Alert.alert('Errore', data.error || 'Errore durante l\'accettazione');
      }
    } catch (error: any) {
      Alert.alert('Errore', error.message || 'Errore durante l\'accettazione');
    }
  };

  const handleRejectFriendRequest = async (requestId: string) => {
    try {
      const res = await fetch(`${API_URL}/friends/reject/${requestId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (data.success) {
        await loadFriendRequests();
      }
    } catch (error: any) {
      Alert.alert('Errore', error.message || 'Errore durante il rifiuto');
    }
  };

  const handleInviteToLobby = async (lobbyId: string, userId: string) => {
    try {
      const res = await fetch(`${API_URL}/lobbies/${lobbyId}/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId })
      });

      const data = await res.json();
      if (data.success) {
        Alert.alert('Successo', 'Invito inviato');
        await loadLobbies();
        await loadOpenLobbies();
      } else {
        Alert.alert('Errore', data.error || 'Errore durante l\'invio');
      }
    } catch (error: any) {
      Alert.alert('Errore', error.message || 'Errore durante l\'invio');
    }
  };

  const handleJoinLobby = async (lobbyId: string) => {
    try {
      const res = await fetch(`${API_URL}/lobbies/${lobbyId}/join`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (data.success) {
        Alert.alert('Successo', 'Ti sei unito alla lobby');
        await loadLobbies();
        await loadOpenLobbies();
      } else {
        Alert.alert('Errore', data.error || 'Errore durante l\'unione');
      }
    } catch (error: any) {
      Alert.alert('Errore', error.message || 'Errore durante l\'unione');
    }
  };

  const handleDeleteLobby = async (lobbyId: string) => {
    Alert.alert(
      'Cancella Lobby',
      'Sei sicuro di voler cancellare questa lobby? Tutti i membri verranno rimossi.',
      [
        { text: 'Annulla', style: 'cancel' },
        {
          text: 'Cancella',
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await fetch(`${API_URL}/lobbies/${lobbyId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
              });
              const data = await res.json();
              if (data.success) {
                Alert.alert('Successo', 'Lobby cancellata');
                await loadLobbies();
                await loadOpenLobbies();
              } else {
                Alert.alert('Errore', data.error || 'Errore durante la cancellazione');
              }
            } catch (error: any) {
              Alert.alert('Errore', error.message);
            }
          }
        }
      ]
    );
  };

  const handleLeaveLobby = async (lobbyId: string) => {
    Alert.alert(
      'Lascia Lobby',
      'Sei sicuro di voler lasciare questa lobby?',
      [
        { text: 'Annulla', style: 'cancel' },
        {
          text: 'Lascia',
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await fetch(`${API_URL}/lobbies/${lobbyId}/leave`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
              });
              const data = await res.json();
              if (data.success) {
                await loadLobbies();
                await loadOpenLobbies();
              }
            } catch (error: any) {
              Alert.alert('Errore', error.message);
            }
          }
        }
      ]
    );
  };

  const handleViewProfile = (userId: string) => {
    router.push({ pathname: '/user-profile', params: { userId } });
  };

  const getProfileImage = (profileImage?: string | null) => {
    if (profileImage && characterImages[profileImage]) {
      return characterImages[profileImage];
    }
    return null;
  };

  if (isLoading && !lobbies.length && !openLobbies.length && !friends.length) {
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

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ThemedView style={styles.background} lightColor="#FFFFFF" darkColor="#FFFFFF">
          <View style={styles.notLoggedInContainer}>
            <FontAwesome5 name="user-slash" size={64} color="#999999" />
            <ThemedText type="defaultSemiBold" style={styles.notLoggedInText}>
              Accedi per usare le lobby
            </ThemedText>
          </View>
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ThemedView style={styles.background} lightColor="#FFFFFF" darkColor="#FFFFFF">
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>Lobby</ThemedText>
          {tab === 'lobbies' && (
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => setCreateLobbyModal(true)}>
              <FontAwesome5 name="plus" size={18} color="#FFFFFF" solid />
            </TouchableOpacity>
          )}
          {tab === 'friends' && (
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => setSearchUserModal(true)}>
              <FontAwesome5 name="user-plus" size={18} color="#FFFFFF" solid />
            </TouchableOpacity>
          )}
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, tab === 'lobbies' && styles.tabActive]}
            onPress={() => setTab('lobbies')}>
            <FontAwesome5 name="users" size={16} color={tab === 'lobbies' ? nintendoRed : '#999999'} />
            <ThemedText style={[styles.tabText, tab === 'lobbies' && styles.tabTextActive]}>
              Mie Lobby
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, tab === 'open' && styles.tabActive]}
            onPress={() => setTab('open')}>
            <FontAwesome5 name="door-open" size={16} color={tab === 'open' ? nintendoRed : '#999999'} />
            <ThemedText style={[styles.tabText, tab === 'open' && styles.tabTextActive]}>
              Aperte
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, tab === 'friends' && styles.tabActive]}
            onPress={() => setTab('friends')}>
            <FontAwesome5 name="user-friends" size={16} color={tab === 'friends' ? nintendoRed : '#999999'} />
            <ThemedText style={[styles.tabText, tab === 'friends' && styles.tabTextActive]}>
              Amici
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, tab === 'requests' && styles.tabActive]}
            onPress={() => setTab('requests')}>
            <FontAwesome5 name="bell" size={16} color={tab === 'requests' ? nintendoRed : '#999999'} />
            <ThemedText style={[styles.tabText, tab === 'requests' && styles.tabTextActive]}>
              Richieste
              {friendRequests.length > 0 && (
                <View style={styles.badge}>
                  <ThemedText style={styles.badgeText}>{friendRequests.length}</ThemedText>
                </View>
              )}
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadData(); }} />
          }>
          
          {tab === 'lobbies' && (
            <View style={styles.content}>
              {lobbies.length === 0 ? (
                <View style={styles.emptyState}>
                  <FontAwesome5 name="users" size={48} color="#CCCCCC" />
                  <ThemedText style={styles.emptyText}>Nessuna lobby</ThemedText>
                  <ThemedText style={styles.emptySubtext}>Crea una nuova lobby per iniziare</ThemedText>
                </View>
              ) : (
                lobbies.map((lobby) => (
                  <View key={lobby.id} style={styles.lobbyCard}>
                    <View style={styles.lobbyHeader}>
                      <View style={styles.lobbyTitleRow}>
                        <ThemedText type="defaultSemiBold" style={styles.lobbyName}>{lobby.name}</ThemedText>
                        {lobby.owner.id === user?.id && (
                          <View style={styles.ownerBadge}>
                            <FontAwesome5 name="crown" size={12} color="#FFD700" solid />
                          </View>
                        )}
                      </View>
                      {lobby.owner.id === user?.id ? (
                        <TouchableOpacity onPress={() => handleDeleteLobby(lobby.id)}>
                          <FontAwesome5 name="trash-alt" size={18} color="#DC3545" />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity onPress={() => handleLeaveLobby(lobby.id)}>
                          <FontAwesome5 name="times" size={18} color="#999999" />
                        </TouchableOpacity>
                      )}
                    </View>
                    
                    {lobby.description && (
                      <ThemedText style={styles.lobbyDescription}>{lobby.description}</ThemedText>
                    )}
                    
                      <View style={styles.membersSection}>
                        <ThemedText style={styles.membersTitle}>
                          Membri ({lobby.members.length}/{lobby.maxMembers})
                        </ThemedText>
                        <View style={styles.membersList}>
                          {lobby.members.map((member) => {
                            const imgSrc = getProfileImage(member.profileImage);
                            return (
                              <TouchableOpacity 
                                key={member.id} 
                                style={styles.memberItem}
                                onPress={() => handleViewProfile(member.id)}
                                activeOpacity={0.7}>
                                {imgSrc ? (
                                  <Image source={imgSrc} style={styles.memberAvatar} contentFit="contain" />
                                ) : (
                                  <View style={styles.memberAvatarPlaceholder}>
                                    <FontAwesome5 name="user" size={16} color="#999999" />
                                  </View>
                                )}
                                <ThemedText style={styles.memberName}>{member.username}</ThemedText>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      </View>

                    {lobby.invitedUsers.length > 0 && (
                      <View style={styles.invitedSection}>
                        <ThemedText style={styles.invitedTitle}>Invitati</ThemedText>
                        <View style={styles.membersList}>
                          {lobby.invitedUsers.map((invited) => {
                            const imgSrc = getProfileImage(invited.profileImage);
                            return (
                              <TouchableOpacity 
                                key={invited.id} 
                                style={styles.memberItem}
                                onPress={() => handleViewProfile(invited.id)}
                                activeOpacity={0.7}>
                                {imgSrc ? (
                                  <Image source={imgSrc} style={styles.memberAvatar} contentFit="contain" />
                                ) : (
                                  <View style={styles.memberAvatarPlaceholder}>
                                    <FontAwesome5 name="user" size={16} color="#999999" />
                                  </View>
                                )}
                                <ThemedText style={styles.memberName}>{invited.username}</ThemedText>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      </View>
                    )}

                    <TouchableOpacity
                      style={styles.enterLobbyButton}
                      onPress={() => router.push({ pathname: '/lobby-detail', params: { lobbyId: lobby.id } })}
                      activeOpacity={0.8}>
                      <FontAwesome5 name="comments" size={18} color="#FFFFFF" solid />
                      <ThemedText style={styles.enterLobbyButtonText} lightColor="#FFFFFF" darkColor="#FFFFFF">
                        Entra nella Lobby
                      </ThemedText>
                    </TouchableOpacity>

                    {lobby.owner.id === user?.id && (
                      <TouchableOpacity
                        style={styles.inviteButton}
                        onPress={() => {
                          Alert.alert(
                            'Invita Amico',
                            'Vuoi invitare un amico o cercare un utente?',
                            [
                              { text: 'Annulla', style: 'cancel' },
                              {
                                text: 'Dai miei amici',
                                onPress: () => {
                                  // Mostra lista amici per invitare
                                  if (friends.length === 0) {
                                    Alert.alert('Nessun amico', 'Non hai amici da invitare');
                                    return;
                                  }
                                  const friendButtons: Array<{ text: string; onPress?: () => void; style?: 'cancel' | 'default' | 'destructive' }> = friends.map((friend) => ({
                                    text: friend.username,
                                    onPress: () => handleInviteToLobby(lobby.id, friend.id)
                                  }));
                                  friendButtons.push({ text: 'Annulla', style: 'cancel' });
                                  Alert.alert(
                                    'Scegli Amico',
                                    friends.map(f => f.username).join('\n'),
                                    friendButtons
                                  );
                                }
                              },
                              {
                                text: 'Cerca utente',
                                onPress: () => setSearchUserModal(true)
                              }
                            ]
                          );
                        }}>
                        <FontAwesome5 name="user-plus" size={16} color={nintendoRed} />
                        <ThemedText style={styles.inviteButtonText}>Invita</ThemedText>
                      </TouchableOpacity>
                    )}
                  </View>
                ))
              )}
            </View>
          )}

          {tab === 'open' && (
            <View style={styles.content}>
              {openLobbies.length === 0 ? (
                <View style={styles.emptyState}>
                  <FontAwesome5 name="door-open" size={48} color="#CCCCCC" />
                  <ThemedText style={styles.emptyText}>Nessuna lobby aperta</ThemedText>
                  <ThemedText style={styles.emptySubtext}>Crea una lobby per iniziare</ThemedText>
                </View>
              ) : (
                openLobbies.map((lobby) => {
                  const isMember = lobby.members.some(m => m.id === user?.id);
                  const isFull = lobby.members.length >= lobby.maxMembers;
                  return (
                    <View key={lobby.id} style={styles.lobbyCard}>
                      <View style={styles.lobbyHeader}>
                        <View style={styles.lobbyTitleRow}>
                          <ThemedText type="defaultSemiBold" style={styles.lobbyName}>{lobby.name}</ThemedText>
                          {isFull && (
                            <View style={styles.fullBadge}>
                              <FontAwesome5 name="lock" size={12} color="#DC3545" solid />
                              <ThemedText style={styles.fullBadgeText}>Piena</ThemedText>
                            </View>
                          )}
                        </View>
                      </View>
                      
                      {lobby.description && (
                        <ThemedText style={styles.lobbyDescription}>{lobby.description}</ThemedText>
                      )}
                      
                      <View style={styles.membersSection}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                          <ThemedText style={styles.membersTitle}>Creato da: </ThemedText>
                          <TouchableOpacity onPress={() => handleViewProfile(lobby.owner.id)} activeOpacity={0.7}>
                            <ThemedText style={[styles.membersTitle, { color: nintendoRed, fontWeight: 'bold' }]}>{lobby.owner.username}</ThemedText>
                          </TouchableOpacity>
                        </View>
                        <ThemedText style={styles.membersTitle}>
                          Membri ({lobby.members.length}/{lobby.maxMembers})
                        </ThemedText>
                        <View style={styles.membersList}>
                          {lobby.members.map((member) => {
                            const imgSrc = getProfileImage(member.profileImage);
                            return (
                              <TouchableOpacity 
                                key={member.id} 
                                style={styles.memberItem}
                                onPress={() => handleViewProfile(member.id)}
                                activeOpacity={0.7}>
                                {imgSrc ? (
                                  <Image source={imgSrc} style={styles.memberAvatar} contentFit="contain" />
                                ) : (
                                  <View style={styles.memberAvatarPlaceholder}>
                                    <FontAwesome5 name="user" size={16} color="#999999" />
                                  </View>
                                )}
                                <ThemedText style={styles.memberName}>{member.username}</ThemedText>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      </View>

                      {!isMember && (
                        <TouchableOpacity
                          style={[styles.joinButton, isFull && styles.joinButtonDisabled]}
                          onPress={() => !isFull && handleJoinLobby(lobby.id)}
                          disabled={isFull}>
                          {isFull ? (
                            <>
                              <FontAwesome5 name="lock" size={16} color="#FFFFFF" />
                              <ThemedText style={styles.joinButtonText} lightColor="#FFFFFF" darkColor="#FFFFFF">
                                Lobby Piena
                              </ThemedText>
                            </>
                          ) : (
                            <>
                              <FontAwesome5 name="sign-in-alt" size={16} color="#FFFFFF" />
                              <ThemedText style={styles.joinButtonText} lightColor="#FFFFFF" darkColor="#FFFFFF">
                                Unisciti
                              </ThemedText>
                            </>
                          )}
                        </TouchableOpacity>
                      )}
                      {isMember && (
                        <>
                          <TouchableOpacity
                            style={styles.enterLobbyButton}
                            onPress={() => router.push({ pathname: '/lobby-detail', params: { lobbyId: lobby.id } })}
                            activeOpacity={0.8}>
                            <FontAwesome5 name="comments" size={18} color="#FFFFFF" solid />
                            <ThemedText style={styles.enterLobbyButtonText} lightColor="#FFFFFF" darkColor="#FFFFFF">
                              Entra nella Lobby
                            </ThemedText>
                          </TouchableOpacity>
                          <View style={styles.memberBadge}>
                            <FontAwesome5 name="check" size={16} color="#4CAF50" />
                            <ThemedText style={styles.memberBadgeText}>Sei membro</ThemedText>
                          </View>
                        </>
                      )}
                    </View>
                  );
                })
              )}
            </View>
          )}

          {tab === 'friends' && (
            <View style={styles.content}>
              {friends.length === 0 ? (
                <View style={styles.emptyState}>
                  <FontAwesome5 name="user-friends" size={48} color="#CCCCCC" />
                  <ThemedText style={styles.emptyText}>Nessun amico</ThemedText>
                  <ThemedText style={styles.emptySubtext}>Cerca utenti per aggiungere amici</ThemedText>
                </View>
              ) : (
                friends.map((friend) => {
                  const imgSrc = getProfileImage(friend.profileImage);
                  return (
                    <View key={friend.id} style={styles.friendCard}>
                      {imgSrc ? (
                        <Image source={imgSrc} style={styles.friendAvatar} contentFit="contain" />
                      ) : (
                        <View style={styles.friendAvatarPlaceholder}>
                          <FontAwesome5 name="user" size={24} color="#999999" />
                        </View>
                      )}
                      <View style={styles.friendInfo}>
                        <TouchableOpacity onPress={() => handleViewProfile(friend.id)} activeOpacity={0.7}>
                          <ThemedText type="defaultSemiBold" style={styles.friendName}>{friend.username}</ThemedText>
                        </TouchableOpacity>
                        <ThemedText style={styles.friendEmail}>{friend.email}</ThemedText>
                      </View>
                      <TouchableOpacity
                        style={styles.viewProfileButton}
                        onPress={() => handleViewProfile(friend.id)}
                        activeOpacity={0.8}>
                        <FontAwesome5 name="user" size={16} color={nintendoRed} />
                      </TouchableOpacity>
                    </View>
                  );
                })
              )}
            </View>
          )}

          {tab === 'requests' && (
            <View style={styles.content}>
              {friendRequests.length === 0 ? (
                <View style={styles.emptyState}>
                  <FontAwesome5 name="bell-slash" size={48} color="#CCCCCC" />
                  <ThemedText style={styles.emptyText}>Nessuna richiesta</ThemedText>
                </View>
              ) : (
                friendRequests.map((request) => {
                  const imgSrc = getProfileImage(request.fromUser.profileImage);
                  return (
                    <View key={request.id} style={styles.requestCard}>
                      {imgSrc ? (
                        <Image source={imgSrc} style={styles.friendAvatar} contentFit="contain" />
                      ) : (
                        <View style={styles.friendAvatarPlaceholder}>
                          <FontAwesome5 name="user" size={24} color="#999999" />
                        </View>
                      )}
                      <View style={styles.friendInfo}>
                        <TouchableOpacity onPress={() => handleViewProfile(request.fromUser.id)} activeOpacity={0.7}>
                          <ThemedText type="defaultSemiBold" style={styles.friendName}>
                            {request.fromUser.username}
                          </ThemedText>
                        </TouchableOpacity>
                        <ThemedText style={styles.friendEmail}>vuole essere tuo amico</ThemedText>
                      </View>
                      <View style={styles.requestActions}>
                        <TouchableOpacity
                          style={styles.viewProfileButton}
                          onPress={() => handleViewProfile(request.fromUser.id)}
                          activeOpacity={0.8}>
                          <FontAwesome5 name="user" size={14} color={nintendoRed} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.acceptButton}
                          onPress={() => handleAcceptFriendRequest(request.id)}>
                          <FontAwesome5 name="check" size={16} color="#FFFFFF" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.rejectButton}
                          onPress={() => handleRejectFriendRequest(request.id)}>
                          <FontAwesome5 name="times" size={16} color="#FFFFFF" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          )}
        </ScrollView>

        {/* Create Lobby Modal */}
        <Modal visible={createLobbyModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <ThemedView style={styles.modalContent} lightColor="#FFFFFF" darkColor="#FFFFFF">
              <View style={styles.modalHeader}>
                <ThemedText type="defaultSemiBold" style={styles.modalTitle}>Crea Lobby</ThemedText>
                <TouchableOpacity onPress={() => setCreateLobbyModal(false)}>
                  <FontAwesome5 name="times" size={20} color="#000000" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <ThemedText style={styles.label}>Nome Lobby *</ThemedText>
                  <TextInput
                    style={styles.input}
                    value={lobbyForm.name}
                    onChangeText={(text) => setLobbyForm({ ...lobbyForm, name: text })}
                    placeholder="Nome della lobby"
                    placeholderTextColor="#999999"
                  />
                </View>
                
                <View style={styles.inputGroup}>
                  <ThemedText style={styles.label}>Descrizione</ThemedText>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={lobbyForm.description}
                    onChangeText={(text) => setLobbyForm({ ...lobbyForm, description: text })}
                    placeholder="Descrizione (opzionale)"
                    placeholderTextColor="#999999"
                    multiline
                    numberOfLines={3}
                  />
                </View>
                
                <View style={styles.inputGroup}>
                  <ThemedText style={styles.label}>Numero Massimo Membri</ThemedText>
                  <TextInput
                    style={styles.input}
                    value={lobbyForm.maxMembers}
                    onChangeText={(text) => setLobbyForm({ ...lobbyForm, maxMembers: text })}
                    placeholder="8"
                    placeholderTextColor="#999999"
                    keyboardType="numeric"
                  />
                </View>
                
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleCreateLobby}
                  disabled={loading}>
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <>
                      <FontAwesome5 name="plus" size={18} color="#FFFFFF" solid />
                      <ThemedText style={styles.submitButtonText} lightColor="#FFFFFF" darkColor="#FFFFFF">
                        Crea Lobby
                      </ThemedText>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </ThemedView>
          </View>
        </Modal>

        {/* Search User Modal */}
        <Modal visible={searchUserModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <ThemedView style={styles.modalContent} lightColor="#FFFFFF" darkColor="#FFFFFF">
              <View style={styles.modalHeader}>
                <ThemedText type="defaultSemiBold" style={styles.modalTitle}>Cerca Utenti</ThemedText>
                <TouchableOpacity onPress={() => {
                  setSearchUserModal(false);
                  setSearchQuery('');
                  setSearchResults([]);
                }}>
                  <FontAwesome5 name="times" size={20} color="#000000" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.searchContainer}>
                <TextInput
                  style={styles.searchInput}
                  value={searchQuery}
                  onChangeText={(text) => setSearchQuery(text)}
                  placeholder="Cerca per username o email..."
                  placeholderTextColor="#999999"
                  autoCapitalize="none"
                />
                {searching && <ActivityIndicator size="small" color={nintendoRed} style={styles.searchLoader} />}
              </View>
              
              <ScrollView style={styles.searchResults}>
                {searchResults.map((searchUser) => {
                  const imgSrc = getProfileImage(searchUser.profileImage);
                  const isFriend = friends.some(f => f.id === searchUser.id);
                  const isMember = tab === 'lobbies' && lobbies.some(l => l.members.some(m => m.id === searchUser.id));
                  return (
                    <View key={searchUser.id} style={styles.searchResultItem}>
                      {imgSrc ? (
                        <Image source={imgSrc} style={styles.friendAvatar} contentFit="contain" />
                      ) : (
                        <View style={styles.friendAvatarPlaceholder}>
                          <FontAwesome5 name="user" size={24} color="#999999" />
                        </View>
                      )}
                      <View style={styles.friendInfo}>
                        <TouchableOpacity onPress={() => handleViewProfile(searchUser.id)} activeOpacity={0.7}>
                          <ThemedText type="defaultSemiBold" style={styles.friendName}>{searchUser.username}</ThemedText>
                        </TouchableOpacity>
                        <ThemedText style={styles.friendEmail}>{searchUser.email}</ThemedText>
                      </View>
                      <View style={styles.searchResultActions}>
                        <TouchableOpacity
                          style={styles.viewProfileButton}
                          onPress={() => handleViewProfile(searchUser.id)}
                          activeOpacity={0.8}>
                          <FontAwesome5 name="user" size={16} color={nintendoRed} />
                        </TouchableOpacity>
                        {!isFriend && (
                          <TouchableOpacity
                            style={styles.addFriendButton}
                            onPress={() => handleSendFriendRequest(searchUser.id)}>
                            <FontAwesome5 name="user-plus" size={16} color={nintendoRed} />
                          </TouchableOpacity>
                        )}
                        {isFriend && (
                          <View style={styles.friendBadge}>
                            <FontAwesome5 name="check" size={16} color="#4CAF50" />
                          </View>
                        )}
                      </View>
                    </View>
                  );
                })}
                {searchQuery.length >= 2 && searchResults.length === 0 && !searching && (
                  <View style={styles.emptyState}>
                    <ThemedText style={styles.emptyText}>Nessun risultato</ThemedText>
                  </View>
                )}
              </ScrollView>
            </ThemedView>
          </View>
        </Modal>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  notLoggedInContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 },
  notLoggedInText: { fontSize: 18, color: '#999999' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingBottom: 12 },
  title: { fontSize: 42, fontWeight: 'bold', color: '#000000' },
  createButton: { backgroundColor: nintendoRed, width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 },
  tabs: { flexDirection: 'row', paddingHorizontal: 20, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, gap: 6 },
  tabActive: { borderBottomWidth: 2, borderBottomColor: nintendoRed },
  tabText: { fontSize: 14, fontWeight: '600', color: '#999999' },
  tabTextActive: { color: nintendoRed },
  badge: { backgroundColor: nintendoRed, borderRadius: 10, minWidth: 20, height: 20, justifyContent: 'center', alignItems: 'center', marginLeft: 4, paddingHorizontal: 6 },
  badgeText: { fontSize: 10, fontWeight: 'bold', color: '#FFFFFF' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  content: { gap: 16 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, gap: 12 },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#999999' },
  emptySubtext: { fontSize: 14, color: '#CCCCCC', textAlign: 'center' },
  lobbyCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, borderWidth: 2, borderColor: nintendoRed, gap: 16, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  lobbyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  lobbyTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  lobbyName: { fontSize: 18, fontWeight: 'bold', color: '#000000' },
  ownerBadge: { backgroundColor: '#FFF5E6', padding: 4, borderRadius: 4 },
  lobbyDescription: { fontSize: 14, color: '#666666' },
  membersSection: { gap: 8 },
  membersTitle: { fontSize: 14, fontWeight: '600', color: '#666666' },
  membersList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  memberItem: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#F5F5F5', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, borderWidth: 1, borderColor: '#E8E8E8' },
  memberAvatar: { width: 32, height: 32, borderRadius: 16 },
  memberAvatarPlaceholder: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center' },
  memberName: { fontSize: 12, color: '#000000' },
  invitedSection: { gap: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  invitedTitle: { fontSize: 14, fontWeight: '600', color: '#999999' },
  inviteButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12, borderWidth: 2, borderColor: nintendoRed, gap: 8 },
  inviteButtonText: { fontSize: 14, fontWeight: '600', color: nintendoRed },
  friendCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E0E0E0', flexDirection: 'row', alignItems: 'center', gap: 12, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  friendAvatar: { width: 48, height: 48, borderRadius: 24 },
  friendAvatarPlaceholder: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center' },
  friendInfo: { flex: 1 },
  friendName: { fontSize: 16, fontWeight: '600', color: '#000000' },
  friendEmail: { fontSize: 12, color: '#999999' },
  requestCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E0E0E0', flexDirection: 'row', alignItems: 'center', gap: 12, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  requestActions: { flexDirection: 'row', gap: 8 },
  viewProfileButton: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: nintendoRed, justifyContent: 'center', alignItems: 'center' },
  searchResultActions: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  acceptButton: { backgroundColor: '#4CAF50', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  rejectButton: { backgroundColor: '#DC3545', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 24, paddingBottom: 40, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#000000' },
  form: { paddingHorizontal: 20, gap: 20 },
  inputGroup: { gap: 8 },
  label: { fontSize: 14, fontWeight: '600', color: '#666666' },
  input: { fontSize: 16, color: '#000000', backgroundColor: '#F5F5F5', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, borderWidth: 1, borderColor: '#E0E0E0' },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  submitButton: { backgroundColor: nintendoRed, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 12, gap: 10, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 5 },
  submitButtonText: { fontSize: 18, fontWeight: '700' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16, gap: 12 },
  searchInput: { flex: 1, fontSize: 16, color: '#000000', backgroundColor: '#F5F5F5', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, borderWidth: 1, borderColor: '#E0E0E0' },
  searchLoader: { position: 'absolute', right: 30 },
  searchResults: { paddingHorizontal: 20, maxHeight: 400 },
  searchResultItem: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#E0E0E0', flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  addFriendButton: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: nintendoRed, justifyContent: 'center', alignItems: 'center' },
  friendBadge: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center' },
  joinButton: { backgroundColor: '#4CAF50', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12, gap: 8, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 },
  joinButtonDisabled: { backgroundColor: '#999999', opacity: 0.6 },
  joinButtonText: { fontSize: 14, fontWeight: '600' },
  fullBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FFE5E5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  fullBadgeText: { fontSize: 12, fontWeight: '600', color: '#DC3545' },
  memberBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#E8F5E9', paddingVertical: 12, borderRadius: 12 },
  memberBadgeText: { fontSize: 14, fontWeight: '600', color: '#4CAF50' },
  enterLobbyButton: { backgroundColor: nintendoRed, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 12, gap: 10, marginTop: 8, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 4 },
  enterLobbyButtonText: { fontSize: 16, fontWeight: '700' },
});

