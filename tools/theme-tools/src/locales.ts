// Standalone preview fixture for the currently supported host languages.
// This is not a locale restriction in the public SDK.
export const languages = [
  { tag: "zh-CN", name: "简体中文", direction: "ltr" },
  { tag: "en-US", name: "English", direction: "ltr" },
] as const;
export const supportedLocales = languages.map((language) => language.tag);
