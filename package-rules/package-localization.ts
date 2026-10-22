/** Author-owned messages. Administrator configuration values are separate. */
export interface MessageCatalog {
  defaultLocale: string;
  messages: Record<string, Record<string, string>>;
}
function localeCandidates(locale: string, fallback: string): string[] {
  const tag = Intl.getCanonicalLocales(locale)[0]!;
  return [
    ...new Set([
      tag,
      tag.split("-")[0]!,
      Intl.getCanonicalLocales(fallback)[0]!,
    ]),
  ];
}
/** Resolve author-owned copy only. Never use this for administrator content. */
export function messageText(
  resource: MessageCatalog,
  locale: string,
  key: string,
): string {
  for (const tag of localeCandidates(locale, resource.defaultLocale)) {
    const dictionary = resource.messages[tag];
    const value =
      dictionary && Object.hasOwn(dictionary, key)
        ? dictionary[key]
        : undefined;
    if (value !== undefined) return value;
  }
  return key;
}
