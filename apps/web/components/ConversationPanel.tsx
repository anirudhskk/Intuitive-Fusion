'use client';

import { useState } from 'react';
import { api } from '../lib/api';

interface Turn {
  role: 'user' | 'assistant';
  text: string;
}

interface TurnResult {
  reply: string;
  fieldUpdates: Array<{ fieldKey: string; value: unknown }>;
  followUpQuestions: string[];
}

/**
 * The conversational surface used across the platform (FR-0005, FR-0006, NFR-U07).
 * Text and voice are equal alternatives. Proposed field updates are shown for the user to keep or
 * edit — the AI drafts, people decide (NFR-AV05).
 */
export function ConversationPanel({ contextType, contextId }: { contextType: string; contextId?: string }) {
  const [conversationId, setConversationId] = useState<string>();
  const [turns, setTurns] = useState<Turn[]>([]);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);

  async function send() {
    if (!draft.trim()) return;
    setBusy(true);
    setTurns((t) => [...t, { role: 'user', text: draft }]);
    try {
      const id =
        conversationId ??
        (await api<{ conversationId: string }>('/conversations', { method: 'POST', body: JSON.stringify({ contextType, contextId }) })).conversationId;
      setConversationId(id);
      const result = await api<TurnResult>(`/conversations/${id}/messages`, { method: 'POST', body: JSON.stringify({ text: draft }) });
      setTurns((t) => [...t, { role: 'assistant', text: [result.reply, ...result.followUpQuestions].join('\n\n') }]);
    } catch (e) {
      setTurns((t) => [...t, { role: 'assistant', text: `Something went wrong: ${(e as Error).message}` }]);
    } finally {
      setDraft('');
      setBusy(false);
    }
  }

  return (
    <section className="card" aria-label="Conversation with the procurement assistant">
      <ol aria-live="polite" style={{ listStyle: 'none', padding: 0 }}>
        {turns.map((t, i) => (
          <li key={i} className={t.role === 'user' ? '' : 'muted'} style={{ whiteSpace: 'pre-wrap', marginBottom: 8 }}>
            <strong>{t.role === 'user' ? 'You' : 'Assistant'}:</strong> {t.text}
          </li>
        ))}
      </ol>
      <label htmlFor="message">Describe what you need</label>
      <textarea id="message" rows={3} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="e.g. We need a Java developer for 6 months starting February, budget about $180k" />
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <button className="button" onClick={send} disabled={busy}>{busy ? 'Working…' : 'Send'}</button>
        {/* TODO MediaRecorder → POST /conversations/:id/audio (Transcribe), play Polly reply */}
        <button className="button secondary" type="button" aria-label="Speak instead of typing">🎤 Speak</button>
      </div>
    </section>
  );
}
