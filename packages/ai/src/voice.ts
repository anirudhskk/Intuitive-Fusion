/**
 * Voice I/O (FR-0005, NFR-U07). Implementations: Amazon Transcribe (streaming) and Polly, in the
 * tenant's region (BRS §5.4). Text is always an equal alternative.
 */
export interface SpeechToText {
  transcribe(audio: Uint8Array, mimeType: string, opts: { tenantId: string; languageCode?: string }): Promise<string>;
}

export interface TextToSpeech {
  synthesise(text: string, opts: { tenantId: string; voiceId?: string }): Promise<Uint8Array>;
}
