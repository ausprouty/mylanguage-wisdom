<template>
  <h4>Select Language</h4>

  <q-option-group
    v-model="selectedLanguage"
    type="radio"
    color="primary"
    :options="languageOptions"
  />
</template>

<script>
import { useLanguageStore } from "stores/LanguageStore";
import { languages} from "/src/data/languages.js";
export default {
  name: "LanguageOptions",
  setup() {
    const languageStore = useLanguageStore();
    return {
      languageStore
    };
  },
  data() {
    return {
      selectedLanguage: '',
      languageOptions: [],
      languageArray: [],
      languageCodeHL: 'eng00',
      languageCodeJF: '529'
    };
  },
  watch: {
    selectedLanguage: {
      handler() {
        for( var i = 0; i < this.languageOptions.length; i++){
          if (this.languageOptions[i].value == this.selectedLanguage){
            this.languageCodeJF = this.languageOptions[i].languageCodeJF;
            this.languageCodeHL = this.languageOptions[i].languageCodeHL;
            break;
          }
        }
        this.languageStore.updateLanguageSelected(this.languageCodeHL, this.languageCodeJF);
      },
      deep: true,
    },
  },
  created() {
     // Use the static languages data
    this.languageArray = languages;
    this.languageStore.updateLanguages(this.languageArray); // Update store if necessary
    this.languageOptions = this.languageArray.map((item) => ({
      label: item.name + ' (' + item.ethnicName + ')',
      value: item.id,
      languageCodeHL: item.languageCodeHL,
      languageCodeJF: item.languageCodeJF,
    }));
    this.selectedLanguage = this.languageStore.getLanguageValue;
  },
};
</script>
