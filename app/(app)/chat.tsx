import { useState, useRef, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { sendChatMessage, type ChatMessage, type FactCard } from '@/lib/api';
import { Colors, FLAG_COLORS, FLAG_LABELS } from '@/lib/theme';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  flag?: string;
  fact_cards?: FactCard[];
}

const WELCOME: Message = {
  id:      'welcome',
  role:    'ai',
  content: 'Ciao! Sono l\'assistente AI di Wait. Come posso aiutarti oggi?',
};

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input,    setInput]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [flag,     setFlag]     = useState<string | null>(null);
  const listRef = useRef<FlatList>(null);

  const FLAG_RANK: Record<string, number> = { green: 0, yellow: 1, orange: 2, red: 3 };

  const resolveFlag = (current: string | null, next: string | null): string | null => {
    if (!next) return current;
    if (current === 'red') return 'red';
    if (next === 'red') return 'red';
    const nr = FLAG_RANK[next] ?? 0;
    const cr = FLAG_RANK[current ?? ''] ?? 0;
    if (cr >= 2 && nr < cr) return current;
    return next;
  };

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const history: ChatMessage[] = messages
      .filter(m => m.id !== 'welcome')
      .concat(userMsg)
      .map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.content }));

    try {
      const data = await sendChatMessage(history);
      if (data.ok && data.reply) {
        const aiMsg: Message = {
          id:         (Date.now() + 1).toString(),
          role:       'ai',
          content:    data.reply,
          flag:       data.flag,
          fact_cards: data.fact_cards,
        };
        setMessages(prev => [...prev, aiMsg]);
        if (data.flag) setFlag(prev => resolveFlag(prev, data.flag ?? null));
      }
    } catch {
      const errMsg: Message = {
        id:      (Date.now() + 1).toString(),
        role:    'ai',
        content: 'Si è verificato un errore. Riprova tra poco.',
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setLoading(false);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [input, loading, messages]);

  const flagColor = flag ? FLAG_COLORS[flag] : null;

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isAi      = item.role === 'ai';
    const isLastAi  = isAi && messages.slice(index + 1).every(m => m.role !== 'ai');

    return (
      <View style={[styles.msgWrap, isAi ? styles.msgWrapAi : styles.msgWrapUser]}>
        <View style={[styles.bubble, isAi ? styles.bubbleAi : styles.bubbleUser]}>
          <Text style={[styles.bubbleText, isAi ? styles.bubbleTextAi : styles.bubbleTextUser]}>
            {item.content}
          </Text>
        </View>

        {/* Flag badge only on last AI message */}
        {isLastAi && flag && (
          <View style={[styles.flagBadge, { backgroundColor: FLAG_COLORS[flag] ?? Colors.green }]}>
            <Text style={styles.flagBadgeText}>{FLAG_LABELS[flag] ?? flag}</Text>
          </View>
        )}

        {/* Fact cards */}
        {isAi && (item.fact_cards?.length ?? 0) > 0 && (
          <View style={styles.cardsWrap}>
            {item.fact_cards!.map((card, i) => (
              <View key={i} style={styles.card}>
                <Text style={styles.cardTitle}>{card.title}</Text>
                <Text style={styles.cardBody}>{card.body}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.root, flagColor ? { backgroundColor: `${flagColor}10` } : null]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerAvatar}>
          <Text style={styles.headerAvatarText}>W</Text>
        </View>
        <View>
          <Text style={styles.headerTitle}>Wait AI</Text>
          <Text style={styles.headerSub}>Assistente • Online</Text>
        </View>
      </View>

      {/* Red flag banner */}
      {flag === 'red' && (
        <View style={styles.redBanner}>
          <Ionicons name="alert-circle" size={18} color={Colors.red} />
          <Text style={styles.redBannerText}>
            Situazione di pericolo rilevata. Chiama il 112 se sei in pericolo immediato.
          </Text>
        </View>
      )}

      {/* Messages */}
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={m => m.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.listContent}
        onLayout={() => listRef.current?.scrollToEnd({ animated: false })}
      />

      {/* Loading indicator */}
      {loading && (
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" color={Colors.magenta} />
          <Text style={styles.loadingText}>Wait sta scrivendo...</Text>
        </View>
      )}

      {/* Input */}
      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          placeholder="Scrivi un messaggio..."
          placeholderTextColor={Colors.grayLight}
          value={input}
          onChangeText={setInput}
          multiline
          editable={!loading && flag !== 'red'}
        />
        <TouchableOpacity
          style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnDisabled]}
          onPress={handleSend}
          disabled={!input.trim() || loading}
        >
          <Ionicons name="send" size={18} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root:           { flex: 1, backgroundColor: Colors.bg },
  header:         { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, paddingTop: 56, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border },
  headerAvatar:   { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.magenta, justifyContent: 'center', alignItems: 'center' },
  headerAvatarText: { color: Colors.white, fontWeight: '800', fontSize: 16 },
  headerTitle:    { fontSize: 15, fontWeight: '700', color: Colors.black },
  headerSub:      { fontSize: 12, color: Colors.grayLight },
  redBanner:      { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FDE8E8', padding: 12, borderBottomWidth: 2, borderBottomColor: Colors.red },
  redBannerText:  { flex: 1, fontSize: 12, color: Colors.red, fontWeight: '500' },
  listContent:    { padding: 16, gap: 12 },
  msgWrap:        { gap: 6 },
  msgWrapAi:      { alignItems: 'flex-start' },
  msgWrapUser:    { alignItems: 'flex-end' },
  bubble:         { maxWidth: '80%', borderRadius: 16, padding: 12 },
  bubbleAi:       { backgroundColor: Colors.white, borderRadius: 16, borderTopLeftRadius: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  bubbleUser:     { backgroundColor: Colors.magenta, borderTopRightRadius: 4 },
  bubbleText:     { fontSize: 15, lineHeight: 22 },
  bubbleTextAi:   { color: Colors.black },
  bubbleTextUser: { color: Colors.white },
  flagBadge:      { alignSelf: 'flex-start', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 3, marginTop: 2 },
  flagBadgeText:  { color: Colors.white, fontWeight: '700', fontSize: 11 },
  cardsWrap:      { gap: 8, maxWidth: '80%' },
  card:           { backgroundColor: Colors.white, borderRadius: 10, padding: 12, borderWidth: 1, borderColor: Colors.border },
  cardTitle:      { fontSize: 13, fontWeight: '700', color: Colors.black, marginBottom: 4 },
  cardBody:       { fontSize: 12, color: Colors.gray, lineHeight: 18 },
  loadingRow:     { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, paddingHorizontal: 16 },
  loadingText:    { fontSize: 13, color: Colors.grayLight },
  inputArea:      { flexDirection: 'row', alignItems: 'flex-end', gap: 10, padding: 12, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.border },
  input:          { flex: 1, backgroundColor: Colors.bg, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 15, color: Colors.black, borderWidth: 1, borderColor: Colors.border, maxHeight: 120 },
  sendBtn:        { width: 42, height: 42, borderRadius: 21, backgroundColor: Colors.magenta, justifyContent: 'center', alignItems: 'center' },
  sendBtnDisabled:{ opacity: 0.4 },
});
