import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity, ActivityIndicator, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { FontAwesome5 } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useLocalSearchParams } from 'expo-router';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://UR-IP:3000/api';
const nintendoRed = '#E60012';

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
  maxMembers: number;
  status: string;
};

type Message = {
  id: string;
  userId: string;
  username: string;
  message: string;
  createdAt: string;
};

export default function LobbyDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user, token, isLoggedIn } = useAuth();
  const lobbyId = params.lobbyId as string;

  const [lobby, setLobby] = useState<Lobby | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (lobbyId && isLoggedIn && token) {
      loadLobby();
      loadMessages();
      
      // Polling per aggiornare i messaggi ogni 2 secondi
      pollIntervalRef.current = setInterval(() => {
        loadMessages();
      }, 2000);

      return () => {
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
        }
      };
    }
  }, [lobbyId, isLoggedIn, token]);

  const loadLobby = async () => {
    try {
      const res = await fetch(`${API_URL}/lobbies/${lobbyId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setLobby(data.lobby);
      } else {
        router.back();
      }
    } catch (error) {
      console.error('Errore caricamento lobby:', error);
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    try {
      const res = await fetch(`${API_URL}/lobbies/${lobbyId}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages);
        // Scroll automatico all'ultimo messaggio
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    } catch (error) {
      console.error('Errore caricamento messaggi:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || sending) return;

    try {
      setSending(true);
      const res = await fetch(`${API_URL}/lobbies/${lobbyId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ message: messageText.trim() })
      });

      const data = await res.json();
      if (data.success) {
        setMessageText('');
        await loadMessages();
      }
    } catch (error) {
      console.error('Errore invio messaggio:', error);
    } finally {
      setSending(false);
    }
  };

  const getProfileImage = (profileImage?: string | null) => {
    if (profileImage && characterImages[profileImage]) {
      return characterImages[profileImage];
    }
    return null;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Adesso';
    if (minutes < 60) return `${minutes}m fa`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h fa`;
    return date.toLocaleDateString('it-IT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
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

  if (!lobby) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ThemedView style={styles.background} lightColor="#FFFFFF" darkColor="#FFFFFF">
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <FontAwesome5 name="arrow-left" size={20} color="#000000" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <ThemedText type="title" style={styles.title}>{lobby.name}</ThemedText>
            <ThemedText style={styles.memberCount}>
              {lobby.members.length}/{lobby.maxMembers} membri
            </ThemedText>
          </View>
          <View style={styles.placeholder} />
        </View>

        {/* Members Section */}
        <View style={styles.membersSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.membersScroll}>
            {lobby.members.map((member) => {
              const imgSrc = getProfileImage(member.profileImage);
              return (
                <TouchableOpacity
                  key={member.id}
                  style={styles.memberChip}
                  activeOpacity={0.7}>
                  {imgSrc ? (
                    <Image source={imgSrc} style={styles.memberChipAvatar} contentFit="contain" />
                  ) : (
                    <View style={styles.memberChipAvatarPlaceholder}>
                      <FontAwesome5 name="user" size={16} color="#999999" />
                    </View>
                  )}
                  <ThemedText style={styles.memberChipName} numberOfLines={1}>
                    {member.username}
                  </ThemedText>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Chat Section */}
        <KeyboardAvoidingView
          style={styles.chatContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesScroll}
            contentContainerStyle={styles.messagesContent}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}>
            {messages.length === 0 ? (
              <View style={styles.emptyChat}>
                <FontAwesome5 name="comments" size={48} color="#CCCCCC" />
                <ThemedText style={styles.emptyChatText}>
                  Nessun messaggio ancora
                </ThemedText>
                <ThemedText style={styles.emptyChatSubtext}>
                  Inizia la conversazione!
                </ThemedText>
              </View>
            ) : (
              messages.map((msg) => {
                const isOwnMessage = msg.userId === user?.id;
                const imgSrc = getProfileImage(
                  lobby.members.find(m => m.id === msg.userId)?.profileImage
                );
                return (
                  <View
                    key={msg.id}
                    style={[
                      styles.messageContainer,
                      isOwnMessage ? styles.messageContainerOwn : styles.messageContainerOther
                    ]}>
                    {!isOwnMessage && (
                      <View style={styles.messageAvatarContainer}>
                        {imgSrc ? (
                          <Image source={imgSrc} style={styles.messageAvatar} contentFit="contain" />
                        ) : (
                          <View style={styles.messageAvatarPlaceholder}>
                            <FontAwesome5 name="user" size={12} color="#999999" />
                          </View>
                        )}
                      </View>
                    )}
                    <View style={[
                      styles.messageBubble,
                      isOwnMessage ? styles.messageBubbleOwn : styles.messageBubbleOther
                    ]}>
                      {!isOwnMessage && (
                        <ThemedText style={styles.messageUsername}>{msg.username}</ThemedText>
                      )}
                      <ThemedText style={[
                        styles.messageText,
                        isOwnMessage ? styles.messageTextOwn : styles.messageTextOther
                      ]}>
                        {msg.message}
                      </ThemedText>
                      <ThemedText style={[
                        styles.messageTime,
                        isOwnMessage ? styles.messageTimeOwn : styles.messageTimeOther
                      ]}>
                        {formatTime(msg.createdAt)}
                      </ThemedText>
                    </View>
                  </View>
                );
              })
            )}
          </ScrollView>

          {/* Input Section */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={messageText}
              onChangeText={setMessageText}
              placeholder="Scrivi un messaggio..."
              placeholderTextColor="#999999"
              multiline
              maxLength={500}
              onSubmitEditing={handleSendMessage}
              returnKeyType="send"
            />
            <TouchableOpacity
              style={[styles.sendButton, (!messageText.trim() || sending) && styles.sendButtonDisabled]}
              onPress={handleSendMessage}
              disabled={!messageText.trim() || sending}
              activeOpacity={0.8}>
              {sending ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <FontAwesome5 name="paper-plane" size={18} color="#FFFFFF" solid />
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
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
    padding: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  memberCount: {
    fontSize: 14,
    color: '#666666',
  },
  placeholder: {
    width: 36,
  },
  membersSection: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  membersScroll: {
    paddingHorizontal: 20,
  },
  memberChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    gap: 8,
  },
  memberChipAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  memberChipAvatarPlaceholder: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberChipName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
    maxWidth: 100,
  },
  chatContainer: {
    flex: 1,
  },
  messagesScroll: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
    paddingBottom: 10,
  },
  emptyChat: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyChatText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999999',
  },
  emptyChatSubtext: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  messageContainerOwn: {
    justifyContent: 'flex-end',
  },
  messageContainerOther: {
    justifyContent: 'flex-start',
  },
  messageAvatarContainer: {
    marginRight: 8,
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  messageAvatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  messageBubbleOwn: {
    backgroundColor: nintendoRed,
    borderBottomRightRadius: 4,
  },
  messageBubbleOther: {
    backgroundColor: '#F5F5F5',
    borderBottomLeftRadius: 4,
  },
  messageUsername: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  messageTextOwn: {
    color: '#FFFFFF',
  },
  messageTextOther: {
    color: '#000000',
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
  },
  messageTimeOwn: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  messageTimeOther: {
    color: '#999999',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#000000',
    backgroundColor: '#F5F5F5',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: nintendoRed,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#CCCCCC',
    opacity: 0.6,
  },
});

