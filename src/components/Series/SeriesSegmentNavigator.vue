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

<script setup>
import { computed, ref } from "vue";
import { useLanguageStore } from "stores/LanguageStore";
import { useEmit } from "vue";

const props = defineProps({
  study: String,
  lesson: Number,
});

const emit = defineEmits(["updateLesson"]);

const languageStore = useLanguageStore();
const minLesson = ref(1);
const maxLesson = computed(() => languageStore.getMaxLesson(props.study));
const currentLesson = computed(
  () => languageStore.lessonNumber[props.study] || 1
);

const showNextLesson = () => {
  const nextLesson = currentLesson.value + 1;
  languageStore.setLessonNumber(props.study, nextLesson);
  emit("updateLesson", nextLesson);
};

const showPreviousLesson = () => {
  const previousLesson = currentLesson.value - 1;
  languageStore.setLessonNumber(props.study, previousLesson);
  emit("updateLesson", previousLesson);
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
