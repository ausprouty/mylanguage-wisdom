// composables/useCommonContent.js
import { ref } from 'vue';
import { useLanguageStore } from 'stores/LanguageStore';

export function useCommonContent(study, initialLanguageCodeHL) {
  const languageStore = useLanguageStore();
  const commonContent = ref(null);
  const topics = ref([]);

  const loadCommonContent = async (languageCode = initialLanguageCodeHL) => {
    try {
      const content = await languageStore.loadCommonContent(languageCode, study);
      commonContent.value = content;
      topics.value = Object.entries(content.topic).map(([key, value]) => ({
        label: `${parseInt(key)}. ${value}`,
        value: parseInt(key),
      }));
    } catch (error) {
      console.error('Failed to load common content:', error);
    }
  };

  return {
    commonContent,
    topics,
    loadCommonContent,
  };
}
