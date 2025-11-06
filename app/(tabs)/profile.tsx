import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity, ActivityIndicator, TextInput, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { FontAwesome5 } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useAuth } from '@/contexts/AuthContext';

const nintendoRed = '#E60012';

// Importa il mapping delle immagini da character-card
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
  'Ice Climbers': require('@/assets/images/Pngs/ice_climbers.png'),
  'Sheik': require('@/assets/images/Pngs/sheik.png'),
  'Zelda': require('@/assets/images/Pngs/zelda.png'),
  'Dr. Mario': require('@/assets/images/Pngs/dr_mario.png'),
  'Pichu': require('@/assets/images/Pngs/pichu.png'),
  'Falco': require('@/assets/images/Pngs/falco.png'),
  'Marth': require('@/assets/images/Pngs/marth.png'),
  'Young Link': require('@/assets/images/Pngs/young_link.png'),
  'Ganondorf': require('@/assets/images/Pngs/ganondorf.png'),
  'Mewtwo': require('@/assets/images/Pngs/mewtwo.png'),
  'Roy': require('@/assets/images/Pngs/roy.png'),
  'Mr. Game & Watch': require('@/assets/images/Pngs/mr_game_and_watch.png'),
  'Meta Knight': require('@/assets/images/Pngs/meta_knight.png'),
  'Pit': require('@/assets/images/Pngs/pit.png'),
  'Zero Suit Samus': require('@/assets/images/Pngs/zero_suit_samus.png'),
  'Wario': require('@/assets/images/Pngs/wario.png'),
  'Snake': require('@/assets/images/Pngs/snake.png'),
  'Ike': require('@/assets/images/Pngs/ike.png'),
  'Pokémon Trainer': require('@/assets/images/Pngs/pokemon_trainer.png'),
  'Diddy Kong': require('@/assets/images/Pngs/diddy_kong.png'),
  'Sonic': require('@/assets/images/Pngs/sonic.png'),
  'King Dedede': require('@/assets/images/Pngs/king_dedede.png'),
  'Olimar': require('@/assets/images/Pngs/olimar.png'),
  'Lucario': require('@/assets/images/Pngs/lucario.png'),
  'R.O.B.': require('@/assets/images/Pngs/rob.png'),
  'Toon Link': require('@/assets/images/Pngs/toon_link.png'),
  'Wolf': require('@/assets/images/Pngs/wolf.png'),
  'Villager': require('@/assets/images/Pngs/villager.png'),
  'Mega Man': require('@/assets/images/Pngs/mega_man.png'),
  'Wii Fit Trainer': require('@/assets/images/Pngs/wii_fit_trainer.png'),
  'Rosalina & Luma': require('@/assets/images/Pngs/rosalina_and_luma.png'),
  'Little Mac': require('@/assets/images/Pngs/little_mac.png'),
  'Greninja': require('@/assets/images/Pngs/greninja.png'),
  'Palutena': require('@/assets/images/Pngs/palutena.png'),
  'Pac-Man': require('@/assets/images/Pngs/pac_man.png'),
  'Robin': require('@/assets/images/Pngs/robin.png'),
  'Shulk': require('@/assets/images/Pngs/shulk.png'),
  'Bowser Jr.': require('@/assets/images/Pngs/bowser_jr.png'),
  'Duck Hunt': require('@/assets/images/Pngs/duck_hunt.png'),
  'Ryu': require('@/assets/images/Pngs/ryu.png'),
  'Ken': require('@/assets/images/Pngs/ken.png'),
  'Cloud': require('@/assets/images/Pngs/cloud.png'),
  'Corrin': require('@/assets/images/Pngs/corrin.png'),
  'Bayonetta': require('@/assets/images/Pngs/bayonetta.png'),
  'Inkling': require('@/assets/images/Pngs/inkling.png'),
  'Ridley': require('@/assets/images/Pngs/ridley.png'),
  'Simon': require('@/assets/images/Pngs/simon.png'),
  'Richter': require('@/assets/images/Pngs/richter.png'),
  'King K. Rool': require('@/assets/images/Pngs/king_k_rool.png'),
  'Isabelle': require('@/assets/images/Pngs/isabelle.png'),
  'Incineroar': require('@/assets/images/Pngs/gaogaen.png'),
  'Piranha Plant': require('@/assets/images/Pngs/packun_flower.png'),
  'Joker': require('@/assets/images/Pngs/joker.png'),
  'Hero': require('@/assets/images/Pngs/dq_hero.png'),
  'Banjo & Kazooie': require('@/assets/images/Pngs/banjo_and_kazooie.png'),
  'Terry': require('@/assets/images/Pngs/Terry.png'),
  'Byleth': require('@/assets/images/Pngs/byleth.png'),
  'Min Min': require('@/assets/images/Pngs/minmin.png'),
  'Steve': require('@/assets/images/Pngs/steve.png'),
  'Sephiroth': require('@/assets/images/Pngs/sephiroth.png'),
  'Pyra/Mythra': require('@/assets/images/Pngs/homura.png'),
  'Kazuya': require('@/assets/images/Pngs/kazuya.png'),
  'Sora': require('@/assets/images/Pngs/sora.png'),
};

