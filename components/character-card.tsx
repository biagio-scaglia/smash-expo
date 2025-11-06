import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from './themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { FontAwesome5 } from '@expo/vector-icons';

type CharacterCardProps = {
  name: string;
  series: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  onPress?: () => void;
  liked?: boolean;
  likeCount?: number;
  onLikePress?: () => void;
};

// Mapping statico delle immagini dei personaggi
const characterImages: { [key: string]: any } = {
  'Mario': require('@/assets/images/Pngs/mario.png'),
  'Donkey Kong': require('@/assets/images/Pngs/donkey_kong.png'),
  'Link': require('@/assets/images/Pngs/link.png'),
  'Samus': require('@/assets/images/Pngs/samus.png'),
  'Dark Samus': require('@/assets/images/Pngs/dark_samus.png'),
  'Yoshi': require('@/assets/images/Pngs/yoshi.png'),
  'Kirby': require('@/assets/images/Pngs/kirby.png'),
  'Fox': require('@/assets/images/Pngs/fox.png'),
  'Pikachu': require('@/assets/images/Pngs/pikachu.png'),
  'Luigi': require('@/assets/images/Pngs/luigi.png'),
  'Ness': require('@/assets/images/Pngs/ness.png'),
  'Captain Falcon': require('@/assets/images/Pngs/captain_falcon.png'),
  'Jigglypuff': require('@/assets/images/Pngs/jigglypuff.png'),
  'Peach': require('@/assets/images/Pngs/peach.png'),
  'Daisy': require('@/assets/images/Pngs/daisy.png'),
  'Bowser': require('@/assets/images/Pngs/bowser.png'),
  'Ice Climbers': require('@/assets/images/Pngs/ice_climbers.png'),
  'Sheik': require('@/assets/images/Pngs/sheik.png'),
  'Zelda': require('@/assets/images/Pngs/zelda.png'),
  'Dr. Mario': require('@/assets/images/Pngs/dr_mario.png'),
  'Pichu': require('@/assets/images/Pngs/pichu.png'),
  'Falco': require('@/assets/images/Pngs/falco.png'),
  'Marth': require('@/assets/images/Pngs/marth.png'),
  'Lucina': require('@/assets/images/Pngs/lucina.png'),
  'Young Link': require('@/assets/images/Pngs/young_link.png'),
  'Ganondorf': require('@/assets/images/Pngs/ganondorf.png'),
  'Mewtwo': require('@/assets/images/Pngs/mewtwo.png'),
  'Roy': require('@/assets/images/Pngs/roy.png'),
  'Chrom': require('@/assets/images/Pngs/chrom.png'),
  'Mr. Game & Watch': require('@/assets/images/Pngs/mr_game_and_watch.png'),
  'Meta Knight': require('@/assets/images/Pngs/meta_knight.png'),
  'Pit': require('@/assets/images/Pngs/pit.png'),
  'Dark Pit': require('@/assets/images/Pngs/dark_pit.png'),
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
  'Mii Fighter': require('@/assets/images/Pngs/mii_fighter.png'),
  'Lucas': require('@/assets/images/Pngs/lucas.png'),
};

export function CharacterCard({ name, series, difficulty = 'Medium', onPress, liked = false, likeCount = 0, onLikePress }: CharacterCardProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const nintendoRed = '#E60012';
  const imageSource = characterImages[name] || characterImages['Mario']; // Fallback a Mario se non trovato

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.container, { shadowColor: theme.tint }]}>
      <View style={[styles.card, { backgroundColor: nintendoRed }]}>
        <View style={styles.content}>
          <Image source={imageSource} style={styles.characterImage} contentFit="contain" />
          <View style={styles.textContainer}>
            <ThemedText type="defaultSemiBold" style={styles.name}>
              {name}
            </ThemedText>
            <ThemedText style={styles.series}>{series}</ThemedText>
            <View style={styles.difficultyBadge}>
              <ThemedText style={styles.difficultyText}>{difficulty}</ThemedText>
            </View>
          </View>
        </View>
        {onLikePress && (
          <TouchableOpacity
            style={styles.likeButton}
            onPress={(e) => {
              e.stopPropagation();
              onLikePress();
            }}
            activeOpacity={0.8}>
            <FontAwesome5 name="heart" size={18} color={liked ? '#FF6B6B' : '#FFFFFF'} solid={liked} />
            {likeCount > 0 && (
              <ThemedText style={styles.likeCount}>{likeCount}</ThemedText>
            )}
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  card: {
    padding: 16,
    minHeight: 120,
    borderRadius: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  characterImage: {
    width: 80,
    height: 80,
  },
  textContainer: {
    flex: 1,
    gap: 8,
    justifyContent: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  series: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  difficultyBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  likeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  likeCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});


