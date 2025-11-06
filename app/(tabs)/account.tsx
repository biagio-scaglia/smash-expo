import { useState } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { FontAwesome5 } from '@expo/vector-icons';
import { AuthModal } from '@/components/auth-modal';
import { useAuth } from '@/contexts/AuthContext';

export default function AccountScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const nintendoRed = '#E60012';
  const { user, isLoggedIn, logout, isLoading } = useAuth();
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLoginPress = () => {
    setAuthMode('login');
    setAuthModalVisible(true);
  };

  const handleRegisterPress = () => {
    setAuthMode('register');
    setAuthModalVisible(true);
  };

  const handleAuthSuccess = () => {
    setAuthModalVisible(false);
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    setLoggingOut(false);
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ThemedView style={styles.background} lightColor="#FFFFFF" darkColor="#FFFFFF">
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          
          {/* Header */}
          <ThemedView style={styles.header} lightColor="transparent" darkColor="transparent">
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <FontAwesome5 name="user-circle" size={48} color={nintendoRed} solid />
              </View>
            </View>
            <ThemedText type="title" style={styles.title}>
              Account
            </ThemedText>
          </ThemedView>

          {!isLoggedIn ? (
            /* Sezione Login/Registrazione */
            <View style={styles.authSection}>
              <ThemedView style={styles.authCard}>
                <FontAwesome5 name="sign-in-alt" size={32} color={nintendoRed} solid style={styles.authIcon} />
                <ThemedText type="defaultSemiBold" style={styles.authTitle}>
                  Accedi al tuo Account
                </ThemedText>
                <ThemedText style={styles.authDescription}>
                  Accedi o registrati per unirti ai gruppi di giocatori e partecipare alle sfide
                </ThemedText>
                
                <View style={styles.authButtons}>
                  <TouchableOpacity 
                    style={styles.loginButton}
                    activeOpacity={0.8}
                    onPress={handleLoginPress}>
                    <FontAwesome5 name="sign-in-alt" size={18} color="#FFFFFF" solid />
                    <ThemedText style={styles.loginButtonText} lightColor="#FFFFFF" darkColor="#FFFFFF">
                      Login
                    </ThemedText>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.registerButton}
                    activeOpacity={0.8}
                    onPress={handleRegisterPress}>
                    <FontAwesome5 name="user-plus" size={18} color={nintendoRed} solid />
                    <ThemedText style={styles.registerButtonText} lightColor={nintendoRed} darkColor={nintendoRed}>
                      Registrati
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              </ThemedView>
            </View>
          ) : (
            /* Sezione Account Loggato */
            <View style={styles.accountSection}>
              {/* Info Utente */}
              <ThemedView style={styles.userCard}>
                <View style={styles.userHeader}>
                  <View style={styles.userAvatar}>
                    <FontAwesome5 name="user" size={32} color={nintendoRed} solid />
                  </View>
                  <View style={styles.userInfo}>
                    <ThemedText type="defaultSemiBold" style={styles.userName}>
                      {user?.username || 'Utente'}
                    </ThemedText>
                    <ThemedText style={styles.userEmail}>
                      {user?.email || 'email@example.com'}
                    </ThemedText>
                  </View>
                </View>
              </ThemedView>

              {/* Logout Button */}
              <TouchableOpacity 
                style={styles.logoutButton}
                activeOpacity={0.8}
                onPress={handleLogout}
                disabled={loggingOut}>
                {loggingOut ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <FontAwesome5 name="sign-out-alt" size={18} color="#FFFFFF" solid />
                    <ThemedText style={styles.logoutButtonText} lightColor="#FFFFFF" darkColor="#FFFFFF">
                      Logout
                    </ThemedText>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        {/* Auth Modal */}
        <AuthModal
          visible={authModalVisible}
          mode={authMode}
          onClose={() => setAuthModalVisible(false)}
          onSuccess={handleAuthSuccess}
        />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 16,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
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
  authSection: {
    gap: 24,
  },
  authCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 28,
    borderWidth: 2,
    borderColor: '#E60012',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  authIcon: {
    marginBottom: 16,
  },
  authTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
  },
  authDescription: {
    fontSize: 15,
    color: '#000000',
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  authButtons: {
    width: '100%',
    gap: 12,
  },
  loginButton: {
    backgroundColor: '#E60012',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: '700',
  },
  registerButton: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E60012',
    gap: 10,
  },
  registerButtonText: {
    fontSize: 18,
    fontWeight: '700',
  },
  socialSection: {
    alignItems: 'center',
    gap: 16,
  },
  socialTitle: {
    fontSize: 14,
    color: '#000000',
    opacity: 0.6,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  socialButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    gap: 8,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  accountSection: {
    gap: 24,
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    borderColor: '#E60012',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  userAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E60012',
  },
  userInfo: {
    flex: 1,
    gap: 4,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  userEmail: {
    fontSize: 14,
    color: '#000000',
    opacity: 0.6,
  },
  logoutButton: {
    backgroundColor: '#E60012',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  logoutButtonText: {
    fontSize: 18,
    fontWeight: '700',
  },
});

