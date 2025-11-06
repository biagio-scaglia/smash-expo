import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type GradientBackgroundProps = {
  children?: React.ReactNode;
  style?: any;
  customColors?: { start: string; end: string };
};

export function GradientBackground({ children, style, customColors }: GradientBackgroundProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const colors = customColors || theme.gradient;

  return (
    <LinearGradient
      colors={[colors.start, colors.end]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.gradient, style]}>
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});


