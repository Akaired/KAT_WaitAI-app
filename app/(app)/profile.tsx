import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { Colors } from '@/lib/theme';

export default function ProfileScreen() {
  const [name,  setName]  = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      setEmail(user.email ?? '');
      setName(
        (user.user_metadata?.full_name as string | undefined)
        ?? user.email?.split('@')[0]
        ?? 'Utente',
      );
    });
  }, []);

  const handleLogout = () => {
    Alert.alert('Esci', 'Sei sicuro di voler uscire?', [
      { text: 'Annulla', style: 'cancel' },
      { text: 'Esci', style: 'destructive', onPress: () => supabase.auth.signOut() },
    ]);
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>Profilo</Text>
      </View>

      {/* Avatar */}
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.email}>{email}</Text>
      </View>

      {/* Info */}
      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <Ionicons name="shield-checkmark" size={20} color={Colors.magenta} />
          <Text style={styles.infoLabel}>Protezione attiva</Text>
          <View style={[styles.badge, { backgroundColor: Colors.green }]}>
            <Text style={styles.badgeText}>ON</Text>
          </View>
        </View>
        <View style={styles.separator} />
        <View style={styles.infoRow}>
          <Ionicons name="lock-closed" size={20} color={Colors.magenta} />
          <Text style={styles.infoLabel}>Dati cifrati</Text>
          <View style={[styles.badge, { backgroundColor: Colors.green }]}>
            <Text style={styles.badgeText}>✓</Text>
          </View>
        </View>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out" size={18} color={Colors.red} />
        <Text style={styles.logoutText}>Esci dall'account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root:          { flex: 1, backgroundColor: Colors.bg },
  header:        { padding: 24, paddingTop: 60, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border },
  title:         { fontSize: 22, fontWeight: '700', color: Colors.black },
  avatarSection: { alignItems: 'center', padding: 32, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border },
  avatar:        { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.magenta, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText:    { color: Colors.white, fontSize: 32, fontWeight: '800' },
  name:          { fontSize: 18, fontWeight: '700', color: Colors.black },
  email:         { fontSize: 13, color: Colors.grayLight, marginTop: 4 },
  infoSection:   { backgroundColor: Colors.white, margin: 16, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: Colors.border },
  infoRow:       { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
  infoLabel:     { flex: 1, fontSize: 14, color: Colors.black },
  badge:         { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText:     { color: Colors.white, fontSize: 11, fontWeight: '700' },
  separator:     { height: 1, backgroundColor: Colors.border },
  logoutBtn:     { flexDirection: 'row', alignItems: 'center', gap: 10, margin: 16, padding: 16, backgroundColor: Colors.white, borderRadius: 12, borderWidth: 1, borderColor: '#FDDEDE' },
  logoutText:    { color: Colors.red, fontWeight: '600', fontSize: 15 },
});
