<template>
  <q-page padding>
    <h2>{{ $t("book.title") }}</h2>
    <p>{{ $t("book.para1") }}</p>
    <p>{{ $t("book.para2") }}</p>
    <p>{{ $t("book.para3") }}</p>
    <div>
      <div>
        <GrandStoryPassageSelect @showPassage="handleShowTeaching" />
      </div>
      <div>
        <GrandStorySegmentController @showTeaching="handleShowTeaching" />
      </div>
      <hr />
      <div v-html="this.text"></div>
    </div>
  </q-page>
</template>

<script>
import { useLanguageStore } from "stores/LanguageStore";
import { legacyApi, currentApi } from "boot/axios";
import { useRoute } from "vue-router";

import GrandStoryPassageSelect from "components/GrandStory/GrandStoryPassageSelect.vue";
import GrandStorySegmentController from "src/components/GrandStory/GrandStorySegmentController.vue";

export default {
  name: "GrandStory",
  props: {
    lessonLink: Number,
    languageCode: String,
  },
  components: {
    GrandStoryPassageSelect,
    GrandStorySegmentController,
  },
  data() {
    return {
      text: "",
      textBlocks: {
        dbsBack: "",
        dbsUp: "",
        dbsForward: "",
      },
    };
  },
  mounted() {
    // Load text blocks from localStorage based on lesson
    this.textBlocks.dbsBack =
      localStorage.getItem(`dbs-${this.lesson}-back`) || "";
    this.textBlocks.dbsUp = localStorage.getItem(`dbs-${this.lesson}-up`) || "";
    this.textBlocks.dbsForward =
      localStorage.getItem(`dbs-${this.lesson}-forward`) || "";
  },
  setup() {
    const languageStore = useLanguageStore();
    const route = useRoute();
    if (route.params.lessonLink !== "") {
      languageStore.updateBookLesson(route.params.lessonLink);
    }
    if (route.params.languageCode !== "") {
      languageStore.updateLanguageSelected(route.params.languageCode);
    }
    return {
      languageStore,
    };
  },
  created() {
    this.handleShowTeaching();
  },
  computed: {
    computedLanguage() {
      return this.languageStore.getLanguageSelected;
    },
    computedBookLesson() {
      return this.languageStore.getBookLesson;
    },
  },
  watch: {
    computedLanguage(newValue, oldValue) {
      this.handleShowTeaching();
    },
    computedBookLesson(newValue, oldValue) {
      this.handleShowTeaching();
    },
  },
  methods: {
    handleShowTeaching() {
      var lesson = this.languageStore.getBookLesson;
      if (isNaN(lesson)){
        lesson = 1
      }
      var language = this.languageStore.getLanguageCodeHLSelected;
      var url = "api/dbs/view/" + lesson + "/" + language;
      console.log(url);
      legacyApi.get(url).then((response) => {
        this.text = response.data;
      });
    },
    saveToLocalStorage(position) {
      alert( 'position :' + position);
      // Save to localStorage based on position (back, up, forward)
      const key = `dbs-${this.lesson}-${position}`;
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

<style></style>
