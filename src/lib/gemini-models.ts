/**
 * Ordered Gemini fallback chain used by every AI route.
 *
 * Callers iterate this list and move to the next model when one fails
 * (quota / 429, 503 overload, model retired or not available to the key).
 * Order = cheapest and fastest first, then stronger models, then the
 * `-latest` aliases (which Google keeps pointing at a live model, so they act
 * as a safety net when a pinned ID is retired), and finally the Pro model.
 */
export const GEMINI_MODELS: string[] = [
  'gemini-3.8-flash',
  'gemini-3.1-flash-lite',
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-flash-latest',
  'gemini-flash-lite-latest',
];
