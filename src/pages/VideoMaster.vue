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
        :study="route.params.study"
        :lesson="computedLessonNumber"
        @updateLesson="updateLesson"
      />
    </div>
    <div>
      <JVideoPlayer
        :topics="topics"
        :lesson="computedLessonNumber"
      />
    </div>
    <div>
      <JVideoQuestions
        :commonContent="commonContent"
      />
    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted } from 'vue'; // Add onMounted
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useLanguageStore } from 'stores/LanguageStore';
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
});

// Default values
const DEFAULTS = {
  study: 'dbs',
  lesson: '1',
  languageCodeHL: 'eng00',
};

// Set defaults if parameters are not provided
const currentStudy = route.params.study || DEFAULTS.study;
const currentLesson = route.params.lesson || DEFAULTS.lesson;
const currentLanguageCodeHL = route.params.languageCodeHL || DEFAULTS.languageCodeHL;

// Update store on initial load
languageStore.setCurrentStudy(currentStudy);
languageStore.setLessonNumber(currentStudy, currentLesson);
languageStore.updateLanguageSelected(currentLanguageCodeHL);

// Initialize the composable
const { commonContent, topics, loadCommonContent } = useCommonContent(currentStudy, currentLanguageCodeHL);

// Reactive computed properties
const computedLanguage = computed(() => languageStore.getLanguageCodeHLSelected);
const computedLessonNumber = computed(() => languageStore.getLessonNumber);

// Load common content when the component mounts
onMounted(() => {
  loadCommonContent();
});

// Watch for changes in computedLanguage and reload common content
watch(computedLanguage, (newLanguage) => {
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
