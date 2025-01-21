<template>
  <h4>Select Language</h4>
  <p>
    Some of our content is only available in English or Hindi, but we will try
    to honor your choices on this page
  </p>
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
      languageOptions: [],
      languageArray: [],
      selectedLanguage: 'eng00',
      languageCodeJF: '529'
    };
  },
  watch: {
    selectedLanguage: {
      handler() {
        this.languageCodeJF=529;
        for( var i = 0; i < this.languageOptions.length; i++){
          if (this.languageOptions[i].value == this.selectedLanguage){
            this.languageCodeJF = this.languageOptions[i].languageCodeJF;
            break;
          }
        }
        this.languageStore.updateLanguageSelected(this.selectedLanguage, this.languageCodeJF);
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
  },
};
</script>
