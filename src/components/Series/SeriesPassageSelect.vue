<template>
  <div>
    <q-select
      filled
      v-model="selectedValue"
      :options="topics"
      option-label="label"
      option-value="value"
      @update:model-value="updateLessonNumber"
      label="Topic"
      class="select"
    />
  </div>
</template>

<script>
import { useLanguageStore } from "stores/LanguageStore";
export default {
  name: "SeriesPassageSelect",
  props: {
    topics: Array,
    lesson: Number,
  },
  setup() {
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
    };
  },
  watch: {
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

  methods: {

    updateLessonNumber() {
      this.languageStore.setLessonNumber(this.study, this.selectedValue.value);
      this.$emit("updateLesson", this.selectedValue.value);
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
