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
import { ref, onMounted, watch } from "vue";
import { useLanguageStore } from "stores/LanguageStore";

export default {
  name: "SeriesPassageSelect",
  props: {
    topics: Array,
    lesson: Number,
  },

  setup(props, { emit }) {
    const languageStore = useLanguageStore();
    const selectedValue = ref({ label: "SELECT", value: 0 });

    // Update select bar when component is mounted or props change
    onMounted(() => {
      // Only call if topics are ready on mount
      if (Array.isArray(props.topics) && props.topics.length > 0) {
        updateSelectBar(props.lesson);
      }
    });

    // Watch for topics to be populated or updated
    watch(
      () => props.topics,
      (newTopics) => {
        if (Array.isArray(newTopics) && newTopics.length > 0) {
          updateSelectBar(props.lesson);
        }
      },
      { immediate: true } // Run immediately if topics are already available
    );

    // Watch for changes in the lesson prop
    watch(() => props.lesson, (newLesson) => {
      updateSelectBar(newLesson);
    });

    // Function to update the selected option based on the lesson
    const updateSelectBar = (lesson) => {
      console.log("lesson is updating " + lesson);

      if (Array.isArray(props.topics) && lesson > 0) {
        console.log(props.topics);
        const matchingTopic = props.topics.find((topic) => topic.value === lesson);
        if (matchingTopic) {
          console.log("matched");
          selectedValue.value = { label: matchingTopic.label, value: matchingTopic.value };
        } else {
          console.log("reset 1");
          resetSelectBar();
        }
      } else {
        console.log("reset 2");
        resetSelectBar();
      }
    };

    // Reset the select bar to its default state
    const resetSelectBar = () => {
      selectedValue.value = { label: "SELECT", value: 0 };
    };

    // Handle updating the lesson number and emitting events
    const updateLessonNumber = () => {
      languageStore.setLessonNumber(props.study, selectedValue.value.value);
      emit("updateLesson", selectedValue.value.value);
    };

    return {
      selectedValue,
      updateLessonNumber,
    };
  },
};
</script>
