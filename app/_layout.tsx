import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { supabase } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady]     = useState(false);
  const router   = useRouter();
  const segments = useSegments();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!ready) return;
    const inApp  = segments[0] === '(app)';
    const inAuth = segments[0] === '(auth)';
    if (!session && !inAuth) {
      router.replace('/(auth)/login');
    } else if (session && !inApp) {
      router.replace('/(app)');
    }
  }, [session, ready, segments, router]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(app)" />
    </Stack>
  );
}
