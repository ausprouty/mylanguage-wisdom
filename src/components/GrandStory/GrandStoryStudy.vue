<template>
  <!-- Render Reactively Instead of Using v-html -->
  <div v-if="commonContent">
    <h1 v-html="studyContent.title" class="title dbs"></h1>

    <h2 v-html="commonContent.look_back.title" class="ltr dbs"></h2>
    <ol class="ltr dbs">
      <li v-for="(item, index) in commonContent.look_back.question" :key="'back-' + index" v-html="item"></li>
    </ol>
    <textarea
      class="dbs-back notes"
      v-model="textBlocks.dbsBack"
      @input="saveToLocalStorage('back')"
      placeholder="Write your notes for Look Back here"
    ></textarea>

    <h2 v-html="commonContent.look_up.title" class="ltr dbs"></h2>
    <ol class="ltr dbs">
      <li v-for="(item, index) in commonContent.look_up.question" :key="'up-' + index" v-html="item"></li>
    </ol>
    <textarea
      class="dbs-up notes"
      v-model="textBlocks.dbsUp"
      @input="saveToLocalStorage('up')"
      placeholder="Write your notes for Look Up here"
    ></textarea>

    <h2 v-html="commonContent.look_forward.title" class="ltr dbs"></h2>
    <ol class="ltr dbs">
      <li v-for="(item, index) in commonContent.look_forward.question" :key="'forward-' + index" v-html="item"></li>
    </ol>
    <textarea
      class="dbs-forward notes"
      v-model="textBlocks.dbsForward"
      @input="saveToLocalStorage('forward')"
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
      textBlocks: {
        dbsBack: "",
        dbsUp: "",
        dbsForward: "",
      },
      studyContent:{
        title: 'Your Study',
        bibleBlock: 'Bible Block'
      }
    };
  },

  setup() { // no access to this.
    const languageStore = useLanguageStore();
    const route = useRoute();
    if (route.params.lessonLink) {
      languageStore.updateGrandStoryLesson(route.params.lessonLink);
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
      await this.loadContent();
    } catch (error) {
      console.error('Error in created hook:', error);
      alert(`Error loading content: ${error.message}`);
    }
  },

  methods: {
    async loadContent() {
    const languageStore = useLanguageStore();
    const LanguageCodeHL = languageStore.getLanguageCodeHLSelected;

    // Load common content
    this.commonContent = await languageStore.loadCommonContent(LanguageCodeHL, 'dbs');

    // Load study content
    this.studyContent = await languageStore.loadStudyContent('dbs');
  },

    saveToLocalStorage(position) {
      const lesson = this.languageStore.getBookLesson;
      const key = `dbs-${lesson}-${position}`;
      localStorage.setItem(
        key,
        this.textBlocks[`dbs${position.charAt(0).toUpperCase() + position.slice(1)}`]
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
