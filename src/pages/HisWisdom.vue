<template>
  <q-page padding>
    <div>
      <h2>{{ $t("teach.title") }}</h2>
      <p>{{ $t("teach.para1") }}</p>
      <p>{{ $t("teach.para2") }}</p>
      <p>{{ $t("teach.para3") }}</p>
      <p>{{ $t("teach.para4") }}</p>
      <div>
        <HisTeachingsPassageSelect @showTeaching="handleShowTeaching" />
      </div>
      <div>
        <HisTeachingsSegmentController @showTeaching="handleShowTeaching" />
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
import HisTeachingsPassageSelect from "components/HisTeachings/HisTeachingsPassageSelect.vue";
import HisTeachingsSegmentController from "src/components/HisTeachings/HisTeachingsSegmentController.vue";

export default {
  name: "HisWisdom",
  props: {
    lessonLink: Number,
    languageCode: String,
  },
  components: {
    HisTeachingsPassageSelect,
    HisTeachingsSegmentController,
  },
  data() {
    return {
      text: "",
    };
  },
  setup() {
    const languageStore = useLanguageStore();
    const route = useRoute();
    if (route.params.lessonLink !== "") {
      console.log("updated HisTeachingLesson to: " + route.params.lessonLink);
      languageStore.updateHisTeachingLesson(route.params.lessonLink);
    }
    if (route.params.languageCode !== "") {
      console.log("updated languagecode to: " + route.params.languageCode);
      languageStore.updateLanguageCodeHLSelected(route.params.languageCode);
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
    computedTeachingLesson() {
      return this.languageStore.getHisTeachingLesson;
    },
  },
  watch: {
    computedLanguage(newValue, oldValue) {
      this.handleShowTeaching();
    },
    computedTeachingLesson(newValue, oldValue) {
      this.handleShowTeaching();
    },
  },
  methods: {
    handleShowTeaching() {
      var lesson = this.languageStore.getHisTeachingLesson;
      var language = this.languageStore.getLanguageCodeHLSelected;
      var url = "api/life_principles/view/" + lesson + "/" + language;
      console.log(url);
      legacyApi.get(url).then((response) => {
        this.text = response.data;
      });
    },
  },
};
</script>

<style>
div.dbs {
  background-color: white;
  max-width: 800px;
  margin: auto;
  background-color: white;
  padding: 10px;
}
table {
  width: 100%;
  max-width: 800px;
}
td {
  width: 50%;
  vertical-align: top;
  padding: 10px;
}
li {
  padding-top: 10px;
}

title.dbs {
  font-size: 1.5em;
  text-align: center;
}
h1.dbs {
  font-size: 2em;
}
h2.dbs {
  margin-block-end: 0em;
  font-size: 1.5em;
  color: green;
}
h3.dbs {
  margin-block-end: 0.3em;
  font-size: 1.17em;
}
h4.dbs {
  margin-block-start: 0em;
  margin-block-end: 0em;
  font-size: 1em;
}
table.dbs {
  border-collapse: collapse;
  border: none;
}
td.dbs,
th.dbs {
  border: none;
}
td.rtl {
  direction: rtl;
}
.ltr.dbs.link {
  text-align: center;
}
.languages {
  text-align: center;
}
.title {
  text-align: center;
}
.biblereference {
  font-weight: bold;
  color: green;
}
.bible-container {
  display: flex;
  padding: 10px;
}
.bible-text {
  flex: 1;
}
.bible-text:first-child {
  margin-right: 20px;
}
</style>
