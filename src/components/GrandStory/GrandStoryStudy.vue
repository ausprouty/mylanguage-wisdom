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
import { useRoute } from "vue-router";
import { legacyApi, currentApi } from "boot/axios";

export default {
  name: "GrandStoryStudy",
  props: {
    lessonLink: Number,
    languageCode: String,
  },

  data() {
    return {
      text: "",
      commonContent: null, // Reactive object for parsed content
      lessonContent: null,
      readInstruction: null,
      textBlocks: {
        dbsBack: "",
        dbsUp: "",
        dbsForward: "",
      },
      passageReference: null,
    };
  },

  setup() {
    // no access to this. variables
    const languageStore = useLanguageStore();
    const route = useRoute();
    if (route.params.lessonLink) {
      languageStore.updateDbsLesson(route.params.lessonLink);
    }
    if (route.params.languageCode) {
      languageStore.updateLanguageSelected(route.params.languageCode);
    }
    return {
      languageStore,
    };
  },

  async created() {
    try {
      await this.loadLessonContent();
      await this.loadCommonContent();
      this.createTranslatedSentences();
    } catch (error) {
      console.error("Error in created hook:", error);
      alert(`Error loading content: ${error.message}`);
    }
  },

  methods: {
    async loadCommonContent() {
      const languageStore = useLanguageStore();
      const LanguageCodeHL = languageStore.getLanguageCodeHLSelected;
      const lesson = languageStore.getDbsLesson;
      this.commonContent = await languageStore.loadCommonContent(
        LanguageCodeHL,
        "dbs"
      );
    },
    async loadLessonContent() {
      const languageStore = useLanguageStore();
      const LanguageCodeHL = languageStore.getLanguageCodeHLSelected;
      const lesson = languageStore.getDbsLesson;
      this.lessonContent = await languageStore.loadLessonContent(
        LanguageCodeHL,
        "dbs",
        lesson
      );
      console.log(this.lessonContent);
    },
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
      const lesson = this.languageStore.getDbsLesson;
      const key = `dbs-${lesson}-${position}`;
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
