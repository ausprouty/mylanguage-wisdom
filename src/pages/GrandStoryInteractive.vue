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
      <GrandStoryStudy
        :languageCodeHL="computedLanguage"
        :study="dbs"
        :lesson="computedBookLesson"
       />
    </div>
  </q-page>
</template>

<script>
import { useLanguageStore } from "stores/LanguageStore";
import { legacyApi, currentApi } from "boot/axios";
import { useRoute } from "vue-router";

import GrandStoryPassageSelect from "src/components/GrandStory/GrandStoryPassageSelect.vue";
import GrandStorySegmentController from "src/components/GrandStory/GrandStorySegmentController.vue";
import GrandStoryStudy from "src/components/GrandStory/GrandStoryStudy.vue";

export default {
  name: "GrandStory",

  components: {
    GrandStoryPassageSelect,
    GrandStorySegmentController,
    GrandStoryStudy,
  },


  setup() {
    const languageStore = useLanguageStore();
    const route = useRoute();
    if (route.params.lessonLink) {
      languageStore.updateBookLesson(route.params.lessonLink);
    }
    if (route.params.languageCode) {
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
      return this.languageStore.getLanguageCodeHLSelected;
    },
    computedBookLesson() {
      return this.languageStore.getDbsLesson;
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
      console.log ('handle show teaching')
    },

    saveToLocalStorage(position) {
      alert('save: ' + position);
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
