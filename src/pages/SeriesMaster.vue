<template>
  <q-page padding>
    <h2>{{ $t(`${computedStudy}.book.title`) }}</h2>
    <p>{{ $t(`${computedStudy}.book.para1`) }}</p>
    <p>{{ $t(`${computedStudy}.book.para2`) }}</p>
    <p>{{ $t(`${computedStudy}.book.para3`) }}</p>
    <div>
      <div>
        <SeriesPassageSelect
          :languageCodeHL="computedLanguage"
          :study="computedStudy"
          :lesson="computedBookLesson"
          @showPassage="handleShowTeaching"
         />
      </div>
      <div>
        <SeriesSegmentNavigator
          :languageCodeHL="computedLanguage"
          :study="computedStudy"
          :lesson="computedBookLesson"
          @showTeaching="handleShowTeaching"
        />
      </div>
      <hr />
      <SeriesLessonContent
        :languageCodeHL="computedLanguage"
        :study="computedStudy"
        :lesson="computedBookLesson"
       />
    </div>
  </q-page>
</template>

<script>
import { useLanguageStore } from "stores/LanguageStore";
import { legacyApi, currentApi } from "boot/axios";
import { useRoute } from "vue-router";

import SeriesPassageSelect from "src/components/Series/SeriesPassageSelect.vue";
import SeriesSegmentNavigator from "src/components/Series/SeriesSegmentNavigator.vue";
import SeriesLessonContent from "src/components/Series/SeriesLessonContent.vue";

export default {
  name: "SeriesMaster",
  components: {
    SeriesPassageSelect,
    SeriesSegmentNavigator,
    SeriesLessonContent,
  },
  setup() {
    const languageStore = useLanguageStore();
    const route = useRoute();

    // Default values
    const DEFAULTS = {
      study: "dbs", // or "life", "lead"
      lesson: "1",
      languageCodeHL: "en",
    };

    // Set defaults if parameters are not provided
    const currentStudy = route.params.study || DEFAULTS.study;
    const currentLesson = route.params.lesson || DEFAULTS.lesson;
    const currentLanguageCodeHL = route.params.languageCodeHL || DEFAULTS.languageCodeHL;

    // Update store on initial load
    languageStore.setCurrentStudy(currentStudy);
    languageStore.setLessonNumber(currentStudy, currentLesson);
    languageStore.updateLanguageSelected(currentLanguageCodeHL);

    return { languageStore };
  },

  computed: {
    computedLanguage() {
      return this.languageStore.getLanguageCodeHLSelected;
    },
    computedBookLesson() {
      return this.languageStore.getLessonNumber(this.languageStore.getStudy());
    },
    computedStudy() {
      return this.languageStore.getStudy();
    },
  },
  watch: {
    computedLanguage() {
      this.handleShowTeaching();
    },
    computedBookLesson() {
      this.handleShowTeaching();
    },
    computedStudy() {
      this.handleShowTeaching();
    },
  },
  methods: {
    handleShowTeaching(nextSegment) {
      const currentStudy = this.computedStudy;
      const currentLesson = nextSegment || this.computedBookLesson;

      // Validate and set the lesson number
      if (currentStudy) {
        this.languageStore.setLessonNumber(currentStudy, currentLesson);
      } else {
        console.warn("No valid study found while updating the lesson.");
      }
    },
  },
};
