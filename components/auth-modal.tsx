import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Modal, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';

type AuthModalProps = {
  visible: boolean;
  mode: 'login' | 'register';
  onClose: () => void;
  onSuccess: () => void;
};

export function AuthModal({ visible, mode, onClose, onSuccess }: AuthModalProps) {
  const nintendoRed = '#E60012';
  const { login, register } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    if (mode === 'login') {
      if (!formData.email || !formData.password) {
        Alert.alert('Errore', 'Compila tutti i campi');
        return;
      }
    } else {
      if (!formData.username || !formData.email || !formData.password) {
        Alert.alert('Errore', 'Compila tutti i campi');
        return;
      }
      if (formData.password.length < 6) {
        Alert.alert('Errore', 'Password deve essere almeno 6 caratteri');
        return;
      }
    }

    try {
      setLoading(true);
      if (mode === 'login') {
        await login(formData.email, formData.password);
      } else {
        await register(formData.username, formData.email, formData.password);
      }
      onSuccess();
      setFormData({ username: '', email: '', password: '' });
    } catch (error: any) {
      Alert.alert('Errore', error.message || 'Errore durante l\'operazione');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <ThemedView style={styles.modalContent} lightColor="#FFFFFF" darkColor="#FFFFFF">
          <View style={styles.modalHeader}>
            <ThemedText type="defaultSemiBold" style={styles.modalTitle}>
              {mode === 'login' ? 'Login' : 'Registrati'}
            </ThemedText>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <FontAwesome5 name="times" size={20} color="#000000" />
            </TouchableOpacity>
          </View>

          {mode === 'register' && (
            <View style={styles.inputContainer}>
              <FontAwesome5 name="user" size={18} color={nintendoRed} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#999999"
                value={formData.username}
                onChangeText={(text) => setFormData({ ...formData, username: text })}
                autoCapitalize="none"
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <FontAwesome5 name="envelope" size={18} color={nintendoRed} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999999"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <FontAwesome5 name="lock" size={18} color={nintendoRed} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999999"
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}>
              <FontAwesome5 
                name={showPassword ? "eye-slash" : "eye"} 
                size={18} 
                color="#999999" 
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: nintendoRed }]}
            onPress={handleSubmit}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <FontAwesome5 
                  name={mode === 'login' ? "sign-in-alt" : "user-plus"} 
                  size={18} 
                  color="#FFFFFF" 
                />
                <ThemedText style={styles.submitButtonText} lightColor="#FFFFFF" darkColor="#FFFFFF">
                  {mode === 'login' ? 'Accedi' : 'Registrati'}
                </ThemedText>
              </>
            )}
          </TouchableOpacity>
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  closeButton: {
    padding: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
  },
  eyeButton: {
    padding: 4,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 10,
    marginTop: 8,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '700',
  },
});
