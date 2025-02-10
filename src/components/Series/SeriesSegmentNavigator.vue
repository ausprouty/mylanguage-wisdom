<template>
  <div class="q-pa-md q-gutter-md q-flex">
    <div
      v-if="currentLesson > minLesson"
      class="q-gutter-md q-flex items-center inline"
      @click="showPreviousLesson"
    >
      <q-btn flat dense round icon="arrow_back" aria-label="Previous" />
      <span class="q-ml-md">Previous</span>
    </div>

    <div
      v-if="currentLesson < maxLesson"
      class="q-gutter-md q-flex items-center inline align-right"
      @click="showNextLesson"
    >
      <span class="q-mr-md">Next</span>
      <q-btn flat dense round icon="arrow_forward" aria-label="Next" />
    </div>
  </div>
</template>

<script>
import { useLanguageStore } from "stores/LanguageStore";
export default {
  name: "SeriesLessonNavigator",
  props: {
    study: String,
    lesson: Number,
  },
  data() {
    return {
      minLesson: 1,
      nextLesson: 0,
    };
  },
  setup(props) {
    const languageStore = useLanguageStore();
    return {
      languageStore,
      maxLesson: languageStore.getMaxLesson(props.study),
    };
  },
  computed: {
    currentLesson() {
      return this.languageStore.lessonNumber[this.study] || 1;
    },
  },
  methods: {
    showNextLesson() {
      this.nextLesson = Number(this.currentLesson) + 1;
      this.languageStore.setLessonNumber(this.study, this.nextLesson);
      this.$emit("updateLesson", this.nextLesson);
    },
    showPreviousLesson() {
      this.nextLesson = Number(this.currentLesson) - 1;
      this.languageStore.setLessonNumber(this.study, this.nextLesson);
      this.$emit("updateLesson", this.nextLesson);
    },
  },
};
</script>

<style scoped>
.align-right {
  text-align: right;
}

.inline {
  display: inline-block;
}

div.inline {
  width: 50%;
}

.q-gutter-md,
.q-mr-md,
.q-ml-md {
  margin-top: 0px;
}

.q-gutter-y-md,
.q-gutter-md {
  margin-top: 0px;
}

.q-gutter-y-md > *,
.q-gutter-md > * {
  margin-top: 0px;
}
</style>
