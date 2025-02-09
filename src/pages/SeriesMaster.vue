<template>
  <q-page padding>
    <h2>{{ $t(`${route.params.study}.book.title`) }}</h2>
    <p>{{ $t(`${route.params.study}.book.para1`) }}</p>
    <p>{{ $t(`${route.params.study}.book.para2`) }}</p>
    <p>{{ $t(`${route.params.study}.book.para3`) }}</p>


      <div>
        <SeriesPassageSelect
          :topics="topics"
          :lesson="computedLessonNumber"
          @showPassage="handleShowTeaching"
        />
      </div>
      <div>
        <SeriesSegmentNavigator
          :study="route.params.study"
          :lesson="computedLessonNumber"
          @showTeaching="handleShowTeaching"
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
import { ref, computed, onMounted } from 'vue';
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
    const commonContent = ref(null); // Define reactive commonContent
    const lessonContentRetrieved = ref(false); // Handle loading lesson content
    const topics = ref([]); //

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
    const loadCommonContent = async () => {
      try {
        const content = await languageStore.loadCommonContent(currentLanguageCodeHL, currentStudy);
        commonContent.value = content;
        // Transform the object into an array of { label, value } objects
        topics.value = Object.entries(content.topic).map(([key, value]) => ({
          label: parseInt(key) + '. '+ value,
          value: parseInt(key),
        }));
      } catch (error) {
        console.error('Failed to load common content:', error);
      }
    };
    // Load common content when the component mounts
    onMounted(loadCommonContent);
      // Reactive computed property
    const computedLanguage = computed(() => languageStore.getLanguageCodeHLSelected);

    const computedLessonNumber = computed(() => languageStore.getLessonNumber);

    return {
      commonContent,
      computedLanguage,
      computedLessonNumber,
      lessonContentRetrieved,
      topics,
      route,
    };
  },

  methods: {
    handleShowTeaching(nextSegment) {
      const currentLesson = nextSegment || this.computedLessonNumber;
      const currentStudy = this.route.params.study;

      // Validate and set the lesson number
      if (currentStudy) {
        this.languageStore.setLessonNumber(currentStudy, currentLesson);
      } else {
        console.warn('No valid study found while updating the lesson.');
      }
    },
  },
};
</script>
