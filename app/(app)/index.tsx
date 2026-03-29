import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { Colors, FLAG_COLORS, FLAG_LABELS } from '@/lib/theme';

const STATUS_MSG: Record<string, string> = {
  green:  'Tutto ok, stai tranquillo, sei protetto',
  yellow: 'Prime avvisaglie, respira, siamo qui',
  orange: 'Situazione al limite, fai attenzione',
  red:    'Sei in pericolo, prendi provvedimenti immediati',
};

export default function HomeScreen() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [flag, setFlag]         = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        const name = (user.user_metadata?.full_name as string | undefined)
          ?? user.email?.split('@')[0]
          ?? 'utente';
        setUserName(name);
      }
    });
    // Flag state potrebbe venire da localStorage/SecureStore — per ora default null
  }, []);

  const level      = flag ?? 'green';
  const flagColor  = FLAG_COLORS[level] ?? Colors.green;
  const flagLabel  = FLAG_LABELS[level] ?? 'Situazione sicura';
  const statusMsg  = STATUS_MSG[level]  ?? STATUS_MSG.green;

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Ciao, {userName} 👋</Text>
          <Text style={styles.subGreeting}>Wait ti protegge</Text>
        </View>
        <View style={styles.logoIcon}>
          <Text style={styles.logoText}>W</Text>
        </View>
      </View>

      {/* Status card */}
      <View style={[styles.statusCard, { borderColor: flagColor }]}>
        <View style={styles.statusHeader}>
          <Ionicons
            name={level === 'red' ? 'alert-circle' : level === 'orange' ? 'warning' : 'shield-checkmark'}
            size={32}
            color={flagColor}
          />
          <View style={[styles.flagBadge, { backgroundColor: flagColor }]}>
            <Text style={styles.flagBadgeText}>{flagLabel}</Text>
          </View>
        </View>
        <Text style={styles.statusMsg}>{statusMsg}</Text>
      </View>

      {/* CTA */}
      <TouchableOpacity style={styles.ctaBtn} onPress={() => router.push('/(app)/chat')}>
        <Ionicons name="chatbubble-ellipses" size={20} color={Colors.white} />
        <Text style={styles.ctaBtnText}>Avvia chat con l'AI</Text>
      </TouchableOpacity>

      {/* Info cards */}
      <View style={styles.infoGrid}>
        <View style={styles.infoCard}>
          <Ionicons name="document-text" size={24} color={Colors.magenta} />
          <Text style={styles.infoTitle}>Risorse</Text>
          <Text style={styles.infoDesc}>Guide e documenti sulla sicurezza online</Text>
        </View>
        <View style={styles.infoCard}>
          <Ionicons name="call" size={24} color={Colors.magenta} />
          <Text style={styles.infoTitle}>Emergenza</Text>
          <Text style={styles.infoDesc}>Chiama il 112 in caso di pericolo immediato</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root:         { flex: 1, backgroundColor: Colors.bg },
  content:      { padding: 24, paddingTop: 60, gap: 20 },
  header:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting:     { fontSize: 22, fontWeight: '700', color: Colors.black },
  subGreeting:  { fontSize: 13, color: Colors.grayLight, marginTop: 2 },
  logoIcon:     { width: 40, height: 40, borderRadius: 10, backgroundColor: Colors.magenta, justifyContent: 'center', alignItems: 'center' },
  logoText:     { color: Colors.white, fontWeight: '800', fontSize: 18 },
  statusCard:   { backgroundColor: Colors.white, borderRadius: 16, padding: 20, borderWidth: 1.5, gap: 12 },
  statusHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  flagBadge:    { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 },
  flagBadgeText:{ color: Colors.white, fontWeight: '700', fontSize: 12 },
  statusMsg:    { fontSize: 14, color: Colors.gray, lineHeight: 20 },
  ctaBtn:       { backgroundColor: Colors.magenta, borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  ctaBtnText:   { color: Colors.white, fontWeight: '700', fontSize: 16 },
  infoGrid:     { flexDirection: 'row', gap: 12 },
  infoCard:     { flex: 1, backgroundColor: Colors.white, borderRadius: 12, padding: 16, gap: 8, borderWidth: 1, borderColor: Colors.border },
  infoTitle:    { fontSize: 14, fontWeight: '700', color: Colors.black },
  infoDesc:     { fontSize: 12, color: Colors.grayLight, lineHeight: 16 },
});
