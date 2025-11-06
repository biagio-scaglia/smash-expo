import { CharacterCard } from '@/components/character-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { FontAwesome5 } from '@expo/vector-icons';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const nintendoRed = '#E60012';

  // Esempi di personaggi - da sostituire con dati reali
  const featuredCharacters = [
    { name: 'Mario', series: 'Super Mario', difficulty: 'Easy' as const },
    { name: 'Link', series: 'The Legend of Zelda', difficulty: 'Medium' as const },
    { name: 'Pikachu', series: 'Pokémon', difficulty: 'Easy' as const },
    { name: 'Cloud', series: 'Final Fantasy', difficulty: 'Hard' as const },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ThemedView style={styles.background} lightColor="#FFFFFF" darkColor="#FFFFFF">
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <ThemedView style={styles.header} lightColor="transparent" darkColor="transparent">
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <FontAwesome5 name="users" size={32} color={nintendoRed} solid />
              </View>
            </View>
            <ThemedText type="title" style={styles.title}>
              Smash Group
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Unisciti alla community e trova altri giocatori per sfide epiche!
            </ThemedText>
          </ThemedView>

          {/* Sezione descrizione app */}
          <ThemedView style={styles.heroSection} lightColor="transparent" darkColor="transparent">
            <ThemedView style={styles.heroCard} lightColor={nintendoRed} darkColor={nintendoRed}>
              <View style={styles.heroContent}>
                <FontAwesome5 name="gamepad" size={40} color="#FFFFFF" solid style={styles.heroIcon} />
                <ThemedText type="defaultSemiBold" style={styles.heroTitle}>
                  Incontra Giocatori
                </ThemedText>
                <ThemedText style={styles.heroText}>
                  Trova altri giocatori di Super Smash Bros nelle tue vicinanze e organizza sessioni di gioco insieme
                </ThemedText>
              </View>
            </ThemedView>
          </ThemedView>

          {/* Funzionalità */}
          <ThemedView style={styles.section} lightColor="transparent" darkColor="transparent">
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Come Funziona
            </ThemedText>
            <View style={styles.featuresContainer}>
              <ThemedView style={styles.featureCardWhite}>
                <View style={styles.featureIconContainer}>
                  <FontAwesome5 name="user-friends" size={24} color={nintendoRed} solid />
                </View>
                <ThemedText type="defaultSemiBold" style={styles.featureTitleBlack}>
                  Crea Gruppi
                </ThemedText>
                <ThemedText style={styles.featureTextBlack}>
                  Crea o unisciti a gruppi di giocatori nella tua zona
                </ThemedText>
              </ThemedView>

              <ThemedView style={styles.featureCardWhite}>
                <View style={styles.featureIconContainer}>
                  <FontAwesome5 name="heart" size={24} color={nintendoRed} solid />
                </View>
                <ThemedText type="defaultSemiBold" style={styles.featureTitleBlack}>
                  Scegli il Tuo Main
                </ThemedText>
                <ThemedText style={styles.featureTextBlack}>
                  Mostra i tuoi personaggi preferiti e trova giocatori con stili simili
                </ThemedText>
              </ThemedView>

              <ThemedView style={styles.featureCardWhite}>
                <View style={styles.featureIconContainer}>
                  <FontAwesome5 name="trophy" size={24} color={nintendoRed} solid />
                </View>
                <ThemedText type="defaultSemiBold" style={styles.featureTitleBlack}>
                  Sfide e Tornei
                </ThemedText>
                <ThemedText style={styles.featureTextBlack}>
                  Partecipa a sfide amichevoli e tornei organizzati dalla community
                </ThemedText>
              </ThemedView>
            </View>
          </ThemedView>

          {/* Personaggi popolari */}
          <ThemedView style={styles.section} lightColor="transparent" darkColor="transparent">
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Personaggi Popolari
            </ThemedText>
            <View style={styles.cardsContainer}>
              {featuredCharacters.map((character, index) => (
                <CharacterCard
                  key={index}
                  name={character.name}
                  series={character.series}
                  difficulty={character.difficulty}
                  onPress={() => {
                    // Navigazione al dettaglio personaggio
                    console.log(`Apri dettaglio ${character.name}`);
                  }}
                />
              ))}
            </View>
          </ThemedView>

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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
    gap: 8,
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 16,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#E60012',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#000000',
    opacity: 0.7,
    textAlign: 'center',
    marginTop: 8,
  },
  heroSection: {
    marginBottom: 32,
  },
  heroCard: {
    borderRadius: 20,
    padding: 24,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  heroContent: {
    alignItems: 'center',
    gap: 16,
  },
  heroIcon: {
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  heroText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.95,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  cardsContainer: {
    gap: 12,
  },
  featuresContainer: {
    gap: 16,
  },
  featureCardWhite: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E60012',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featureIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitleBlack: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  featureTextBlack: {
    fontSize: 14,
    color: '#000000',
    opacity: 0.7,
    lineHeight: 20,
  },
});
