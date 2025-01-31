// services/TranslationService.js
export async function getCommonContent(language, study) {
  // Check Vuex store (if needed) — skipped here since Vuex handles it
  const localStoredContent = localStorage.getItem(`commonContent_${language}_${study}`);
  if (localStoredContent) return JSON.parse(localStoredContent);

  // Fallback: API Call
  const response = await fetch(`/api/translate/commonContent/${language}/${study}`);
  const data = await response.json();

  // Cache this content locally for future use
  localStorage.setItem(`commonContent_${language}_${study}`, JSON.stringify(data));

  return data;
}
