import { ref } from 'vue';
import { useLanguageStore } from 'stores/LanguageStore';

export function useCommonContent(study, initialLanguageCodeHL) {
  console.log ('useCommonContent');
  const languageStore = useLanguageStore();
  const commonContent = ref({}); // ✅ Default to an empty object
  const topics = ref([]);

  const loadCommonContent = async (languageCode = initialLanguageCodeHL) => {
    try {
      console.log ('loadCommonContent');
      const content = await languageStore.loadCommonContent(languageCode, study);
      commonContent.value = content || {}; // ✅ Ensure it never becomes null
      topics.value = content?.topic
        ? Object.entries(content.topic).map(([key, value]) => ({
            label: `${parseInt(key)}. ${value}`,
            value: parseInt(key),
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
