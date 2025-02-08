<template>
  <div>
    <q-select
      filled
      v-model="selectedValue"
      :options="supportedPassages"
      option-label="label"
      option-value="value"
      @update:model-value="updatePassage"
      label="Passage"
      class="select"
    />
  </div>
</template>

<script>
import { legacyApi, currentApi } from "boot/axios";
import { useLanguageStore } from "stores/LanguageStore";
export default {
  name: "SeriesPassageSelect",
  props: {
    languageCodeHL: String,
    study: String,
    lesson: Number,
  },
  setup(props) {
    const languageStore = useLanguageStore();
    return {
      languageStore,
    };
  },
  data() {
    return {
      selectedValue: {
        label: "SELECT",
        value: 1,
      },
      supportedPassages: [],
    };
  },
  watch: {
    languageCodeHL(newLanguage, oldLanguage) {
      if (newLanguage !== oldLanguage) {
        this.getLessonList();
      }
    },
    study(newStudy, oldStudy) {
      if (newStudy !== oldStudy) {
        this.getLessonList();
      }
    },
    currentLesson(newLesson, oldLesson) {
      if (newLesson !== oldLesson) {
        this.updateSelectBar(newLesson);
      }
    },
  },
  computed: {
    currentLesson() {
      return this.languageStore.lessonNumber[this.study] || 1;
    },
  },
  created() {
    this.getLessonList();
  },
  methods: {
    getLessonList() {
      return this.languageStore.loadLessonList(this.study, this.languageCodeHL);
    },
    updatePassage() {
      this.languageStore.setLessonNumber(this.study, this.selectedValue.value);
      this.$emit("showPassage", this.selectedValue.value);
    },
    updateSelectBar(lesson) {
      if (Array.isArray(this.supportedPassages) && lesson > 0) {
        const passage = this.supportedPassages.find(p => p.value === lesson);
        if (passage) {
          this.selectedValue = { label: passage.label, value: passage.value };
        } else {
          this.resetSelectBar();
        }
      } else {
        this.resetSelectBar();
      }
    },
    resetSelectBar() {
      this.selectedValue = { label: "SELECT", value: 1 };
    },
  },
};
</script>
