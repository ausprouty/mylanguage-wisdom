<template>
  <q-page padding>
    <h2>{{ $t(`${route.params.study}.title`) }}</h2>
    <p>{{ $t(`${route.params.study}.para1`) }}</p>
    <p>{{ $t(`${route.params.study}.para2`) }}</p>
    <p>{{ $t(`${route.params.study}.para3`) }}</p>


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


    <hr />

      <SeriesLessonContent
        :languageCodeHL="computedLanguage"
        :study="route.params.study"
        :lesson="computedLessonNumber"
        :commonContent="commonContent"
      />

  </q-page>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useLanguageStore } from 'stores/LanguageStore';
import { useRoute } from 'vue-router';

import SeriesPassageSelect from 'src/components/Series/SeriesPassageSelect.vue';
import SeriesSegmentNavigator from 'src/components/Series/SeriesSegmentNavigator.vue';
import SeriesLessonContent from 'src/components/Series/SeriesLessonContent.vue';

export default {
  name: 'SeriesMaster',
  components: {
    SeriesPassageSelect,
    SeriesSegmentNavigator,
    SeriesLessonContent,
  },

  setup() {
    const languageStore = useLanguageStore();
    const route = useRoute();
    const commonContent = ref(null);
    const topics = ref([]);

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

    // Async function to load common content
    const loadCommonContent = async (languageCode = currentLanguageCodeHL) => {
      try {
        const content = await languageStore.loadCommonContent(languageCode, currentStudy);
        commonContent.value = content;

        // Transform the object into an array of { label, value } objects
        topics.value = Object.entries(content.topic).map(([key, value]) => ({
          label: `${parseInt(key)}. ${value}`,
          value: parseInt(key),
        }));
      } catch (error) {
        console.error('Failed to load common content:', error);
      }
    };

    // Load common content when the component mounts
    onMounted(() => {
      loadCommonContent();
    });

    // Reactive computed properties
    const computedLanguage = computed(() => languageStore.getLanguageCodeHLSelected);
    const computedLessonNumber = computed(() => languageStore.getLessonNumber);

    // Watch for changes in computedLanguage and reload common content
    watch(computedLanguage, (newLanguage) => {
      loadCommonContent(newLanguage);
    });

    return {
      commonContent,
      computedLanguage,
      computedLessonNumber,
      topics,
      route,
    };
  },

  methods: {
    updateLesson(nextLessonNumber) {
      this.languageStore.setLessonNumber(this.route.params.study, nextLessonNumber);
    },
  },
};

</script>