// Lista personaggi disponibili (usa solo i nomi per il selettore)
const allCharacters = Object.keys(characterImages).map(name => ({ name }));

export default function ProfileScreen() {
  const { user, isLoggedIn, updateProfile, deleteAccount, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [characterModalVisible, setCharacterModalVisible] = useState(false);
  const [mainModalVisible, setMainModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    description: user?.description || '',
  });

  React.useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        description: user.description || '',
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    try {
      setIsSaving(true);
      await updateProfile({
        username: formData.username,
        email: formData.email,
        description: formData.description,
      });
      setIsEditing(false);
      Alert.alert('Successo', 'Profilo aggiornato con successo');
    } catch (error: any) {
      Alert.alert('Errore', error.message || 'Errore durante l\'aggiornamento');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectMain = async (characterName: string) => {
    if (!user) return;

    try {
      setIsSaving(true);
      await updateProfile({ main: characterName });
      setMainModalVisible(false);
      Alert.alert('Successo', 'Personaggio principale aggiornato');
    } catch (error: any) {
      Alert.alert('Errore', error.message || 'Errore durante l\'aggiornamento');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectCharacter = async (characterName: string) => {
    if (!user) return;

    try {
      setIsSaving(true);
      await updateProfile({ profileImage: characterName });
      setCharacterModalVisible(false);
      Alert.alert('Successo', 'Immagine profilo aggiornata');
    } catch (error: any) {
      Alert.alert('Errore', error.message || 'Errore durante l\'aggiornamento');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Cancella Account',
      'Sei sicuro di voler cancellare il tuo account? Questa azione è irreversibile e tutti i tuoi dati verranno eliminati permanentemente.',
      [
        {
          text: 'Annulla',
          style: 'cancel',
        },
        {
          text: 'Cancella',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsSaving(true);
              await deleteAccount();
              Alert.alert('Account cancellato', 'Il tuo account è stato cancellato con successo.');
            } catch (error: any) {
              Alert.alert('Errore', error.message || 'Errore durante la cancellazione dell\'account');
            } finally {
              setIsSaving(false);
            }
          },
        },
      ]
    );
  };

  const getProfileImage = () => {
    if (user?.profileImage && characterImages[user.profileImage]) {
      return characterImages[user.profileImage];
    }
    return null;
  };

  if (isLoading) {
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
              Accedi per vedere il tuo profilo
            </ThemedText>
          </View>
        </ThemedView>
      </SafeAreaView>
    );
  }

  const profileImageSource = getProfileImage();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ThemedView style={styles.background} lightColor="#FFFFFF" darkColor="#FFFFFF">
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          
          {/* Header */}
          <View style={styles.header}>
            <ThemedText type="title" style={styles.title}>
              Profilo
            </ThemedText>
          </View>

          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <TouchableOpacity
              style={styles.avatarContainer}
              onPress={() => setCharacterModalVisible(true)}
              activeOpacity={0.8}>
              {profileImageSource ? (
                <Image source={profileImageSource} style={styles.avatarImage} contentFit="contain" />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <FontAwesome5 name="user" size={40} color={nintendoRed} solid />
                </View>
              )}
              <View style={styles.editIconContainer}>
                <FontAwesome5 name="camera" size={16} color="#FFFFFF" solid />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.changeAvatarButton}
              onPress={() => setCharacterModalVisible(true)}>
              <ThemedText style={styles.changeAvatarText}>
                Cambia Personaggio
              </ThemedText>
            </TouchableOpacity>
          </View>

          {/* Profile Info */}
          <ThemedView style={styles.profileCard}>
            <View style={styles.cardHeader}>
              <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
                Informazioni Profilo
              </ThemedText>
              {!isEditing ? (
                <TouchableOpacity
                  onPress={() => setIsEditing(true)}
                  style={styles.editButton}>
                  <FontAwesome5 name="edit" size={16} color={nintendoRed} solid />
                </TouchableOpacity>
              ) : (
                <View style={styles.editActions}>
                  <TouchableOpacity
                    onPress={() => {
                      setIsEditing(false);
                      setFormData({
                        username: user?.username || '',
                        email: user?.email || '',
                        description: user?.description || '',
                      });
                    }}
                    style={styles.cancelButton}>
                    <FontAwesome5 name="times" size={16} color="#999999" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSave}
                    style={styles.saveButton}
                    disabled={isSaving}>
                    {isSaving ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <FontAwesome5 name="check" size={16} color="#FFFFFF" solid />
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={styles.formSection}>
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Username</ThemedText>
                {isEditing ? (
                  <TextInput
                    style={styles.input}
                    value={formData.username}
                    onChangeText={(text) => setFormData({ ...formData, username: text })}
                    placeholder="Username"
                    placeholderTextColor="#999999"
                  />
                ) : (
                  <ThemedText style={styles.value}>{user?.username || '-'}</ThemedText>
                )}
              </View>

              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Email</ThemedText>
                {isEditing ? (
                  <TextInput
                    style={styles.input}
                    value={formData.email}
                    onChangeText={(text) => setFormData({ ...formData, email: text })}
                    placeholder="Email"
                    placeholderTextColor="#999999"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                ) : (
                  <ThemedText style={styles.value}>{user?.email || '-'}</ThemedText>
                )}
              </View>
            </View>
          </ThemedView>

          {/* Main Character Section */}
          <ThemedView style={styles.profileCard}>
            <View style={styles.cardHeader}>
              <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
                Personaggio Principale
              </ThemedText>
              <TouchableOpacity
                onPress={() => setMainModalVisible(true)}
                style={styles.editButton}>
                <FontAwesome5 name="edit" size={16} color={nintendoRed} solid />
              </TouchableOpacity>
            </View>
            {user?.main ? (
              <View style={styles.mainSection}>
                {characterImages[user.main] ? (
                  <Image source={characterImages[user.main]} style={styles.mainImage} contentFit="contain" />
                ) : null}
                <ThemedText style={styles.mainName}>{user.main}</ThemedText>
              </View>
            ) : (
              <ThemedText style={styles.noMainText}>Nessun personaggio principale selezionato</ThemedText>
            )}
          </ThemedView>

          {/* Description Section */}
          <ThemedView style={[styles.profileCard, styles.descriptionCard]}>
            <View style={styles.cardHeader}>
              <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
                Descrizione
              </ThemedText>
            </View>
            {isEditing ? (
              <TextInput
                style={styles.textArea}
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                placeholder="Scrivi qualcosa su di te..."
                placeholderTextColor="#999999"
                multiline
                numberOfLines={4}
                maxLength={500}
              />
            ) : (
              <ThemedText style={styles.descriptionText}>
                {user?.description || 'Nessuna descrizione'}
              </ThemedText>
            )}
          </ThemedView>

          {/* Delete Account Section */}
          <View style={styles.deleteSection}>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDeleteAccount}
              disabled={isSaving}
              activeOpacity={0.8}>
              {isSaving ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <FontAwesome5 name="trash-alt" size={18} color="#FFFFFF" solid />
                  <ThemedText style={styles.deleteButtonText} lightColor="#FFFFFF" darkColor="#FFFFFF">
                    Cancella Account
                  </ThemedText>
                </>
              )}
            </TouchableOpacity>
            <ThemedText style={styles.deleteWarning}>
              L'eliminazione dell'account è permanente e non può essere annullata
            </ThemedText>
          </View>
        </ScrollView>

        {/* Character Selection Modal */}
        <Modal
          visible={characterModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setCharacterModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <ThemedView style={styles.modalContent} lightColor="#FFFFFF" darkColor="#FFFFFF">
              <View style={styles.modalHeader}>
                <ThemedText type="defaultSemiBold" style={styles.modalTitle}>
                  Scegli Personaggio
                </ThemedText>
                <TouchableOpacity
                  onPress={() => setCharacterModalVisible(false)}
                  style={styles.modalCloseButton}>
                  <FontAwesome5 name="times" size={20} color="#000000" />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.modalScrollView}>
                <View style={styles.charactersGrid}>
                  {allCharacters.map((character, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.characterOption,
                        user?.profileImage === character.name && styles.characterOptionSelected
                      ]}
                      onPress={() => handleSelectCharacter(character.name)}
                      activeOpacity={0.8}>
                      {characterImages[character.name] ? (
                        <Image
                          source={characterImages[character.name]}
                          style={styles.characterOptionImage}
                          contentFit="contain"
                        />
                      ) : (
                        <View style={styles.characterOptionPlaceholder}>
                          <FontAwesome5 name="user" size={24} color="#999999" />
                        </View>
                      )}
                      <ThemedText style={styles.characterOptionName} numberOfLines={1}>
                        {character.name}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </ThemedView>
          </View>
        </Modal>

        {/* Main Character Selection Modal */}
        <Modal
          visible={mainModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setMainModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <ThemedView style={styles.modalContent} lightColor="#FFFFFF" darkColor="#FFFFFF">
              <View style={styles.modalHeader}>
                <ThemedText type="defaultSemiBold" style={styles.modalTitle}>
                  Scegli Personaggio Principale
                </ThemedText>
                <TouchableOpacity
                  onPress={() => setMainModalVisible(false)}
                  style={styles.modalCloseButton}>
                  <FontAwesome5 name="times" size={20} color="#000000" />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.modalScrollView}>
                <View style={styles.charactersGrid}>
                  {allCharacters.map((character, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.characterOption,
                        user?.main === character.name && styles.characterOptionSelected
                      ]}
                      onPress={() => handleSelectMain(character.name)}
                      activeOpacity={0.8}>
                      {characterImages[character.name] ? (
                        <Image
                          source={characterImages[character.name]}
                          style={styles.characterOptionImage}
                          contentFit="contain"
                        />
                      ) : (
                        <View style={styles.characterOptionPlaceholder}>
                          <FontAwesome5 name="user" size={24} color="#999999" />
                        </View>
                      )}
                      <ThemedText style={styles.characterOptionName} numberOfLines={1}>
                        {character.name}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </ThemedView>
          </View>
        </Modal>
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
  notLoggedInContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  notLoggedInText: {
    fontSize: 18,
    color: '#999999',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#000000',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: nintendoRed,
    marginBottom: 16,
    position: 'relative',
  },
  avatarImage: {
    width: 112,
    height: 112,
    borderRadius: 56,
  },
  avatarPlaceholder: {
    width: 112,
    height: 112,
    borderRadius: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: nintendoRed,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  changeAvatarButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: nintendoRed,
  },
  changeAvatarText: {
    fontSize: 14,
    fontWeight: '600',
    color: nintendoRed,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    borderColor: nintendoRed,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 16,
  },
  descriptionCard: {
    marginTop: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  editButton: {
    padding: 8,
  },
  editActions: {
    flexDirection: 'row',
    gap: 8,
  },
  cancelButton: {
    padding: 8,
  },
  saveButton: {
    padding: 8,
    backgroundColor: nintendoRed,
    borderRadius: 8,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formSection: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  value: {
    fontSize: 16,
    color: '#000000',
  },
  input: {
    fontSize: 16,
    color: '#000000',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  textArea: {
    fontSize: 16,
    color: '#000000',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  mainSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 8,
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
  noMainText: {
    fontSize: 14,
    color: '#999999',
    fontStyle: 'italic',
  },
  descriptionText: {
    fontSize: 16,
    color: '#000000',
    lineHeight: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalScrollView: {
    paddingHorizontal: 20,
  },
  charactersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  characterOption: {
    width: '30%',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  characterOptionSelected: {
    borderColor: nintendoRed,
    backgroundColor: '#FFF5F5',
  },
  characterOptionImage: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  characterOptionPlaceholder: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  characterOptionName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
  },
  deleteSection: {
    marginTop: 32,
    alignItems: 'center',
    gap: 12,
  },
  deleteButton: {
    backgroundColor: '#DC3545',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 10,
    width: '100%',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  deleteButtonText: {
    fontSize: 18,
    fontWeight: '700',
  },
  deleteWarning: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

