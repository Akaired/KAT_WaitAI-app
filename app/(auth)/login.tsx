import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { supabase } from '@/lib/supabase';
import { Colors } from '@/lib/theme';

export default function LoginScreen() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (err) setError(err.message);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.root}>
      <View style={styles.container}>
        {/* Logo */}
        <View style={styles.logoWrap}>
          <View style={styles.logoIcon}>
            <Text style={styles.logoIconText}>W</Text>
          </View>
          <Text style={styles.logoName}>Wait</Text>
        </View>

        <Text style={styles.subtitle}>Protezione intelligente dalla violenza online</Text>

        {/* Form */}
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={Colors.grayLight}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={Colors.grayLight}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {error && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={loading}>
            {loading
              ? <ActivityIndicator color={Colors.white} />
              : <Text style={styles.btnText}>Accedi</Text>
            }
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root:       { flex: 1, backgroundColor: Colors.black },
  container:  { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  logoWrap:   { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  logoIcon:   {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: Colors.magenta,
    justifyContent: 'center', alignItems: 'center',
  },
  logoIconText: { color: Colors.white, fontWeight: '800', fontSize: 20 },
  logoName:   { color: Colors.white, fontSize: 32, fontWeight: '800' },
  subtitle:   { color: Colors.grayLight, fontSize: 14, textAlign: 'center', marginBottom: 40 },
  form:       { width: '100%', gap: 12 },
  input:      {
    backgroundColor: '#1A1A1A',
    borderRadius: 10, padding: 14,
    color: Colors.white, fontSize: 15,
    borderWidth: 1, borderColor: '#333',
  },
  error:      { color: Colors.red, fontSize: 13, textAlign: 'center' },
  btn:        {
    backgroundColor: Colors.magenta,
    borderRadius: 10, padding: 16,
    alignItems: 'center', marginTop: 8,
  },
  btnText:    { color: Colors.white, fontSize: 16, fontWeight: '700' },
});
