<template>
  <div v-if="lessonContent">
    <h1 class="title dbs">{{ lessonContent.title }}</h1>

    <section v-if="commonContent">
      <SharedContentSection
        :content="commonContent.look_back"
        :sectionKey="sectionKeyBack"
        placeholder="Write your notes for Look Back here"
      />

      <SharedContentSection
        :content="commonContent.look_up"
        :sectionKey="sectionKeyUp"
        placeholder="Write your notes for Look Up here"
        :biblePassage="lessonContent.bibleBlock.passage"
        :passageReference="passageReference"
      />

      <SharedContentSection
        :content="commonContent.look_forward"
        :sectionKey="sectionKeyForward"
        placeholder="Write your notes for Look Forward here"
      />
    </section>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from "vue";
import { useLanguageStore } from "stores/LanguageStore";
import SharedContentSection from "src/components/SharedContentSection.vue";

export default {
  name: "SeriesLessonContent",
  components: { SharedContentSection },
  props: {
    languageCodeHL: { type: String, required: true },
    study: { type: String, required: true },
    lesson: { type: Number, required: true },
    commonContent: { type: Object, required: true },
  },
  setup(props) {
    const languageStore = useLanguageStore();
    const lessonContent = ref(null);
    const passageReference = ref("No reference found");

    // ✅ Computed section keys (Updates when study or lesson changes)
    const sectionKeyBack = computed(() => `${props.study}-${props.lesson}-back`);
    const sectionKeyUp = computed(() => `${props.study}-${props.lesson}-up`);
    const sectionKeyForward = computed(() => `${props.study}-${props.lesson}-forward`);

    // ✅ Load lesson content
    const loadLessonContent = async () => {
      try {
        lessonContent.value = await languageStore.loadLessonContent(
          props.languageCodeHL,
          props.study,
          props.lesson
        );
        updatePassageReference();
      } catch (error) {
        console.error("Error loading lesson content:", error);
      }
    };

    // ✅ Update passage reference when lesson content changes
    const updatePassageReference = () => {
      const reference = lessonContent.value?.bibleBlock.passage.referenceLocalLanguage || "";
      passageReference.value = reference || "No reference found";
    };

    // ✅ Watch for lesson changes and reload content
    watch(() => props.lesson, async (newLesson, oldLesson) => {
      console.log(`🔄 Lesson changed from ${oldLesson} to ${newLesson}. Reloading content...`);
      await loadLessonContent();
    });

    // ✅ Load content when the component mounts
    onMounted(() => {
      loadLessonContent();
    });

    return {
      lessonContent,
      passageReference,
      sectionKeyBack,
      sectionKeyUp,
      sectionKeyForward,
    };
  },
};
</script>
