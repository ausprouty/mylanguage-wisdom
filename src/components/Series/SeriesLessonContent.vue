<template>
  <div v-if="lessonContent">
    <h1 class="title dbs">{{ lessonContent.title }}</h1>

    <section v-if="commonContent">
      <SharedContentSection
        :content="commonContent.look_back"
        sectionKey="dbsBack"
        placeholder="Write your notes for Look Back here"
      />

      <SharedContentSection
        :content="commonContent.look_up"
        sectionKey="dbsUp"
        placeholder="Write your notes for Look Up here"
        :biblePassage="lessonContent.bibleBlock.passage"
        :passageReference="passageReference"
      />

      <SharedContentSection
        :content="commonContent.look_forward"
        sectionKey="dbsForward"
        placeholder="Write your notes for Look Forward here"
      />
    </section>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
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

    const updatePassageReference = () => {
      const reference =
        lessonContent.value?.bibleBlock.passage.referenceLocalLanguage || "";
      passageReference.value = reference || "No reference found";
    };

    onMounted(() => {
      loadLessonContent();
    });

    return {
      lessonContent,
      passageReference,
    };
  },
};
</script>
