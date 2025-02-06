<template>
  <!-- Render Reactively Instead of Using v-html -->
  <div v-if="commonContent">
    <h1 v-html="lessonContent.title" class="title dbs"></h1>

    <h2 v-html="commonContent.look_back.title" class="ltr dbs"></h2>
    <ol class="ltr dbs">
      <li
        v-for="(item, index) in commonContent.look_back.question"
        :key="'back-' + index"
        v-html="item"
      ></li>
    </ol>
    <textarea
      class="dbs-back notes"
      v-model="textBlocks.dbsBack"
      @input="saveNoteToLocalStorage('back')"
      placeholder="Write your notes for Look Back here"
    ></textarea>

    <h2 v-html="commonContent.look_up.title" class="ltr dbs"></h2>
    <h3 class="dbs">{{ readInstruction }}</h3>
    <ol class="ltr dbs">
      <li
        v-for="(item, index) in commonContent.look_up.question"
        :key="'up-' + index"
        v-html="item"
      ></li>
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
        v-html="lessonContent.bibleBlock.passage.passageText"
        class="bible-text"
      ></div>
      <div>
        <a
          :href="lessonContent.bibleBlock.passage.passageUrl"
          class="readmore-button"
        >
          {{ lessonContent.bibleBlock.translation.read_more }}
        </a>
      </div>
    </div>

    <h2 v-html="commonContent.look_forward.title" class="ltr dbs"></h2>
    <ol class="ltr dbs">
      <li
        v-for="(item, index) in commonContent.look_forward.question"
        :key="'forward-' + index"
        v-html="item"
      ></li>
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
import { ref, onMounted, watch } from 'vue';



export default {
  name: "GrandStoryStudy",
  props: {
    languageCodeHL: String,
    study:String,
    lesson: Number,
  },

  data() {
    return {
      text: "",
      readInstruction: null,
      textBlocks: {
        dbsBack: "",
        dbsUp: "",
        dbsForward: "",
      },
      passageReference: null,
    };
  },

  setup(props) {
    const languageStore = useLanguageStore();
    const commonContent = ref(null);
    const lessonContent = ref(null);
    const noteContent = ref(null);

    const loadCommonContent = async () => {
      commonContent.value = await languageStore.loadCommonContent(
        props.languageCodeHL, props.study
      );
    };
    const loadLessonContent = async () => {
      lessonContent.value = await languageStore.loadLessonContent(
        props.languageCodeHL, props.study, props.lesson);
      this.createTranslatedSentences();
    };
    const loadLessonNotes = () =>{
      noteContent.value = languageStore.loadLessonNotes(
      props.languageCodeHL, props.study, props.lesson);
    };

    // Load initial data when component mounts
    onMounted(async () => {
      await loadCommonContent();
      await loadLessonContent();

      loadLessonNotes();
    });

    // Watch for changes to props and reload data if necessary
    watch(() => [props.languageCodeHL, props.study, props.lesson], async () => {
      await loadCommonContent();
      await loadLessonContent();
      loadLessonNotes();
    });

    return { commonContent, lessonContent, noteContent};
  },

  methods: {

    createTranslatedSentences() {
      this.cleanReference();
      var readTemplate = this.lessonContent.bibleBlock.translation.read;
      this.readInstruction =  readTemplate.replace("{{XXX}}", this.passageReference);
    },
    cleanReference() {
      var reference =
        this.lessonContent.bibleBlock.passage.referenceLocalLanguage;
      // Regular expression to match a Bible reference pattern
      let bibleReferenceRegex = /[A-Za-z]+\s\d+:\d+(?:-\d+)?/;
      this.passageReference =
        reference.match(bibleReferenceRegex)?.[0] || "No reference found";
    },

    saveNoteToLocalStorage(position) {

      const key = `${props.languageCodeHL}-${props.study}-${props.lesson}-${position}`;
      localStorage.setItem(
        key,
        this.textBlocks[
          `dbs${position.charAt(0).toUpperCase() + position.slice(1)}`
        ]
      );
    },
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
