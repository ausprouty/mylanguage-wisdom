<template>
  <div>
    <q-select
      filled
      v-model="selectedValue"
      :options="supportedPassages"
      option-label="label"
      option-value="value"
      @update:model-value="updatePassage"
      label="Wisdom Passage"
      class="select"
    />
  </div>
</template>

<script>
import { legacyApi, currentApi } from "boot/axios";
import { useLanguageStore } from "stores/LanguageStore";
export default {
  name: "SeriesPassageSelect",
  props: {
    study: String,
  },
  setup() {
    const languageStore = useLanguageStore();
    return {
      languageStore,
    };
  },
  data() {
    return {
      selectedValue: {
        label: "SELECT",
        value: 1,
      },
      supportedPassages: [],
    };
  },
  watch: {
    languageCodeHL: function (newLanguage, oldLanguage) {
      if (newLanguage !== oldLanguage) {
        this.getLessonList(newLanguage);
      }
    },
    currentSegment: function (newLesson, oldLesson) {
      if (newLesson !== oldLesson) {
        this.updateSelectBar(newLesson);
      }
    },
  },
  computed: {
    languageCodeHL() {
      return this.languageStore.getLanguageCodeHLSelected;
    },
    currentSegment() {
      return this.languageStore.getDbsLesson;
    },
  },
  created() {
    this.getLessonList(this.languageCodeHL);
  },
  methods: {
    getLessonList(languageCodeHL) {
      var url = "api/dbs/studies/" + languageCodeHL;
      console.log(url);
      legacyApi.get(url).then((response) => {
        var data = response.data;
        this.supportedPassages = data.map((item) => ({
          label: item.title,
          value: item.lesson,
        }));
        this.updateSelectBar(this.currentSegment);
        this.updatePassage();
      });
    },
    updatePassage() {
      this.languageStore.updateDbsLesson(this.selectedValue.value);
      this.$emit("showPassage", this.selectedValue.value);
    },
    updateSelectBar(key) {
      if (typeof this.supportedPassages != undefined) {
        key = key - 1;
        if (key >= 0) {
          this.selectedValue.label = this.supportedPassages[key].label;
          this.selectedValue.value = this.supportedPassages[key].value;
        } else {
          this.selectedValue.label = "SELECT";
          this.selectedValue.value = 1;
        }
      }
    },
  },
};
</script>
