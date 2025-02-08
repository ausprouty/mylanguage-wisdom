<template>
  <q-page padding>
    <h2>{{ $t(`${computedStudy}.book.title`) }}</h2>
    <p>{{ $t(`${computedStudy}.book.para1`) }}</p>
    <p>{{ $t(`${computedStudy}.book.para2`) }}</p>
    <p>{{ $t(`${computedStudy}.book.para3`) }}</p>

    <div v-if="commonContent">
      <div>
        <SeriesPassageSelect
          :topics="commonContent.topics"
          :lesson="computedBookLesson"
          @showPassage="handleShowTeaching"
        />
      </div>
      <div>
        <SeriesSegmentNavigator
          :study="study"
          :lesson="computedBookLesson"
          @showTeaching="handleShowTeaching"
        />
      </div>
    </div>
    <div v-else>
      Loading common content...
    </div>

    <hr />

    <div v-if="lessonContentRetrieved">
      <SeriesLessonContent
        :languageCodeHL="computedLanguage"
        :study="computedStudy"
        :lesson="computedBookLesson"
      />
    </div>
    <div v-else>
      Loading lesson content...
    </div>
  </q-page>
</template>

---

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

    // Default values
    const DEFAULTS = {
      study: 'dbs',
      lesson: '1',
      languageCodeHL: 'en',
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
      } catch (error) {
        console.error('Failed to load common content:', error);
      }
    };

    // Load common content when the component mounts
    onMounted(loadCommonContent);

    // Computed properties
    const computedLanguage = computed(() => languageStore.getLanguageCodeHLSelected);
    const computedBookLesson = computed(() => languageStore.getLessonNumber(languageStore.getStudy()));
    const computedStudy = computed(() => languageStore.getStudy());

    return {
      commonContent,
      computedLanguage,
      computedBookLesson,
      computedStudy,
      lessonContentRetrieved,
    };
  },

  methods: {
    handleShowTeaching(nextSegment) {
      const currentStudy = this.computedStudy;
      const currentLesson = nextSegment || this.computedBookLesson;

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
