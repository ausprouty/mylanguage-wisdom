<template>
  <div v-if="commonContent">
    <h1 class="title dbs">{{ lessonContent?.title }}</h1>

    <h2 class="ltr dbs">{{ commonContent.look_back.title }}</h2>
    <ol class="ltr dbs">
      <li
        v-for="(item, index) in commonContent.look_back.question"
        :key="'back-' + index"
      >
        {{ item }}
      </li>
    </ol>
    <textarea
      class="dbs-back notes"
      v-model="textBlocks.dbsBack"
      @input="saveNoteToLocalStorage('back')"
      placeholder="Write your notes for Look Back here"
    ></textarea>

    <h2 class="ltr dbs">{{ commonContent.look_up.title }}</h2>
    <h3 class="dbs">{{ readInstruction }}</h3>
    <ol class="ltr dbs">
      <li
        v-for="(item, index) in commonContent.look_up.question"
        :key="'up-' + index"
        >
        {{ item }}
      </li>
    </ol>
    <textarea
      class="dbs-up notes"
      v-model="textBlocks.dbsUp"
      @input="saveNoteToLocalStorage('up')"
      placeholder="Write your notes for Look Up here"
    ></textarea>

    <div class="bible-container">
      <div>
        <h3 class="dbs">{{ passageReference }}</h3>
      </div>
      <div
        v-html="lessonContent?.bibleBlock.passage.passageText"
        class="bible-text"
      ></div>
      <div>
        <a
          :href="lessonContent?.bibleBlock.passage.passageUrl"
          class="readmore-button"
        >
          {{ lessonContent?.bibleBlock.translation.read_more }}
        </a>
      </div>
    </div>

    <h2 class="ltr dbs">{{ commonContent.look_forward.title }}</h2>
    <ol class="ltr dbs">
      <li
        v-for="(item, index) in commonContent.look_forward.question"
        :key="'forward-' + index"
        >
        {{ item }}
      </li>
    </ol>
    <textarea
      class="dbs-forward notes"
      v-model="textBlocks.dbsForward"
      @input="saveNoteToLocalStorage('forward')"
      placeholder="Write your notes for Look Forward here"
    ></textarea>
  </div>
</template>

<script>
import { useLanguageStore } from "stores/LanguageStore";
import { ref, onMounted, watch, computed } from "vue";

export default {
  name: "SeriesLessonContent",
  props: {
    languageCodeHL: String,
    study: String,
    lesson: Number,
    commonContent:Object,
  },
  setup(props) {
    console.log (props)
    const languageStore = useLanguageStore();
    const commonContent = ref(null);
    const lessonContent = ref(null);
    const textBlocks = ref({
      dbsBack: "",
      dbsUp: "",
      dbsForward: "",
    });
    const passageReference = ref("No reference found");
    const readInstruction = ref(null);

    const loadLessonContent = async () => {
      lessonContent.value = await languageStore.loadLessonContent(
        props.languageCodeHL,
        props.study,
        props.lesson
      );
      createTranslatedSentences();
    };

    const cleanReference = () => {
      const reference = lessonContent.value.bibleBlock.passage.referenceLocalLanguage;
      // Updated regex to capture cases like "Genesis 3" or "Genesis 3:1-5"
      const bibleReferenceRegex = /[A-Za-z]+\s\d+(:\d+(-\d+)?)?/;
      // Match the reference or fallback to the first non-blank section delimited by \n
      passageReference.value = reference.match(bibleReferenceRegex)?.[0] ||
          reference.split("\n").find(section => section.trim()) || "No reference found";
    };

    const createTranslatedSentences = () => {
      cleanReference();
      const readTemplate = lessonContent.value.bibleBlock.translation.read;
      readInstruction.value = readTemplate.replace(
        "{{XXX}}",
        passageReference.value
      );
    };

    const loadLessonNotes = () => {
      const key = `${props.study}-${props.languageCodeHL}-${props.lesson}-notes`;
      const storedNotes = localStorage.getItem(key);

      if (storedNotes) {
        const notes = JSON.parse(storedNotes);
        textBlocks.value.dbsBack = notes.dbsBack || "";
        textBlocks.value.dbsUp = notes.dbsUp || "";
        textBlocks.value.dbsForward = notes.dbsForward || "";
      } else {
        // Clear textBlocks when no stored notes are found
        textBlocks.value.dbsBack = "";
        textBlocks.value.dbsUp = "";
        textBlocks.value.dbsForward = "";
      }
    };

    const saveNoteToLocalStorage = (position) => {
      const key = `${props.study}-${props.languageCodeHL}-${props.lesson}-notes`;
      const notes = {
        dbsBack: textBlocks.value.dbsBack,
        dbsUp: textBlocks.value.dbsUp,
        dbsForward: textBlocks.value.dbsForward,
      };
      // Store the object as a JSON string in localStorage
      localStorage.setItem(key, JSON.stringify(notes));
    };

    onMounted(async () => {
      await loadLessonContent();
      loadLessonNotes();
    });

    watch(
      () => [props.languageCodeHL, props.study, props.lesson],
      async () => {
        await loadLessonContent();
        loadLessonNotes();
      }
    );

    return {
      lessonContent,
      textBlocks,
      passageReference,
      readInstruction,
      saveNoteToLocalStorage,
    };
  },
};
</script>

<style>
textarea {
  width: 100%;
  height: 100px;
  margin-top: 8px;
}
</style>
