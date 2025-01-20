<template>
  <div >
    <q-select
      filled
      v-model="selectedValue"
      :options="supportedPassages"
      option-label="label"
      option-value="value"
      @update:model-value="updatePassage"
      label="Passage from His Holy Book"
      class="select"
    />
  </div>
</template>

<script>
import { api } from "boot/axios";
import { useLanguageStore } from "stores/LanguageStore";
export default {
  name: "HisBookPassageSelect",
  setup() {
    const languageStore = useLanguageStore();
    return {
      languageStore,
    };
  },
  data() {
    return {
      selectedValue: {
        label: 'SELECT',
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
      if (newLesson !== oldLesson ){
        this.updateSelectBar(newLesson);
      }
    },
  },
  computed: {
    languageCodeHL(){
      return this.languageStore.getLanguageCodeHLSelected;
    },
    currentSegment() {

      return this.languageStore.getBookLesson;
    },
  },
  created() {
    this.getLessonList(this.languageCodeHL);

  },
  methods: {
    getLessonList(languageCodeHL) {
      var url = "api/dbs/studies/" + languageCodeHL;
      console.log (url)
      api.get(url).then((response) => {
        var data = response.data
        this.supportedPassages = data.map((item) => ({
          label: item.title,
          value: item.lesson,
        }));
        this.updateSelectBar(this.currentSegment)
        this.updatePassage();
      });
    },
    updatePassage() {
      this.languageStore.updateBookLesson(this.selectedValue.value);
      this.$emit('showPassage', this.selectedValue.value)
    },
    updateSelectBar(key){
      console.log(this.supportedPassages)
      console.log (key)
      if (typeof this.supportedPassages != undefined){
        key = key-1;
        if (key >= 0){
          this.selectedValue.label = this.supportedPassages[key].label;
          this.selectedValue.value = this.supportedPassages[key].value;
        }
        else{
          this.selectedValue.label = 'SELECT';
          this.selectedValue.value = 1;
        }
      }
    },

  }
};
</script>
