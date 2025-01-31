<template>
  <!-- Render Reactively Instead of Using v-html -->
  <div v-if="commonContent">
    <h1 v-html="commonContent.title" class="title dbs"></h1>

    <h2 v-html="commonContent.lookBack.title" class="ltr dbs"></h2>
    <ol class="ltr dbs">
      <li v-for="(item, index) in commonContent.lookBack.questions" :key="'back-' + index" v-html="item"></li>
    </ol>
    <textarea
      class="dbs-back notes"
      v-model="textBlocks.dbsBack"
      @input="saveToLocalStorage('back')"
      placeholder="Write your notes for Look Back here"
    ></textarea>

    <h2 v-html="commonContent.lookUp.title" class="ltr dbs"></h2>
    <ol class="ltr dbs">
      <li v-for="(item, index) in commonContent.lookUp.questions" :key="'up-' + index" v-html="item"></li>
    </ol>
    <textarea
      class="dbs-up notes"
      v-model="textBlocks.dbsUp"
      @input="saveToLocalStorage('up')"
      placeholder="Write your notes for Look Up here"
    ></textarea>

    <h2 v-html="commonContent.lookForward.title" class="ltr dbs"></h2>
    <ol class="ltr dbs">
      <li v-for="(item, index) in commonContent.lookForward.questions" :key="'forward-' + index" v-html="item"></li>
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
    };
  },
  mounted() {
    // Load text blocks from localStorage based on lesson
    const lesson = this.languageStore.getBookLesson;
    this.textBlocks.dbsBack = localStorage.getItem(`dbs-${lesson}-back`) || "";
    this.textBlocks.dbsUp = localStorage.getItem(`dbs-${lesson}-up`) || "";
    this.textBlocks.dbsForward = localStorage.getItem(`dbs-${lesson}-forward`) || "";
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
  async created() {
    const languageStore = useLanguageStore();
    alert ('looking for commonContent')
    // Load common content and assign it to a local variable
    this.commonContent = await languageStore.loadCommonContent(this.language, this.study);
    console.log (this.commonContent);
    alert('found content')
    this.handleShowTeaching();

  },
  methods: {
    getQuestions(){
      const language = this.languageStore.getLanguageCodeHLSelected;
      const url = `api/translate/questions/dbsStructured/${language}`;
      currentApi.get(url).then((response) => {
        console.log (response)
        this.commonContent = this.parseContent(response.data);
      });
    },
    handleShowTeaching() {
      const lesson = this.languageStore.getBookLesson;
      const language = this.languageStore.getLanguageCodeHLSelected;
      const url = `api/translate/questions/dbsStructured/${language}`;
      currentApi.get(url).then((response) => {
        this.text = response.data;
        this.commonContent = this.parseContent(response.data);
      });
    },
    parseContent(htmlString) {
      // Parse the HTML string into a structured object for rendering
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlString, "text/html");

      return {
        title: doc.querySelector("h1")?.innerHTML || "",
        lookBack: {
          title: doc.querySelector("h2:nth-of-type(1)")?.innerHTML || "",
          questions: Array.from(doc.querySelectorAll("ol:nth-of-type(1) li")).map(
            (li) => li.innerHTML
          ),
        },
        lookUp: {
          title: doc.querySelector("h2:nth-of-type(2)")?.innerHTML || "",
          questions: Array.from(doc.querySelectorAll("ol:nth-of-type(2) li")).map(
            (li) => li.innerHTML
          ),
        },
        lookForward: {
          title: doc.querySelector("h2:nth-of-type(3)")?.innerHTML || "",
          questions: Array.from(
            doc.querySelectorAll("ol:nth-of-type(3) li")
          ).map((li) => li.innerHTML),
        },
      };
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
