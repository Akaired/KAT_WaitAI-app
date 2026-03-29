import { supabase } from './supabase';

const API_BASE = process.env.EXPO_PUBLIC_API_BASE ?? 'https://lab.davidemaiorana.dev';

async function authHeaders(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { 'Content-Type': 'application/json' };
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session.access_token}`,
  };
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface FactCard {
  title: string;
  body: string;
  source_title?: string;
  source_url?: string;
}

export interface ChatResponse {
  ok: boolean;
  reply?: string;
  flag?: string;
  fact_cards?: FactCard[];
  error?: string;
}

export async function sendChatMessage(messages: ChatMessage[]): Promise<ChatResponse> {
  const headers = await authHeaders();
  const res = await fetch(`${API_BASE}/api/chat/send`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ messages }),
  });
  return res.json() as Promise<ChatResponse>;
}

export interface ConversationRow {
  id: string;
  title: string;
  updated_at: string;
}

export async function fetchConversations(): Promise<ConversationRow[]> {
  const { data, error } = await supabase
    .from('conversations')
    .select('id, title, updated_at')
    .order('updated_at', { ascending: false });
  if (error) return [];
  return (data ?? []) as ConversationRow[];
}
