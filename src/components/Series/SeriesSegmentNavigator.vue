<template>
  <div class="q-pa-md q-gutter-md q-flex justify-between items-center">
    <div
      v-if="currentLesson > minLesson"
      class="q-flex items-center cursor-pointer"
      @click="showPreviousLesson"
    >
      <q-btn flat dense round icon="arrow_back" aria-label="Previous" />
      <span class="q-ml-md">Previous</span>
    </div>

    <div
      v-if="currentLesson < maxLesson"
      class="q-flex items-center cursor-pointer"
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

const props = defineProps({
  study: String,
  lesson: Number,
});

const emit = defineEmits(["updateLesson"]); // ✅ Correct usage

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
