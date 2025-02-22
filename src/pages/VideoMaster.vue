<template>
  <q-page padding>
    <h2>{{ t('jVideo.title') }}</h2>
    <p>{{ t('jVideo.para.1') }}</p>
    <p>{{ t('jVideo.para.2') }}</p>
    <div>
      <SeriesPassageSelect
        :topics="topics"
        :lesson="computedLessonNumber"
        @updateLesson="updateLesson"
      />
    </div>
    <div>
      <SeriesSegmentNavigator
        :study="currentStudy"
        :lesson="computedLessonNumber"
        @updateLesson="updateLesson"
      />
    </div>
    <div>
      <VideoPlayer
        :videoUrls="videoUrls"
        :lesson="computedLessonNumber"
      />
    </div>
    <div>
      <VideoQuestions
        :videoContent="videoContent"
      />
    </div>
  </q-page>
</template>

<script setup>
import { computed,watch, onMounted } from 'vue'; // Add onMounted
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useLanguageStore } from 'stores/LanguageStore';
import { useCommonContent } from 'src/composables/useCommonContent';

import VideoPlayer from 'src/components/Video/VideoPlayer.vue';
import SeriesPassageSelect from 'src/components/Series/SeriesPassageSelect.vue';
import SeriesSegmentNavigator from 'src/components/Series/SeriesSegmentNavigator.vue';
import VideoQuestions from 'src/components/Video/VideoQuestions.vue';

// Access the current route
const route = useRoute();

// Access the i18n instance
const { t } = useI18n();

// Access the language store
const languageStore = useLanguageStore();

// Props
const props = defineProps({
  video:String,
  lesson: Number,
  languageCodeHL: String,
  languageCodeJF: String,
});

// Use getters to fetch default values from the store
const currentStudy = 'jvideo'
languageStore.setCurrentStudy(currentStudy);
const currentLesson = route.params.lesson || languageStore.getLessonNumber;
const currentLanguageCodeHL = route.params.languageCodeHL || languageStore.getLanguageCodeHLSelected;
const currentLanguageCodeJF = route.params.languageCodeJF || languageStore.getLanguageCodeJFSelected;


languageStore.setLessonNumber(currentStudy, currentLesson);
languageStore.updateLanguageSelected(currentLanguageCodeHL, currentLanguageCodeJF);


// Initialize the composable
// Initialize the composable
const { commonContent, topics, loadCommonContent } = useCommonContent(currentStudy, currentLanguageCodeHL);
console.log ('topics')
console.log (topics)
// Reactive computed properties
const computedLanguageHL = computed(() => languageStore.getLanguageCodeHLSelected);
const computedLessonNumber = computed(() => languageStore.getLessonNumber);
const computedVideoUrls = computed(() => languageStore.getJesusVideoUrls);

// Load common content when the component mounts
onMounted(async () => {
  await loadCommonContent();
  console.log('Updated topics:', topics.value);
});


// Watch for changes in computedLanguage and reload common content
watch(computedLanguageHL, (newLanguage) => {
  loadCommonContent(newLanguage);
});

// Function to update the lesson number
const updateLesson = (nextLessonNumber) => {
  languageStore.setLessonNumber(currentStudy, nextLessonNumber);
};
</script>

<style>
.q-page {
  background-color: white;
}
</style>
