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
import { api } from "boot/axios";
import { useLanguageStore } from "stores/LanguageStore";
export default {
  name: "HinduLanguages",
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
        console.log (this.languageOptions)
        console.log ("selected language: " + this.selectedLanguage)
        for( var i = 0; i < this.languageOptions.length; i++){
          console.log ("language Options: " + this.languageOptions[i].value)
          if (this.languageOptions[i].value == this.selectedLanguage){
            console.log( this.languageOptions[i] )
            this.languageCodeJF = this.languageOptions[i].languageCodeJF;
            break;
          }
        }
        console.log (this.languageCodeJF)
        this.languageStore.updateLanguageSelected(this.selectedLanguage, this.languageCodeJF);
      },
      deep: true,
    },
  },
  created() {
    api.get("api/languages/hindi").then((response) => {
      this.languageArray = response.data;
      this.languageStore.updateLanguages(this.languageArray);
      this.languageOptions = this.languageArray.map((item) => ({
        label: item.name,
        value: item.languageCodeHL,
        languageCodeJF: item.languageCodeJF
      }));
    });
  },
};
</script>
