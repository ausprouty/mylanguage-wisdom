<template>
<!-- this component will:
   Load notes from localStorage on mount.
   Save notes to localStorage when they change.
   Use sectionKey to store unique notes per section.-->

   
  <section v-if="content">
    <h2 class="ltr dbs">{{ content.title }}</h2>
    <ol class="ltr dbs">
      <li v-for="(item, index) in content.question" :key="'question-' + index">
        {{ item }}
      </li>
    </ol>
    <textarea
      class="dbs-notes notes"
      v-model="note"
      :placeholder="placeholder"
    ></textarea>

    <!-- Bible Passage Section (Optional) -->
    <div v-if="biblePassage" class="bible-container">
      <div>
        <h3 class="dbs">{{ passageReference }}</h3>
      </div>
      <div v-html="biblePassage.passageText" class="bible-text"></div>
      <div>
        <a :href="biblePassage.passageUrl" class="readmore-button">
          {{ biblePassage.readMoreText }}
        </a>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, watch, onMounted } from "vue";

export default {
  props: {
    content: { type: Object, required: true },
    sectionKey: { type: String, required: true }, // Unique key for localStorage
    placeholder: { type: String, default: "Write your notes here" },
    biblePassage: { type: Object, default: null },
    passageReference: { type: String, default: "No reference found" },
  },
  setup(props) {
    const note = ref("");

    // Load notes from localStorage
    const loadNotes = () => {
      const storedNotes = localStorage.getItem(`notes-${props.sectionKey}`);
      if (storedNotes) {
        note.value = storedNotes;
      }
    };

    // Watch for changes and save to localStorage
    watch(note, (newNote) => {
      localStorage.setItem(`notes-${props.sectionKey}`, newNote);
    });

    onMounted(() => {
      loadNotes();
    });

    return {
      note,
    };
  },
};
</script>

<style scoped>
textarea {
  width: 100%;
  height: 100px;
  margin-top: 8px;
}
</style>
