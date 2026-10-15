/**
 * AI application controls (SEC-AP08). Supplier submissions, uploaded documents and migrated
 * records are untrusted: they are wrapped as data and screened before reaching a model.
 */
const SUSPICIOUS = [
  /ignore (all|any|the) (previous|prior|above) instructions/i,
  /you are now/i,
  /system prompt/i,
  /score (this|our) (submission|bid) (as|at) (the )?(highest|maximum|10)/i,
  /<\/?untrusted>/i,
];

export interface ScreenedContent {
  wrapped: string;
  flags: string[];
}

export function wrapUntrusted(content: string, source: string): ScreenedContent {
  const flags = SUSPICIOUS.filter((re) => re.test(content)).map((re) => re.source);
  const neutralised = content.replace(/<\/?untrusted>/gi, '');
  return { wrapped: `<untrusted source="${source}">\n${neutralised}\n</untrusted>`, flags };
}
