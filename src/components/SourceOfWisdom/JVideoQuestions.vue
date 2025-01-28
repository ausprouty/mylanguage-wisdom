<template>
  <div v-html="this.questions"></div>
</template>
<script>
import { legacyApi, currentApi } from "boot/axios";
import { useLanguageStore } from "stores/LanguageStore";
export default {
  name: "JVideoQuestions",
  setup() {
    const languageStore = useLanguageStore();
    return {
      languageStore,
    };
  },

  data() {
    return {
      questions: "",
    };
  },
  watch: {
    languageCodeHL: function (newLanguage, oldLanguage) {
      if (newLanguage !== oldLanguage) {
        this.showQuestions(newLanguage);
      }
    },
  },
  computed: {
    languageCodeHL() {
      return this.languageStore.getLanguageCodeHLSelected;
    },
  },
  methods: {
    showQuestions(languageCodeHL) {
      var url = "api/jvideo/questions/" + languageCodeHL;
      console.log(url);
      legacyApi.get(url).then((response) => {
        console.log(response);
        this.questions = response.data;
      });
    },
  },
  created() {
    this.showQuestions(this.languageCodeHL);
  },
};
</script>
