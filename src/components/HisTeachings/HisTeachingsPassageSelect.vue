<template>
  <div>
    <q-select
      filled
      v-model="selectedValue"
      :options="lessons"
      option-label="label"
      option-value="value"
      @update:model-value="updateLesson"
      label="Teachings"
      class="select"
    />
  </div>
</template>

<script>
import { legacyApi, currentApi } from "boot/axios";
import { useLanguageStore } from "stores/LanguageStore";
export default {
  name: "HisTeachingsPassageSelect",

  setup() {
    const languageStore = useLanguageStore();
    return {
      languageStore,
    };
  },
  data() {
    return {
      selectedValue: {
        value: 1,
        label: "SELECT",
      },
      lessons: [],
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
      return this.languageStore.getHisTeachingLesson;
    },
  },
  created() {
    this.getLessonList(this.languageCodeHL);
  },
  methods: {
    getLessonList(languageCodeHL) {
      var url = "api/life_principles/studies/" + languageCodeHL;
      console.log(url);
      legacyApi.get(url).then((response) => {
        var data = response.data;
        this.lessons = data.map((item) => ({
          label: item.title,
          value: item.lesson,
        }));
        this.updateSelectBar(this.currentSegment);
        this.updateLesson();
      });
    },
    updateLesson() {
      this.languageStore.updateHisTeachingLesson(this.selectedValue.value);
      this.$emit("showTeaching", this.selectedValue.value);
    },
    updateSelectBar(key) {
      key = key - 1;
      if (key >= 0) {
        this.selectedValue.label = this.lessons[key].label;
        this.selectedValue.value = this.lessons[key].value;
      } else {
        this.selectedValue.label = "SELECT";
        this.selectedValue.value = 1;
      }
    },
  },
};
</script>
<style scoped>
.q-item__label {
  color: black;
}
</style>
