import { ref } from 'vue';
import { useLanguageStore } from 'stores/LanguageStore';

export function useCommonContent(study, initialLanguageCodeHL) {
  const languageStore = useLanguageStore();
  const commonContent = ref({}); // ✅ Default to an empty object
  const topics = ref([]);

  const loadCommonContent = async (languageCode = initialLanguageCodeHL) => {
    try {
      const content = await languageStore.loadCommonContent(languageCode, study);
      commonContent.value = content || {}; // ✅ Ensure it never becomes null
      topics.value = content?.topic
        ? Object.entries(content.topic).map(([key, value]) => ({
            label: `${parseInt(key)}. ${value}`,
            value: parseInt(key),
            videoCode: content.videoCode?.[key] || '',
          }))
        : [];
    } catch (error) {
      console.error('Failed to load common content:', error);
      commonContent.value = {}; // ✅ Fallback to an empty object
    }
  };

  return {
    commonContent,
    topics,
    loadCommonContent,
  };
}
