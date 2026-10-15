/**
 * Scoped field edits: "in the background field, change paragraph 5 to X and keep everything else
 * the same" (FR-0745, client AI narrative).
 *
 * The model only produces the replacement text. Splicing is deterministic code, so untouched
 * paragraphs are guaranteed byte-identical — we never ask the model to re-emit the whole field.
 * If targeting fails, the caller falls back to manual editing (NFR-U08).
 */
export function splitParagraphs(text: string): string[] {
  return text.split(/\n\s*\n/);
}

export function replaceParagraph(text: string, paragraphNumber: number, replacement: string): string {
  const paras = splitParagraphs(text);
  if (paragraphNumber < 1 || paragraphNumber > paras.length) {
    throw new RangeError(`Field has ${paras.length} paragraph(s); cannot edit paragraph ${paragraphNumber}`);
  }
  paras[paragraphNumber - 1] = replacement.trim();
  return paras.join('\n\n');
}

export function insertParagraph(text: string, afterParagraph: number, content: string): string {
  const paras = splitParagraphs(text);
  paras.splice(Math.max(0, Math.min(afterParagraph, paras.length)), 0, content.trim());
  return paras.join('\n\n');
}
