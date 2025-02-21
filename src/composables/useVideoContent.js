import { ref } from 'vue';
import { useLanguageStore } from 'stores/LanguageStore';

export function useVideoContent(study, languageCodeHL, langaugeCodeJF) {
  const languageStore = useLanguageStore();
  const VideoContent = ref({}); // ✅ Default to an empty object
  const topics = ref([]);

  const loadVideoCommonContent = async (languageCode = languageCodeHL) => {
    try {
      const content = await languageStore.loadVideoCommonContent(languageCode, study);
      VideoContent.value = content || {}; // ✅ Ensure it never becomes null
      topics.value = content?.topic
        ? Object.entries(content.topic).map(([key, value]) => ({
            label: `${parseInt(key)}. ${value}`,
            value: parseInt(key),
          }))
        : [];
    } catch (error) {
      console.error('Failed to load video content:', error);
      VideoContent.value = {}; // ✅ Fallback to an empty object
    }
  };
  const loadVideoSeriesUrls = async (languageCode = languageCodeJF) => {
    try {
      const content = await languageStore.loadVideoSeriesUrls
        ? Object.entries(content.topic).map(([key, value]) => ({
            label: `${parseInt(key)}. ${value}`,
            value: parseInt(key),
            url: content.videoCode?.[key] || '',
          }))
        : [];
    } catch (error) {
      console.error('Failed to load video content:', error);
      VideoContent.value = {}; // ✅ Fallback to an empty object
    }
  };

  return {
    VideoContent,
    topics,
    loadVideoCommonContent,
    loadVideoSeriesUrls,
  };
}
