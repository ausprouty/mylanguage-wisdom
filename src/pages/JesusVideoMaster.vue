<template>
  <q-page padding>
    <h2>{{ t('life.title') }}</h2>
    <p>{{ t('life.para.1') }}</p>
    <p>{{ t('life.para.2') }}</p>
    <div>
      <JVideoSegmentSelect
        :languageCodeHL="computedLanguageCodeHLSelected"
        @showVideo="handleNewVideoSegment"
      />
    </div>
    <div>
      <JVideoSegmentController
        :videoSegment="computedVideoSegmentId"
        :languageCodeHL="computedLanguageCodeHLSelected"
        @showVideo="handleNewVideoSegment"
      />
    </div>
    <div>
      <JVideoPlayer :languageCodeHL="computedLanguageCodeHLSelected" />
    </div>
    <div>
      <JVideoQuestions :languageCodeHL="computedLanguageCodeHLSelected" />
    </div>
  </q-page>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useLanguageStore } from 'stores/LanguageStore';
import JVideoPlayer from 'src/components/JVideo/JVideoPlayer.vue';
import JVideoSegmentSelect from 'src/components/JVideo/JVideoSegmentSelect.vue';
import JVideoSegmentController from 'src/components/JVideo/JVideoSegmentController.vue';
import JVideoQuestions from 'src/components/JVideo/JVideoQuestions.vue';

// Access the current route
const route = useRoute();

// Access the i18n instance
const { t } = useI18n();

// Access the language store
const languageStore = useLanguageStore();

// Props
const props = defineProps({
  lesson: Number,
  languageCodeHL: String,
});

// Computed properties
const computedLanguageCodeHLSelected = computed(() => languageStore.getLanguageCodeHLSelected);
const computedVideoSegmentId = computed(() => languageStore.getJVideoSegmentId);

// Lifecycle hooks
onMounted(() => {
  if (route.params.lessonLink) {
    languageStore.updateJVideoSegmentId(route.params.lessonLink);
  }
  if (route.params.languageCode) {
    languageStore.updateLanguageCodeHLSelected(route.params.languageCode);
  }
});

// Methods
const handleNewVideoSegment = (response) => {
  console.log('handleNewVideoSegment', response);
  languageStore.updateJVideoSegmentId(response);
};
</script>

<style>
.q-page {
  background-color: white;
}
</style>
