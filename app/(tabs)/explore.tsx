import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CharacterCard } from '@/components/character-card';
import { Colors } from '@/constants/theme';
import { GlobalFont } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAuth } from '@/contexts/AuthContext';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://UR-IP:3000/api';

export default function CharactersScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const { token, isLoggedIn } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [likedCharacters, setLikedCharacters] = useState<Set<string>>(new Set());
  const [likeCounts, setLikeCounts] = useState<{ [key: string]: number }>({});

  // Lista completa personaggi - da sostituire con dati reali
  const allCharacters = [
    { name: 'Mario', series: 'Super Mario', difficulty: 'Easy' as const },
    { name: 'Donkey Kong', series: 'Donkey Kong', difficulty: 'Medium' as const },
    { name: 'Link', series: 'The Legend of Zelda', difficulty: 'Medium' as const },
    { name: 'Samus', series: 'Metroid', difficulty: 'Medium' as const },
    { name: 'Yoshi', series: 'Yoshi', difficulty: 'Easy' as const },
    { name: 'Kirby', series: 'Kirby', difficulty: 'Easy' as const },
    { name: 'Fox', series: 'Star Fox', difficulty: 'Hard' as const },
    { name: 'Pikachu', series: 'Pokémon', difficulty: 'Easy' as const },
    { name: 'Luigi', series: 'Super Mario', difficulty: 'Easy' as const },
    { name: 'Ness', series: 'EarthBound', difficulty: 'Hard' as const },
    { name: 'Captain Falcon', series: 'F-Zero', difficulty: 'Medium' as const },
    { name: 'Jigglypuff', series: 'Pokémon', difficulty: 'Medium' as const },
    { name: 'Peach', series: 'Super Mario', difficulty: 'Medium' as const },
    { name: 'Bowser', series: 'Super Mario', difficulty: 'Medium' as const },
    { name: 'Ice Climbers', series: 'Ice Climber', difficulty: 'Hard' as const },
    { name: 'Sheik', series: 'The Legend of Zelda', difficulty: 'Hard' as const },
    { name: 'Zelda', series: 'The Legend of Zelda', difficulty: 'Medium' as const },
    { name: 'Dr. Mario', series: 'Super Mario', difficulty: 'Easy' as const },
    { name: 'Pichu', series: 'Pokémon', difficulty: 'Hard' as const },
    { name: 'Falco', series: 'Star Fox', difficulty: 'Hard' as const },
    { name: 'Marth', series: 'Fire Emblem', difficulty: 'Medium' as const },
    { name: 'Young Link', series: 'The Legend of Zelda', difficulty: 'Medium' as const },
    { name: 'Ganondorf', series: 'The Legend of Zelda', difficulty: 'Hard' as const },
    { name: 'Mewtwo', series: 'Pokémon', difficulty: 'Hard' as const },
    { name: 'Roy', series: 'Fire Emblem', difficulty: 'Medium' as const },
    { name: 'Mr. Game & Watch', series: 'Game & Watch', difficulty: 'Hard' as const },
    { name: 'Meta Knight', series: 'Kirby', difficulty: 'Hard' as const },
    { name: 'Pit', series: 'Kid Icarus', difficulty: 'Medium' as const },
    { name: 'Zero Suit Samus', series: 'Metroid', difficulty: 'Hard' as const },
    { name: 'Wario', series: 'Wario', difficulty: 'Medium' as const },
    { name: 'Snake', series: 'Metal Gear', difficulty: 'Hard' as const },
    { name: 'Ike', series: 'Fire Emblem', difficulty: 'Medium' as const },
    { name: 'Pokémon Trainer', series: 'Pokémon', difficulty: 'Hard' as const },
    { name: 'Diddy Kong', series: 'Donkey Kong', difficulty: 'Hard' as const },
    { name: 'Sonic', series: 'Sonic the Hedgehog', difficulty: 'Medium' as const },
    { name: 'King Dedede', series: 'Kirby', difficulty: 'Medium' as const },
    { name: 'Olimar', series: 'Pikmin', difficulty: 'Hard' as const },
    { name: 'Lucario', series: 'Pokémon', difficulty: 'Medium' as const },
    { name: 'R.O.B.', series: 'R.O.B.', difficulty: 'Hard' as const },
    { name: 'Toon Link', series: 'The Legend of Zelda', difficulty: 'Medium' as const },
    { name: 'Wolf', series: 'Star Fox', difficulty: 'Hard' as const },
    { name: 'Villager', series: 'Animal Crossing', difficulty: 'Hard' as const },
    { name: 'Mega Man', series: 'Mega Man', difficulty: 'Medium' as const },
    { name: 'Wii Fit Trainer', series: 'Wii Fit', difficulty: 'Medium' as const },
    { name: 'Rosalina & Luma', series: 'Super Mario', difficulty: 'Hard' as const },
    { name: 'Little Mac', series: 'Punch-Out!!', difficulty: 'Medium' as const },
    { name: 'Greninja', series: 'Pokémon', difficulty: 'Hard' as const },
    { name: 'Palutena', series: 'Kid Icarus', difficulty: 'Medium' as const },
    { name: 'Pac-Man', series: 'Pac-Man', difficulty: 'Hard' as const },
    { name: 'Robin', series: 'Fire Emblem', difficulty: 'Hard' as const },
    { name: 'Shulk', series: 'Xenoblade Chronicles', difficulty: 'Hard' as const },
    { name: 'Bowser Jr.', series: 'Super Mario', difficulty: 'Medium' as const },
    { name: 'Duck Hunt', series: 'Duck Hunt', difficulty: 'Hard' as const },
    { name: 'Ryu', series: 'Street Fighter', difficulty: 'Hard' as const },
    { name: 'Ken', series: 'Street Fighter', difficulty: 'Hard' as const },
    { name: 'Cloud', series: 'Final Fantasy', difficulty: 'Medium' as const },
    { name: 'Corrin', series: 'Fire Emblem', difficulty: 'Hard' as const },
    { name: 'Bayonetta', series: 'Bayonetta', difficulty: 'Hard' as const },
    { name: 'Inkling', series: 'Splatoon', difficulty: 'Medium' as const },
    { name: 'Ridley', series: 'Metroid', difficulty: 'Medium' as const },
    { name: 'Simon', series: 'Castlevania', difficulty: 'Medium' as const },
    { name: 'Richter', series: 'Castlevania', difficulty: 'Medium' as const },
    { name: 'King K. Rool', series: 'Donkey Kong', difficulty: 'Medium' as const },
    { name: 'Isabelle', series: 'Animal Crossing', difficulty: 'Medium' as const },
    { name: 'Incineroar', series: 'Pokémon', difficulty: 'Medium' as const },
    { name: 'Piranha Plant', series: 'Super Mario', difficulty: 'Hard' as const },
    { name: 'Joker', series: 'Persona', difficulty: 'Hard' as const },
    { name: 'Hero', series: 'Dragon Quest', difficulty: 'Hard' as const },
    { name: 'Banjo & Kazooie', series: 'Banjo-Kazooie', difficulty: 'Medium' as const },
    { name: 'Terry', series: 'Fatal Fury', difficulty: 'Hard' as const },
    { name: 'Byleth', series: 'Fire Emblem', difficulty: 'Medium' as const },
    { name: 'Min Min', series: 'ARMS', difficulty: 'Hard' as const },
    { name: 'Steve', series: 'Minecraft', difficulty: 'Hard' as const },
    { name: 'Sephiroth', series: 'Final Fantasy', difficulty: 'Hard' as const },
    { name: 'Pyra/Mythra', series: 'Xenoblade Chronicles', difficulty: 'Hard' as const },
    { name: 'Kazuya', series: 'Tekken', difficulty: 'Hard' as const },
    { name: 'Sora', series: 'Kingdom Hearts', difficulty: 'Medium' as const },
  ];

  const filteredCharacters = allCharacters.filter(
    (char) =>
      char.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      char.series.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (isLoggedIn && token) {
      loadLikes();
    }
  }, [isLoggedIn, token]);

  const loadLikes = async () => {
    if (!token) return;
    
    try {
      // Carica i like dell'utente
      const res = await fetch(`${API_URL}/characters/likes/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setLikedCharacters(new Set(data.likedCharacters));
      }

      // Carica i count per ogni personaggio
      const counts: { [key: string]: number } = {};
      for (const char of allCharacters) {
        try {
          const countRes = await fetch(`${API_URL}/characters/${encodeURIComponent(char.name)}/like`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const countData = await countRes.json();
          if (countData.success) {
            counts[char.name] = countData.count;
          }
        } catch (error) {
          console.error(`Errore caricamento like per ${char.name}:`, error);
        }
      }
      setLikeCounts(counts);
    } catch (error) {
      console.error('Errore caricamento like:', error);
    }
  };

  const handleLikeToggle = async (characterName: string) => {
    if (!token || !isLoggedIn) return;

    try {
      const res = await fetch(`${API_URL}/characters/${encodeURIComponent(characterName)}/like`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        const newLiked = new Set(likedCharacters);
        if (data.liked) {
          newLiked.add(characterName);
        } else {
          newLiked.delete(characterName);
        }
        setLikedCharacters(newLiked);
        setLikeCounts({ ...likeCounts, [characterName]: data.count });
      }
    } catch (error) {
      console.error('Errore toggle like:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ThemedView style={styles.background} lightColor="#FFFFFF" darkColor="#FFFFFF">
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Personaggi
          </ThemedText>
          <View style={styles.searchContainer}>
            <IconSymbol name="magnifyingglass" size={20} color="#666666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Cerca personaggio o serie..."
              placeholderTextColor="#999999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <ThemedText style={styles.countText}>
            {filteredCharacters.length} personaggi trovati
          </ThemedText>

          <View style={styles.cardsContainer}>
            {filteredCharacters.map((character, index) => (
              <CharacterCard
                key={index}
                name={character.name}
                series={character.series}
                difficulty={character.difficulty}
                liked={likedCharacters.has(character.name)}
                likeCount={likeCounts[character.name] || 0}
                onLikePress={isLoggedIn ? () => handleLikeToggle(character.name) : undefined}
                onPress={() => {
                  // Navigazione al dettaglio personaggio
                  console.log(`Apri dettaglio ${character.name}`);
                }}
              />
            ))}
          </View>
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
  header: {
    padding: 20,
    paddingBottom: 12,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchIcon: {
    opacity: 0.6,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    fontFamily: GlobalFont,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 40,
  },
  countText: {
    fontSize: 14,
    color: '#000000',
    opacity: 0.7,
    marginBottom: 16,
  },
  cardsContainer: {
    gap: 12,
  },
});
